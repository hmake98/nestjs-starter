// user.public.doc.ts
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';

import {
    UserGetProfileResponseDto,
    UserUpdateProfileResponseDto,
} from '../dtos/response/user.response';

export function UserPublicGetProfileDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({ summary: 'Get user profile' }),
        DocResponse({
            serialization: UserGetProfileResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND])
    );
}

export function UserPublicUpdateProfileDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({ summary: 'Update user' }),
        DocResponse({
            serialization: UserUpdateProfileResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST])
    );
}
