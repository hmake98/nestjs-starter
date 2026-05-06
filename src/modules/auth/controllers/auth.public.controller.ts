import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiEndpoint } from 'src/common/doc/decorators/doc.api-endpoint.decorator';
import { AuthUser } from 'src/common/request/decorators/auth-user.decorator';
import { PublicRoute } from 'src/common/request/decorators/public.decorator';
import { JwtRefreshGuard } from 'src/common/request/guards/jwt-refresh.guard';
import type { IAuthUser } from 'src/common/request/interfaces/request.interface';

import { UserLoginDto } from '../dtos/auth.login.dto';
import {
    AuthRefreshResponseDto,
    AuthResponseDto,
} from '../dtos/auth.response.dto';
import { UserCreateDto } from '../dtos/auth.signup.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('public.auth')
@PublicRoute()
@Controller({ path: '/auth', version: '1' })
export class AuthPublicController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiEndpoint({
        summary: 'User login',
        serialization: AuthResponseDto,
        messageKey: 'auth.success.loggedIn',
    })
    login(@Body() payload: UserLoginDto): Promise<AuthResponseDto> {
        return this.authService.login(payload);
    }

    @Post('signup')
    @ApiEndpoint({
        summary: 'User signup',
        serialization: AuthResponseDto,
        httpStatus: HttpStatus.CREATED,
        messageKey: 'auth.success.signedUp',
    })
    signup(@Body() payload: UserCreateDto): Promise<AuthResponseDto> {
        return this.authService.signup(payload);
    }

    @Get('refresh-token')
    @UseGuards(JwtRefreshGuard)
    @ApiBearerAuth('refreshToken')
    @ApiEndpoint({
        summary: 'Refresh tokens',
        serialization: AuthRefreshResponseDto,
        messageKey: 'auth.success.tokensRefreshed',
    })
    refreshTokens(
        @AuthUser() user: IAuthUser
    ): Promise<AuthRefreshResponseDto> {
        return this.authService.refreshTokens(user);
    }
}
