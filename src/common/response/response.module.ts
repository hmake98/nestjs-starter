import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { MessageModule } from '../message/message.module';

import { ResponseExceptionFilter } from './filters/response.exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Module({
    imports: [MessageModule],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: ResponseExceptionFilter,
        },
    ],
})
export class ResponseModule {}
