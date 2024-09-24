import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UserCreateDTO } from './dto/user-create-dto';
import { UserUpdateDTO } from './dto/user-update-dto';
import { handleError, handleResponse } from 'src/utils/response.util';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async getUserByUsernameOrEmail(usernameEmail: string): Promise<User | null> {
    if (!usernameEmail) {
      return null;
    }

    return this.userModel
      .findOne({ $or: [{ userName: usernameEmail }, { email: usernameEmail }] })
      .exec();
  }

  async createUser(userCreateDTO: UserCreateDTO) {
    try {
      const userExist = await this.getUserByUsernameOrEmail(
        userCreateDTO.userName,
      );
      if (userExist) {
        return handleError({ userName: 'Username already in used.' });
      }

      const newUserModel = new this.userModel(userCreateDTO);
      const newUser = await newUserModel.save();
      return handleResponse(newUser);
    } catch (error) {
      return handleError(error);
    }
  }

  async updateUser(id: string, userUpdateDTO: UserUpdateDTO) {
    return this.userModel.findByIdAndUpdate(id, userUpdateDTO);
  }
}
