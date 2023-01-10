import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { isDev } from '../utils/common';

const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: isDev,
        logging: isDev,
        namingStrategy: new SnakeNamingStrategy(),
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      });
      return dataSource.initialize();
    },
  },
];

@Global()
@Module({
  imports: [],
  providers: [DatabaseService, ...databaseProviders],
  exports: [DatabaseService, ...databaseProviders],
})
export class DatabaseModule {}
