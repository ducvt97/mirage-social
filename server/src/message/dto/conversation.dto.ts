import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConversationDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  avatar: string;

  @IsOptional()
  isGroup: boolean = false;

  @IsOptional()
  members: string[] = [];
}
