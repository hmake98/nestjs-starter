import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

describe('AwsS3Service', () => {
    let service: AwsS3Service;
    let _configService: ConfigService;
    let loggerMock: jest.Mocked<PinoLogger>;
    let mockS3Client: jest.Mocked<S3Client>;

    const mockConfig = {
        'aws.s3.region': 'us-east-1',
        'aws.accessKey': 'test-access-key',
        'aws.secretKey': 'test-secret-key',
        'aws.s3.bucket': 'test-bucket',
        'aws.s3.linkExpire': 3600,
    };

    beforeEach(async () => {
        loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            trace: jest.fn(),
            fatal: jest.fn(),
            setContext: jest.fn(),
        } as unknown as jest.Mocked<PinoLogger>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AwsS3Service,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string, defaultValue?: any) => {
                            return mockConfig[key] ?? defaultValue;
                        }),
                    },
                },
                {
                    provide: PinoLogger,
                    useValue: loggerMock,
                },
            ],
        }).compile();

        service = module.get<AwsS3Service>(AwsS3Service);
        _configService = module.get<ConfigService>(ConfigService);
        mockS3Client = service['s3Client'] as jest.Mocked<S3Client>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should initialize S3 client with correct configuration', () => {
        expect(S3Client).toHaveBeenCalledWith({
            credentials: {
                accessKeyId: 'test-access-key',
                secretAccessKey: 'test-secret-key',
            },
            region: 'us-east-1',
        });

        expect(loggerMock.info).toHaveBeenCalledWith(
            { region: 'us-east-1', bucket: 'test-bucket' },
            'S3 service initialized'
        );
    });

    describe('getPresignedUploadUrl', () => {
        const mockPresignedUrl =
            'https://test-bucket.s3.amazonaws.com/presigned-url';

        beforeEach(() => {
            (getSignedUrl as jest.Mock).mockResolvedValue(mockPresignedUrl);
        });

        it('should generate presigned upload URL successfully', async () => {
            const key = 'user123/profile/test.jpg';
            const contentType = 'image/jpeg';

            const result = await service.getPresignedUploadUrl(
                key,
                contentType
            );

            expect(result).toEqual({
                url: mockPresignedUrl,
                expiresIn: 3600,
            });

            expect(PutObjectCommand).toHaveBeenCalledWith({
                Bucket: 'test-bucket',
                Key: key,
                ContentType: contentType,
            });

            expect(getSignedUrl).toHaveBeenCalledWith(
                expect.any(S3Client),
                expect.any(PutObjectCommand),
                { expiresIn: 3600 }
            );

            expect(loggerMock.debug).toHaveBeenCalledWith(
                { key, contentType, expiresIn: 3600 },
                'Generated presigned upload URL'
            );
        });

        it('should use custom expiration time when provided', async () => {
            const key = 'user123/profile/test.jpg';
            const contentType = 'image/jpeg';
            const customExpiry = 7200;

            const result = await service.getPresignedUploadUrl(
                key,
                contentType,
                customExpiry
            );

            expect(result).toEqual({
                url: mockPresignedUrl,
                expiresIn: customExpiry,
            });

            expect(getSignedUrl).toHaveBeenCalledWith(
                expect.any(S3Client),
                expect.any(PutObjectCommand),
                { expiresIn: customExpiry }
            );

            expect(loggerMock.debug).toHaveBeenCalledWith(
                { key, contentType, expiresIn: customExpiry },
                'Generated presigned upload URL'
            );
        });

        it('should handle different content types', async () => {
            const testCases = [
                { key: 'test.pdf', contentType: 'application/pdf' },
                { key: 'test.png', contentType: 'image/png' },
                { key: 'test.mp4', contentType: 'video/mp4' },
                { key: 'test.txt', contentType: 'text/plain' },
            ];

            for (const { key, contentType } of testCases) {
                await service.getPresignedUploadUrl(key, contentType);

                expect(PutObjectCommand).toHaveBeenCalledWith({
                    Bucket: 'test-bucket',
                    Key: key,
                    ContentType: contentType,
                });
            }
        });

        it('should throw and log error on failure', async () => {
            const mockError = new Error('S3 service error');
            (getSignedUrl as jest.Mock).mockRejectedValue(mockError);

            await expect(
                service.getPresignedUploadUrl('test.jpg', 'image/jpeg')
            ).rejects.toThrow(mockError);

            expect(loggerMock.error).toHaveBeenCalledWith(
                'Failed to generate presigned URL: S3 service error'
            );
        });
    });

    describe('uploadObject', () => {
        beforeEach(() => {
            mockS3Client.send = jest.fn().mockResolvedValue({});
        });

        it('should upload object successfully with Buffer', async () => {
            const key = 'user123/documents/test.pdf';
            const body = Buffer.from('test content');
            const contentType = 'application/pdf';

            await service.uploadObject(key, body, contentType);

            expect(PutObjectCommand).toHaveBeenCalledWith({
                Bucket: 'test-bucket',
                Key: key,
                Body: body,
                ContentType: contentType,
            });

            expect(mockS3Client.send).toHaveBeenCalledWith(
                expect.any(PutObjectCommand)
            );

            expect(loggerMock.info).toHaveBeenCalledWith(
                { key, contentType },
                'Object uploaded to S3'
            );
        });

        it('should upload object successfully with string', async () => {
            const key = 'user123/text/test.txt';
            const body = 'Hello, World!';
            const contentType = 'text/plain';

            await service.uploadObject(key, body, contentType);

            expect(PutObjectCommand).toHaveBeenCalledWith({
                Bucket: 'test-bucket',
                Key: key,
                Body: body,
                ContentType: contentType,
            });

            expect(mockS3Client.send).toHaveBeenCalled();
        });

        it('should handle different file types', async () => {
            const testCases = [
                {
                    key: 'image.jpg',
                    body: Buffer.from('image data'),
                    contentType: 'image/jpeg',
                },
                {
                    key: 'video.mp4',
                    body: Buffer.from('video data'),
                    contentType: 'video/mp4',
                },
                {
                    key: 'doc.json',
                    body: '{"test": "data"}',
                    contentType: 'application/json',
                },
            ];

            for (const { key, body, contentType } of testCases) {
                await service.uploadObject(key, body, contentType);

                expect(PutObjectCommand).toHaveBeenCalledWith({
                    Bucket: 'test-bucket',
                    Key: key,
                    Body: body,
                    ContentType: contentType,
                });
            }
        });

        it('should throw and log error on upload failure', async () => {
            const mockError = new Error('Upload failed');
            mockS3Client.send = jest.fn().mockRejectedValue(mockError);

            const key = 'test.jpg';
            const body = Buffer.from('test');
            const contentType = 'image/jpeg';

            await expect(
                service.uploadObject(key, body, contentType)
            ).rejects.toThrow(mockError);

            expect(loggerMock.error).toHaveBeenCalledWith(
                'Failed to upload object to S3: Upload failed'
            );
        });
    });

    describe('getPublicUrl', () => {
        it('should generate correct public URL', () => {
            const key = 'user123/profile/avatar.jpg';

            const url = service.getPublicUrl(key);

            expect(url).toBe(
                'https://test-bucket.s3.us-east-1.amazonaws.com/user123/profile/avatar.jpg'
            );
        });

        it('should handle keys with special characters', () => {
            const key = 'user-123/files/my file (1).pdf';

            const url = service.getPublicUrl(key);

            expect(url).toBe(
                'https://test-bucket.s3.us-east-1.amazonaws.com/user-123/files/my file (1).pdf'
            );
        });

        it('should handle nested folder structures', () => {
            const key = 'org/dept/team/user/file.txt';

            const url = service.getPublicUrl(key);

            expect(url).toBe(
                'https://test-bucket.s3.us-east-1.amazonaws.com/org/dept/team/user/file.txt'
            );
        });

        it('should handle root level files', () => {
            const key = 'file.txt';

            const url = service.getPublicUrl(key);

            expect(url).toBe(
                'https://test-bucket.s3.us-east-1.amazonaws.com/file.txt'
            );
        });
    });
});
