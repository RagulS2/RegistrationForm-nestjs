import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    @Matches('[a-zA-Z ]*')
    userName: string;

    @ApiProperty()
    @IsString()
    @Matches('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;

}
