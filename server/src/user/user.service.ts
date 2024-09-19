import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UserCreateDTO } from './dto/user-create-dto';
import { UserUpdateDTO } from './dto/user-update-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  async createUser(userCreateDTO: UserCreateDTO) {
    const newUser = new this.userModel(userCreateDTO);
    return newUser.save();
  }
  async updateUser(id: string, userUpdateDTO: UserUpdateDTO) {
    return this.userModel.findByIdAndUpdate(id, userUpdateDTO);
  }
}
