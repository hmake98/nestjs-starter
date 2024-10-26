import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';

import {
    AuthResponseDto,
    AuthRefreshResponseDto,
} from '../dtos/auth.response.dto';

export function AuthLoginDoc() {
    return applyDecorators(
        ApiOperation({ summary: 'User login' }),
        DocResponse({
            serialization: AuthResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST])
    );
}

export function AuthSignupDoc() {
    return applyDecorators(
        ApiOperation({ summary: 'User signup' }),
        DocResponse({
            serialization: AuthResponseDto,
            httpStatus: HttpStatus.CREATED,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.CONFLICT])
    );
}

export function AuthRefreshTokenDoc() {
    return applyDecorators(
        ApiBearerAuth('refreshToken'),
        ApiOperation({ summary: 'Refresh token' }),
        DocResponse({
            serialization: AuthRefreshResponseDto,
            httpStatus: HttpStatus.CREATED,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED])
    );
}
