import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { INotificationService } from '../interfaces/notification.service.interface';
import { NotificationCreateDto } from '../dtos/create.notification.dto';
import { NotificationGetDto } from '../dtos/get.notification.dto';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import {
  NotificationCreateResponseDto,
  NotificationGetResponseDto,
} from '../dtos/notification.response.dto';
import { GenericResponseDto } from 'src/core/dtos/response.dto';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createNotification(
    userId: string,
    data: NotificationCreateDto,
  ): Promise<NotificationCreateResponseDto> {
    const { title, body, payload, recipients, type } = data;
    return this.prismaService.notification.create({
      data: {
        title: title?.trim(),
        body: body?.trim(),
        payload,
        type,
        sender: {
          connect: {
            id: userId,
          },
        },
        recipients: {
          create: recipients.map(userId => ({
            user: {
              connect: {
                id: userId,
              },
            },
          })),
        },
      },
      include: {
        sender: true,
        recipients: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  public async getNotifications(
    params: NotificationGetDto,
  ): Promise<NotificationGetResponseDto> {
    try {
      const { limit, page, search } = params;
      const skip = (page - 1) * limit;
      const count = await this.prismaService.notification.count({
        where: {
          ...(search && {
            title: {
              contains: search,
              mode: 'insensitive',
            },
            body: {
              contains: search,
              mode: 'insensitive',
            },
          }),
        },
      });
      const data = await this.prismaService.notification.findMany({
        where: {
          ...(search && {
            title: {
              contains: search,
              mode: 'insensitive',
            },
            body: {
              contains: search,
              mode: 'insensitive',
            },
          }),
        },
        take: limit,
        skip: skip,
        include: {
          sender: true,
          recipients: {
            include: {
              user: true,
            },
          },
        },
      });
      return {
        count,
        data,
      };
    } catch (e) {
      throw e;
    }
  }

  async deleteNotification(
    notificationId: string,
  ): Promise<GenericResponseDto> {
    const check = await this.prismaService.notification.findUnique({
      where: {
        id: notificationId,
      },
    });
    if (!check) {
      throw new HttpException(
        'notifications.notificationNotFound',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.prismaService.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        deleted_at: new Date(),
        is_deleted: true,
      },
    });
    return {
      status: true,
      message: 'notifications.notificationDeleted',
    };
  }
}
