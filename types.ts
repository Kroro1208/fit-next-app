// types.ts
import type { Prisma } from '@prisma/client';

export type JsonValue = Prisma.JsonValue;

export interface TipTapNodeAttrs {
  level?: number;
  href?: string;
  // 他の属性も必要に応じて追加
}

export interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  attrs?: TipTapNodeAttrs;
  text?: string;
}

export interface TipTapContent {
  type: 'doc';
  content: TipTapNode[];
}

export interface Post {
    id: string;
    title: string;
    imageString: string | null;
    subName: string | null;
    upVoteCount: number;
    downVoteCount: number;
    trustScore: number;
    shareLinkVisible: boolean;
    User: { id: string; userName: string | null } | null;
    comments: { id: string }[];
    tags: Tag[];
    textContent: string | TipTapContent | JsonValue;
}

export interface Tag {
    id: string;
    name: string;
}

export interface UserProfileState {
  message?: string;
  status?: 'success' | 'error' | '';
}

export interface SubDescriptionState {
  message?: string;
  status?: 'green' | 'error' | undefined;
}

export interface ActionState {
  message?: string;
  status?: 'green' | 'error' | undefined;
}

export interface RenderJsonProps {
  data: string | TipTapContent | JsonValue | null | undefined;
}