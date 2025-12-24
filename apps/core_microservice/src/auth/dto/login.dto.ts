import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
<<<<<<< HEAD
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
=======
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}
