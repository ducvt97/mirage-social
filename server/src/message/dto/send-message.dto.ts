import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';

export class SendMessageDTO {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  @IsMongoId()
  senderId?: string;

  @IsOptional()
  @IsMongoId()
  receiverId?: string;

  @IsOptional()
  @IsMongoId()
  conversationId?: string;
}

export class GetMessagesDTO extends GetWithPagingDTO {
  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;
}
