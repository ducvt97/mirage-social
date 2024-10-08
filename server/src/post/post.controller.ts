import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SearchDTO } from 'src/common/dto/get-with-paging-dto';
import { PostCreateDTO } from './dto/post-create-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { parseJWT } from 'src/utils/jwt.util';

@Controller('post')
export class PostController {
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
    console.log(userId);
  }
}
