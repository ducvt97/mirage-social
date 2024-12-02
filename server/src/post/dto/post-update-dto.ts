import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostStatusType } from 'src/common/constants/enums';

export class PostUpdateDTO {
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsEnum(PostStatusType)
  status: string;
}

export class SystemPostUpdateDTO {
  @IsOptional()
  @IsMongoId()
  id?: string;

  @IsOptional()
  @IsString()
  caption: string;

  @IsOptional()
  @IsEnum(PostStatusType)
  status: string;

  @IsOptional()
  content: string;

  @IsOptional()
  @IsNumber()
  likes: number;

  @IsOptional()
  @IsArray()
  usersLike: string[];

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsOptional()
  @IsArray()
  comments: string[];
}

export class LikePost {
  @IsString()
  @IsNotEmpty()
  postId: string;
}
