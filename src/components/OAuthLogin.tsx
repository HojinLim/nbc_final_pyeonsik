import { atom, useAtom } from 'jotai';
import React from 'react';
import { useNavigate } from 'react-router';
import { userAtom } from 'src/globalState/jotai';
import supabase from 'src/lib/supabaseClient';

type Provider = 'google' | 'kakao' | 'github';

interface OAuthLoginProps {
  provider: Provider;
}

const OAuthLogin = ({ provider }: OAuthLoginProps) => {
  const navigate = useNavigate();

  const [, setUserLogin] = useAtom(userAtom);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider
      });
      localStorage.setItem('social', provider);
    } catch (error) {
      console.log(error);
    }
  };

  const applyImageLogo = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'google.png';
      case 'kakao':
        return 'kakao.jpg';
      case 'github':
        return 'github.png';
    }
  };

  return (
    <>
      <div onClick={handleLogin}>{provider === 'google' ? '구글 로그인' : '카카오 로그인'}</div>
    </>
  );
};

export default OAuthLogin;

// <button
//   style={
//     {
//       // backgroundImage: `url('${applyImageLogo(provider)}')`, // 함수 호출 추가
//       // backgroundSize: 'cover', // 이미지가 버튼을 가득 채우도록 설정
//       // width: '50px', // 버튼의 너비
//       // height: '50px', // 버튼의 높이
//       // border: 'none', // 테두리 제거
//       // color: 'white', // 텍스트 색상
//       // fontSize: '16px', // 폰트 크기
//       // cursor: 'pointer', // 커서 스타일 변경
//       // margin: '5px'
//     }
//   }

// </button>
// >
