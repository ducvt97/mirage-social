import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommentOnPostDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  caption: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  postId: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  replyCommentId?: string;
}
