import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService } from './files.service';
import { PrismaService } from 'src/common/helper/services/prisma.service';
import { GetPresignDto } from '../dtos/get.presign.dto';
import { FileModuleType } from '../interfaces/files.interface';

describe('FilesService', () => {
  let filesService: FilesService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService, PrismaService, ConfigService],
    }).compile();

    filesService = module.get<FilesService>(FilesService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPresignGetObject', () => {
    it('should throw NotFoundException when file is not found', async () => {
      jest.spyOn(prismaService.files, 'findUnique').mockResolvedValue(null);

      await expect(
        filesService.getPresignGetObject('fileId', 'userId'),
      ).rejects.toThrowError(NotFoundException);
    });

    // Add more test cases for getPresignGetObject as needed
  });

  describe('getPresginPutObject', () => {
    it('should create a presigned URL and save the file', async () => {
      // Arrange
      const userId = 'userId';
      const file: GetPresignDto = {
        type: FileModuleType.user_profile,
        name: 'example.jpg',
      };

      const createdFile = {
        id: 'fileId',
        file_name: file.name,
        link: 'userId/image/123_example.jpg',
        users: { connect: { id: userId } },
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        is_deleted: false,
        post_id: null,
      };

      // Mock the dependencies
      jest.spyOn(prismaService.files, 'create').mockResolvedValue(createdFile);
      jest.mock('@aws-sdk/s3-request-presigner', () => ({
        getSignedUrl: jest.fn().mockResolvedValue('presigned-url'),
      }));

      // Act
      const result = await filesService.getPresginPutObject(file, userId);

      // Assert
      expect(result.url).toBe('presigned-url');
      expect(result.file).toEqual(createdFile);

      // Verify that the create method was called with the correct parameters
      expect(prismaService.files.create).toHaveBeenCalledWith({
        data: {
          file_name: file.name,
          link: expect.stringContaining(userId),
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });
    });
  });
});
