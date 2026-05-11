import { Injectable } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';

import { MessageService } from 'src/common/message/services/message.service';

import { ApiGenericResponseDto } from '../dtos/response.generic.dto';

@Injectable()
export class ResponseSerializerService {
    constructor(private readonly messageService: MessageService) {}

    serialize(
        data: unknown,
        cls: ClassConstructor<unknown> | undefined
    ): unknown {
        if (!cls) return data;
        return plainToInstance(cls, data, { excludeExtraneousValues: true });
    }

    patchGenericMessage(
        data: unknown,
        cls: ClassConstructor<unknown> | undefined
    ): void {
        if (
            data &&
            typeof data === 'object' &&
            'message' in data &&
            cls?.name === ApiGenericResponseDto.name
        ) {
            (data as ApiGenericResponseDto).message =
                this.messageService.translate(
                    (data as ApiGenericResponseDto).message,
                    { defaultValue: (data as ApiGenericResponseDto).message }
                );
        }
    }
}
