import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Notification } from '@prisma/client';

import { GenericResponseDto } from 'src/core/dtos/response.dto';
import { NotificationService } from 'src/common/notification/services/notification.service';
import { PrismaService } from 'src/common/helper/services/prisma.service';
import {
  NotificationCreateResponseDto,
  NotificationGetResponseDto,
} from 'src/common/notification/dtos/notification.response.dto';
import { NotificationCreateDto } from 'src/common/notification/dtos/create.notification.dto';
import { NotificationGetDto } from 'src/common/notification/dtos/get.notification.dto';

describe('NotificationService', () => {
  let service: NotificationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const userId = 'user1';
      const data = {
        title: 'Test Title',
        body: 'Test Body',
        payload: {},
        recipients: ['user2'],
        type: 'EMAIL',
      } as unknown as NotificationCreateDto;
      const expectedResult = {
        id: 'notification1',
        title: 'Test Title',
        body: 'Test Body',
        payload: {},
        type: 'EMAIL',
        sender: { id: userId },
        recipients: [{ user: { id: 'user2' } }],
      } as unknown as NotificationCreateResponseDto;

      jest
        .spyOn(prismaService.notification, 'create')
        .mockResolvedValue(expectedResult);

      const result = await service.createNotification(userId, data);
      expect(result).toEqual(expectedResult);
      expect(prismaService.notification.create).toHaveBeenCalledWith({
        data: {
          title: data.title.trim(),
          body: data.body.trim(),
          payload: data.payload,
          type: data.type,
          sender: {
            connect: {
              id: userId,
            },
          },
          recipients: {
            create: data.recipients.map((recipientId) => ({
              user: {
                connect: {
                  id: recipientId,
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
    });
  });

  describe('getNotifications', () => {
    it('should return a list of notifications', async () => {
      const params = {
        limit: 10,
        page: 1,
        search: 'Test',
      } as unknown as NotificationGetDto;
      const expectedResult = {
        count: 1,
        data: [
          {
            id: 'notification1',
            title: 'Test Title',
            body: 'Test Body',
            payload: {},
            type: 'INFO',
            sender: { id: 'user1' },
            recipients: [{ user: { id: 'user2' } }],
          },
        ],
      } as unknown as NotificationGetResponseDto;

      jest.spyOn(prismaService.notification, 'count').mockResolvedValue(1);
      jest
        .spyOn(prismaService.notification, 'findMany')
        .mockResolvedValue(expectedResult.data);

      const result = await service.getNotifications(params);
      expect(result).toEqual(expectedResult);
      expect(prismaService.notification.count).toHaveBeenCalledWith({
        where: {
          title: { contains: params.search, mode: 'insensitive' },
          body: { contains: params.search, mode: 'insensitive' },
        },
      });
      expect(prismaService.notification.findMany).toHaveBeenCalledWith({
        where: {
          title: { contains: params.search, mode: 'insensitive' },
          body: { contains: params.search, mode: 'insensitive' },
        },
        take: params.limit,
        skip: 0,
        include: {
          sender: true,
          recipients: {
            include: {
              user: true,
            },
          },
        },
      });
    });

    it('should throw an HttpException when an error occurs', async () => {
      const params: NotificationGetDto = {
        limit: 10,
        page: 1,
        search: 'Test',
      };

      jest
        .spyOn(prismaService.notification, 'count')
        .mockRejectedValue(new Error('Test Error'));

      await expect(service.getNotifications(params)).rejects.toThrow(
        expect.any(Error),
      );
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const notificationId = 'notification1';
      const checkResult = { id: notificationId } as unknown as Notification;
      const expectedResult: GenericResponseDto = {
        status: true,
        message: 'notifications.notificationDeleted',
      };

      jest
        .spyOn(prismaService.notification, 'findUnique')
        .mockResolvedValue(checkResult);
      jest
        .spyOn(prismaService.notification, 'update')
        .mockResolvedValue(undefined);

      const result = await service.deleteNotification(notificationId);
      expect(result).toEqual(expectedResult);
      expect(prismaService.notification.findUnique).toHaveBeenCalledWith({
        where: { id: notificationId },
      });
      expect(prismaService.notification.update).toHaveBeenCalledWith({
        where: { id: notificationId },
        data: {
          deleted_at: new Date(),
          is_deleted: true,
        },
      });
    });

    it('should throw an exception if notification not found', async () => {
      const notificationId = 'notification1';

      jest
        .spyOn(prismaService.notification, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.deleteNotification(notificationId)).rejects.toThrow(
        new HttpException(
          'notifications.notificationNotFound',
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(prismaService.notification.findUnique).toHaveBeenCalledWith({
        where: { id: notificationId },
      });
    });
  });
});
