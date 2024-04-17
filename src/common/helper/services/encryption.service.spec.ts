import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'secret'),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create access token', async () => {
    const payload = { userId: '123' };
    const accessToken = 'generated-access-token';
    jest.spyOn(service, 'createAccessToken').mockResolvedValue(accessToken);

    const result = await service.createAccessToken(payload);

    expect(result).toBe(accessToken);
    expect(service.createAccessToken).toHaveBeenCalledWith(payload);
  });

  it('should create refresh token', async () => {
    const payload = { userId: '123' };
    const refreshToken = 'generated-refresh-token';
    jest.spyOn(service, 'createRefreshToken').mockResolvedValue(refreshToken);

    const result = await service.createRefreshToken(payload);

    expect(result).toBe(refreshToken);
    expect(service.createRefreshToken).toHaveBeenCalledWith(payload);
  });

  it('should create JWT tokens', async () => {
    const payload = { userId: '123' };
    const accessToken = 'generated-access-token';
    const refreshToken = 'generated-refresh-token';
    jest.spyOn(service, 'createAccessToken').mockResolvedValue(accessToken);
    jest.spyOn(service, 'createRefreshToken').mockResolvedValue(refreshToken);

    const result = await service.createJwtTokens(payload);

    expect(result.accessToken).toBe(accessToken);
    expect(result.refreshToken).toBe(refreshToken);
    expect(service.createAccessToken).toHaveBeenCalledWith(payload);
    expect(service.createRefreshToken).toHaveBeenCalledWith(payload);
  });

  it('should create hash', () => {
    const password = 'password';
    const hash = service.createHash(password);
    expect(hash).not.toBeNull();
    expect(hash).not.toBe(password);
  });

  it('should match password with hash', () => {
    const password = 'password';
    const hash = service.createHash(password);
    const match = service.match(hash, password);
    expect(match).toBe(true);
  });

  it('should encrypt and decrypt text', () => {
    const text = 'hello world';
    const encrypted = service.encrypt(text);
    const decrypted = service.decrypt(encrypted);
    expect(decrypted).toBe(text);
  });
});
