import { Module } from '@nestjs/common';

import { HelperModule } from 'src/common/helper/helper.module';

import { UserService } from './services/user.service';
import { UserController } from './controllers/users.user.controller';
import { AdminUserController } from './controllers/users.admin.controller';

@Module({
  imports: [HelperModule],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
})
export class UserModule {}
