import { Test } from '@nestjs/testing';
import * as Sentry from '@sentry/node';
import { type Request } from 'express';

import { SentryService } from 'src/common/response/services/response.sentry.service';

jest.mock('@sentry/node', () => ({
    getClient: jest.fn(),
    withScope: jest.fn(),
    captureException: jest.fn(),
    captureMessage: jest.fn(),
}));

const mockRequest = (headers: Record<string, string> = {}): Request =>
    ({
        url: '/test',
        method: 'GET',
        body: { key: 'value' },
        query: { q: '1' },
        params: { id: '123' },
        headers,
    }) as unknown as Request;

describe('SentryService', () => {
    let service: SentryService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [SentryService],
        }).compile();
        service = module.get(SentryService);
    });

    it('should be defined', () => expect(service).toBeDefined());

    describe('capture', () => {
        it('does nothing when Sentry has no client', () => {
            (Sentry.getClient as jest.Mock).mockReturnValue(null);
            service.capture(new Error('test'), mockRequest());
            expect(Sentry.withScope).not.toHaveBeenCalled();
        });

        it('captures Error instances with captureException', () => {
            (Sentry.getClient as jest.Mock).mockReturnValue({});
            const setExtra = jest.fn();
            (Sentry.withScope as jest.Mock).mockImplementation(cb =>
                cb({ setExtra })
            );

            const error = new Error('test error');
            service.capture(error, mockRequest());
            expect(Sentry.captureException).toHaveBeenCalledWith(error);
        });

        it('captures non-Error values with captureMessage', () => {
            (Sentry.getClient as jest.Mock).mockReturnValue({});
            const setExtra = jest.fn();
            (Sentry.withScope as jest.Mock).mockImplementation(cb =>
                cb({ setExtra })
            );

            service.capture('string exception', mockRequest());
            expect(Sentry.captureMessage).toHaveBeenCalledWith(
                'Non-Error exception thrown'
            );
        });

        it('attaches request context via setExtra', () => {
            (Sentry.getClient as jest.Mock).mockReturnValue({});
            const setExtra = jest.fn();
            (Sentry.withScope as jest.Mock).mockImplementation(cb =>
                cb({ setExtra })
            );

            service.capture(
                new Error('ctx'),
                mockRequest({ 'x-custom': 'val' })
            );
            expect(setExtra).toHaveBeenCalledWith('requestUrl', '/test');
            expect(setExtra).toHaveBeenCalledWith('method', 'GET');
        });

        it('strips authorization and cookie from headers', () => {
            (Sentry.getClient as jest.Mock).mockReturnValue({});
            const setExtra = jest.fn();
            (Sentry.withScope as jest.Mock).mockImplementation(cb =>
                cb({ setExtra })
            );

            service.capture(
                new Error('headers'),
                mockRequest({
                    authorization: 'Bearer secret',
                    cookie: 'session=abc',
                    'x-custom': 'keep',
                })
            );

            const headersArg = setExtra.mock.calls.find(
                ([key]) => key === 'headers'
            )?.[1];
            expect(headersArg).not.toHaveProperty('authorization');
            expect(headersArg).not.toHaveProperty('cookie');
            expect(headersArg).toHaveProperty('x-custom', 'keep');
        });
    });
});
