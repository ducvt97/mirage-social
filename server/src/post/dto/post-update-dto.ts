import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { PostStatusType } from 'src/common/constants/enums';

export class PostUpdateDTO {
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsEnum(PostStatusType)
  status: string;
}

export class LikePost {
  @IsString()
  @IsNotEmpty()
  postId: string;
}
