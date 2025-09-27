// File: lasop-client/src/lib/types/blog.ts
export type Blog = {
  _id: string;
  title: string;
  content: string;
  img: string;
  date: string;
  time: string;
  createdAt?: string;
  updatedAt?: string;
};