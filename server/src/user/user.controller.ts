import {
  Body,
  Controller,
  Get,
  Headers,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserCreateDTO } from './dto/user-create-dto';
import { User } from 'src/schemas/user.schema';
import {
  UserSearchDTO,
  UserUpdateDTO,
  UserUpdateFriendDTO,
} from './dto/user-update-dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { parseJWT } from 'src/utils/jwt.util';
import { handleError, handleResponse } from 'src/utils/response.util';

@Injectable()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Get('searchUser')
  async searchUser(@Query() { searchText }: UserSearchDTO) {
    try {
      const users = await this.userService.searchUser(searchText);
      return handleResponse(users);
    } catch (error) {
      return handleError(error);
    }
  }

  @Post()
  create(@Body() reqBody: UserCreateDTO) {
    return this.userService.createUser(reqBody);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() reqBody: UserUpdateDTO) {
    return this.userService.updateUser(id, reqBody);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addFriend')
  async addFriend(
    @Body() { friendId }: UserUpdateFriendDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const res = await this.userService.sendFriendRequest(userId, friendId);
      return handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('undoAddFriend')
  async undoAddFriend(
    @Body() { friendId }: UserUpdateFriendDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const res = await this.userService.undoSendFriendRequest(
        userId,
        friendId,
      );
      return handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('acceptFriend')
  async acceptFriend(
    @Body() { friendId }: UserUpdateFriendDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const res = await this.userService.acceptFriendRequest(userId, friendId);
      return handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('rejectFriend')
  async rejectFriend(
    @Body() { friendId }: UserUpdateFriendDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const res = await this.userService.rejectFriendRequest(userId, friendId);
      return handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('unfriend')
  async unfriend(
    @Body() { friendId }: UserUpdateFriendDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const res = await this.userService.deleteFriend(userId, friendId);
      return handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const user = await this.userService.getUserById(id);
      return handleResponse(user);
    } catch (error) {
      return handleError(error);
    }
  }
}
