import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetWithPagingDTO {
  @ApiProperty()
  @IsOptional()
  page?: number;

  @ApiProperty()
  @IsOptional()
  pageSize?: number;
}

export class SearchDTO extends GetWithPagingDTO {
  @ApiProperty()
  @IsOptional()
  search?: string;
}
