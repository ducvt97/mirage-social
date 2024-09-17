import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SearchDTO } from 'src/common/dto/get-with-paging-dto';
import { PostCreateDTO } from './dto/post-create-dto';

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

    @Post()
    create(@Body() reqBody: PostCreateDTO) {
        console.log(reqBody);
    }
}
