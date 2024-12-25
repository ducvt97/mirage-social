import { IsNotEmpty, IsString } from 'class-validator';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';

export class GetPostsByUserDTO extends GetWithPagingDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
