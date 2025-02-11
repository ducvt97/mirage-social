import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateConversationDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsOptional()
  isGroup: boolean = false;

  @IsArray()
  members: string[] = [];
}
