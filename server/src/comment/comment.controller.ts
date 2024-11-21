import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentOnPostDTO } from './dto/comment-post.dto';
import { CommentService } from './comment.service';
import { parseJWT } from 'src/utils/jwt.util';
import { handleError, handleResponse } from 'src/utils/response.util';
import {
  GetCommentsByCommentDTO,
  GetCommentsByPostDTO,
} from './dto/get-comment.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/schemas/user.schema';

@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async commentOnPost(
    @Body() body: CommentOnPostDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const getComment = this.commentService.createComment(userId, body);
      const getUser = this.userService.getUserById(userId);
      const [comment, user] = await Promise.all([getComment, getUser]);

      return handleResponse({ ...comment['_doc'], userDetails: user });
    } catch (error) {
      handleError(error);
    }
  }

  @Get('getCommentsByPost')
  async getCommentsByPost(@Query() query: GetCommentsByPostDTO) {
    try {
      const comments = await this.commentService.getCommentsByPost(query);
      const getUsersDetails: Promise<User>[] = [];
      for (const comment of comments) {
        getUsersDetails.push(this.userService.getUserById(comment.userId));
      }

      const usersDetails = await Promise.all(getUsersDetails);
      const commentsDetails = comments.map((item) => ({
        ...item['_doc'],
        userDetails: usersDetails.find(
          (user) => String(user._id) === item.userId,
        ),
      }));

      return handleResponse(commentsDetails);
    } catch (error) {
      handleError(error);
    }
  }

  @Get('getCommentsByComment')
  async getCommentsByComment(@Query() query: GetCommentsByCommentDTO) {
    try {
      const comment = await this.commentService.getCommentsByComment(query);
      return handleResponse(comment);
    } catch (error) {
      handleError(error);
    }
  }
}
