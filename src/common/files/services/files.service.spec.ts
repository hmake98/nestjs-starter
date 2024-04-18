import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../../helper/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileModuleType } from '../constants/files.enum';

jest.mock('@aws-sdk/s3-request-presigner');
jest.mock('@aws-sdk/client-s3');

describe('FilesService', () => {
  let filesService: FilesService;

  const getSignedUrlMock: jest.Mock = getSignedUrl as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: PrismaService,
          useValue: {
            files: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'aws.accessKey':
                  return 'test-access-key';
                case 'aws.secretKey':
                  return 'test-secret-access-key';
                case 'aws.region':
                  return 'us-west-2';
                case 'aws.s3.bucket':
                  return 'test-bucket';
                case 'aws.s3.linkExpire':
                  return 3600;
              }
            }),
          },
        },
      ],
    }).compile();

    filesService = module.get<FilesService>(FilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filesService).toBeDefined();
  });

  it('should generate a presigned URL successfully', async () => {
    const getPresignDto = {
      storeType: FileModuleType.UserProfile,
      name: 'testfile.txt',
    };
    const userId = '123';
    const expectedUrl = 'http://example.com/presigned-url';

    getSignedUrlMock.mockResolvedValue(expectedUrl);

    const result = await filesService.getPresginPutObject(
      getPresignDto,
      userId,
    );
    expect(result).toEqual({ url: expectedUrl, expiresIn: 3600 });
  });

  it('should handle errors when generating a presigned PUT URL', async () => {
    const getPresignDto = {
      storeType: FileModuleType.UserProfile,
      name: 'testfile.txt',
    };
    const userId = '123';

    getSignedUrlMock.mockRejectedValue(
      new Error('Failed to create presigned URL'),
    );

    await expect(
      filesService.getPresginPutObject(getPresignDto, userId),
    ).rejects.toThrow('Failed to create presigned URL');
  });
});
