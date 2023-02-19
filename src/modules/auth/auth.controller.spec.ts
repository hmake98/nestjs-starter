import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { nanoid } from 'nanoid';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AppModule } from '../../app.module';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { User } from '../../database/entities';
import { DataSource } from 'typeorm';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userId: number;
  let connection: DataSource;

  const userData = {
    firstName: 'John',
    lastName: 'Smith',
    email: `john_${nanoid()}@smith.com`,
    password: 'password',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('auth_secret'),
            signOptions: { expiresIn: configService.get('token_exp') },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    }).compile();

    connection = await moduleRef.get(getDataSourceToken());
    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(async () => {
    await connection.destroy();
  });

  it('controller to be defined', () => {
    expect(authController).toBeDefined();
  });

  it('service to be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should return an access token with user data', async () => {
      const spy = jest.spyOn(authService, 'signup');
      const response = await authController.signup(userData);
      userId = response.user.id;
      expect(spy).toHaveBeenCalled();
      expect(response.accessToken).toBeDefined();
      expect(response.user).toBeDefined();
    });
  });

  describe('login', () => {
    it('should return an access token with user data', async () => {
      const spy = jest.spyOn(authService, 'login');
      const response = await authController.login({
        email: userData.email,
        password: userData.password,
      });
      expect(spy).toHaveBeenCalled();
      expect(response.accessToken).toBeDefined();
      expect(response.user).toBeDefined();
    });
  });

  describe('me', () => {
    it('should return authorized user data', async () => {
      const spy = jest.spyOn(authService, 'me');
      const response = await authController.me(userId);
      expect(spy).toHaveBeenCalled();
      expect(response.id).toBeDefined();
    });
  });
});
