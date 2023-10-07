import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import ProdCard from './ProdCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getEventProd } from 'src/api/product';
import { useLocation } from 'react-router';
import { useInView } from 'react-intersection-observer';
import { InfinityProductList } from 'src/types/types';
import { FlexBoxAlignCenter } from 'src/styles/styleBox';
import ProdSkeleton from '../skeleton/ProdSkeleton';
import { useMediaQuery } from 'react-responsive';

const ProdList = () => {
  const location = useLocation();
  const [isProdLoading, setIsProdLoading] = useState<Boolean>(true);
    // 화면 크기에 따른 반응형
    const isDeskTop = useMediaQuery({ minWidth: 915 });
    const containerWidth = isDeskTop ? '100%' : '50%';

  let brandParam: string;
  if (location.search === '') {
    brandParam = 'all';
  } else {
    brandParam = location.search;
  }

  const {
    data: productList,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<InfinityProductList>({
    queryKey: [`event`, brandParam],
    queryFn: ({ pageParam }) => getEventProd(pageParam, brandParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000
  });

  const products = useMemo(() => {
    if (productList) setIsProdLoading(false);
    return productList?.pages
      .map((data) => {
        return data.products;
      })
      .flat();
  }, [productList]);

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (!inView || !hasNextPage || isFetchingNextPage) return;
      fetchNextPage();
    }
  });

  return (
    <>
      {isProdLoading && (
        <>
          <ProdSkeleton />
        </>
      )}
      <S.Container style={{width: containerWidth}}>
        {products?.map((item) => {
          return <ProdCard key={item.id} data={item} />;
        })}
      </S.Container>
      <S.EmptyBox ref={ref} />
    </>
  );
};

export default ProdList;

const S = {
  
  Container: styled(FlexBoxAlignCenter)`
    width: 100%;
    align-content: center;
    gap: 30px;
    flex-wrap: wrap;
  `,
  EmptyBox: styled.div`
    width: 200px;
    height: 200px;
  `
};
