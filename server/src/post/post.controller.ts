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
import { PostCreateDTO } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { parseJWT } from 'src/utils/jwt.util';
import { PostService } from './post.service';
import { LikePostDTO, PostUpdateDTO } from './dto/update-post.dto';
import { handleError, handleResponse } from 'src/utils/response.util';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { createNotificationInstance } from 'src/utils/common.util';
import { NotificationType } from 'src/common/constants/enums';
import { GetPostsByUserDTO } from './dto/get-post.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  @Get()
  getAll(@Param() params: SearchDTO) {
    console.log(params);
  }

  @ApiBearerAuth()
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

  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('getByUser')
  async getByUser(
    @Query() { userId, page, pageSize }: GetPostsByUserDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: currentUserId } = parseJWT(token);
    const isCurrentUser = userId === currentUserId;

    const getPosts = this.postService.getPostByUser(
      userId,
      page,
      pageSize,
      isCurrentUser,
    );
    const getUser = this.userService.getUserById(userId);
    const [posts, user] = await Promise.all([getPosts, getUser]);
    const postsDetails = posts.map((item) => ({
      ...item['_doc'],
      userDetails: user,
    }));

    return handleResponse({ posts: postsDetails });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('likePost')
  async likePost(
    @Body() { postId }: LikePostDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const { post, shouldSendNotification } = await this.postService.likePost(
        postId,
        userId,
      );

      if (shouldSendNotification) {
        const notification = createNotificationInstance(
          post.userId,
          userId,
          postId,
          NotificationType.LIKE_POST,
        );
        this.notificationService.addNotification(notification);
      }

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

  @ApiBearerAuth()
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
