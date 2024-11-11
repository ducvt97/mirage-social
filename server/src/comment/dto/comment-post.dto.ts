import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommentOnPostDTO {
  @IsString()
  @IsNotEmpty()
  caption: string;

  @IsMongoId()
  @IsNotEmpty()
  postId: string;

  @IsOptional()
  @IsMongoId()
  replyCommentId?: string;
}
