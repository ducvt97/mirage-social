import { Body, Controller, Get, Injectable, Param, Patch, Post } from '@nestjs/common';
import { UserCreateDTO } from './dto/user-create-dto';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UserUpdateDTO } from './dto/user-update-dto';

@Injectable()
@Controller('user')
export class UserController {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Get()
  getAll(@Param() params: GetWithPagingDTO): Promise<User[]> {
    return this.userModel.find().exec();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  @Post()
  create(@Body() reqBody) {
    console.log(reqBody);
    const newUser = new this.userModel(reqBody);
    return newUser.save();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() reqBody: UserUpdateDTO) {
    return this.userModel.findByIdAndUpdate(id, reqBody);
  }
}
