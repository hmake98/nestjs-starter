import { User } from 'src/database/entities';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Put,
  Get,
  UseInterceptors,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthToken } from 'src/shared/interfaces';
import { UserCreateDto, UserLoginDto, UserUpdateDto, ListUsersDto, TokenDto } from './dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Post('login')
  public async login(@Body() data: UserLoginDto): Promise<AuthToken> {
    return this.userService.login(data);
  }

  @HttpCode(200)
  @Post('signup')
  public async signup(@Body() data: UserCreateDto): Promise<AuthToken> {
    return this.userService.signup(data);
  }

  @HttpCode(200)
  @Post('refresh-token')
  public async getAccessToken(@Body() data: TokenDto): Promise<AuthToken> {
    return this.userService.getToken(data.refreshToken);
  }

  @HttpCode(200)
  @Put('update/:id')
  public async update(@Param('id') id: number, @Body() data: UserUpdateDto): Promise<User> {
    return this.userService.update(id, data);
  }

  @HttpCode(200)
  @Delete('delete/:id')
  public async delete(@Param('id') id: number): Promise<any> {
    return this.userService.delete(id);
  }

  @HttpCode(200)
  @Get('list')
  public async list(@Query() query: ListUsersDto): Promise<User[]> {
    return this.userService.list(query);
  }
}
