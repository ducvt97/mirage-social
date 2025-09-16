import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';

export class GetPostsByUserDTO extends GetWithPagingDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
