import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-dto';
import { UserService } from 'src/user/user.service';
import { UserCreateDTO } from 'src/user/dto/user-create-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  register(@Body() reqBody: UserCreateDTO) {
    return this.userService.createUser(reqBody);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() reqBody: LoginDTO) {
    return this.authService.login(reqBody);
  }
}
