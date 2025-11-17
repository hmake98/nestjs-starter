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
    let module: TestingModule;

    const mockConfig = {
        'auth.accessToken.secret': 'accessTokenSecret',
        'auth.refreshToken.secret': 'refreshTokenSecret',
        'auth.accessToken.tokenExp': '1h',
        'auth.refreshToken.tokenExp': '7d',
    };

    beforeEach(async () => {
        configServiceMock = {
            getOrThrow: jest.fn().mockImplementation((key: string) => {
                return mockConfig[key];
            }),
        } as any;

        jwtServiceMock = {
            signAsync: jest.fn(),
        } as any;

        module = await Test.createTestingModule({
            providers: [
                HelperEncryptionService,
                { provide: ConfigService, useValue: configServiceMock },
                { provide: JwtService, useValue: jwtServiceMock },
            ],
        }).compile();

        service = module.get<HelperEncryptionService>(HelperEncryptionService);
    });

    afterEach(async () => {
        jest.clearAllMocks();
        if (module) {
            await module.close();
        }
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('constructor', () => {
        it('should load configuration values correctly', () => {
            expect(configServiceMock.getOrThrow).toHaveBeenCalledWith(
                'auth.accessToken.secret'
            );
            expect(configServiceMock.getOrThrow).toHaveBeenCalledWith(
                'auth.refreshToken.secret'
            );
            expect(configServiceMock.getOrThrow).toHaveBeenCalledWith(
                'auth.accessToken.tokenExp'
            );
            expect(configServiceMock.getOrThrow).toHaveBeenCalledWith(
                'auth.refreshToken.tokenExp'
            );
            expect(configServiceMock.getOrThrow).toHaveBeenCalledTimes(4);
        });

        it('should throw error if required config is missing', async () => {
            const badConfigService = {
                getOrThrow: jest.fn().mockImplementation((key: string) => {
                    if (key === 'auth.accessToken.secret') {
                        throw new Error(`Config key ${key} not found`);
                    }
                    return mockConfig[key];
                }),
            } as any;

            await expect(async () => {
                await Test.createTestingModule({
                    providers: [
                        HelperEncryptionService,
                        { provide: ConfigService, useValue: badConfigService },
                        { provide: JwtService, useValue: jwtServiceMock },
                    ],
                }).compile();
            }).rejects.toThrow('Config key auth.accessToken.secret not found');
        });
    });

    describe('createJwtTokens', () => {
        const mockPayload: IAuthUser = { userId: '123', role: 'USER' };

        it('should create access and refresh tokens', async () => {
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

        it('should handle access token creation failure', async () => {
            const error = new Error('Access token creation failed');
            jwtServiceMock.signAsync.mockRejectedValueOnce(error);

            await expect(service.createJwtTokens(mockPayload)).rejects.toThrow(
                'Access token creation failed'
            );
        });

        it('should handle refresh token creation failure', async () => {
            const error = new Error('Refresh token creation failed');
            jwtServiceMock.signAsync
                .mockResolvedValueOnce('mockAccessToken')
                .mockRejectedValueOnce(error);

            await expect(service.createJwtTokens(mockPayload)).rejects.toThrow(
                'Refresh token creation failed'
            );
        });

        it('should handle different user roles', async () => {
            const adminPayload: IAuthUser = { userId: '456', role: 'ADMIN' };
            jwtServiceMock.signAsync
                .mockResolvedValueOnce('adminAccessToken')
                .mockResolvedValueOnce('adminRefreshToken');

            const result = await service.createJwtTokens(adminPayload);

            expect(result).toEqual({
                accessToken: 'adminAccessToken',
                refreshToken: 'adminRefreshToken',
            });
        });
    });

    describe('createAccessToken', () => {
        it('should create an access token', async () => {
            const mockPayload: IAuthUser = { userId: '123', role: 'USER' };
            jwtServiceMock.signAsync.mockResolvedValue('mockAccessToken');

            const result = await service.createAccessToken(mockPayload);

            expect(result).toBe('mockAccessToken');
            expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(mockPayload, {
                secret: 'accessTokenSecret',
                expiresIn: '1h',
            });
        });

        it('should handle JWT signing errors', async () => {
            const mockPayload: IAuthUser = { userId: '123', role: 'USER' };
            const error = new Error('JWT signing failed');
            jwtServiceMock.signAsync.mockRejectedValue(error);

            await expect(
                service.createAccessToken(mockPayload)
            ).rejects.toThrow('JWT signing failed');
        });

        it('should work with different payload types', async () => {
            const developerPayload: IAuthUser = {
                userId: 'dev-456',
                role: 'DEVELOPER',
            };
            jwtServiceMock.signAsync.mockResolvedValue('devAccessToken');

            const result = await service.createAccessToken(developerPayload);

            expect(result).toBe('devAccessToken');
            expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
                developerPayload,
                {
                    secret: 'accessTokenSecret',
                    expiresIn: '1h',
                }
            );
        });
    });

    describe('createRefreshToken', () => {
        it('should create a refresh token', async () => {
            const mockPayload: IAuthUser = { userId: '123', role: 'USER' };
            jwtServiceMock.signAsync.mockResolvedValue('mockRefreshToken');

            const result = await service.createRefreshToken(mockPayload);

            expect(result).toBe('mockRefreshToken');
            expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(mockPayload, {
                secret: 'refreshTokenSecret',
                expiresIn: '7d',
            });
        });

        it('should handle JWT signing errors', async () => {
            const mockPayload: IAuthUser = { userId: '123', role: 'USER' };
            const error = new Error('Refresh token signing failed');
            jwtServiceMock.signAsync.mockRejectedValue(error);

            await expect(
                service.createRefreshToken(mockPayload)
            ).rejects.toThrow('Refresh token signing failed');
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

        it('should handle argon2 hashing errors', async () => {
            const password = 'password123';
            const error = new Error('Hashing failed');
            (argon2.hash as jest.Mock).mockRejectedValue(error);

            await expect(service.createHash(password)).rejects.toThrow(
                'Hashing failed'
            );
        });

        it('should handle empty password', async () => {
            const password = '';
            (argon2.hash as jest.Mock).mockResolvedValue('emptyPasswordHash');

            const result = await service.createHash(password);

            expect(result).toBe('emptyPasswordHash');
            expect(argon2.hash).toHaveBeenCalledWith(password);
        });

        it('should handle special characters in password', async () => {
            const password = 'p@ssw0rd!@#$%^&*()';
            (argon2.hash as jest.Mock).mockResolvedValue('specialCharHash');

            const result = await service.createHash(password);

            expect(result).toBe('specialCharHash');
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

        it('should handle argon2 verification errors', async () => {
            const hash = 'hashedPassword';
            const password = 'password123';
            const error = new Error('Verification failed');
            (argon2.verify as jest.Mock).mockRejectedValue(error);

            await expect(service.match(hash, password)).rejects.toThrow(
                'Verification failed'
            );
        });

        it('should handle invalid hash format', async () => {
            const hash = 'invalidHash';
            const password = 'password123';
            (argon2.verify as jest.Mock).mockResolvedValue(false);

            const result = await service.match(hash, password);

            expect(result).toBe(false);
        });
    });

    describe('encrypt', () => {
        beforeEach(() => {
            (crypto.randomBytes as jest.Mock).mockReturnValue(
                Buffer.from('mockRandomBytes')
            );
            (crypto.scrypt as jest.Mock).mockImplementation(
                (_secret, _salt, _keylen, callback) => {
                    callback(null, Buffer.from('mockDerivedKey'));
                }
            );
        });

        it('should encrypt data successfully', async () => {
            const text = 'sensitive data';
            const mockCipher = {
                update: jest
                    .fn()
                    .mockReturnValue(Buffer.from('mockEncryptedData')),
                final: jest.fn().mockReturnValue(Buffer.from('')),
                getAuthTag: jest.fn().mockReturnValue(Buffer.from('mockTag')),
            };
            (crypto.createCipheriv as jest.Mock).mockReturnValue(mockCipher);

            const result = await service.encrypt(text);

            expect(result).toEqual({
                iv: expect.any(String),
                data: expect.any(String),
                tag: expect.any(String),
                salt: expect.any(String),
            });
            expect(crypto.randomBytes).toHaveBeenCalledTimes(2); // salt and iv
            expect(crypto.scrypt).toHaveBeenCalled();
            expect(crypto.createCipheriv).toHaveBeenCalled();
        });

        it('should handle empty string encryption', async () => {
            const text = '';
            const mockCipher = {
                update: jest.fn().mockReturnValue(Buffer.from('')),
                final: jest.fn().mockReturnValue(Buffer.from('')),
                getAuthTag: jest.fn().mockReturnValue(Buffer.from('mockTag')),
            };
            (crypto.createCipheriv as jest.Mock).mockReturnValue(mockCipher);

            const result = await service.encrypt(text);

            expect(result).toEqual({
                iv: expect.any(String),
                data: expect.any(String),
                tag: expect.any(String),
                salt: expect.any(String),
            });
        });

        it('should handle key derivation errors', async () => {
            const text = 'sensitive data';
            const error = new Error('Key derivation failed');
            (crypto.scrypt as jest.Mock).mockImplementation(
                (_secret, _salt, _keylen, callback) => {
                    callback(error, null);
                }
            );

            await expect(service.encrypt(text)).rejects.toThrow(
                'Key derivation failed'
            );
        });

        it('should handle cipher creation errors', async () => {
            const text = 'sensitive data';
            (crypto.createCipheriv as jest.Mock).mockImplementation(() => {
                throw new Error('Cipher creation failed');
            });

            await expect(service.encrypt(text)).rejects.toThrow(
                'Cipher creation failed'
            );
        });
    });

    describe('decrypt', () => {
        const mockEncrypted = {
            iv: 'mockIv',
            data: 'mockEncryptedData',
            tag: 'mockTag',
            salt: 'mockSalt',
        };

        beforeEach(() => {
            (crypto.scrypt as jest.Mock).mockImplementation(
                (_secret, _salt, _keylen, callback) => {
                    callback(null, Buffer.from('mockDerivedKey'));
                }
            );
        });

        it('should decrypt data successfully', async () => {
            const originalText = 'sensitive data';
            const mockDecipher = {
                update: jest.fn().mockReturnValue(Buffer.from(originalText)),
                final: jest.fn().mockReturnValue(Buffer.from('')),
                setAuthTag: jest.fn(),
            };
            (crypto.createDecipheriv as jest.Mock).mockReturnValue(
                mockDecipher
            );

            const result = await service.decrypt(mockEncrypted);

            expect(result).toBe(originalText);
            expect(crypto.scrypt).toHaveBeenCalled();
            expect(crypto.createDecipheriv).toHaveBeenCalled();
            expect(mockDecipher.setAuthTag).toHaveBeenCalledWith(
                Buffer.from('mockTag', 'hex')
            );
        });

        it('should handle key derivation errors during decryption', async () => {
            const error = new Error('Key derivation failed');
            (crypto.scrypt as jest.Mock).mockImplementation(
                (_secret, _salt, _keylen, callback) => {
                    callback(error, null);
                }
            );

            await expect(service.decrypt(mockEncrypted)).rejects.toThrow(
                'Key derivation failed'
            );
        });

        it('should handle decipher creation errors', async () => {
            (crypto.createDecipheriv as jest.Mock).mockImplementation(() => {
                throw new Error('Decipher creation failed');
            });

            await expect(service.decrypt(mockEncrypted)).rejects.toThrow(
                'Decipher creation failed'
            );
        });

        it('should handle authentication tag errors', async () => {
            const mockDecipher = {
                update: jest.fn(),
                final: jest.fn(),
                setAuthTag: jest.fn().mockImplementation(() => {
                    throw new Error('Invalid authentication tag');
                }),
            };
            (crypto.createDecipheriv as jest.Mock).mockReturnValue(
                mockDecipher
            );

            await expect(service.decrypt(mockEncrypted)).rejects.toThrow(
                'Invalid authentication tag'
            );
        });

        it('should handle decryption update errors', async () => {
            const mockDecipher = {
                update: jest.fn().mockImplementation(() => {
                    throw new Error('Decryption update failed');
                }),
                final: jest.fn(),
                setAuthTag: jest.fn(),
            };
            (crypto.createDecipheriv as jest.Mock).mockReturnValue(
                mockDecipher
            );

            await expect(service.decrypt(mockEncrypted)).rejects.toThrow(
                'Decryption update failed'
            );
        });

        it('should handle decryption final errors', async () => {
            const mockDecipher = {
                update: jest.fn().mockReturnValue(Buffer.from('partial')),
                final: jest.fn().mockImplementation(() => {
                    throw new Error('Decryption final failed');
                }),
                setAuthTag: jest.fn(),
            };
            (crypto.createDecipheriv as jest.Mock).mockReturnValue(
                mockDecipher
            );

            await expect(service.decrypt(mockEncrypted)).rejects.toThrow(
                'Decryption final failed'
            );
        });

        it('should handle empty decrypted data', async () => {
            const mockDecipher = {
                update: jest.fn().mockReturnValue(Buffer.from('')),
                final: jest.fn().mockReturnValue(Buffer.from('')),
                setAuthTag: jest.fn(),
            };
            (crypto.createDecipheriv as jest.Mock).mockReturnValue(
                mockDecipher
            );

            const result = await service.decrypt(mockEncrypted);

            expect(result).toBe('');
        });
    });

    describe('integration scenarios', () => {
        it('should encrypt and decrypt data round-trip successfully', async () => {
            const originalText = 'sensitive data for round trip';

            // Mock encrypt
            (crypto.randomBytes as jest.Mock)
                .mockReturnValueOnce(Buffer.from('saltBytes'))
                .mockReturnValueOnce(Buffer.from('ivBytes'));
            (crypto.scrypt as jest.Mock).mockImplementation(
                (_secret, _salt, _keylen, callback) => {
                    callback(null, Buffer.from('derivedKey'));
                }
            );
            const mockCipher = {
                update: jest.fn().mockReturnValue(Buffer.from('encrypted')),
                final: jest.fn().mockReturnValue(Buffer.from('')),
                getAuthTag: jest.fn().mockReturnValue(Buffer.from('authTag')),
            };
            (crypto.createCipheriv as jest.Mock).mockReturnValue(mockCipher);

            // Mock decrypt
            const mockDecipher = {
                update: jest.fn().mockReturnValue(Buffer.from(originalText)),
                final: jest.fn().mockReturnValue(Buffer.from('')),
                setAuthTag: jest.fn(),
            };
            (crypto.createDecipheriv as jest.Mock).mockReturnValue(
                mockDecipher
            );

            const encrypted = await service.encrypt(originalText);
            const decrypted = await service.decrypt(encrypted);

            expect(decrypted).toBe(originalText);
        });

        it('should handle JWT token creation and password operations together', async () => {
            const mockPayload: IAuthUser = { userId: '123', role: 'USER' };
            const password = 'testPassword';

            jwtServiceMock.signAsync
                .mockResolvedValueOnce('accessToken')
                .mockResolvedValueOnce('refreshToken');
            (argon2.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (argon2.verify as jest.Mock).mockResolvedValue(true);

            const tokens = await service.createJwtTokens(mockPayload);
            const hash = await service.createHash(password);
            const isValid = await service.match(hash, password);

            expect(tokens).toEqual({
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
            });
            expect(hash).toBe('hashedPassword');
            expect(isValid).toBe(true);
        });
    });
});
