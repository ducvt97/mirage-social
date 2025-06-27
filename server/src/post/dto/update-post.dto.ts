import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  caption: string;

  @ApiProperty()
  @IsEnum(PostStatusType)
  status: string;
}

export class SystemPostUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  caption: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PostStatusType)
  status: string;

  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  likes: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  usersLike: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  tags: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  comments: string[];
}

export class LikePostDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postId: string;
}
