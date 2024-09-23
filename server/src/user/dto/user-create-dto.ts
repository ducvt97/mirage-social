import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserCreateDTO {
    @IsNotEmpty()
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