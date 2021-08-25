import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { DatabaseModule } from 'src/database/database.module';
import { UserRepository } from 'src/shared/repository';
import { EmailService } from 'src/shared/services/email.service';
import { TokenService } from 'src/shared/services/token.service';
import { Connection } from 'typeorm';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ConfigModule, DatabaseModule, UserModule],
  controllers: [AdminController],
  exports: [AdminService],
  providers: [
    AdminService,
    TokenService,
    EmailService,
    {
      provide: UserRepository,
      useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository),
      inject: [Connection],
    },
  ],
})
export class AdminModule {}
