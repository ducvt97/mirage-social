import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDTO {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  content?: string;

  @IsMongoId()
  senderId: string;

  @IsOptional()
  @IsMongoId()
  receiverId?: string;

  @IsOptional()
  @IsMongoId()
  conversationId?: string;
}
