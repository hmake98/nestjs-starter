import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Token } from 'src/shared/interfaces';
import { FileService } from 'src/shared/services/file.service';
import { TokenDto } from './dto/token.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  public constructor(private readonly userService: UserService, private readonly fileService: FileService) {}

  @HttpCode(200)
  @Post('/login')
  public async login(@Body() data: UserLoginDto): Promise<void> {
    return this.userService.login(data.pin);
  }

  @HttpCode(200)
  @Post('/token')
  public async getAccessToken(@Body() data: TokenDto): Promise<Token> {
    return this.userService.getToken(data.refreshToken);
  }
}
