import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { FilePresignDto } from 'src/common/file/dtos/request/file.presign.dto';
import { ENUM_FILE_STORE } from 'src/common/file/enums/files.enum';
import { FileService } from 'src/common/file/services/files.service';

describe('FileService', () => {
    let service: FileService;
    let awsS3Service: jest.Mocked<AwsS3Service>;
    let loggerMock: jest.Mocked<PinoLogger>;

    beforeEach(async () => {
        jest.useFakeTimers();

        const mockAwsS3Service = {
            getPresignedUploadUrl: jest.fn().mockResolvedValue({
                url: 'https://test-bucket.s3.amazonaws.com/test-key',
                expiresIn: 3600,
            }),
        };

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
                FileService,
                {
                    provide: AwsS3Service,
                    useValue: mockAwsS3Service,
                },
                {
                    provide: PinoLogger,
                    useValue: loggerMock,
                },
            ],
        }).compile();

        service = module.get<FileService>(FileService);
        awsS3Service = module.get<AwsS3Service>(
            AwsS3Service
        ) as jest.Mocked<AwsS3Service>;
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    describe('getPresignUrlPutObject', () => {
        const mockPresignDto: FilePresignDto = {
            fileName: 'test.jpg',
            storeType: ENUM_FILE_STORE.USER_PROFILES,
            contentType: 'image/jpeg',
        };
        const mockUserId = 'user123';
        const mockUrl = 'https://testbucket.s3.amazonaws.com/presigned-url';

        it('should generate a pre-signed URL successfully', async () => {
            awsS3Service.getPresignedUploadUrl.mockResolvedValue({
                url: mockUrl,
                expiresIn: 3600,
            });

            const result = await service.getPresignUrlPutObject(
                mockUserId,
                mockPresignDto
            );

            expect(result).toEqual({
                url: mockUrl,
                expiresIn: 3600,
            });

            expect(awsS3Service.getPresignedUploadUrl).toHaveBeenCalledWith(
                expect.stringMatching(
                    new RegExp(
                        `^${mockUserId}/${mockPresignDto.storeType}/\\d+_${mockPresignDto.fileName}$`
                    )
                ),
                mockPresignDto.contentType
            );
        });

        it('should throw an error if generating pre-signed URL fails', async () => {
            const mockError = new Error('Failed to generate URL');
            awsS3Service.getPresignedUploadUrl.mockRejectedValue(mockError);

            await expect(
                service.getPresignUrlPutObject(mockUserId, mockPresignDto)
            ).rejects.toThrow(mockError);
        });

        it('should use correct content type', async () => {
            awsS3Service.getPresignedUploadUrl.mockResolvedValue({
                url: mockUrl,
                expiresIn: 3600,
            });

            await service.getPresignUrlPutObject(mockUserId, mockPresignDto);

            expect(awsS3Service.getPresignedUploadUrl).toHaveBeenCalledWith(
                expect.any(String),
                'image/jpeg'
            );
        });
    });
});
