import { Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import { FilePublicPresignUrlDoc } from '../docs/file.public.doc';
import { FilePresignDto } from '../dtos/file.presign.dto';
import { FilePutPresignResponseDto } from '../dtos/file.response.dto';
import { FileService } from '../services/files.service';

@ApiTags('public.file')
@Controller({
    path: '/file',
    version: '1',
})
export class FilePublicController {
    constructor(private readonly fileService: FileService) {}

    @FilePublicPresignUrlDoc()
    @Post('get-presign')
    putPresignUrl(
        @AuthUser() { userId }: IAuthUser,
        @Query() params: FilePresignDto
    ): Promise<FilePutPresignResponseDto> {
        return this.fileService.getPresignUrlPutObject(userId, params);
    }
}
