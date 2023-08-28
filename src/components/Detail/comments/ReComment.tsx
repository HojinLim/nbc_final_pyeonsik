import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { deleteReCommentData, getReCommentData, writeReCommentData } from 'src/api/ReComment';
import { supabase } from 'src/supabse';
import { ReCommentWrap, CommentWriteWrap,ReCommentToggle } from './styledComments';
import ReCommentLikes from './ReCommentLikes';
import { useParams } from 'react-router';
import useLoginUserId from 'src/hooks/useLoginUserId';

interface ReCommentProps {
  parentCommentId: string;
}

const ReComment: React.FC<ReCommentProps> = ({ parentCommentId }) => {
  const [reComment, setReComment] = useState('');
  const [isToggle, setIsToggle] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const userId = useLoginUserId();
  console.log(id);

  const { data: reCommentData } = useQuery(['reComment'], () => getReCommentData(parentCommentId));
  console.log(reCommentData, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

  const WriteReCommentMutation = useMutation(writeReCommentData, {
    onSuccess: () => {
      queryClient.invalidateQueries(['reComment']);
    }
  });

  const deleteReCommentMutation = useMutation(deleteReCommentData, {
    onSuccess: () => {
      queryClient.invalidateQueries(['reComment']);
    }
  });

  //댓글 삭제 버튼
  const deleteReCommentButton = (id: string) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      deleteReCommentMutation.mutate(id);
    } else {
      alert('삭제가 취소되었습니다.');
    }
  };

  const writeReCommentButton = () => {
    const newReComment = {
      comment: reComment,
      parent_commentId: parentCommentId,
      postId: id,
      userId
    };
    WriteReCommentMutation.mutate(newReComment);
  };

  //작성 날짜 월일로 변환
  const commentWriteDate = (date: string) => {
    const writeDate = new Date(date);
    const month = writeDate.getMonth() + 1;
    const day = writeDate.getDate();
    return `${month}월 ${day}일`;
  };
  const openReComment = () => {
    setIsToggle(!isToggle);
  };

  return (
    <>
      <ReCommentToggle onClick={openReComment}>{reCommentData?.length}개의 답글보기</ReCommentToggle>
      {isToggle && (
        <>
          <CommentWriteWrap>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                writeReCommentButton();
              }}
            >
              <input
                value={reComment}
                onChange={(e) => {
                  setReComment(e.target.value);
                }}
              ></input>
              <button>
                <img src="/images/commentWriteImg2.png" alt="답글작성버튼"></img>
              </button>
            </form>
          </CommentWriteWrap>
          <ReCommentWrap>
            {reCommentData?.map((item: any) => {
              return (
                <div key={item.id} className='reCommentInner'>
                  <div className="recommentInfo">
                    {userId && item.users && item.users.profileImg && item.users.nickname !== null ? (
                      <div className='userInfo'>
                        <img src={item.users.profileImg}></img>
                        <h1>{item.users.nickname}</h1>
                        <span>{commentWriteDate(item.created_at)}</span>{' '}
                      </div>
                    ) : (
                      '아이디 널이라서 오류남 데이터 지워야함'
                    )}
                    <div>
                      <button onClick={() => deleteReCommentButton(item.id)}>삭제</button>
                      <ReCommentLikes commentId={item.id} />
                    </div>
                  </div>
                  <h2>{item.comment}</h2>
                </div>
              );
            })}
          </ReCommentWrap>
        </>
      )}
    </>
  );
};

export default ReComment;
