import { IsMongoId } from 'class-validator';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';

export class GetCommentsByPostDTO extends GetWithPagingDTO {
  @IsMongoId()
  postId: string;
}

export class GetCommentsByCommentDTO extends GetWithPagingDTO {
  @IsMongoId()
  commentId: string;
}
