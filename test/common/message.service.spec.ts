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

    afterEach(() => {});

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
            mockI18nService.translate.mockReturnValue('Translated message');

            const result = service.translate(key, options);

            expect(result).toBe('Translated message');
            expect(mockI18nService.translate).toHaveBeenCalledWith(key, {
                lang: 'fr',
                args: { name: 'John' },
                defaultValue: 'Default message',
            });
        });

        it('should use context language when not provided', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'es' });
            mockI18nService.translate.mockReturnValue('Mensaje');

            service.translate('test.key');

            expect(mockI18nService.translate).toHaveBeenCalledWith('test.key', {
                lang: 'es',
                args: {},
                defaultValue: 'test.key',
            });
        });

        it('should use fallback language when context is not available', () => {
            mockI18nContextCurrent.mockReturnValue(null);

            service.translate('test.key');

            expect(mockI18nService.translate).toHaveBeenCalledWith('test.key', {
                lang: 'en',
                args: {},
                defaultValue: 'test.key',
            });
        });

        it('should prioritize provided lang over context lang', () => {
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
        it('should build and translate key from parts', () => {
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });
            mockI18nService.translate.mockReturnValue('Not Found');

            const result = service.translateKey(['http', 'error', '404']);

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
            mockI18nContextCurrent.mockReturnValue({ lang: 'en' });

            service.translateKey(['http', 'success', 201]);

            expect(mockI18nService.translate).toHaveBeenCalledWith(
                'http.success.201',
                expect.any(Object)
            );
        });

        it('should pass options correctly', () => {
            mockI18nService.translate.mockReturnValue('Mot de passe invalide');

            service.translateKey(['auth', 'error', 'invalidPassword'], {
                lang: 'fr',
                args: { attempts: 3 },
                defaultValue: 'Invalid password',
            });

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
});
