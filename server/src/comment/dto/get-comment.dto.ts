import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';

export class GetCommentsByPostDTO extends GetWithPagingDTO {
  @ApiProperty()
  @IsMongoId()
  postId: string;
}

export class GetCommentsByCommentDTO extends GetWithPagingDTO {
  @ApiProperty()
  @IsMongoId()
  commentId: string;
}
