import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router';
import TagImage from 'src/components/imageTag/ShowTag';
import { styleFont } from 'src/styles/styleFont';
import styled, { css } from 'styled-components';

interface ContentBoxProps {
  post: any;
}

const ContentBox = ({ post }: ContentBoxProps) => {
  const { pathname } = useLocation();

  // 화면 크기에 따라 Container의 너비를 설정
  const isDeskTop = useMediaQuery({ minWidth: 915 });

  return (
    <>
      {post.title && <S.PostTitle isDeskTop={isDeskTop}>{post.title}</S.PostTitle>}
      {post.postCategory === 'common' && (
        <S.PostBodyCommon $location={pathname} dangerouslySetInnerHTML={{ __html: post.body }} />
      )}
      <S.PostBodyRecipe $location={pathname}>
        {post.postCategory === 'recipe' &&
          post.recipeBody.map((recipeText: string, index: number) =>
            post.tagimage[index] ? (
              <TagImage
                key={index}
                imageUrl={`${process.env.REACT_APP_SUPABASE_STORAGE_URL}${post.tagimage[index]}`}
                recipeBody={recipeText}
                tagsForImage={post.tags[index] || []}
              />
            ) : (
              <div key={index}>{recipeText}</div>
            )
          )}
      </S.PostBodyRecipe>
    </>
  );
};

export default ContentBox;

interface BodyHeightProps {
  $location: string;
  dangerouslySetInnerHTML?: any;
}

export const S = {
  DtailArea: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 84px 0;
  `,

  PostHead: styled.div`
    background-color: transparent;

    width: 890px;
    height: 42px;
    margin-bottom: 23px;

    display: flex;
    position: relative;
  `,

  WriterContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  WriterImgBox: styled.div`
    width: 42px;
    height: 42px;
    margin-right: 8px;

    border-radius: 100px;
    overflow: hidden;
  `,

  WriterImg: styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;

    transform: translateZ(0);
    backface-visibility: hidden;
    image-rendering: -webkit-optimize-contrast;
  `,

  WirterLevel: styled.div`
    background: #fff;
    height: 20px;
    padding: 0px 13px;
    border-radius: 100px;
    border: 1px solid var(--neutral-300, #d0d5dd);

    color: var(--font-black, var(--black, #242424));
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  Contour: styled.div`
    background: var(--neutral-300, #d0d5dd);

    width: 1px;
    height: 12px;
    border-radius: 100px;
    margin: 0px 4.5px;
  `,

  ContentsBox: styled.div`
    width: 890px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 10px;
    padding-bottom: 100px;
  `,

  PostTitle: styled.div<{ isDeskTop: boolean }>`
      width: ${(props) => (props.isDeskTop ? '790px' : '500px')};
    margin: 36px 0px 0px 0px;

    display: flex;
    align-items: center;

    color: var(--black, #242424);
    ${(props) =>
      props.isDeskTop
        ? css`
            ${styleFont.titleLarge}
          `
        : css`
            ${styleFont.titleSmall}
          `};
  `,

  PostBodyCommon: styled.pre<BodyHeightProps>`
    width: 790px;
    ${(props) => {
      if (props.$location === 'detail') {
        return css`
          min-height: 40vh;
        `;
      }
    }}
    margin: 30px 0px 10px 0px;
    white-space: normal;
    word-wrap: break-word;

    color: var(--Black, #242424);
    font-family: 'Pretendard';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px;

    .ql-size-small {
      font-size: small;
    }
    .ql-size-large {
      font-size: x-large;
    }
    .ql-align-center {
      text-align: center;
    }
    .ql-align-right {
      text-align: right;
    }
    .ql-align-justify {
      text-align: justify;
    }
    b {
      font-weight: bold;
    }
    i {
      font-style: italic;
    }
    li {
      display: list-item;
      text-align: -webkit-match-parent;
    }
    ol,
    ul {
      display: block;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      padding-inline-start: 50px;
    }
    ol {
      list-style-type: decimal;
    }
    ul {
      list-style-type: disc;
    }
  `,

  PostBodyRecipe: styled.div<BodyHeightProps>`
    padding-top: 30px;
    min-height: ${(props) => {
      if (props.$location !== '/') {
        return '10vh';
      } else {
        return '10vh';
      }
    }};
  `
};
