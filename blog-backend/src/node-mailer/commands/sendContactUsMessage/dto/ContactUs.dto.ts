import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ContactUsDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, { message: 'Name is too long' })
  Name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  Email: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject is required' })
  @MaxLength(150, { message: 'Subject is too long' })
  Subject: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  Message: string;
}
