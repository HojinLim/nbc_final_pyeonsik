import { atom } from 'jotai';
import { Post } from 'src/types/types';

export const myPagePostAtom = atom<Post[]>([]);
