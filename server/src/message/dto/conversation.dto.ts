import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateConversationDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsOptional()
  isGroup: boolean = false;

  @ApiProperty()
  @IsArray()
  members: string[] = [];
}

export class GetDirectConversationDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  receiverId?: string;
}
