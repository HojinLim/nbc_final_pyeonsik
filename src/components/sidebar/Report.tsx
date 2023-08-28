import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useLoginUserId from 'src/hooks/useLoginUserId';
import { supabase } from 'src/supabse';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';


const Report = () => {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [selectedInquiry1, setSelectedInquiry1] = useState<string>('');
  const [selectedInquiry2, setSelectedInquiry2] = useState<string>('');
  const [image, setImage] = useState<File>();
  const [imageName,setImageName] = useState<string>()
  const [urlLink, setUrlLink] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const userId = useLoginUserId();

  const navigate = useNavigate();


  const reportImage = async (event:React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) { //null 방지?
    const uploadimage = event?.target.files[0]
    console.log("1",uploadimage)
    const originalFileName = uploadimage.name;
    console.log("2",originalFileName)
    const fileExtension = originalFileName.split('.').pop();
    const randomFileName = uuidv4() + '.' + fileExtension;
    setImageName(randomFileName)
    setImage(uploadimage)
    }
  }
  console.log("3",image)
  

  const nextStep = () => setStep(step + 1);

  const handleOptionClick = (option: string) => {
    setSelectedInquiry1(option);
    console.log(option);
  };

  const handleOption2Click = (option: string) => {
    setSelectedInquiry2(option);
    console.log(option);
  };

  const handleSubmitButton = async () => {
    const url = []
    if(image){
      const { data, error } = await supabase.storage.from('photos').upload(`report/${imageName}`, image);
      if (error) {
        console.error('Error uploading image to Supabase storage:', error);
        alert('이미지 업로드 중 에러가 발생했습니다!');
        return;
      }
      url.push(data.path)
    }
    
    const reportData = {
      email,
      userId,
      inquiry1: selectedInquiry1,
      inquiry2: selectedInquiry2,
      detailReport: {
        image : `${process.env.REACT_APP_SUPABASE_STORAGE_REPORT}${url}`,
        urlLink,
        message
      }
    };
    await supabase.from('reports').insert([reportData]);
    nextStep();
  };

  const handleNext = () => {
    if(selectedInquiry1){
      nextStep();
    }else{
      alert("문의항목을 선택해 주세요.")
    }
  };
  const handleNext2 = () => {
    if(selectedInquiry2){
      nextStep();
    }else{
      alert("항목을 선택해 주세요.")
    }
  }

  const options1 = ['유저 신고', '오류 제보', '기타'];
  const options2 = [
    '불법성 게시물 또는 댓글',
    '음란성 게시물 또는 댓글',
    '개인정보노출 게시물 또는 댓글',
    '저작권 침해 게시물 또는 댓글',
    '홍보성 게시물 또는 댓글',
    '비방/비하/욕설 게시물 또는 댓글',
    '불법 상품 판매 게시물 또는 댓글'
  ];

  return (
    <ReportWrap>
      {step === 1 && (
        <ReportInner>
          <div>
            <h1>식신 고객센터</h1>
            <h2>
              안녕하세요!식신 고객센터입니다.
              <span>식신을 사용하면서 오류나 궁금한 점이 있다면 자유롭게 문의 남겨주세요.</span>
            </h2>
          </div>
          {userId ? null : (
            <div>
              <h2>이메일 입력</h2>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 적어주세요."
              ></input>
            </div>
          )}

          <div>
            <h2>문의 항목</h2>
            <div className="options-box">
              {options1.map((option) => (
                <p
                  key={option}
                  className={`option ${selectedInquiry1 === option ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </p>
              ))}
            </div>
            <button onClick={handleNext}>선택완료</button>
          </div>
        </ReportInner>
      )}
      {step === 2 && (
        <ReportInner>
          <h2>이런! 불쾌함을 조성하는 유저가 있나요?</h2>
          <div className="options-box">
            {options2.map((option) => {
              return (
                <p
                  key={option}
                  className={`option ${selectedInquiry2 === option ? 'selected' : ''}`}
                  onClick={() => handleOption2Click(option)}
                >
                  {option}
                </p>
              );
            })}
          </div>
          <button onClick={handleNext2}>선택완료</button>
        </ReportInner>
      )}
      {step === 3 && (
        <ReportInner>
          <h2>해당 내용에 대해 확인 할 수 있는 사진,파일,링크를 업로드 해주세요.</h2>
          <input
            type="file"
            onChange={reportImage}
            id="fileupload"
            placeholder="클릭하여 파일을 선택해주세요."
          ></input>
          <input
            value={urlLink}
            onChange={(e) => setUrlLink(e.target.value)}
            placeholder="주소 링크를 입력해주세요."
          ></input>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="사진,파일,링크에 대해 식신 운영자가 이해할 수 있는 추가 설명을 해주세요."
          ></input>
          <button onClick={handleSubmitButton}>제출하기</button>
        </ReportInner>
      )}
      {step === 4 && (
        <ReportInner>
          <h1>제출이 완료되었습니다.</h1>
          <button
            onClick={() => {
              navigate('/');
            }}
          >
            홈으로 가기
          </button>
        </ReportInner>
      )}
    </ReportWrap>
  );
};

export default Report;

const ReportWrap = styled.div``;

const ReportInner = styled.div`
h1{
  font-size: 40px;
  font-weight: bold;
  letter-spacing: -2px;
}
  p {
    border: solid 1px #999;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
  }
  .selected {
    background: red;
  }
  button {
    width: 210px;
    padding: 10px;
    text-align: left;
    border-radius: 5px;
    background-color: #ced4da;
  }
`;
