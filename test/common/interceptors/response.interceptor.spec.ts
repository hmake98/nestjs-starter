import { type CallHandler, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { firstValueFrom, of } from 'rxjs';

import { MessageService } from 'src/common/message/services/message.service';
import { ResponseInterceptor } from 'src/common/response/interceptors/response.interceptor';
import { ResponseSerializerService } from 'src/common/response/services/response.serializer.service';

const mockReflector = { get: jest.fn() };
const mockMessageService = {
    resolveSuccessMessage: jest.fn().mockReturnValue('Success'),
};
const mockSerializerService = {
    serialize: jest.fn((data: unknown) => data),
    patchGenericMessage: jest.fn(),
};

describe('ResponseInterceptor', () => {
    let interceptor: ResponseInterceptor;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ResponseInterceptor,
                { provide: Reflector, useValue: mockReflector },
                { provide: MessageService, useValue: mockMessageService },
                {
                    provide: ResponseSerializerService,
                    useValue: mockSerializerService,
                },
            ],
        }).compile();

        interceptor = module.get(ResponseInterceptor);
    });

    const mockContext = (statusCode = 200): ExecutionContext =>
        ({
            getHandler: jest.fn().mockReturnValue('handler'),
            switchToHttp: jest.fn().mockReturnValue({
                getResponse: jest.fn().mockReturnValue({ statusCode }),
            }),
        }) as unknown as ExecutionContext;

    const mockHandler = (data: unknown): CallHandler => ({
        handle: jest.fn().mockReturnValue(of(data)),
    });

    it('should be defined', () => expect(interceptor).toBeDefined());

    it('wraps response body with standard envelope', async () => {
        mockReflector.get.mockReturnValue(undefined);
        const result = await firstValueFrom(
            interceptor.intercept(mockContext(200), mockHandler({ id: '1' }))
        );
        expect(result).toMatchObject({
            statusCode: 200,
            message: 'Success',
            timestamp: expect.any(String),
            data: { id: '1' },
        });
    });

    it('calls serializer with provided class', async () => {
        class TestDto {}
        mockReflector.get
            .mockReturnValueOnce(TestDto)
            .mockReturnValueOnce('user.success.profile');
        await firstValueFrom(
            interceptor.intercept(
                mockContext(200),
                mockHandler({ name: 'Alice' })
            )
        );
        expect(mockSerializerService.serialize).toHaveBeenCalledWith(
            { name: 'Alice' },
            TestDto
        );
    });

    it('calls patchGenericMessage after serializing', async () => {
        mockReflector.get.mockReturnValue(undefined);
        await firstValueFrom(
            interceptor.intercept(
                mockContext(200),
                mockHandler({ success: true })
            )
        );
        expect(mockSerializerService.patchGenericMessage).toHaveBeenCalled();
    });

    it('resolves success message with status code and key', async () => {
        mockReflector.get
            .mockReturnValueOnce(undefined)
            .mockReturnValueOnce('user.success.updated');
        await firstValueFrom(
            interceptor.intercept(mockContext(200), mockHandler({}))
        );
        expect(mockMessageService.resolveSuccessMessage).toHaveBeenCalledWith(
            'user.success.updated',
            200
        );
    });
});
