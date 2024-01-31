'use client';
import {auth} from '@/firebase';
import {Button, Input, useDisclosure} from '@nextui-org/react';
import {AuthError, browserSessionPersistence, setPersistence, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {FormEvent, useLayoutEffect} from 'react';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import Swal from 'sweetalert2';
import AuthUseStateCollection from './_components/AuthUseStateCollection';
import PasswordResetModal from './_components/PasswordResetModal';
import SocialLogin from './_components/SocialLogin';
import ValidateInput from './_components/ValidateInput';
// 로그인 컴포넌트
export default function AuthPage() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    emailCheck,
    setEmailCheck,
    passwordCheck,
    setPasswordCheck,
    loginError,
    setLoginError,
    isResetModalOpen,
    setIsResetModalOpen,
    resetEmail,
    setResetEmail,
    isShowPassword,
    setIsShowPassword,
    isEmailSent,
    setIsEmailSent,
    emailCheckMessage,
    setEmailCheckMessage,
  } = AuthUseStateCollection();

  const router = useRouter();

  useLayoutEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 비밀번호 표시 토글 함수
  const clickTogglePasswordhandler = () => {
    setIsShowPassword(!isShowPassword);
  };

  // 로그인 버튼 클릭 시 실행되는 함수
  const clickLoginHandler = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError('');

    if (
      !ValidateInput({
        email,
        setEmailCheck,
        password,
        setPasswordCheck,
      })
    )
      return;
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then(() => {
        Swal.fire({
          title: '로그인 성공!',
          icon: 'success',
          confirmButtonText: '확인',
          confirmButtonColor: '#0051FF',
        });
        setEmail('');
        setPassword('');
        router.replace('/');
      })
      .catch(error => {
        const authError = error as AuthError;
        // 로그인 실패 시 에러 처리
        switch (authError.code) {
          case 'auth/invalid-credential':
            setLoginError('이메일 혹은 비밀번호가 틀렸습니다.');
            setEmail('');
            setPassword('');
            break;
          case 'auth/too-many-requests':
            setLoginError('비밀번호 실패가 너무 많아 계정이 잠겼습니다. 나중에 다시 시도해주세요.');
            setEmail('');
            setPassword('');
            break;
          default:
            setLoginError('로그인 실패: ' + authError.message);
            setEmail('');
            setPassword('');
            break;
        }
      });
  };

  // 로그아웃 버튼 클릭시 실행되는 함수
  const clickLogoutHandler = async () => {
    try {
      await signOut(auth); // Firebase에서 로그아웃 요청
      setEmail('');
      setPassword('');
      router.replace('/'); // 메인페이지 이동
    } catch (error) {
      console.error(error);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="place-items-center grid select-none ">
      <form onSubmit={clickLoginHandler} className=" w-[400px]">
        <h3 className="w-full mx-auto text-2xl mt-[20px] mb-[20px]  font-bold">로그인</h3>
        <Input
          type="email"
          label="이메일을 입력해주세요."
          value={email}
          variant="bordered"
          className=" bg-[#fff] rounded-xl"
          onChange={e => setEmail(e.target.value)}
        />
        {emailCheck && <p className="text-[#EB271C]">{emailCheck}</p>}{' '}
        <Button
          onPress={onOpen}
          className=" Class
Properties
translate-x-[13px] float-right bg-transparent text-xs  z-40 text-[#0051FF]"
        >
          비밀번호를 잊으셨나요?
        </Button>
        <div className="relative">
          <Input
            type={isShowPassword ? 'text' : 'password'}
            label="비밀번호를 입력해주세요."
            variant="bordered"
            value={password}
            className="bg-[#fff] rounded-xl mt-[20px]"
            onChange={e => setPassword(e.target.value)}
          />
          <span
            onClick={clickTogglePasswordhandler}
            className="absolute inset-y-0 right-0  top-[40px] pr-3 flex  items-center  leading-5 cursor-pointer"
          >
            {isShowPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>
        {passwordCheck && <p className="text-[#EB271C]">{passwordCheck}</p>}
        {loginError && <p className="text-[#EB271C]">{loginError}</p>}
        <Button size="lg" type="submit" className="mt-[40px] w-full bg-[#0051FF] font-bold text-white">
          로그인
        </Button>
        <SocialLogin />
      </form>

      {/* 비밀번호 재설정 모달 */}
      <PasswordResetModal
        isOpen={isOpen}
        setIsResetModalOpen={setIsResetModalOpen}
        onOpenChange={onOpenChange}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        emailCheckMessage={emailCheckMessage}
        setEmailCheckMessage={setEmailCheckMessage}
        isEmailSent={isEmailSent}
        setIsEmailSent={setIsEmailSent}
      />
    </div>
  );
}
