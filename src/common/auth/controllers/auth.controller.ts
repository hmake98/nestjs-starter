import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PublicRoute } from 'src/core/decorators/public.request.decorator';
import { AuthService } from '../services/auth.service';
import { UserLoginDto } from '../dtos/auth.login.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AuthRefreshResponseDto,
  AuthResponseDto,
} from '../dtos/auth.response.dto';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';
import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { IAuthUser } from '../interfaces/auth.interface';
import { JwtRefreshGuard } from 'src/core/guards/jwt.refresh.guard';

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
    serialization: AuthResponseDto,
    httpStatus: 200,
  })
  @Get('refresh-token')
  public refreshTokens(
    @AuthUser() user: IAuthUser,
  ): Promise<AuthRefreshResponseDto> {
    return this.authService.refreshTokens(user);
  }
}
