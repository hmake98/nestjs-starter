import { Controller, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';
import { IAuthUser } from 'src/core/interfaces/request.interface';

import { FilePutPresignResponseDto } from '../dtos/file.response.dto';
import { GetPresignDto } from '../dtos/get.presign.dto';
import { FilesService } from '../services/files.service';

@ApiTags('files')
@Controller({
  path: '/files',
  version: '1',
})
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Get pre-signed URL for file upload' })
  @DocResponse({
    serialization: FilePutPresignResponseDto,
    httpStatus: HttpStatus.CREATED,
  })
  @DocErrors([HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR])
  @Post('get-presign')
  putPresignUrl(
    @AuthUser() user: IAuthUser,
    @Query() params: GetPresignDto,
  ): Promise<FilePutPresignResponseDto> {
    return this.fileService.getPresignUrlPutObject(params, user.userId);
  }
}
