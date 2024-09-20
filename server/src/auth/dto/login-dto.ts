import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}