import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PublicRoute } from 'src/common/request/decorators/request.public.decorator';
import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { JwtRefreshGuard } from 'src/common/request/guards/jwt.refresh.guard';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import {
    AuthLoginDoc,
    AuthRefreshTokenDoc,
    AuthSignupDoc,
} from '../docs/auth.public.doc';
import { UserLoginDto } from '../dtos/auth.login.dto';
import {
    AuthRefreshResponseDto,
    AuthResponseDto,
} from '../dtos/auth.response.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('public.auth')
@Controller({
    version: '1',
    path: '/auth',
})
export class AuthPublicController {
    constructor(private readonly authService: AuthService) {}

    @AuthLoginDoc()
    @PublicRoute()
    @Post('login')
    public login(@Body() payload: UserLoginDto): Promise<AuthResponseDto> {
        return this.authService.login(payload);
    }

    @AuthSignupDoc()
    @PublicRoute()
    @Post('signup')
    public signup(@Body() payload: UserCreateDto): Promise<AuthResponseDto> {
        return this.authService.signup(payload);
    }

    @AuthRefreshTokenDoc()
    @PublicRoute()
    @UseGuards(JwtRefreshGuard)
    @Get('refresh-token')
    public refreshTokens(
        @AuthUser() user: IAuthUser
    ): Promise<AuthRefreshResponseDto> {
        return this.authService.refreshTokens(user);
    }
}
