import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostCreateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  caption: string;
}
