import { Injectable } from '@nestjs/common';
import { CommentOnPostDTO } from './dto/comment-post.dto';
import { Comment } from 'src/schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GetCommentsByCommentDTO,
  GetCommentsByPostDTO,
} from './dto/get-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async createComment(
    userId: string,
    comment: CommentOnPostDTO,
  ): Promise<Comment> {
    try {
      const newComment = new this.commentModel({ userId, ...comment });
      await newComment.save();
      return newComment;
    } catch (error) {
      Promise.reject(error);
    }
  }

  async getCommentsByPost({
    postId,
    page = 0,
    pageSize = 10,
  }: GetCommentsByPostDTO): Promise<Comment[]> {
    try {
      const comments = await this.commentModel.find(
        { postId },
        {},
        { skip: page * pageSize, limit: pageSize },
      );
      return comments;
    } catch (error) {
      Promise.reject(error);
    }
  }

  async getCommentsByComment({
    commentId,
    page = 0,
    pageSize = 10,
  }: GetCommentsByCommentDTO): Promise<Comment[]> {
    try {
      const comments = await this.commentModel.find(
        { replyCommentId: commentId },
        {},
        { skip: page * pageSize, limit: pageSize },
      );
      return comments;
    } catch (error) {
      Promise.reject(error);
    }
  }
}
