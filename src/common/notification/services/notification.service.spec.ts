import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/common/helper/services/prisma.service';
import { NotificationCreateDto } from '../dtos/create.notification.dto';
import { NotificationGetDto } from '../dtos/get.notification.dto';
import { NotificationDto } from '../dtos/notification.response.dto';
import { Notification } from '@prisma/client';

describe('NotificationService', () => {
  let notificationService: NotificationService;

  const prismaServiceMock = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(notificationService).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const userId = 'user-id';
      const notificationCreateDto: NotificationCreateDto = {
        title: 'Test Title',
        body: 'Test Body',
        payload: {},
        recipients: ['recipient-id-1', 'recipient-id-2'],
        type: 'EMAIL',
      };
      const createdNotification = {
        id: 'notification-id',
        title: 'Test Title',
        body: 'Test Body',
        payload: {},
        type: 'EMAIL',
        sender: {
          id: userId,
          email: 'user@example.com',
          first_name: 'John',
          last_name: 'Doe',
        },
        recipients: [],
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      } as NotificationDto;

      prismaServiceMock.notification.create.mockResolvedValue(
        createdNotification,
      );

      const result = await notificationService.createNotification(
        userId,
        notificationCreateDto,
      );
      expect(result).toEqual(createdNotification);
      expect(prismaServiceMock.notification.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });
  });

  describe('getNotifications', () => {
    it('should get notifications', async () => {
      const notificationGetDto: NotificationGetDto = {
        limit: 10,
        page: 1,
        search: 'test',
      };
      const notifications = [
        {
          id: 'notification-id-1',
          title: 'Test Title 1',
          body: 'Test Body 1',
          payload: {},
          type: 'EMAIL',
          sender: {
            id: 'user-id-1',
            email: 'user1@example.com',
            first_name: 'John',
            last_name: 'Doe',
          },
          recipients: [],
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          id: 'notification-id-2',
          title: 'Test Title 2',
          body: 'Test Body 2',
          payload: {},
          type: 'TEXT',
          sender: {
            id: 'user-id-2',
            email: 'user2@example.com',
            first_name: 'Jane',
            last_name: 'Doe',
          },
          recipients: [],
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ] as NotificationDto[];

      prismaServiceMock.notification.count.mockResolvedValue(2);
      prismaServiceMock.notification.findMany.mockResolvedValue(notifications);

      const result =
        await notificationService.getNotifications(notificationGetDto);
      expect(result.count).toBe(2);
      expect(result.data).toEqual(notifications);
      expect(prismaServiceMock.notification.count).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(prismaServiceMock.notification.findMany).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const notificationId = 'notification-id';
      const deletedNotification: Notification = {
        id: notificationId,
        title: 'Test Title',
        body: 'Test Body',
        payload: {},
        type: 'EMAIL',
        sender_id: 'user-id',
        is_deleted: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
      };

      prismaServiceMock.notification.update.mockResolvedValue(
        deletedNotification,
      );

      const result =
        await notificationService.deleteNotification(notificationId);
      expect(result).toEqual(deletedNotification);
      expect(prismaServiceMock.notification.update).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });
  });
});