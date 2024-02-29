import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { GetPresignDto } from '../dtos/get.presign.dto';
import { FilesService } from '../services/files.service';
import { FilesResponseInterface } from '../interfaces/files.interface';

@Controller({
  path: '/files',
  version: '1',
})
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Get('/put-presign')
  putPresignUrl(
    @AuthUser() userId: string,
    @Query() params: GetPresignDto,
  ): Promise<FilesResponseInterface> {
    return this.fileService.getPresginPutObject(params, userId);
  }

  @Get('/get-presign/:id')
  getPresignUrl(
    @AuthUser() userId: string,
    @Param('id') fileId: string,
  ): Promise<FilesResponseInterface> {
    return this.fileService.getPresignGetObject(fileId, userId);
  }
}
