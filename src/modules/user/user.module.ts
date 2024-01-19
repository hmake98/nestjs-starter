import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
  imports: [HelperModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
