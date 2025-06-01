import { Module } from '@nestjs/common';

import { CommonModule } from 'src/common/common.module';
import { WorkerModule } from 'src/workers/worker.module';

import { PostModule } from '../modules/post/post.module';
import { UserModule } from '../modules/user/user.module';

@Module({
    imports: [CommonModule, WorkerModule, PostModule, UserModule],
})
export class AppModule {}
