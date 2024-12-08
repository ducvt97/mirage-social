import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from 'src/schemas/post.schema';
import { PostCreateDTO } from './dto/post-create-dto';
import { PostUpdateDTO, SystemPostUpdateDTO } from './dto/post-update-dto';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private commentService: CommentService,
  ) {}

  async createPost(userId: string, postInfo: PostCreateDTO): Promise<Post> {
    try {
      const newPost = new this.postModel({ userId, ...postInfo });
      await newPost.save();
      return newPost;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deletePost(userId: string, postId: string) {
    try {
      const post = await this.postModel.findById(postId);

      if (!post) {
        return Promise.reject('No post found.');
      }

      if (userId !== post.userId) {
        return Promise.reject('Permission denied.');
      }

      const deletePost = post.deleteOne();
      const deletePostComments =
        this.commentService.deleteCommentsByPost(postId);
      await Promise.all([deletePost, deletePostComments]);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async userUpdatePost(userId: string, postInfo: PostUpdateDTO) {
    try {
      const post = await this.postModel.findById(postInfo.id);

      if (userId !== String(post.userId)) {
        return Promise.reject('Permission denied.');
      }

      for (const key in postInfo) {
        post[key] = postInfo[key];
      }

      await post.save();

      return post;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async systemUpdatePost(postId: string, postInfo: SystemPostUpdateDTO) {
    try {
      const post = await this.postModel.findById(postId);
      for (const key in postInfo) {
        post[key] = postInfo[key] ?? post[key];
      }

      await post.save();
      return post;
    } catch (error) {
      return Promise.reject(error);
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

  async getPostByUser(
    userId: string,
    page: number = 0,
    pageSize: number = 10,
  ): Promise<Post[]> {
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

  async likePost(postId: string, userId: string): Promise<Post> {
    try {
      const post = await this.postModel.findById(postId);

      if (!post || (post.status && post.userId !== userId)) {
        return Promise.reject('This post does not exist.');
      }

      const userLikeIndex = post.usersLike.findIndex(
        (item) => String(item) === userId,
      );

      if (userLikeIndex > -1) {
        post.usersLike.splice(userLikeIndex, 1);
        post.likes -= 1;
      } else {
        post.usersLike.push(userId);
        post.likes += 1;
      }

      await post.save();
      return post;
    } catch (error) {
      return Promise.reject('Cannot like/unlike this post.');
    }
  }
}
