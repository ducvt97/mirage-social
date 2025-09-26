"use client";
import { PostDetail } from "@/interfaces";
import PostItem from "./postItem";

type PostListProps = {
  posts: PostDetail[];
};

const PostList = ({ posts }: PostListProps) => {
  return posts.map((post) => <PostItem key={post._id} post={post} />);
};

export default PostList;
