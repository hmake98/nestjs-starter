import { Controller, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';
import { IAuthUser } from 'src/core/interfaces/request.interface';

import { GetPresignDto } from '../dtos/get.presign.dto';
import { FilesService } from '../services/files.service';
import { FilePutPresignResponseDto } from '../dtos/file.response.dto';

@ApiTags('files')
@Controller({
  path: '/files',
  version: '1',
})
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @ApiBearerAuth('accessToken')
  @DocResponse({
    serialization: FilePutPresignResponseDto,
    httpStatus: 201,
  })
  @DocErrors([HttpStatus.INTERNAL_SERVER_ERROR])
  @Post('/get-presign')
  putPresignUrl(
    @AuthUser() user: IAuthUser,
    @Query() params: GetPresignDto,
  ): Promise<FilePutPresignResponseDto> {
    return this.fileService.getPresginPutObject(params, user.userId);
  }
}
