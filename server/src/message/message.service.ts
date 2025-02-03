import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { SendMessageDTO } from './dto/send-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

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
