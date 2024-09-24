import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './dto/login-dto';
import { handleError, handleResponse } from 'src/utils/response.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginDto: LoginDTO) {
    const { userName, password } = loginDto;

    try {
      const user = await this.userService.getUserByUsernameOrEmail(userName);
      if (!user) {
        return handleError('Incorrect username or password.', 401);
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return handleError('Incorrect username or password.', 401);
      }

      return handleResponse(user);
    } catch (error) {
      return handleError(error);
    }
  }
}
