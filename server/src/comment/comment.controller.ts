import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentOnPostDTO } from './dto/comment-post.dto';

@Controller('comment')
export class CommentController {
  @UseGuards(JwtAuthGuard)
  @Post()
  commentOnPost(@Body() body: CommentOnPostDTO) {}
}
