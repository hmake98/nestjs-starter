import { Sequelize } from 'sequelize-typescript';
import { File, Post, User } from './models';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (): Promise<Sequelize> => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      });
      sequelize.addModels([User, Post, File]);
      await sequelize.sync({ logging: true });
      return sequelize;
    },
  },
  {
    provide: 'FILE_REPOSITORY',
    useValue: File,
  },
  {
    provide: 'POST_REPOSITORY',
    useValue: Post,
  },
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];
