import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserCreateDTO {
    @IsOptional()
    @IsString()
    userName: string;
    
    @IsNotEmpty()
    @IsEmail()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}