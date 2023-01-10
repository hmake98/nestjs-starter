import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { nanoid } from 'nanoid';
import { BullModule } from '@nestjs/bull';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { User } from '../../database/entities';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let connection: DataSource;

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
});
