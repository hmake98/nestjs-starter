import { Controller, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';
import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import { FilePresignDto } from '../dtos/request/file.presign.dto';
import { FilePutPresignResponseDto } from '../dtos/response/file.response.dto';
import { FileService } from '../services/files.service';

@ApiTags('public.file')
@Controller({
    path: '/file',
    version: '1',
})
export class FilePublicController {
    constructor(private readonly fileService: FileService) {}

    @Post('get-presign')
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: 'Get pre-signed URL for file upload' })
    @DocResponse({
        serialization: FilePutPresignResponseDto,
        httpStatus: HttpStatus.CREATED,
        messageKey: 'file.success.presignUrl',
    })
    putPresignUrl(
        @AuthUser() { userId }: IAuthUser,
        @Query() params: FilePresignDto
    ): Promise<FilePutPresignResponseDto> {
        return this.fileService.getPresignUrlPutObject(userId, params);
    }
}
