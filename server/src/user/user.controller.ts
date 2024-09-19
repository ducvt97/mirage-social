import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserCreateDTO } from './dto/user-create-dto';
import { User } from 'src/schemas/user.schema';
import { UserUpdateDTO } from './dto/user-update-dto';
import { UserService } from './user.service';

@Injectable()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  create(@Body() reqBody: UserCreateDTO) {
    return this.userService.createUser(reqBody);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() reqBody: UserUpdateDTO) {
    return this.userService.updateUser(id, reqBody);
  }
}
