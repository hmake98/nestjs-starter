import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UserLoginDto {
  @ApiProperty({
    description: 'User email address',
    example: faker.internet.email(),
    required: true,
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.errors.invalidEmail') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.errors.required') })
  public email: string;

  @ApiProperty({
    description: 'User password',
    example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string
      .alphanumeric(5)
      .toUpperCase()}@@!${faker.number.int(1000)}`,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('validation.errors.required') })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: i18nValidationMessage('validation.errors.passwordComplexity'),
  })
  public password: string;
}
