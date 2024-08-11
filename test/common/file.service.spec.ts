import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { ENUM_FILE_STORE } from 'src/app/app.constant';
import { GetPresignDto } from 'src/common/files/dtos/get.presign.dto';
import { FilesService } from 'src/common/files/services/files.service';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

describe('FilesService', () => {
  let service: FilesService;
  let configServiceMock: jest.Mocked<ConfigService>;
  let s3ClientMock: jest.Mocked<S3Client>;

  beforeEach(async () => {
    jest.useFakeTimers();

    configServiceMock = {
      get: jest.fn((key: string) => {
        const config = {
          'aws.accessKey': 'testAccessKey',
          'aws.secretKey': 'testSecretKey',
          'aws.region': 'us-west-2',
          'aws.s3.linkExpire': 3600,
          'aws.s3.bucket': 'testBucket',
        };
        return config[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService, { provide: ConfigService, useValue: configServiceMock }],
    }).compile();

    service = module.get<FilesService>(FilesService);
    s3ClientMock = service['s3Client'] as unknown as jest.Mocked<S3Client>;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPresignUrlPutObject', () => {
    const mockGetPresignDto: GetPresignDto = {
      fileName: 'test.jpg',
      storeType: ENUM_FILE_STORE.USER_PROFILES,
      contentType: 'image/jpeg',
    };
    const mockUserId = 'user123';

    it('should generate a pre-signed URL successfully', async () => {
      const mockUrl = 'https://testbucket.s3.amazonaws.com/presigned-url';
      (getSignedUrl as jest.Mock).mockResolvedValue(mockUrl);

      const result = await service.getPresignUrlPutObject(mockGetPresignDto, mockUserId);

      expect(result).toEqual({
        url: mockUrl,
        expiresIn: 3600,
      });
      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: 'testBucket',
        Key: expect.stringContaining(`${mockUserId}/${mockGetPresignDto.storeType}/`),
        ContentType: mockGetPresignDto.contentType,
      });
      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(PutObjectCommand),
        { expiresIn: 3600 },
      );
    });

    it('should throw an error if generating pre-signed URL fails', async () => {
      const mockError = new Error('Failed to generate URL');
      (getSignedUrl as jest.Mock).mockRejectedValue(mockError);

      await expect(service.getPresignUrlPutObject(mockGetPresignDto, mockUserId)).rejects.toThrow(
        'Failed to generate URL',
      );
    });

    it('should generate a unique key for each file', async () => {
      (getSignedUrl as jest.Mock).mockResolvedValue('mockUrl');

      await service.getPresignUrlPutObject(mockGetPresignDto, mockUserId);
      const firstKey = (PutObjectCommand as unknown as jest.Mock).mock.calls[0][0].Key;

      jest.advanceTimersByTime(1000);

      await service.getPresignUrlPutObject(mockGetPresignDto, mockUserId);
      const secondKey = (PutObjectCommand as unknown as jest.Mock).mock.calls[1][0].Key;

      expect(firstKey).not.toEqual(secondKey);
    });
  });
});
