import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';
import { PublicRoute } from 'src/common/request/decorators/request.public.decorator';
import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { JwtRefreshGuard } from 'src/common/request/guards/jwt.refresh.guard';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import { UserLoginDto } from '../dtos/request/auth.login.dto';
import { UserCreateDto } from '../dtos/request/auth.signup.dto';
import {
    AuthRefreshResponseDto,
    AuthResponseDto,
} from '../dtos/response/auth.response.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('public.auth')
@Controller({
    version: '1',
    path: '/auth',
})
export class AuthPublicController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @PublicRoute()
    @ApiOperation({ summary: 'User login' })
    @DocResponse({
        serialization: AuthResponseDto,
        httpStatus: HttpStatus.OK,
    })
    public login(@Body() payload: UserLoginDto): Promise<AuthResponseDto> {
        return this.authService.login(payload);
    }

    @Post('signup')
    @PublicRoute()
    @ApiOperation({ summary: 'User signup' })
    @DocResponse({
        serialization: AuthResponseDto,
        httpStatus: HttpStatus.CREATED,
    })
    public signup(@Body() payload: UserCreateDto): Promise<AuthResponseDto> {
        return this.authService.signup(payload);
    }

    @Get('refresh-token')
    @PublicRoute()
    @UseGuards(JwtRefreshGuard)
    @ApiBearerAuth('refreshToken')
    @ApiOperation({ summary: 'Refresh token' })
    @DocResponse({
        serialization: AuthRefreshResponseDto,
        httpStatus: HttpStatus.CREATED,
    })
    public refreshTokens(
        @AuthUser() user: IAuthUser
    ): Promise<AuthRefreshResponseDto> {
        return this.authService.refreshTokens(user);
    }
}
