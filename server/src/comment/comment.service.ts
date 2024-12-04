import { Injectable } from '@nestjs/common';
import { CommentOnPostDTO } from './dto/comment-post.dto';
import { Comment } from 'src/schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GetCommentsByCommentDTO,
  GetCommentsByPostDTO,
} from './dto/get-comment.dto';
import {
  CommentUpdateDTO,
  SystemCommentUpdateDTO,
} from './dto/comment-update.dto';

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

  async userUpdateComment(userId: string, commentInfo: CommentUpdateDTO) {
    try {
      const comment = await this.commentModel.findById(commentInfo.id);

      if (userId !== String(comment.userId)) {
        return Promise.reject('Permission denied.');
      }

      for (const key in commentInfo) {
        comment[key] = commentInfo[key];
      }

      await comment.save();
      return comment;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async systemUpdatePost(
    commentId: string,
    commentInfo: SystemCommentUpdateDTO,
  ) {
    try {
      const comment = await this.commentModel.findById(commentId);
      for (const key in commentInfo) {
        comment[key] = commentInfo[key] ?? comment[key];
      }

      await comment.save();
      return comment;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getCommentsByPost({
    postId,
    page = 0,
    pageSize = 10,
  }: GetCommentsByPostDTO): Promise<Comment[]> {
    try {
      const comments = await this.commentModel.find(
        { postId, replyCommentId: null },
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

  async likePost(postId: string, userId: string): Promise<Comment> {
    try {
      const comment = await this.commentModel.findById(postId);

      if (!comment) {
        return Promise.reject('This comment does not exist.');
      }

      const userLikeIndex = comment.usersLike.findIndex(
        (item) => String(item) === userId,
      );

      if (userLikeIndex > -1) {
        comment.usersLike.splice(userLikeIndex, 1);
        comment.likes -= 1;
      } else {
        comment.usersLike.push(userId);
        comment.likes += 1;
      }

      await comment.save();
      return comment;
    } catch (error) {
      return Promise.reject('Cannot like/unlike this comment.');
    }
  }
}
