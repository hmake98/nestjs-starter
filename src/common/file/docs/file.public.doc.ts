import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';

import { FilePutPresignResponseDto } from '../dtos/file.response.dto';

export function FilePublicPresignUrlDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({ summary: 'Get pre-signed URL for file upload' }),
        DocResponse({
            serialization: FilePutPresignResponseDto,
            httpStatus: HttpStatus.CREATED,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR])
    );
}
