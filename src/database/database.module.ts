import { DatabaseService } from './database.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Connection, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const databaseProviders = [
  {
    provide: Connection,
    useFactory: async (configService: ConfigService) => {
      const config = configService.get('database');
      const env = configService.get('env');
      return await createConnection({
        name: 'shefahealth',
        type: config.DB_TYPE,
        host: config.DB_HOST,
        port: config.DB_PORT,
        username: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: true,
        logging: env === 'development',
        namingStrategy: new SnakeNamingStrategy(),
      });
    },
    inject: [ConfigService],
  },
  DatabaseService,
  ConfigService,
];

@Module({
  exports: databaseProviders,
  providers: databaseProviders,
})
export class DatabaseModule {}
