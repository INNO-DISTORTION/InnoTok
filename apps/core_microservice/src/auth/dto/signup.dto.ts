import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
<<<<<<< HEAD
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
=======
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Display name' })
  @IsString({ message: 'Display name must be a string' })
  @IsNotEmpty({ message: 'Display name is required' })
  displayName: string;

<<<<<<< HEAD
  @ApiProperty({ example: '1990-01-01', description: 'Birthday in YYYY-MM-DD format' })
=======
  @ApiProperty({
    example: '1990-01-01',
    description: 'Birthday in YYYY-MM-DD format',
  })
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
  @IsString({ message: 'Birthday must be a string' })
  @IsNotEmpty({ message: 'Birthday is required' })
  birthday: string;

<<<<<<< HEAD
  @ApiProperty({ example: 'Bio about the user', description: 'User bio', required: false })
=======
  @ApiProperty({
    example: 'Bio about the user',
    description: 'User bio',
    required: false,
  })
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
  @IsString({ message: 'Bio must be a string' })
  bio?: string;
}
