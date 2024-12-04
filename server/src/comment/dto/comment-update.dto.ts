import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CommentUpdateDTO {
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsString()
  caption: string;
}

export class SystemCommentUpdateDTO {
  @IsOptional()
  @IsString()
  caption: string;

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

  @IsOptional()
  @IsNumber()
  replies: number;

  @IsOptional()
  @IsArray()
  replyComments: string[];
}

export class LikeComment {
  @IsString()
  @IsNotEmpty()
  commentId: string;
}

export class LikeCommentDTO {
  @IsString()
  @IsNotEmpty()
  commentId: string;
}
