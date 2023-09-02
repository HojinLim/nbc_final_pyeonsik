import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getPostLike } from 'src/api/postLikes';
import { getPostBookmark } from 'src/api/postBookmark';
import { getQuotationPosts } from 'src/api/posts';
import usePostLikes from 'src/hooks/usePostLikes';
import usePostBookmark from 'src/hooks/usePostBookmark';
import { BottomFunctionProps } from 'src/types/types';
import { S } from 'src/components/post/style/StyledBottomFunction';
import {
  IconBookmark,
  IconComment,
  IconLike,
  IconQuotation,
  IconUnBookmark,
  IconUnLike,
  IconUnLink,
  IconUnQuotation
} from 'src/components/icons';
import { getCommentCountDataByPostId } from 'src/api/comment';

const BottomFunction = ({ userId, post }: BottomFunctionProps) => {
  const navigate = useNavigate();

  // 이 아이디는 디테일 페이지인지 아닌지를 구분하는용으로 사용하면 될듯. (메인게시글 리스트의 댓글 숫자 / 디테일페이지의 링크 복사 노출관련)
  const { id } = useParams<string>();
  const { pathname } = useLocation();

  const { addPostLikeMutate, deletePostLikeMutate } = usePostLikes();
  const { addPostBookmarkMutate, deletePostBookmarkMutate } = usePostBookmark();

  // 쿼리키에 아이디값 추가
  // 상위 컴포넌트에서 받아오는 post 객체의 Id값 사용
  const { data: commentCountData } = useQuery({
    queryKey: ['commentCount', post.id],
    queryFn: () => getCommentCountDataByPostId(post.id!),
    enabled: !id ? true : false
  });
  const { data: postLikeData } = useQuery({ queryKey: ['post_like', post.id], queryFn: () => getPostLike(post.id!) });
  const { data: postBookmarkData } = useQuery({
    queryKey: ['post_bookmark', post.id],
    queryFn: () => getPostBookmark(post.id!)
  });
  const { data: postQuotationData } = useQuery({
    queryKey: ['post_quotation', post.id],
    queryFn: () => getQuotationPosts(post.id!)
  });

  const postLikeList = postLikeData?.data;
  const postBookmarkList = postBookmarkData?.data;
  const postQuotationList = postQuotationData?.data;

  const postLike = postLikeList?.find((like) => like.userId === userId);
  const postBookmark = postBookmarkList?.find((bookmark) => bookmark.userId === userId);
  const postQuotation = postQuotationList?.find((Quotation) => Quotation.userId === userId);

  // 좋아요
  const clickPostLike = () => {
    if (!postLike) {
      const newPostLike = {
        postId: post.id,
        userId
      };
      addPostLikeMutate.mutate(newPostLike);
    } else {
      deletePostLikeMutate.mutate(postLike.id);
    }
  };

  // bookmark
  const clickPostBookmark = () => {
    if (!postBookmark) {
      const newPostBookmark = {
        postId: post.id,
        userId
      };
      addPostBookmarkMutate.mutate(newPostBookmark);
    } else {
      deletePostBookmarkMutate.mutate(postBookmark.id);
    }
  };

  // 인용
  const clickQuotation = () => {
    navigate('/write', { state: post });
  };

  // clip board
  const clickCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://nbc-final-pyeonsik-897l29vm7-kimyoonsu97.vercel.app/${pathname}`);
      alert('주소가 복사되었습니다.');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!id && (
        <S.FunctionButtonBox $location={pathname}>
          <S.FunctionButton>
            <IconComment />
          </S.FunctionButton>
          <S.FunctionCount $location={pathname}>{commentCountData}</S.FunctionCount>
        </S.FunctionButtonBox>
      )}
      <S.FunctionButtonBox $location={pathname}>
        <S.FunctionButton onClick={clickPostLike}>{postLike ? <IconLike /> : <IconUnLike />}</S.FunctionButton>
        <S.FunctionCount $location={pathname}>{postLikeList?.length === 0 ? 0 : postLikeList?.length}</S.FunctionCount>
      </S.FunctionButtonBox>
      <S.FunctionButtonBox $location={pathname}>
        <S.FunctionButton onClick={clickQuotation}>
          {postQuotation ? <IconQuotation /> : <IconUnQuotation />}
        </S.FunctionButton>
        <S.FunctionCount $location={pathname}>
          {postQuotationList?.length === 0 ? 0 : postQuotationList?.length}
        </S.FunctionCount>
      </S.FunctionButtonBox>
      <S.FunctionButtonBox $location={pathname}>
        <S.FunctionButton onClick={clickPostBookmark}>
          {postBookmark ? <IconBookmark /> : <IconUnBookmark />}
        </S.FunctionButton>
        <S.FunctionCount $location={pathname}>
          {postBookmarkList?.length === 0 ? 0 : postBookmarkList?.length}
        </S.FunctionCount>
      </S.FunctionButtonBox>
      {id && (
        <S.FunctionButton onClick={clickCopyLink}>
          <IconUnLink />
        </S.FunctionButton>
      )}
    </>
  );
};

export default BottomFunction;
