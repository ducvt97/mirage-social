import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class PostUpdateDTO {
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsString()
  caption: string;
}

export class LikePost {
  @IsString()
  @IsNotEmpty()
  postId: string;
}
