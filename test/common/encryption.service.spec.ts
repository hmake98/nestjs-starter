import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

import { IAuthUser } from 'src/core/interfaces/request.interface';

import { EncryptionService } from '../../src/common/helper/services/encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(() => 'secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createJwtTokens', () => {
    it('should return an object containing accessToken and refreshToken', async () => {
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      jest
        .spyOn(service, 'createAccessToken')
        .mockResolvedValue(mockAccessToken);
      jest
        .spyOn(service, 'createRefreshToken')
        .mockResolvedValue(mockRefreshToken);

      const userPayload = {
        userId: 1,
        username: 'testuser',
      } as unknown as IAuthUser;
      const result = await service.createJwtTokens(userPayload);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });
  });

  describe('createAccessToken', () => {
    it('should return a valid JWT token with correct payload', async () => {
      const mockToken = 'mockToken';
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const userPayload = {
        userId: 1,
        role: 'USER',
      } as unknown as IAuthUser;
      const token = await service.createAccessToken(userPayload);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        userPayload,
        expect.any(Object),
      );
      expect(token).toBe(mockToken);
    });
  });

  describe('createRefreshToken', () => {
    it('should return a valid JWT token with correct payload', async () => {
      const mockToken = 'mockToken';
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const userPayload = {
        userId: 1,
        role: 'USER',
      } as unknown as IAuthUser;
      const token = await service.createRefreshToken(userPayload);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        userPayload,
        expect.any(Object),
      );
      expect(token).toBe(mockToken);
    });
  });

  describe('createHash', () => {
    it('should return a hash string', async () => {
      const mockPassword = 'password';
      const hash = await service.createHash(mockPassword);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });
  });

  describe('match', () => {
    it('should return true when given correct hash and password', async () => {
      const mockPassword = 'password';
      const hash = await argon2.hash(mockPassword);
      const matchResult = await service.match(hash, mockPassword);
      expect(matchResult).toBe(true);
    });

    it('should return false when given incorrect hash or password', async () => {
      const correctPassword = 'password';
      const incorrectPassword = 'incorrectPassword';
      const hash = await argon2.hash(correctPassword);
      const matchResult = await service.match(hash, incorrectPassword);
      expect(matchResult).toBe(false);
    });
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt data successfully', () => {
      const plaintext = 'Hello, world!';
      const encryptedData = service.encrypt(plaintext);
      const decryptedData = service.decrypt(encryptedData);
      expect(decryptedData).toBe(plaintext);
    });
  });
});
