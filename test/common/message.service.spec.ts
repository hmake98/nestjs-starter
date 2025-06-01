import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';

import { MessageService } from 'src/common/message/services/message.service';

describe('MessageService', () => {
    let service: MessageService;
    let mockI18nService: jest.Mocked<I18nService>;

    beforeEach(async () => {
        const mockI18nServiceValue = {
            translate: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MessageService,
                {
                    provide: I18nService,
                    useValue: mockI18nServiceValue,
                },
            ],
        }).compile();

        service = module.get<MessageService>(MessageService);
        mockI18nService = module.get<I18nService>(
            I18nService
        ) as jest.Mocked<I18nService>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('translate', () => {
        it('should translate with all options provided', () => {
            const key = 'test.key';
            const options = {
                lang: 'fr',
                args: { name: 'John' },
                defaultValue: 'Default message',
            };
            const expectedTranslation = 'Translated message';

            mockI18nService.translate.mockReturnValue(expectedTranslation);

            const result = service.translate(key, options);

            expect(result).toBe(expectedTranslation);
            expect(mockI18nService.translate).toHaveBeenCalledWith(
                key,
                options
            );
        });

        it('should use default language when not provided', () => {
            const key = 'test.key';
            const options = {
                args: { name: 'John' },
                defaultValue: 'Default message',
            };

            service.translate(key, options);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                ...options,
                lang: 'en',
            });
        });

        it('should use empty args when not provided', () => {
            const key = 'test.key';
            const options = {
                lang: 'en',
                defaultValue: 'Default message',
            };

            service.translate(key, options);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                ...options,
                args: {},
            });
        });

        it('should use key as default value when not provided', () => {
            const key = 'test.key';
            const options = {
                lang: 'en',
                args: { name: 'John' },
            };

            service.translate(key, options);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                ...options,
                defaultValue: key,
            });
        });

        it('should handle minimal options', () => {
            const key = 'test.key';
            const minimalOptions = {};

            service.translate(key, minimalOptions);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: 'en',
                args: {},
                defaultValue: key,
            });
        });

        it('should handle undefined options', () => {
            const key = 'test.key';
            const options = undefined;

            service.translate(key, options as any);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: 'en',
                args: {},
                defaultValue: key,
            });
        });

        it('should use provided values even if empty strings', () => {
            const key = 'test.key';
            const options = {
                lang: '',
                args: {},
                defaultValue: '',
            };

            service.translate(key, options);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: '',
                args: {},
                defaultValue: '',
            });
        });

        it('should handle partial options', () => {
            const key = 'test.key';
            const options = {
                lang: 'fr',
                // missing args and defaultValue
            };

            service.translate(key, options);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: 'fr',
                args: {},
                defaultValue: key,
            });
        });

        it('should handle empty object options', () => {
            const key = 'test.key';
            const options = {};

            service.translate(key, options);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: 'en',
                args: {},
                defaultValue: key,
            });
        });
    });

    describe('translateSuccess', () => {
        it('should translate success message with status code', () => {
            const statusCode = HttpStatus.CREATED;
            const expectedMessage = 'Created successfully';

            mockI18nService.translate.mockReturnValue(expectedMessage);

            const result = service.translateSuccess(statusCode);

            expect(result).toBe(expectedMessage);
            expect(mockI18nService.translate).toHaveBeenCalledWith(
                `http.success.${statusCode}`,
                {
                    lang: 'en',
                    args: {},
                    defaultValue: 'Operation completed successfully.',
                }
            );
        });

        it('should use provided language', () => {
            const statusCode = HttpStatus.OK;
            const lang = 'es';

            service.translateSuccess(statusCode, lang);

            expect(mockI18nService.translate).toHaveBeenCalledWith(
                `http.success.${statusCode}`,
                {
                    lang,
                    args: {},
                    defaultValue: 'Operation completed successfully.',
                }
            );
        });
    });

    describe('translateError', () => {
        it('should translate error message with status code', () => {
            const statusCode = HttpStatus.NOT_FOUND;
            const expectedMessage = 'Not Found';

            mockI18nService.translate.mockReturnValue(expectedMessage);

            const result = service.translateError(statusCode);

            expect(result).toBe(expectedMessage);
            expect(mockI18nService.translate).toHaveBeenCalledWith(
                `http.error.${statusCode}`,
                {
                    lang: 'en',
                    args: {},
                    defaultValue: 'Internal server error.',
                }
            );
        });

        it('should use provided language', () => {
            const statusCode = HttpStatus.BAD_REQUEST;
            const lang = 'fr';

            service.translateError(statusCode, lang);

            expect(mockI18nService.translate).toHaveBeenCalledWith(
                `http.error.${statusCode}`,
                {
                    lang,
                    args: {},
                    defaultValue: 'Internal server error.',
                }
            );
        });
    });

    describe('translateValidationMessages', () => {
        it('should translate array of validation messages', () => {
            const messages = [
                'validation.isString|{"field":"username"}',
                'validation.minLength|{"field":"password","min":6}',
            ];
            const translatedMessages = [
                'Username must be a string',
                'Password must be at least 6 characters',
            ];

            mockI18nService.translate
                .mockReturnValueOnce(translatedMessages[0])
                .mockReturnValueOnce(translatedMessages[1]);

            const result = service.translateValidationMessages(messages);

            expect(result).toEqual(translatedMessages);
            expect(mockI18nService.translate).toHaveBeenCalledTimes(2);
            expect(mockI18nService.translate).toHaveBeenNthCalledWith(
                1,
                'validation.isString',
                {
                    lang: 'en',
                    args: { field: 'username' },
                    defaultValue: 'validation.isString',
                }
            );
            expect(mockI18nService.translate).toHaveBeenNthCalledWith(
                2,
                'validation.minLength',
                {
                    lang: 'en',
                    args: { field: 'password', min: 6 },
                    defaultValue: 'validation.minLength',
                }
            );
        });

        it('should handle messages without parameters', () => {
            const messages = ['validation.required'];
            const translatedMessage = 'Field is required';

            mockI18nService.translate.mockReturnValue(translatedMessage);

            const result = service.translateValidationMessages(messages);

            expect(result).toEqual([translatedMessage]);
            expect(mockI18nService.translate).toHaveBeenCalledWith(
                'validation.required',
                {
                    lang: 'en',
                    args: {},
                    defaultValue: 'validation.required',
                }
            );
        });

        it('should return original message if parsing fails', () => {
            const invalidMessage = 'invalid|{message}';

            const result = service.translateValidationMessages([
                invalidMessage,
            ]);

            expect(result).toEqual([invalidMessage]);
            // Should not call translate service for invalid messages
            expect(mockI18nService.translate).not.toHaveBeenCalled();
        });

        it('should handle empty messages array', () => {
            const result = service.translateValidationMessages([]);

            expect(result).toEqual([]);
            expect(mockI18nService.translate).not.toHaveBeenCalled();
        });

        it('should handle messages with empty parameters', () => {
            const messages = ['validation.required|{}'];
            const translatedMessage = 'Field is required';

            mockI18nService.translate.mockReturnValue(translatedMessage);

            const result = service.translateValidationMessages(messages);

            expect(result).toEqual([translatedMessage]);
            expect(mockI18nService.translate).toHaveBeenCalledWith(
                'validation.required',
                {
                    lang: 'en',
                    args: {},
                    defaultValue: 'validation.required',
                }
            );
        });
    });

    describe('translateResponseMessage', () => {
        it('should translate response message', () => {
            const message = 'response.success';
            const expectedTranslation = 'Success message';

            mockI18nService.translate.mockReturnValue(expectedTranslation);

            const result = service.translateResponseMessage(message);

            expect(result).toBe(expectedTranslation);
            expect(mockI18nService.translate).toHaveBeenCalledWith(message, {
                lang: 'en',
                args: {},
                defaultValue: 'Operation completed.',
            });
        });

        it('should use provided language', () => {
            const message = 'response.success';
            const lang = 'de';

            service.translateResponseMessage(message, lang);

            expect(mockI18nService.translate).toHaveBeenCalledWith(message, {
                lang,
                args: {},
                defaultValue: 'Operation completed.',
            });
        });
    });
});
