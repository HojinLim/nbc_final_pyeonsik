import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

import { ReactComponent as CameraIcon } from 'src/components/ImageTag/svg/CameraIcon.svg';

import { ImageUploaderProps } from 'src/types/types';

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imageSelected }) => {
  const [, setImageSelect] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const originalFileName = file.name;
      const fileExtension = originalFileName.split('.').pop();
      const randomFileName = uuidv4() + '.' + fileExtension;

      onImageSelect(new File([file], randomFileName));
      setImageSelect(true);
    }
  };

  return (
    <div>
      <S.ImageContainer imageselected={imageSelected}>
        <S.FileLabel imageselected={imageSelected}>
          <S.IconWrapper imageselected={imageSelected}>{imageSelected ? '🔃' : <CameraIcon />}</S.IconWrapper>
          <S.FileInput type="file" accept="image/*" onChange={handleImageUpload} />
        </S.FileLabel>
      </S.ImageContainer>
    </div>
  );
};

export default ImageUploader;

const S = {
  ImageContainer: styled.div<{ imageselected: boolean }>`
    position: ${(props) => (props.imageselected ? 'absolute' : 'initial')};
    top: ${(props) => (props.imageselected ? '94%' : 'initial')};
  `,

  FileInput: styled.input`
    opacity: 0;
    cursor: pointer;
  `,
  FileLabel: styled.label<{ imageselected: boolean }>`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: ${(props) => (props.imageselected ? 'none' : '1px solid #ccc')};
    width: ${(props) => (props.imageselected ? '40px' : '360px')};
    height: ${(props) => (props.imageselected ? '40px' : '360px')};
    position: ${(props) => (props.imageselected ? 'absolute' : 'initial')};
    margin-left: ${(props) => (props.imageselected ? '30px' : '0')};
    z-index: 1;
    /* &:hover {
      background-color: ${(props) => (props.imageselected ? 'skyblue' : 'initial')};
    } */
  `,

  IconWrapper: styled.span<{ imageselected: boolean }>`
    &:hover {
      transform: ${(props) => (props.imageselected ? 'scale(1.5)' : 'initial')};
    }
  `,

  FileLabelText: styled.span`
    margin-left: 140px;
  `
};