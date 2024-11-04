import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/post.shema';
import { PostCreateDTO } from './dto/post-create-dto';
import { handleError, handleResponse } from 'src/utils/response.util';
import { PostUpdateDTO } from './dto/post-update-dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(userId: string, postInfo: PostCreateDTO) {
    try {
      const newPost = new this.postModel({ userId, ...postInfo });
      await newPost.save();
      return handleResponse(newPost);
    } catch (error) {
      handleError(error);
    }
  }

  async deletePost(postId: string, userId: string) {
    try {
      const post = await this.postModel.findById(postId);

      if (!post) {
        return handleError('No post found.');
      }

      if (post.userId !== userId) {
        handleError('Permission denied.');
      }

      await post.deleteOne({});

      return handleResponse();
    } catch (error) {
      handleError(error);
    }
  }

  async updatePost(postInfo: PostUpdateDTO) {
    try {
      const post = await this.postModel.findById(postInfo.id);

      if (!post) {
        return handleError('No post found.');
      }

      if (post.userId !== postInfo.userId) {
        handleError('Permission denied.');
      }

      for (const key in postInfo) {
        post[key] = postInfo[key];
      }

      await post.save();

      return handleResponse(post);
    } catch (error) {
      handleError(error);
    }
  }

  async getPostById(postId: string) {
    try {
      const post = await this.postModel.findById(postId);
      if (!post) {
        return handleError('No post found.');
      }
      return handleResponse(post);
    } catch (error) {
      handleError(error);
    }
  }

  async getPostByUser(
    userId: string,
    page: number = 0,
    itemsPerPage: number = 10,
  ) {
    try {
      const posts = await this.postModel.find({
        userId,
        skip: page * itemsPerPage,
        limit: itemsPerPage,
      });
      return handleResponse(posts);
    } catch (error) {
      handleError(error);
    }
  }
}
