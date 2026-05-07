import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { MessageModule } from '../message/message.module';
import { ResponseExceptionFilter } from './filters/response.exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { SentryService } from './services/response.sentry.service';
import { ResponseSerializerService } from './services/response.serializer.service';

@Module({
    imports: [MessageModule],
    providers: [
        SentryService,
        ResponseSerializerService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: ResponseExceptionFilter,
        },
    ],
    exports: [ResponseSerializerService, SentryService],
})
export class ResponseModule {}
