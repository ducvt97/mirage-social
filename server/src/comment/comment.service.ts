import { Injectable } from '@nestjs/common';
import { CommentOnPostDTO } from './dto/comment-post.dto';
import { Comment, CommentDocument } from 'src/schemas/comment.schema';
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
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async getCommentById(commentId: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId);
    return comment;
  }

  async findAndCheckPermission(
    commentId: string,
    userId: string,
  ): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      return Promise.reject('Comment does not exist.');
    }

    if (userId !== String(comment.userId)) {
      return Promise.reject('Permission denied.');
    }

    return comment;
  }

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

  async userUpdateComment(
    userId: string,
    commentInfo: CommentUpdateDTO,
  ): Promise<Comment> {
    try {
      const comment = await this.findAndCheckPermission(commentInfo.id, userId);

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
  ): Promise<Comment> {
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

  async likeComment(
    commentId: string,
    userId: string,
  ): Promise<{ comment: Comment; shouldSendNotification: boolean }> {
    try {
      const comment = await this.commentModel.findById(commentId);

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
      return { comment, shouldSendNotification: userLikeIndex === -1 };
    } catch (error) {
      return Promise.reject('Cannot like/unlike this comment.');
    }
  }

  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    try {
      const comment = await this.findAndCheckPermission(commentId, userId);
      const deleteParentComment = comment.deleteOne();
      const deleteChildComment = this.commentModel.deleteMany({
        replyCommentId: comment.id,
      });
      await Promise.all([deleteParentComment, deleteChildComment]);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteCommentsByPost(postId: string): Promise<boolean> {
    try {
      await this.commentModel.deleteMany({ replyCommentId: postId });
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
