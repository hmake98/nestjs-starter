import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';

import { nanoid } from 'nanoid';
import { BullModule } from '@nestjs/bull';
import { DataSource } from 'typeorm';
import { AppModule } from '../../../app/app.module';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { User } from '../../../common/database/entities';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let connection: DataSource;
  let userId: number;

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
        BullModule.registerQueue({
          name: 'notification',
        }),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    connection = await moduleRef.get(getDataSourceToken());
    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  afterEach(async () => {
    await connection.destroy();
  });

  it('controller to be defined', () => {
    expect(userController).toBeDefined();
  });

  it('service to be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('signup', () => {
    it('should return an access token with user data', async () => {
      const spy = jest.spyOn(userService, 'signup');
      const response = await userService.signup(userData);
      userId = response.user.id;
      expect(spy).toHaveBeenCalled();
      expect(response.accessToken).toBeDefined();
      expect(response.user).toBeDefined();
    });
  });

  describe('login', () => {
    it('should return an access token with user data', async () => {
      const spy = jest.spyOn(userService, 'login');
      const response = await userController.login({
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
      const spy = jest.spyOn(userService, 'me');
      const response = await userController.me(userId);
      expect(spy).toHaveBeenCalled();
      expect(response.id).toBeDefined();
    });
  });
});
