import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocGenericResponse } from 'src/common/doc/decorators/doc.generic.decorator';
import { DocPaginatedResponse } from 'src/common/doc/decorators/doc.paginated.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';

import {
    PostCreateResponseDto,
    PostResponseDto,
    PostUpdateResponseDto,
} from '../dtos/response/post.response';

export function PostPublicCreateDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({ summary: 'Create a new post' }),
        DocResponse({
            serialization: PostCreateResponseDto,
            httpStatus: HttpStatus.CREATED,
        }),
        DocErrors([HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED])
    );
}

export function PostPublicDeleteDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({ summary: 'Delete a post' }),
        ApiParam({ name: 'id', description: 'Post ID' }),
        DocGenericResponse(),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}

export function PostPublicGetAllDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({ summary: 'Get all posts' }),
        DocPaginatedResponse({
            serialization: PostResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED])
    );
}

export function PostPublicUpdateDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({ summary: 'Update a post' }),
        ApiParam({ name: 'id', description: 'Post ID' }),
        DocResponse({
            serialization: PostUpdateResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}
