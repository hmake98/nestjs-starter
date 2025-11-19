import { Test, TestingModule } from '@nestjs/testing';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { MessageService } from 'src/common/message/services/message.service';

// Mock I18nContext.current method
const mockI18nContextCurrent = jest.fn();

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

        // Spy on I18nContext.current
        jest.spyOn(I18nContext, 'current').mockImplementation(
            mockI18nContextCurrent
        );

        // Reset mocks
        jest.clearAllMocks();
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
            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: 'fr',
                args: { name: 'John' },
                defaultValue: 'Default message',
            });
        });

        it('should use context language when not provided', () => {
            const key = 'test.key';
            const contextLang = 'es';

            mockI18nContextCurrent.mockReturnValue({
                lang: contextLang,
            });

            mockI18nService.translate.mockReturnValue('Mensaje');

            service.translate(key);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: contextLang,
                args: {},
                defaultValue: key,
            });
        });

        it('should use fallback language when context is not available', () => {
            const key = 'test.key';

            mockI18nContextCurrent.mockReturnValue(null);

            service.translate(key);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: 'en',
                args: {},
                defaultValue: key,
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
                lang: 'en',
                args: {},
                defaultValue: 'Default message',
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
                lang: 'en',
                args: { name: 'John' },
                defaultValue: key,
            });
        });

        it('should handle undefined options', () => {
            const key = 'test.key';

            mockI18nContextCurrent.mockReturnValue({
                lang: 'en',
            });

            service.translate(key);

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: 'en',
                args: {},
                defaultValue: key,
            });
        });

        it('should prioritize provided lang over context lang', () => {
            const key = 'test.key';

            mockI18nContextCurrent.mockReturnValue({
                lang: 'es',
            });

            service.translate(key, { lang: 'fr' });

            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: 'fr',
                args: {},
                defaultValue: key,
            });
        });
    });

    describe('translateBulk', () => {
        it('should translate multiple messages', () => {
            const items = [
                { key: 'user.created' },
                { key: 'user.updated', args: { name: 'John' } },
                { key: 'user.deleted', defaultValue: 'User removed' },
            ];

            mockI18nContextCurrent.mockReturnValue({
                lang: 'en',
            });

            mockI18nService.translate
                .mockReturnValueOnce('User created')
                .mockReturnValueOnce('User John updated')
                .mockReturnValueOnce('User deleted');

            const result = service.translateBulk(items);

            expect(result).toEqual([
                'User created',
                'User John updated',
                'User deleted',
            ]);
            expect(mockI18nService.translate).toHaveBeenCalledTimes(3);
            expect(mockI18nService.translate).toHaveBeenNthCalledWith(
                1,
                'user.created',
                {
                    lang: 'en',
                    args: {},
                    defaultValue: 'user.created',
                }
            );
            expect(mockI18nService.translate).toHaveBeenNthCalledWith(
                2,
                'user.updated',
                {
                    lang: 'en',
                    args: { name: 'John' },
                    defaultValue: 'user.updated',
                }
            );
            expect(mockI18nService.translate).toHaveBeenNthCalledWith(
                3,
                'user.deleted',
                {
                    lang: 'en',
                    args: {},
                    defaultValue: 'User removed',
                }
            );
        });

        it('should use provided language for all items', () => {
            const items = [{ key: 'user.created' }, { key: 'user.updated' }];

            mockI18nService.translate
                .mockReturnValueOnce('Usuario creado')
                .mockReturnValueOnce('Usuario actualizado');

            service.translateBulk(items, 'es');

            expect(mockI18nService.translate).toHaveBeenNthCalledWith(
                1,
                'user.created',
                {
                    lang: 'es',
                    args: {},
                    defaultValue: 'user.created',
                }
            );
            expect(mockI18nService.translate).toHaveBeenNthCalledWith(
                2,
                'user.updated',
                {
                    lang: 'es',
                    args: {},
                    defaultValue: 'user.updated',
                }
            );
        });

        it('should handle empty array', () => {
            const result = service.translateBulk([]);

            expect(result).toEqual([]);
            expect(mockI18nService.translate).not.toHaveBeenCalled();
        });
    });

    describe('translateKey', () => {
        it('should build and translate key from parts', () => {
            const parts = ['http', 'error', '404'];

            mockI18nContextCurrent.mockReturnValue({
                lang: 'en',
            });

            mockI18nService.translate.mockReturnValue('Not Found');

            const result = service.translateKey(parts);

            expect(result).toBe('Not Found');
            expect(mockI18nService.translate).toHaveBeenCalledWith(
                'http.error.404',
                {
                    lang: 'en',
                    args: {},
                    defaultValue: 'http.error.404',
                }
            );
        });

        it('should handle numeric parts', () => {
            const parts = ['http', 'success', 201];

            mockI18nContextCurrent.mockReturnValue({
                lang: 'en',
            });

            mockI18nService.translate.mockReturnValue('Created');

            service.translateKey(parts);

            expect(mockI18nService.translate).toHaveBeenCalledWith(
                'http.success.201',
                expect.any(Object)
            );
        });

        it('should pass options correctly', () => {
            const parts = ['auth', 'error', 'invalidPassword'];
            const options = {
                lang: 'fr',
                args: { attempts: 3 },
                defaultValue: 'Invalid password',
            };

            mockI18nService.translate.mockReturnValue('Mot de passe invalide');

            service.translateKey(parts, options);

            expect(mockI18nService.translate).toHaveBeenCalledWith(
                'auth.error.invalidPassword',
                {
                    lang: 'fr',
                    args: { attempts: 3 },
                    defaultValue: 'Invalid password',
                }
            );
        });
    });

    describe('getCurrentLanguage', () => {
        it('should return language from context', () => {
            mockI18nContextCurrent.mockReturnValue({
                lang: 'fr',
            });

            const result = service.getCurrentLanguage();

            expect(result).toBe('fr');
        });

        it('should return fallback language when context is null', () => {
            mockI18nContextCurrent.mockReturnValue(null);

            const result = service.getCurrentLanguage();

            expect(result).toBe('en');
        });

        it('should return fallback language when context throws error', () => {
            mockI18nContextCurrent.mockImplementation(() => {
                throw new Error('No context');
            });

            const result = service.getCurrentLanguage();

            expect(result).toBe('en');
        });

        it('should return fallback language when context.lang is undefined', () => {
            mockI18nContextCurrent.mockReturnValue({});

            const result = service.getCurrentLanguage();

            expect(result).toBe('en');
        });
    });
});
