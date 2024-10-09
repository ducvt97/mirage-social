import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './dto/login-dto';
import { handleError, handleResponse } from 'src/utils/response.util';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'src/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDTO) {
    const { userName, password } = loginDto;

    try {
      const user = await this.userService.getUserByUsernameOrEmail(userName);
      
      if (!user) {
        return handleError('Incorrect username or password.');
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      console.log(isPasswordMatch);

      if (!isPasswordMatch) {
        return handleError('Incorrect username or password.');
      }

      const payload: JWTPayload = {
        username: user.userName,
        sub: user._id.toString(),
      };
      const jwt = await this.jwtService.signAsync(payload);

      return handleResponse({ token: jwt, user });
    } catch (error) {
      console.log('error: ' + error);
      return handleError(error.message);
    }
  }
}
