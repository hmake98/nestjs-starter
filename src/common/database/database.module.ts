import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { isDev } from 'src/utils/util';

const databaseProviders = [
  {
    provide: DataSource,
    import: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('db.host'),
        port: Number(configService.get('db.port')),
        username: configService.get('db.user'),
        password: configService.get('db.password'),
        database: configService.get('db.name'),
        synchronize: isDev,
        logging: isDev,
        namingStrategy: new SnakeNamingStrategy(),
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      });
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];

@Global()
@Module({
  imports: [],
  providers: [DatabaseService, ...databaseProviders],
  exports: [DatabaseService, ...databaseProviders],
})
export class DatabaseModule {}
