import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocGenericResponse } from 'src/common/doc/decorators/doc.generic.decorator';

export function UserAdminDeleteDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({ summary: 'Delete user' }),
        DocGenericResponse(),
        DocErrors([HttpStatus.NOT_FOUND])
    );
}
