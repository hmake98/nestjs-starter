import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { MessageService } from 'src/common/message/services/message.service';

const mockI18nContextCurrent = jest.fn();

describe('MessageService', () => {
    let service: MessageService;
    let mockI18nService: jest.Mocked<I18nService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MessageService,
                { provide: I18nService, useValue: { translate: jest.fn() } },
            ],
        }).compile();

        service = module.get<MessageService>(MessageService);
        mockI18nService = module.get<I18nService>(
            I18nService
        ) as jest.Mocked<I18nService>;

        jest.spyOn(I18nContext, 'current').mockImplementation(
            mockI18nContextCurrent
        );
    });

    it('should be defined', () => expect(service).toBeDefined());

    describe('translate', () => {
        it('translates with all options provided', () => {
            mockI18nService.translate.mockReturnValue('Translated message');
            const result = service.translate('test.key', {
                lang: 'fr',
                args: { name: 'John' },
                defaultValue: 'Default message',
            });
            expect(result).toBe('Translated message');
            expect(mockI18nService.translate).toHaveBeenCalledWith('test.key', {
                lang: 'fr',
                args: { name: 'John' },
                defaultValue: 'Default message',
            });
        });

        it('uses context language when lang not provided', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'es' });
            mockI18nService.translate.mockReturnValue('Mensaje');
            service.translate('test.key');
            expect(mockI18nService.translate).toHaveBeenCalledWith('test.key', {
                lang: 'es',
                args: {},
                defaultValue: 'test.key',
            });
        });

        it('uses fallback language when context is null', () => {
            mockI18nContextCurrent.mockReturnValue(null);
            service.translate('test.key');
            expect(mockI18nService.translate).toHaveBeenCalledWith('test.key', {
                lang: 'en',
                args: {},
                defaultValue: 'test.key',
            });
        });

        it('uses fallback language when I18nContext.current throws', () => {
            jest.spyOn(I18nContext, 'current').mockImplementation(() => {
                throw new Error('context error');
            });
            service.translate('test.key');
            expect(mockI18nService.translate).toHaveBeenCalledWith('test.key', {
                lang: 'en',
                args: {},
                defaultValue: 'test.key',
            });
        });

        it('prioritizes provided lang over context lang', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'es' });
            service.translate('test.key', { lang: 'fr' });
            expect(mockI18nService.translate).toHaveBeenCalledWith('test.key', {
                lang: 'fr',
                args: {},
                defaultValue: 'test.key',
            });
        });
    });

    describe('translateKey', () => {
        it('joins parts and translates', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('Not Found');
            const result = service.translateKey(['http', 'error', '404']);
            expect(result).toBe('Not Found');
            expect(mockI18nService.translate).toHaveBeenCalledWith(
                'http.error.404',
                expect.any(Object)
            );
        });

        it('handles numeric parts', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            service.translateKey(['http', 'success', 201]);
            expect(mockI18nService.translate).toHaveBeenCalledWith(
                'http.success.201',
                expect.any(Object)
            );
        });
    });

    describe('translateHttpStatus', () => {
        it('translates an error status', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('Not Found');
            const result = service.translateHttpStatus(
                404,
                'error',
                'Not Found'
            );
            expect(result).toBe('Not Found');
        });

        it('translates a success status', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('OK');
            const result = service.translateHttpStatus(200, 'success', 'OK');
            expect(result).toBe('OK');
        });
    });

    describe('resolveSuccessMessage', () => {
        it('translates provided messageKey', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('User profile retrieved');
            const result = service.resolveSuccessMessage(
                'user.success.profile',
                HttpStatus.OK
            );
            expect(result).toBe('User profile retrieved');
        });

        it('falls back to HTTP status translation when no key', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('Success');
            const result = service.resolveSuccessMessage(
                undefined,
                HttpStatus.OK
            );
            expect(result).toBe('Success');
        });
    });

    describe('resolveExceptionMessage', () => {
        it('handles HttpException', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('Not found');
            const result = service.resolveExceptionMessage(
                new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                ),
                HttpStatus.NOT_FOUND
            );
            expect(result).toEqual({ message: 'Not found' });
        });

        it('handles BadRequestException with string message', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('Bad request');
            const result = service.resolveExceptionMessage(
                new BadRequestException('auth.error.invalid'),
                HttpStatus.BAD_REQUEST
            );
            expect(result).toEqual({ message: 'Bad request' });
        });

        it('handles BadRequestException with no message (uses fallback key)', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('Bad Request');
            const result = service.resolveExceptionMessage(
                new BadRequestException({ message: null }),
                HttpStatus.BAD_REQUEST
            );
            expect(mockI18nService.translate).toHaveBeenCalledWith(
                'http.error.400',
                expect.objectContaining({ defaultValue: 'Bad Request' })
            );
            expect(result).toEqual({ message: 'Bad Request' });
        });

        it('handles BadRequestException with array message', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('translated');
            const result = service.resolveExceptionMessage(
                new BadRequestException([
                    'email must be valid',
                    'password too short',
                ]),
                HttpStatus.BAD_REQUEST
            );
            expect(result.validationMessages).toHaveLength(2);
        });

        it('handles non-HttpException as 500', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('Internal Server Error');
            const result = service.resolveExceptionMessage(
                new Error('unexpected'),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
            expect(result).toEqual({ message: 'Internal Server Error' });
        });
    });

    describe('translateValidationMessages', () => {
        it('translates messages with params', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('translated');
            const result = service.translateValidationMessages([
                'field.required|{"field":"email"}',
            ]);
            expect(result).toEqual(['translated']);
            expect(mockI18nService.translate).toHaveBeenCalledWith(
                'field.required',
                {
                    lang: 'en',
                    args: { field: 'email' },
                    defaultValue: 'field.required',
                }
            );
        });

        it('translates plain messages without params', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('translated plain');
            const result = service.translateValidationMessages(['simple.key']);
            expect(result).toEqual(['translated plain']);
        });

        it('falls back gracefully on invalid JSON params', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('fallback');
            const result = service.translateValidationMessages([
                'key|{invalid json',
            ]);
            expect(result).toEqual(['fallback']);
        });
    });
});
