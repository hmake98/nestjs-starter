import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/common/database/database.module';
import { HelperModule } from 'src/common/helper/helper.module';

import { UserAdminController } from './controllers/user.admin.controller';
import { UserPublicController } from './controllers/user.public.controller';
import { UserService } from './services/user.service';

@Module({
    imports: [HelperModule, DatabaseModule],
    controllers: [UserAdminController, UserPublicController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
