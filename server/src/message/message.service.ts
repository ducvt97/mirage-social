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

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
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

  async findDirectConversation(userIds: string[]): Promise<Conversation> {
    try {
      if (userIds.length !== 2) {
        return undefined;
      }
      const conversation = await this.conversationModel.findOne({
        isGroup: false,
        members: { $size: 2, $all: userIds },
      });
      return conversation;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /*** Conversation Services End ***/

  async addMessage(messageInfo: SendMessageDTO): Promise<Message> {
    try {
      const newMessage = new this.messageModel({ ...messageInfo });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
