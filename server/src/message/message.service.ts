import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { SendMessageDTO } from './dto/send-message.dto';
import {
  Conversation,
  ConversationDocument,
} from 'src/schemas/conversation.schema';
import { CreateConversationDTO } from './dto/conversation.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private userService: UserService,
  ) {}

  /*** Conversation Services Start ***/
  async createConversation(
    conversationInfo: CreateConversationDTO,
  ): Promise<Conversation> {
    try {
      const newConversation = new this.conversationModel({
        ...conversationInfo,
      });
      await newConversation.save();
      return newConversation;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findConversationById(conversationId: string): Promise<Conversation> {
    try {
      const conversation =
        await this.conversationModel.findById(conversationId);
      return conversation;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async userGetConversationById(
    userId: string,
    conversationId: string,
  ): Promise<Conversation> {
    try {
      const conversation =
        await this.conversationModel.findById(conversationId);

      if (!conversation) {
        return Promise.reject('Conversation not found.');
      }

      if (conversation.isGroup) {
        if (!conversation.name) {
          const memberId = conversation.members.find(
            (item) => String(item) !== userId,
          );

          const member = await this.userService.getUserById(memberId);

          if (member) {
            conversation.name = `You, ${member.lastName}${
              conversation.members.length > 2 &&
              'and ' + (conversation.members.length - 2) + ' other(s)'
            }`;
          }
        }

        if (!conversation.avatar) {
          conversation.avatar =
            'https://avatars.githubusercontent.com/u/739984?v=4';
        }
      } else {
        const friendId =
          conversation.members.length === 1
            ? conversation.members[0]
            : conversation.members.find((item) => String(item) !== userId);

        if (friendId) {
          const friend = await this.userService.getUserById(friendId);
          conversation.name = `${friend.firstName} ${friend.lastName}`;
          conversation.avatar = friend.avatar;
        }
      }
      return conversation;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findDirectConversation(userIds: string[]): Promise<Conversation> {
    try {
      if (!userIds.length) {
        return null;
      }

      const conversation = await this.conversationModel.findOne({
        isGroup: false,
        members: { $size: userIds.length, $all: userIds },
      });
      return conversation;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /*** Conversation Services End ***/

  /*** Message Services Start ***/
  async addMessage(messageInfo: SendMessageDTO): Promise<Message> {
    try {
      const newMessage = new this.messageModel({ ...messageInfo });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getMessageById(messageId: string): Promise<MessageDocument> {
    try {
      const message = await this.messageModel.findById(messageId);
      return message;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getMessagesByConversation(
    conversationId: string,
    page: number = 0,
  ): Promise<Message[]> {
    try {
      const messages = await this.messageModel.find({ conversationId }, null, {
        skip: page * 20,
        limit: 20,
      });
      return messages;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getLastMessageOfConversation(conversationId: string): Promise<Message> {
    try {
      const message = await this.messageModel.findOne({ conversationId });
      return message;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /*** Message Services End ***/
}
