import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/users.user.controller';
import { HelperModule } from 'src/common/helper/helper.module';
import { AdminUserController } from './controllers/users.admin.controller';

@Module({
  imports: [HelperModule],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
})
export class UserModule {}
