import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  NotificationCreateResponseDto,
  NotificationGetResponseDto,
} from '../dtos/notification.response.dto';
import { DocErrors, DocResponse } from 'src/core/decorators/response.decorator';
import { NotificationService } from '../services/notification.service';
import { NotificationCreateDto } from '../dtos/create.notification.dto';
import { AuthUser } from 'src/core/decorators/auth.user.decorator';
import { NotificationGetDto } from '../dtos/get.notification.dto';
import { IAuthUser } from 'src/core/interfaces/request.interface';
import { GenericResponseDto } from 'src/core/dtos/response.dto';

@ApiTags('notifications')
@Controller({
  path: '/notifications',
  version: '1',
})
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiBearerAuth('accessToken')
  @DocResponse({
    serialization: NotificationCreateResponseDto,
    httpStatus: 201,
  })
  @DocErrors([HttpStatus.CONFLICT])
  @Post()
  async createNotification(
    @AuthUser() user: IAuthUser,
    @Body() data: NotificationCreateDto,
  ): Promise<NotificationCreateResponseDto> {
    return this.notificationService.createNotification(user.userId, data);
  }

  @ApiBearerAuth('accessToken')
  @DocResponse({
    serialization: NotificationGetResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Get()
  async getNotifications(
    @Query() params: NotificationGetDto,
  ): Promise<NotificationGetResponseDto> {
    return this.notificationService.getNotifications(params);
  }

  @ApiBearerAuth('accessToken')
  @DocResponse({
    serialization: GenericResponseDto,
    httpStatus: 200,
  })
  @DocErrors([HttpStatus.NOT_FOUND])
  @Delete(':id')
  async deleteNotification(
    @AuthUser() _user: IAuthUser,
    @Param('id') notificationId: string,
  ): Promise<GenericResponseDto> {
    return this.notificationService.deleteNotification(notificationId);
  }
}
