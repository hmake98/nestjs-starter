import {
    type ArgumentsHost,
    BadRequestException,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { type Request, type Response } from 'express';

import { MessageService } from 'src/common/message/services/message.service';
import { ResponseExceptionFilter } from 'src/common/response/filters/response.exception.filter';
import { SentryService } from 'src/common/response/services/response.sentry.service';

const mockMessageService = {
    resolveExceptionMessage: jest.fn(),
};
const mockSentryService = { capture: jest.fn() };
const mockConfigService = { get: jest.fn() };

const buildHost = (): {
    host: ArgumentsHost;
    json: jest.Mock;
    status: jest.Mock;
} => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const response = { status } as unknown as Response;
    const request = { method: 'GET', url: '/test' } as Request;
    const host = {
        switchToHttp: jest.fn().mockReturnValue({
            getResponse: jest.fn().mockReturnValue(response),
            getRequest: jest.fn().mockReturnValue(request),
        }),
    } as unknown as ArgumentsHost;
    return { host, json, status };
};

describe('ResponseExceptionFilter', () => {
    let filter: ResponseExceptionFilter;

    const buildFilter = async (debug = false) => {
        mockConfigService.get.mockReturnValue(debug);
        const module = await Test.createTestingModule({
            providers: [
                ResponseExceptionFilter,
                { provide: MessageService, useValue: mockMessageService },
                { provide: SentryService, useValue: mockSentryService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();
        filter = module.get(ResponseExceptionFilter);
    };

    beforeEach(() => {
        mockMessageService.resolveExceptionMessage.mockReturnValue({
            message: 'Error occurred',
        });
        return buildFilter();
    });

    it('defaults isDebug to false when configService.get returns undefined', async () => {
        mockConfigService.get.mockReturnValue(undefined);
        const module = await Test.createTestingModule({
            providers: [
                ResponseExceptionFilter,
                { provide: MessageService, useValue: mockMessageService },
                { provide: SentryService, useValue: mockSentryService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();
        const f = module.get(ResponseExceptionFilter);
        const { host, json } = buildHost();
        f.catch(new Error('no debug'), host);
        expect(json.mock.calls[0][0]).not.toHaveProperty('error');
    });

    it('should be defined', () => expect(filter).toBeDefined());

    describe('HttpException handling', () => {
        it('uses exception status code for HttpException', () => {
            const { host, status } = buildHost();
            filter.catch(
                new HttpException('Not Found', HttpStatus.NOT_FOUND),
                host
            );
            expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        });

        it('uses 500 for non-HttpException errors', () => {
            const { host, status } = buildHost();
            filter.catch(new Error('boom'), host);
            expect(status).toHaveBeenCalledWith(
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        });
    });

    describe('Sentry and logging', () => {
        it('captures 5xx errors in sentry', () => {
            const { host } = buildHost();
            filter.catch(new InternalServerErrorException(), host);
            expect(mockSentryService.capture).toHaveBeenCalled();
        });

        it('does not capture 4xx errors in sentry', () => {
            const { host } = buildHost();
            filter.catch(
                new HttpException('Bad Request', HttpStatus.BAD_REQUEST),
                host
            );
            expect(mockSentryService.capture).not.toHaveBeenCalled();
        });

        it('captures non-HttpException (treated as 500) in sentry', () => {
            const { host } = buildHost();
            filter.catch(new Error('unexpected'), host);
            expect(mockSentryService.capture).toHaveBeenCalled();
        });
    });

    describe('debug mode off (default)', () => {
        it('does not include error field in response', () => {
            const { host, json } = buildHost();
            filter.catch(new Error('stack trace'), host);
            const payload = json.mock.calls[0][0];
            expect(payload).not.toHaveProperty('error');
        });
    });

    describe('debug mode on', () => {
        beforeEach(() => buildFilter(true));

        it('includes stack trace for plain Error', () => {
            const { host, json } = buildHost();
            const err = new Error('with stack');
            filter.catch(err, host);
            const payload = json.mock.calls[0][0];
            expect(payload.error).toBe(err.stack);
        });

        it('includes validationMessages for BadRequestException with array body', () => {
            mockMessageService.resolveExceptionMessage.mockReturnValue({
                message: 'Bad Request',
                validationMessages: ['field is required'],
            });
            const { host, json } = buildHost();
            filter.catch(new BadRequestException(['field is required']), host);
            const payload = json.mock.calls[0][0];
            expect(payload.error).toEqual(['field is required']);
        });

        it('does not include error field when exception is not an Error instance', () => {
            mockMessageService.resolveExceptionMessage.mockReturnValue({
                message: 'Unknown',
            });
            const { host, json } = buildHost();
            filter.catch('plain string thrown', host);
            const payload = json.mock.calls[0][0];
            expect(payload).not.toHaveProperty('error');
        });
    });

    describe('response shape', () => {
        it('always includes statusCode, message, and timestamp', () => {
            const { host, json } = buildHost();
            filter.catch(
                new HttpException('Bad', HttpStatus.BAD_REQUEST),
                host
            );
            const payload = json.mock.calls[0][0];
            expect(payload).toMatchObject({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error occurred',
                timestamp: expect.any(String),
            });
        });
    });
});
