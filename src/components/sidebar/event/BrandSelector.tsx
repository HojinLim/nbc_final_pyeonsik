import React from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const brands = [
  {
    name: 'GS25',
    path: '?=gs25',
    logoImg: ''
  },
  {
    name: 'CU',
    path: '?=cu',
    logoImg: ''
  },
  {
    name: 'SEVEN ELEVEN',
    path: '?=seveneleven',
    logoImg: ''
  },
  {
    name: 'E-MART24',
    path: '?=emart24',
    logoImg: ''
  }
];

const BrandSelector = () => {
  const location = useLocation();
  return (
    <S.Container>
      <S.TapButton to={'event'} $type={''} $location={location.search}>
        전체보기
        <S.Icon></S.Icon>
      </S.TapButton>
      {brands.map((brand) => {
        return (
          <S.TapButton key={brand.name} to={`event${brand.path}`} $type={brand.path} $location={location.search}>
            프로필
            <S.Icon></S.Icon>
          </S.TapButton>
        );
      })}
    </S.Container>
  );
};

export default BrandSelector;

type Props = {
  $location: string;
  $type: string;
};

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 10px;
  `,
  Icon: styled.div`
    width: 20px;
    height: 20px;
    margin-right: 4px;
  `,
  TapButton: styled(Link)<Props>`
    display: flex;
    align-items: center;
    padding: 10px 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    border-radius: 10px;
    text-decoration: none;
    color: black;
    cursor: pointer;
    ${(props) =>
      props.$type === props.$location &&
      css`
        background-color: #efefef;
      `}
    &:hover {
      background-color: #efefef;
    }
  `
};
