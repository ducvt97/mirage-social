import type { StatusType } from "~/common/constants/enums";

export interface PostSchema {
  _id: string;
  caption: string;
  status: StatusType;
  content: string[];
  likes: number;
  usersLike: string[];
  tags: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}
