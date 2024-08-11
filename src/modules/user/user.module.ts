import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/common/database/database.module';
import { HelperModule } from 'src/common/helper/helper.module';

import { AdminUserController } from './controllers/users.admin.controller';
import { UserController } from './controllers/users.user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [HelperModule, DatabaseModule],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
})
export class UserModule {}
