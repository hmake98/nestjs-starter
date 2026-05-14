import { Test } from '@nestjs/testing';
import { Expose } from 'class-transformer';

import { MessageService } from 'src/common/message/services/message.service';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';
import { ResponseSerializerService } from 'src/common/response/services/response.serializer.service';

class TestDto {
    @Expose() name: string;
}

const mockMessageService = {
    translate: jest.fn((key: string) => `translated:${key}`),
};

describe('ResponseSerializerService', () => {
    let service: ResponseSerializerService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ResponseSerializerService,
                { provide: MessageService, useValue: mockMessageService },
            ],
        }).compile();
        service = module.get(ResponseSerializerService);
    });

    it('should be defined', () => expect(service).toBeDefined());

    describe('serialize', () => {
        it('returns data as-is when no class provided', () => {
            const data = { foo: 'bar' };
            expect(service.serialize(data, undefined)).toBe(data);
        });

        it('transforms data using plainToInstance excluding unexposed fields', () => {
            const result = service.serialize(
                { name: 'Alice', secret: 'stripped' },
                TestDto
            );
            expect(result).toEqual({ name: 'Alice' });
            expect((result as TestDto).name).toBe('Alice');
        });
    });

    describe('patchGenericMessage', () => {
        it('translates message when data is ApiGenericResponseDto', () => {
            const data = new ApiGenericResponseDto(
                true,
                'user.success.deleted'
            );
            service.patchGenericMessage(data, ApiGenericResponseDto);
            expect(data.message).toBe('translated:user.success.deleted');
        });

        it('does not translate when cls is a different class', () => {
            const data = new ApiGenericResponseDto(true, 'key');
            service.patchGenericMessage(data, TestDto);
            expect(mockMessageService.translate).not.toHaveBeenCalled();
        });

        it('does nothing when data is null', () => {
            expect(() =>
                service.patchGenericMessage(null, ApiGenericResponseDto)
            ).not.toThrow();
        });

        it('does nothing when cls is undefined', () => {
            const data = new ApiGenericResponseDto(true, 'key');
            service.patchGenericMessage(data, undefined);
            expect(mockMessageService.translate).not.toHaveBeenCalled();
        });

        it('does nothing when data has no message property', () => {
            service.patchGenericMessage(
                { other: 'field' },
                ApiGenericResponseDto
            );
            expect(mockMessageService.translate).not.toHaveBeenCalled();
        });
    });
});
