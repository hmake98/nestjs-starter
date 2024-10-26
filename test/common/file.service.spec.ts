import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { FilePresignDto } from 'src/common/file/dtos/file.presign.dto';
import { ENUM_FILE_STORE } from 'src/common/file/enums/files.enum';
import { FileService } from 'src/common/file/services/files.service';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

describe('FileService', () => {
    let service: FileService;
    let configService: ConfigService;
    let s3Client: jest.Mocked<S3Client>;

    const mockConfig = {
        'aws.accessKey': 'testAccessKey',
        'aws.secretKey': 'testSecretKey',
        'aws.region': 'us-west-2',
        'aws.s3.linkExpire': 3600,
        'aws.s3.bucket': 'testBucket',
    };

    beforeEach(async () => {
        jest.useFakeTimers();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => mockConfig[key]),
                    },
                },
            ],
        }).compile();

        service = module.get<FileService>(FileService);
        configService = module.get<ConfigService>(ConfigService);
        s3Client = service['s3Client'] as jest.Mocked<S3Client>;
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should initialize S3 client with correct config', () => {
            expect(S3Client).toHaveBeenCalledWith({
                credentials: {
                    accessKeyId: mockConfig['aws.accessKey'],
                    secretAccessKey: mockConfig['aws.secretKey'],
                },
                region: mockConfig['aws.region'],
            });
        });
    });

    describe('getPresignUrlPutObject', () => {
        const mockPresignDto: FilePresignDto = {
            fileName: 'test.jpg',
            storeType: ENUM_FILE_STORE.USER_PROFILES,
            contentType: 'image/jpeg',
        };
        const mockUserId = 'user123';
        const mockUrl = 'https://testbucket.s3.amazonaws.com/presigned-url';

        beforeEach(() => {
            (getSignedUrl as jest.Mock).mockReset().mockResolvedValue(mockUrl);
        });

        it('should generate a pre-signed URL successfully', async () => {
            const result = await service.getPresignUrlPutObject(
                mockUserId,
                mockPresignDto
            );

            expect(result).toEqual({
                url: mockUrl,
                expiresIn: mockConfig['aws.s3.linkExpire'],
            });

            expect(PutObjectCommand).toHaveBeenCalledWith({
                Bucket: mockConfig['aws.s3.bucket'],
                Key: expect.stringMatching(
                    new RegExp(
                        `^${mockUserId}/${mockPresignDto.storeType}/\\d+_${mockPresignDto.fileName}$`
                    )
                ),
                ContentType: mockPresignDto.contentType,
            });

            expect(getSignedUrl).toHaveBeenCalledWith(
                expect.any(S3Client),
                expect.any(PutObjectCommand),
                { expiresIn: mockConfig['aws.s3.linkExpire'] }
            );
        });

        it('should throw an error if generating pre-signed URL fails', async () => {
            const mockError = new Error('Failed to generate URL');
            (getSignedUrl as jest.Mock).mockRejectedValue(mockError);

            await expect(
                service.getPresignUrlPutObject(mockUserId, mockPresignDto)
            ).rejects.toThrow(mockError);
        });

        it('should generate unique keys for different requests', async () => {
            const firstCall = service.getPresignUrlPutObject(
                mockUserId,
                mockPresignDto
            );

            jest.advanceTimersByTime(1000);

            const secondCall = service.getPresignUrlPutObject(
                mockUserId,
                mockPresignDto
            );

            await Promise.all([firstCall, secondCall]);

            const [[firstCallArgs], [secondCallArgs]] = (
                PutObjectCommand as unknown as jest.Mock
            ).mock.calls;

            expect(firstCallArgs.Key).not.toEqual(secondCallArgs.Key);
            expect(firstCallArgs.Key).toMatch(
                new RegExp(
                    `^${mockUserId}/${mockPresignDto.storeType}/\\d+_${mockPresignDto.fileName}$`
                )
            );
            expect(secondCallArgs.Key).toMatch(
                new RegExp(
                    `^${mockUserId}/${mockPresignDto.storeType}/\\d+_${mockPresignDto.fileName}$`
                )
            );
        });
    });
});
