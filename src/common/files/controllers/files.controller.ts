import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { GetPresignDto } from '../dtos/get.presign.dto';
import { FilesService } from '../services/files.service';
import { ApiTags } from '@nestjs/swagger';
import {
  FileGetPresignResponseDto,
  FilePutPresignResponseDto,
} from '../dtos/file.response.dto';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';

@ApiTags('files')
@Controller({
  path: '/files',
  version: '1',
})
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @DocResponse({
    serialization: FilePutPresignResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.INTERNAL_SERVER_ERROR])
  @Get('/put-presign')
  putPresignUrl(
    @AuthUser() userId: string,
    @Query() params: GetPresignDto,
  ): Promise<FilePutPresignResponseDto> {
    return this.fileService.getPresginPutObject(params, userId);
  }

  @DocResponse({
    serialization: FileGetPresignResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.NOT_FOUND])
  @Get('/get-presign/:id')
  getPresignUrl(
    @AuthUser() userId: string,
    @Param('id') fileId: string,
  ): Promise<FileGetPresignResponseDto> {
    return this.fileService.getPresignGetObject(fileId, userId);
  }
}
