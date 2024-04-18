import { GenericResponseDto } from 'src/core/dtos/response.dto';
import { NotificationCreateDto } from '../dtos/create.notification.dto';
import { NotificationGetDto } from '../dtos/get.notification.dto';
import {
  NotificationCreateResponseDto,
  NotificationGetResponseDto,
} from '../dtos/notification.response.dto';

export interface INotificationService {
  createNotification(
    userId: string,
    data: NotificationCreateDto,
  ): Promise<NotificationCreateResponseDto>;
  getNotifications(
    params: NotificationGetDto,
  ): Promise<NotificationGetResponseDto>;
  deleteNotification(notificationId: string): Promise<GenericResponseDto>;
}
