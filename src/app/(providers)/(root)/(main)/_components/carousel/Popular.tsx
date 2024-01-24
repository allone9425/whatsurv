'use client';
import {getPosts} from '@/app/api/firebaseApi';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from '@/firebase';
import {useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {useRef} from 'react';
import {GrView} from 'react-icons/gr';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Post} from '@/app/api/typePost';
import {useState} from 'react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import SwiperCore from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';

export default function Popular() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const updateViewsCount = async (postId: string) => {
    try {
      const postRef = doc(db, 'litesurveyposts', postId);
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
  // 게시물 클릭을 처리하는 함수
  const onClickPosthandler = (post: Post) => {
    setSelectedPost(post);
    updateViewsCount(post.id); // 'views' 카운트를 업데이트하는 함수 호출
  };

  SwiperCore.use([Navigation, Pagination]);
  const swiperRef = useRef<SwiperCore>();
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>로딩 중에 오류가 발생했습니다.</div>;
  }

  if (!posts) {
    return <div>불러올 수 있는 게시글이 없습니다.</div>;
  }

  return (
    <>
      <h2 className="text-xl font-bold">주간 인기 Surv</h2>
      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        slidesPerView={4}
        spaceBetween={20}
        loop={true}
        pagination={{
          clickable: true,
          el: null,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="popular-swiper"
      >
        {posts.map(post => {
          return (
            <SwiperSlide id="popular-slide" key={post.id}>
              <Link href={`/survey-it/${post.id}`} onClick={() => onClickPosthandler(post)}>
                <div className="h-[180px] border-2 border-[#0051FF80] rounded-xl p-4 bg-white">
                  <div className="category-box flex justify-between items-center mb-4">
                    <div className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                      {post.category}
                    </div>
                    <div className="bg-[#D6FF00] text-black w-14 p-1 text-center rounded-full font-semibold text-xs">
                      🔥HOT
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#666]">
                      마감일 |{' '}
                      {post.deadlineDate
                        ? post.deadlineDate.toDate
                          ? post.deadlineDate
                              .toDate()
                              .toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})
                          : '2099.12.31'
                        : '2099.12.31'}
                    </p>
                    <div className="viewer flex  gap-2 text-[#818490]">
                      <GrView />
                      {post.views}
                    </div>
                  </div>
                  <h3 className="text-base font-bold">{post.title}</h3>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
