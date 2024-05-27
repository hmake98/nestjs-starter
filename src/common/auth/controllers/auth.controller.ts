import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PublicRoute } from 'src/core/decorators/public.request.decorator';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';
import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { JwtRefreshGuard } from 'src/core/guards/jwt.refresh.guard';
import { IAuthUser } from 'src/core/interfaces/request.interface';

import {
  AuthRefreshResponseDto,
  AuthResponseDto,
} from '../dtos/auth.response.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';
import { UserLoginDto } from '../dtos/auth.login.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @DocErrors([HttpStatus.NOT_FOUND])
  @DocResponse({
    serialization: AuthResponseDto,
    httpStatus: 201,
  })
  @Post('login')
  public login(@Body() payload: UserLoginDto): Promise<AuthResponseDto> {
    return this.authService.login(payload);
  }

  @PublicRoute()
  @DocErrors([HttpStatus.NOT_FOUND, HttpStatus.CONFLICT])
  @DocResponse({
    serialization: AuthResponseDto,
    httpStatus: 201,
  })
  @Post('signup')
  public signup(@Body() payload: UserCreateDto): Promise<AuthResponseDto> {
    return this.authService.signup(payload);
  }

  @ApiBearerAuth('refreshToken')
  @PublicRoute()
  @UseGuards(JwtRefreshGuard)
  @DocErrors([HttpStatus.UNAUTHORIZED])
  @DocResponse({
    serialization: AuthRefreshResponseDto,
    httpStatus: 200,
  })
  @Get('refresh-token')
  public refreshTokens(
    @AuthUser() user: IAuthUser,
  ): Promise<AuthRefreshResponseDto> {
    return this.authService.refreshTokens(user);
  }
}
