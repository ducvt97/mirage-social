import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserCreateDTO } from './dto/user-create-dto';
import { UserUpdateDTO } from './dto/user-update-dto';
import { handleError, handleResponse } from 'src/utils/response.util';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async getUserByEmail(email: string): Promise<User> {
    if (!email) {
      return null;
    }

    return this.userModel.findOne({ email }).exec();
  }

  async createUser(userCreateDTO: UserCreateDTO) {
    try {
      const userExist = await this.getUserByEmail(userCreateDTO.email);
      if (userExist) {
        return handleError({ email: 'Email already in used.' });
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

  async sendFriendRequest(userId: string, friendId: string): Promise<boolean> {
    try {
      const [user, friend] = await Promise.all([
        this.getUserById(userId),
        this.getUserById(friendId),
      ]);

      const isFriend =
        user.friends.includes(friendId) || friend.friends.includes(userId);
      if (isFriend) {
        return Promise.reject('You both are already friends.');
      }

      const isSentRequest =
        user.friendRequestsSent.includes(friendId) ||
        friend.friendRequests.includes(userId);
      if (isSentRequest) {
        return Promise.reject(
          'You had sent friend request to this person. Please wait to be accepted.',
        );
      }

      friend.friendRequests.unshift(userId);
      user.friendRequestsSent.unshift(friendId);
      await Promise.all([friend.save(), user.save()]);

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async undoSendFriendRequest(
    userId: string,
    friendId: string,
  ): Promise<boolean> {
    try {
      const [user, friend] = await Promise.all([
        this.getUserById(userId),
        this.getUserById(friendId),
      ]);

      const userRequestIndex = user.friendRequestsSent.findIndex(
        (item) => item === friendId,
      );
      const requestIndex = friend.friendRequests.findIndex(
        (item) => item === userId,
      );
      if (userRequestIndex === -1 || requestIndex === -1) {
        return Promise.reject('You did not add this person as friend.');
      }

      user.friendRequestsSent.splice(userRequestIndex, 1);
      friend.friendRequests.splice(requestIndex, 1);
      await Promise.all([friend.save(), user.save()]);

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async acceptFriendRequest(
    userId: string,
    friendId: string,
  ): Promise<boolean> {
    try {
      const [user, friend] = await Promise.all([
        this.getUserById(userId),
        this.getUserById(friendId),
      ]);

      const isFriend =
        user.friends.includes(friendId) || friend.friends.includes(userId);
      if (isFriend) {
        return Promise.reject('You both are already friends.');
      }

      const userRequestIndex = user.friendRequestsSent.findIndex(
        (item) => item === friendId,
      );
      const requestIndex = friend.friendRequests.findIndex(
        (item) => item === userId,
      );
      if (userRequestIndex === -1 || requestIndex === -1) {
        return Promise.reject('This person did not add you as friend.');
      }

      user.friendRequestsSent.splice(userRequestIndex, 1);
      user.friends.unshift(friendId);
      friend.friendRequests.splice(requestIndex, 1);
      friend.friends.unshift(userId);
      await Promise.all([friend.save(), user.save()]);

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async rejectFriendRequest(
    userId: string,
    friendId: string,
  ): Promise<boolean> {
    try {
      const [user, friend] = await Promise.all([
        this.getUserById(userId),
        this.getUserById(friendId),
      ]);

      const isSentRequest =
        user.friendRequestsSent.includes(friendId) &&
        friend.friendRequests.includes(userId);
      if (!isSentRequest) {
        return Promise.reject('This person did not add you as friend.');
      }

      user.friendRequestsSent = user.friendRequestsSent.filter(
        (item) => item !== friendId,
      );
      friend.friendRequests = friend.friendRequests.filter(
        (item) => item !== userId,
      );
      await Promise.all([friend.save(), user.save()]);

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteFriend(userId: string, friendId: string) {
    try {
      const [user, friend] = await Promise.all([
        this.getUserById(userId),
        this.getUserById(friendId),
      ]);

      const isFriend =
        user.friends.includes(friendId) && friend.friends.includes(userId);
      if (isFriend) {
        return Promise.reject('You both are not friends.');
      }

      user.friends = user.friends.filter((item) => item !== friendId);
      friend.friends = friend.friends.filter((item) => item !== userId);
      await Promise.all([friend.save(), user.save()]);

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
