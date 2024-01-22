import {db} from '@/firebase';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {Post, litePost} from './typePost';
import {getAuth} from 'firebase/auth';

// 게시글 목록 불러오기 fetchPosts
export const getPosts = async (): Promise<Post[]> => {
  try {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
    const posts: Post[] = snapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        likes: data?.likes || 0,
        counts: data?.counts || 0,
        views: data?.views || 0,
        rewards: data?.rewards || 0,
        title: data?.title || '',
        content: data?.content || '',
        contents: data?.contents || '',
        imageUrl: data?.imageUrl || '',
        images: data?.images || '',
        category: data?.category || '',
        userId: data?.userId || '',
        // TODO: firebase 에서 지원하는 건 displayName 이었던 것으로 기억.
        nickname: data?.nickname || '',
        email: data?.email || '',
        ageGroup: data?.ageGroup || '',
        sexType: data?.sexType || '',
        researchLocation: data?.researchLocation || '',
        researchType: data?.researchType || '',
        researchTime: data?.researchTime || '',
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
        deadlineDate: data?.deadlineDate instanceof Timestamp ? data.deadlineDate : data?.deadlineDate || null,
      };
    });

    return posts;
  } catch (error) {
    console.error('에러', error);
    throw new Error('게시글을 불러오는 것에 실패했습니다.');
  }
};

// 단일 게시글 정보 불러오기 fetchPostById
export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot: DocumentSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      return postSnapshot.data() as Post;
    } else {
      console.error(`Post with ID ${postId} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw new Error('Failed to fetch post data.');
  }
};

// 게시글 추가하기 addPost
export const addPost = async (newPost: Post): Promise<DocumentReference> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('로그인이 필요한 유저입니다.');
    }

    const createdAt = new Date();
    const docRef = await addDoc(collection(db, 'posts'), {
      ...newPost,
      createdAt,
      views: 0,
      userId: user.uid,
      email: user.email,
      nickname: user.displayName || '',
    });

    return docRef;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('게시글을 추가하는 것에 실패했습니다.');
  }
};

// 게시글 조회수 증가 (광희님 코드 참고)
export const updateViewsCount = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const currentViews = postSnapshot.data().views || 0;
      await updateDoc(postRef, {
        views: currentViews + 1, // 'views' 카운트 증가
      });
    } else {
      console.error(`게시물 ID ${postId}에 해당하는 문서가 존재하지 않습니다.`);
    }
  } catch (error) {
    console.error('Views 카운트 업데이트 중 오류:', error);
  }
};

// 게시글 좋아요 증가 (광희님 코드 참고)
// TODO: 좋아요 감소 추가,  optimistic update 적용 필요
export const updateLikesCount = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const currentLikes = postSnapshot.data().likes || 0;
      await updateDoc(postRef, {
        likes: currentLikes + 1, // 'likes' 카운트 증가
      });
    } else {
      console.error(`게시물 ID ${postId}에 해당하는 문서가 존재하지 않습니다.`);
    }
  } catch (error) {
    console.error('Likes 카운트 업데이트 중 오류:', error);
  }
};

// 게시글 수정하기 updatePost
export const updatePost = async (postId: string, updatedPost: Omit<Post, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, updatedPost);
  } catch (error) {
    console.error('Error updating document: ', error);
    throw new Error('게시글을 수정하는 것에 실패했습니다.');
  }
};

// 게시글 삭제하기 deletePost
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw new Error('게시글을 삭제하는 것에 실패했습니다.');
  }
};

// 업로드한 이미지 storage에 저장
export const uploadImageToStorage = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);

  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
};

export const getLiteSurveyPosts = async (): Promise<litePost[]> => {
  try {
    const postsQuery = query(collection(db, 'litesurveyposts'));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
    const liteposts: litePost[] = snapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        counts: data?.counts || 0,
        likes: data?.likes || 0,
        views: data?.views || 0,
        title: data?.title || '',
        contents: data?.contents || '',
        images: data?.images || '',
        createdAt: data?.createdAt?.toDate() || new Date(),
        deadlineDate: data?.deadlineDate || null,
      };
    });

    return liteposts;
  } catch (error) {
    console.error('에러', error);
    throw new Error('게시글을 불러오는 것에 실패했습니다.');
  }
};

// 게시글+사용자(작성자) 정보 불러오기 fetchPostWithUser
//TODO: 유저 정보 불러오는 로직 작성
//TODO: 해당 로직은 미완성.
// export const fetchPostsWithUser = async (): Promise<PostWithUser[]> => {
//   try {
//     const postsQuery = query(collection(db, 'posts'));
//     const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
//     const postsWithUser: PostWithUser[] = [];

//     for (const doc of snapshot.docs) {
//       const postData: Post = { id: doc.id, ...(doc.data() as any) } as Post;
//       const user = await fetchUserById(postData.userId); // Implement fetchUserById

//       if (user) {
//         const postWithUser: PostWithUser = { ...postData, user };
//         postsWithUser.push(postWithUser);
//       }
//     }

//     return postsWithUser;
//   } catch (error) {
//     console.error('에러', error);
//     throw new Error('게시글을 불러오는 것에 실패했습니다.');
//   }
// };
