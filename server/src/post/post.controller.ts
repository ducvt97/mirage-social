import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  GetWithPagingDTO,
  SearchDTO,
} from 'src/common/dto/get-with-paging-dto';
import { PostCreateDTO } from './dto/post-create-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { parseJWT } from 'src/utils/jwt.util';
import { PostService } from './post.service';
import { LikePost, PostUpdateDTO } from './dto/post-update-dto';
import { handleError, handleResponse } from 'src/utils/response.util';
import { UserService } from 'src/user/user.service';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {}

  @Get()
  getAll(@Param() params: SearchDTO) {
    console.log(params);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() reqBody: PostCreateDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: userId } = parseJWT(token);
    try {
      const getPost = this.postService.createPost(userId, reqBody);
      const getUser = this.userService.getUserById(userId);
      const [post, user] = await Promise.all([getPost, getUser]);
      return handleResponse({ post, user });
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Body() reqBody: PostUpdateDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const post = await this.postService.userUpdatePost(userId, reqBody);
      return handleResponse(post);
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getByCurrentUser')
  async getByCurrentUser(
    @Query() { page, pageSize }: GetWithPagingDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: userId } = parseJWT(token);

    const getPosts = this.postService.getPostByUser(userId, page, pageSize);
    const getUser = this.userService.getUserById(userId);
    const [posts, user] = await Promise.all([getPosts, getUser]);
    const postsDetails = posts.map((item) => ({
      ...item['_doc'],
      userDetails: user,
    }));

    return handleResponse({ posts: postsDetails });
  }

  @UseGuards(JwtAuthGuard)
  @Post('likePost')
  async likePost(
    @Body() { postId }: LikePost,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const post = await this.postService.likePost(postId, userId);
      return handleResponse({ likes: post.likes, usersLike: post.usersLike });
    } catch (error) {
      return handleError(error);
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const post = await this.postService.getPostById(id);
      return handleResponse(post);
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(
    @Param('id') id: string,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      await this.postService.deletePost(userId, id);
      return handleResponse(true);
    } catch (error) {
      return handleError('Cannot delete this post.');
    }
  }
}
