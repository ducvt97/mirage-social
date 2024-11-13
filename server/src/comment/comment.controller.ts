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

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async commentOnPost(
    @Body() body: CommentOnPostDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const comment = await this.commentService.createComment(userId, body);
      return handleResponse(comment);
    } catch (error) {
      handleError(error);
    }
  }

  @Get('getCommentsByPost')
  async getCommentsByPost(@Query() query: GetCommentsByPostDTO) {
    try {
      const comment = await this.commentService.getCommentsByPost(query);
      return handleResponse(comment);
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
