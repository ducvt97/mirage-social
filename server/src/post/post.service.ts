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

  async deletePost(postId: string) {
    try {
      await this.postModel.findByIdAndDelete(postId);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updatePost(postInfo: PostUpdateDTO) {
    try {
      const post = await this.postModel.findByIdAndUpdate(postInfo);
      return post;
    } catch (error) {
      handleError(error);
    }
  }

  async getPostById(postId: string): Promise<Post> {
    try {
      const post = await this.postModel.findById(postId);
      return post;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getPostByUser(userId: string, page: number = 0, pageSize: number = 10): Promise<Post[]> {
    try {
      const posts = await this.postModel.find({ userId }, null, {
        skip: page * pageSize,
        limit: pageSize,
        sort: { createdAt: -1 },
      });

      return posts;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
