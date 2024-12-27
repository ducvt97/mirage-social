import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserUpdateDTO {
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsDateString()
  dob?: string;
}

export class UserUpdateFriendDTO {
  @IsString()
  @IsNotEmpty()
  friendId: string;
}
