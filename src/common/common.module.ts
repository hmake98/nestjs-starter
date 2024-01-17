import configs from '../config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaService } from './services/prisma.service';

@Module({
  controllers: [],
  imports: [
    AuthModule,
    TerminusModule,
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],
  providers: [PrismaService],
})
export class CommonModule {}
