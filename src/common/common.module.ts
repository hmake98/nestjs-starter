import configs from '../config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
// import { NotificationModule } from './notification/notification.module';
import { HelperModule } from './helper/helper.module';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    AuthModule,
    FilesModule,
    // NotificationModule,
    HelperModule,
  ],
  providers: [],
})
export class CommonModule {}
