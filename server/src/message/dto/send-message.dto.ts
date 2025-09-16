import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';

export class SendMessageDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsOptional()
  content?: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  senderId?: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  receiverId?: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  conversationId?: string;
}

export class GetMessagesDTO extends GetWithPagingDTO {
  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;
}
