import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';

export class UserUpdateDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dob?: string;
}

export class UserUpdateFriendDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  friendId: string;
}

export class UserSearchDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  searchText?: string;
}

export class UserGetInfoDTO extends GetWithPagingDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
