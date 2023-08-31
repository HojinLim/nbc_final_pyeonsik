import { S } from './StyledPostWriteCommon';
import React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAtom } from 'jotai';

import AddImageTagComponent, { contentsAtom, tagsDataAtom, imagesAtom } from '../../ImageTag/AddImageTagComponent';
import supabase from 'src/lib/supabaseClient';
import useLoginUserId from 'src/hooks/useLoginUserId';
import usePost from 'src/hooks/usePost';
import PostWriteInput from './PostWriteInput';
import { ReactComponent as Add } from 'src/components/post/svg/Add.svg';
import { ReactComponent as Select } from 'src/components/post/svg/Select.svg';

interface orgPostIdProps {
  orgPostId: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

// recipe, common write component 정리 필요
const PostWriteRecipe = ({ orgPostId, setCategory }: orgPostIdProps) => {
  const navigate = useNavigate();

  //입력값이 배열로 바뀌었기에 query 선언을 하나 더 했습니다!
  const { addRecipePostMutate } = usePost();

  //제출 후 값을 초기화 해주기 위해 선언
  const [allContents, setContentsAtom] = useAtom(contentsAtom);
  const [allTags, setTagsDataAtom] = useAtom(tagsDataAtom);
  const [selectedImages, setImagesDataAtom] = useAtom(imagesAtom);

  const [title, setTitle] = useState<string>('');

  // current user id
  const userId: string | undefined = useLoginUserId();

  const postRef = useRef<HTMLInputElement>(null);

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const imageUrls = [];

    for (const selectedImage of selectedImages) {
      const { data, error } = await supabase.storage.from('photos').upload(`tags/${selectedImage.name}`, selectedImage);

      if (error) {
        console.error('Error uploading image to Supabase storage:', error);
        alert('이미지 업로드 중 에러가 발생했습니다!');
        return;
      }

      imageUrls.push(data.path);
    }

    const newPost = {
      orgPostId,
      postCategory: 'recipe',
      userId,
      title,
      body: allContents,
      recipeBody: Object.values(allContents),
      tags: Object.values(allTags),
      tagimage: imageUrls
    };

    addRecipePostMutate.mutate(newPost);

    setContentsAtom({});
    setTagsDataAtom({});
    setImagesDataAtom([]);

    navigate(`/`);
  };

  const clickLogo = () => {
    navigate(`/`);
  };
  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const clickCategory = () => {
    setCategory('recipe');
  };

  return (
    <>
      <S.WriteArea>
        <S.WriteForm onSubmit={submitPost}>
          <S.WriteHeader>
            <div onClick={clickLogo}>로고 영역</div>
            <S.AddButton type="submit">
              <S.AddText>공유하기</S.AddText>
              <S.AddIcon>
                <Add />
              </S.AddIcon>
            </S.AddButton>
          </S.WriteHeader>
          <S.TitleBox>
            <S.CategoryText>그르르갉</S.CategoryText>
            <S.Contour />
            <S.Title
              ref={postRef}
              type="text"
              name="title"
              placeholder="제목 생략 가능"
              value={title}
              onChange={changeTitle}
              autoFocus
            />
            <S.SelectCategory>
              <S.SelectIcon>
                <Select />
              </S.SelectIcon>
              <S.SelectText type="button" onClick={clickCategory}>
                편식조합
              </S.SelectText>
            </S.SelectCategory>
          </S.TitleBox>
        </S.WriteForm>
      </S.WriteArea>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '950px' }}>
          <AddImageTagComponent onImageSelect={() => {}} />
        </div>
      </div>
    </>
  );
};

export default PostWriteRecipe;
