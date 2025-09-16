import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CommentUpdateDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  caption: string;
}

export class SystemCommentUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  caption: string;

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

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  replies: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  replyComments: string[];
}

export class LikeComment {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  commentId: string;
}

export class LikeCommentDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  commentId: string;
}
