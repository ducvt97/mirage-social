import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
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
import { PostUpdateDTO } from './dto/post-update-dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAll(@Param() params: SearchDTO) {
    console.log(params);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    console.log(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() reqBody: PostCreateDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: userId } = parseJWT(token);
    return this.postService.createPost(userId, reqBody);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  update(@Body() reqBody: PostUpdateDTO) {
    return this.postService.updatePost(reqBody);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getByCurrentUser(
    @Body() reqBody: GetWithPagingDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: userId } = parseJWT(token);
    return this.postService.getPostByUser(
      userId,
      reqBody.page,
      reqBody.pageSize,
    );
  }
}
