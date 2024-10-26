import * as crypto from 'node:crypto';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';

import { HelperEncryptionService } from 'src/common/helper/services/helper.encryption.service';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';

jest.mock('argon2');
jest.mock('node:crypto');

describe('HelperEncryptionService', () => {
    let service: HelperEncryptionService;
    let configServiceMock: jest.Mocked<ConfigService>;
    let jwtServiceMock: jest.Mocked<JwtService>;

    beforeEach(async () => {
        configServiceMock = {
            getOrThrow: jest.fn().mockImplementation((key: string) => {
                const config = {
                    'auth.accessToken.secret': 'accessTokenSecret',
                    'auth.refreshToken.secret': 'refreshTokenSecret',
                    'auth.accessToken.tokenExp': '1h',
                    'auth.refreshToken.tokenExp': '7d',
                };
                return config[key];
            }),
        } as any;

        jwtServiceMock = {
            signAsync: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HelperEncryptionService,
                { provide: ConfigService, useValue: configServiceMock },
                { provide: JwtService, useValue: jwtServiceMock },
            ],
        }).compile();

        service = module.get<HelperEncryptionService>(HelperEncryptionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createJwtTokens', () => {
        it('should create access and refresh tokens', async () => {
            const mockPayload: IAuthUser = { userId: '123', role: 'DEVELOPER' };
            jwtServiceMock.signAsync
                .mockResolvedValueOnce('mockAccessToken')
                .mockResolvedValueOnce('mockRefreshToken');

            const result = await service.createJwtTokens(mockPayload);

            expect(result).toEqual({
                accessToken: 'mockAccessToken',
                refreshToken: 'mockRefreshToken',
            });
            expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(2);
        });
    });

    describe('createAccessToken', () => {
        it('should create an access token', async () => {
            const mockPayload: IAuthUser = { userId: '123', role: 'DEVELOPER' };
            jwtServiceMock.signAsync.mockResolvedValue('mockAccessToken');

            const result = await service.createAccessToken(mockPayload);

            expect(result).toBe('mockAccessToken');
            expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(mockPayload, {
                secret: 'accessTokenSecret',
                expiresIn: '1h',
            });
        });
    });

    describe('createRefreshToken', () => {
        it('should create a refresh token', async () => {
            const mockPayload: IAuthUser = { userId: '123', role: 'DEVELOPER' };
            jwtServiceMock.signAsync.mockResolvedValue('mockRefreshToken');

            const result = await service.createRefreshToken(mockPayload);

            expect(result).toBe('mockRefreshToken');
            expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(mockPayload, {
                secret: 'refreshTokenSecret',
                expiresIn: '7d',
            });
        });
    });

    describe('createHash', () => {
        it('should create a hash', async () => {
            const password = 'password123';
            (argon2.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const result = await service.createHash(password);

            expect(result).toBe('hashedPassword');
            expect(argon2.hash).toHaveBeenCalledWith(password);
        });
    });

    describe('match', () => {
        it('should return true for matching password', async () => {
            const hash = 'hashedPassword';
            const password = 'password123';
            (argon2.verify as jest.Mock).mockResolvedValue(true);

            const result = await service.match(hash, password);

            expect(result).toBe(true);
            expect(argon2.verify).toHaveBeenCalledWith(hash, password);
        });

        it('should return false for non-matching password', async () => {
            const hash = 'hashedPassword';
            const password = 'wrongPassword';
            (argon2.verify as jest.Mock).mockResolvedValue(false);

            const result = await service.match(hash, password);

            expect(result).toBe(false);
        });
    });

    describe('encrypt and decrypt', () => {
        it('should encrypt and decrypt data successfully', async () => {
            const text = 'sensitive data';

            (crypto.randomBytes as jest.Mock).mockReturnValue(
                Buffer.from('mockRandomBytes')
            );
            (crypto.scrypt as jest.Mock).mockImplementation(
                (secret, salt, keylen, callback) => {
                    callback(null, Buffer.from('mockDerivedKey'));
                }
            );
            const mockCipher = {
                update: jest
                    .fn()
                    .mockReturnValue(Buffer.from('mockEncryptedData')),
                final: jest.fn().mockReturnValue(Buffer.from('')),
                getAuthTag: jest.fn().mockReturnValue(Buffer.from('mockTag')),
            };
            (crypto.createCipheriv as jest.Mock).mockReturnValue(mockCipher);

            const mockDecipher = {
                update: jest.fn().mockReturnValue(Buffer.from(text)),
                final: jest.fn().mockReturnValue(Buffer.from('')),
                setAuthTag: jest.fn(),
            };
            (crypto.createDecipheriv as jest.Mock).mockReturnValue(
                mockDecipher
            );

            const encrypted = await service.encrypt(text);
            const decrypted = await service.decrypt(encrypted);

            expect(encrypted).toEqual(
                expect.objectContaining({
                    iv: expect.any(String),
                    data: expect.any(String),
                    tag: expect.any(String),
                    salt: expect.any(String),
                })
            );
            expect(decrypted).toBe(text);
        });

        it('should throw an error if decryption fails', async () => {
            const mockEncrypted = {
                iv: 'mockIv',
                data: 'mockEncryptedData',
                tag: 'mockTag',
                salt: 'mockSalt',
            };

            (crypto.scrypt as jest.Mock).mockImplementation(
                (secret, salt, keylen, callback) => {
                    callback(null, Buffer.from('mockDerivedKey'));
                }
            );

            (crypto.createDecipheriv as jest.Mock).mockImplementation(() => {
                throw new Error('Decryption failed');
            });

            await expect(service.decrypt(mockEncrypted)).rejects.toThrow(
                'Decryption failed'
            );
        });
    });
});
