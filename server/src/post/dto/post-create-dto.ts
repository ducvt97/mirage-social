import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class PostCreateDTO {
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  caption: string;
}
