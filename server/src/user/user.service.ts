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
    try {
      const user = await this.userModel.findById(id);
      return user;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getUsersById(ids: string[]): Promise<UserDocument[]> {
    try {
      const usersPromise: Promise<UserDocument>[] = [];
      ids.forEach((item) => usersPromise.push(this.getUserById(item)));
      const users = await Promise.all(usersPromise);
      return users;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async searchUser(
    searchText: string,
    page: number = 0,
    pageSize: number = 20,
  ): Promise<UserDocument[]> {
    try {
      if (!searchText) {
        return [];
      }

      const users = await this.userModel.find(
        {
          $or: [
            { email: { $regex: searchText, $options: 'i' } },
            { firstName: { $regex: searchText, $options: 'i' } },
            { lastName: { $regex: searchText, $options: 'i' } },
          ],
        },
        null,
        { skip: page, limit: pageSize },
      );
      return users;
    } catch (error) {
      return Promise.reject(error);
    }
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
        user.friends.find((item) => String(item) === friendId) ||
        friend.friends.find((item) => String(item) === userId);
      if (isFriend) {
        return Promise.reject('You both are already friends.');
      }

      const isSentRequest =
        user.friendRequestsSent.find((item) => String(item) === friendId) ||
        friend.friendRequests.find((item) => String(item) === userId);
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
        (item) => String(item) === friendId,
      );
      const requestIndex = friend.friendRequests.findIndex(
        (item) => String(item) === userId,
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

      const userRequestIndex = user.friendRequests.findIndex(
        (item) => String(item) === friendId,
      );
      const requestIndex = friend.friendRequestsSent.findIndex(
        (item) => String(item) === userId,
      );
      if (userRequestIndex === -1 || requestIndex === -1) {
        return Promise.reject('This person did not add you as friend.');
      }

      user.friendRequests.splice(userRequestIndex, 1);
      user.friends.unshift(friendId);
      friend.friendRequestsSent.splice(requestIndex, 1);
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

      const userRequestIndex = user.friendRequests.findIndex(
        (item) => String(item) === friendId,
      );
      const requestIndex = friend.friendRequestsSent.findIndex(
        (item) => String(item) === userId,
      );
      if (userRequestIndex === -1 || requestIndex === -1) {
        return Promise.reject('This person did not add you as friend.');
      }

      user.friendRequests.splice(userRequestIndex, 1);
      friend.friendRequestsSent.splice(requestIndex, 1);
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

      const userFriendIndex = user.friends.findIndex(
        (item) => String(item) === friendId,
      );
      const friendUserIndex = friend.friends.findIndex(
        (item) => String(item) === userId,
      );
      if (userFriendIndex === -1 || friendUserIndex === -1) {
        return Promise.reject('You both are not friends.');
      }

      user.friends.splice(userFriendIndex, 1);
      friend.friends.splice(friendUserIndex, 1);
      await Promise.all([friend.save(), user.save()]);

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addNewMessage(userId: string, conversationId: string): Promise<User> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        return Promise.reject('User not found.');
      }

      const conversationIndex = user.conversations.findIndex(
        (item) => String(item) === conversationId,
      );
      if (conversationIndex !== -1) {
        user.conversations.splice(conversationIndex, 1);
      }
      user.conversations.unshift(conversationId);

      const isConversationUnread = user.unreadConversations.find(
        (item) => String(item) === conversationId,
      );
      if (!isConversationUnread) {
        user.unreadConversations.push(conversationId);
      }

      await user.save();
      return user;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
