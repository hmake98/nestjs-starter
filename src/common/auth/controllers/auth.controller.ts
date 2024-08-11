import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { PublicRoute } from 'src/core/decorators/public.request.decorator';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';
import { JwtRefreshGuard } from 'src/core/guards/jwt.refresh.guard';
import { IAuthUser } from 'src/core/interfaces/request.interface';

import { UserLoginDto } from '../dtos/auth.login.dto';
import { AuthRefreshResponseDto, AuthResponseDto } from '../dtos/auth.response.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @ApiOperation({ summary: 'User login' })
  @DocErrors([HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST])
  @DocResponse({
    serialization: AuthResponseDto,
    httpStatus: HttpStatus.OK,
  })
  @Post('login')
  public login(@Body() payload: UserLoginDto): Promise<AuthResponseDto> {
    return this.authService.login(payload);
  }

  @PublicRoute()
  @ApiOperation({ summary: 'User signup' })
  @DocErrors([HttpStatus.NOT_FOUND, HttpStatus.CONFLICT])
  @DocResponse({
    serialization: AuthResponseDto,
    httpStatus: HttpStatus.CREATED,
  })
  @Post('signup')
  public signup(@Body() payload: UserCreateDto): Promise<AuthResponseDto> {
    return this.authService.signup(payload);
  }

  @PublicRoute()
  @ApiBearerAuth('refreshToken')
  @ApiOperation({ summary: 'Refresh token' })
  @UseGuards(JwtRefreshGuard)
  @DocErrors([HttpStatus.UNAUTHORIZED])
  @DocResponse({
    serialization: AuthResponseDto,
    httpStatus: HttpStatus.CREATED,
  })
  @Get('refresh-token')
  public refreshTokens(@AuthUser() user: IAuthUser): Promise<AuthRefreshResponseDto> {
    return this.authService.refreshTokens(user);
  }
}
