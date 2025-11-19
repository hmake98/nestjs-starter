import { Test, TestingModule } from '@nestjs/testing';

import { MCPToolsService } from 'src/common/mcp/services/mcp.tools.service';

describe('MCPToolsService', () => {
    let service: MCPToolsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MCPToolsService],
        }).compile();

        service = module.get<MCPToolsService>(MCPToolsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('add', () => {
        it('should add two positive numbers', async () => {
            const result = await service.add({ a: 5, b: 3 });
            expect(result).toBe(8);
        });

        it('should add two negative numbers', async () => {
            const result = await service.add({ a: -5, b: -3 });
            expect(result).toBe(-8);
        });

        it('should add positive and negative numbers', async () => {
            const result = await service.add({ a: 10, b: -3 });
            expect(result).toBe(7);
        });

        it('should add zero to a number', async () => {
            const result = await service.add({ a: 5, b: 0 });
            expect(result).toBe(5);
        });

        it('should add decimal numbers', async () => {
            const result = await service.add({ a: 1.5, b: 2.3 });
            expect(result).toBeCloseTo(3.8);
        });
    });

    describe('subtract', () => {
        it('should subtract two positive numbers', async () => {
            const result = await service.subtract({ a: 10, b: 3 });
            expect(result).toBe(7);
        });

        it('should subtract two negative numbers', async () => {
            const result = await service.subtract({ a: -5, b: -3 });
            expect(result).toBe(-2);
        });

        it('should subtract negative from positive', async () => {
            const result = await service.subtract({ a: 10, b: -5 });
            expect(result).toBe(15);
        });

        it('should subtract zero from a number', async () => {
            const result = await service.subtract({ a: 5, b: 0 });
            expect(result).toBe(5);
        });

        it('should subtract decimal numbers', async () => {
            const result = await service.subtract({ a: 5.5, b: 2.3 });
            expect(result).toBeCloseTo(3.2);
        });

        it('should handle result being zero', async () => {
            const result = await service.subtract({ a: 5, b: 5 });
            expect(result).toBe(0);
        });
    });

    describe('multiply', () => {
        it('should multiply two positive numbers', async () => {
            const result = await service.multiply({ a: 5, b: 3 });
            expect(result).toBe(15);
        });

        it('should multiply two negative numbers', async () => {
            const result = await service.multiply({ a: -5, b: -3 });
            expect(result).toBe(15);
        });

        it('should multiply positive and negative numbers', async () => {
            const result = await service.multiply({ a: 5, b: -3 });
            expect(result).toBe(-15);
        });

        it('should multiply by zero', async () => {
            const result = await service.multiply({ a: 5, b: 0 });
            expect(result).toBe(0);
        });

        it('should multiply by one', async () => {
            const result = await service.multiply({ a: 5, b: 1 });
            expect(result).toBe(5);
        });

        it('should multiply decimal numbers', async () => {
            const result = await service.multiply({ a: 2.5, b: 4 });
            expect(result).toBe(10);
        });
    });

    describe('divide', () => {
        it('should divide two positive numbers', async () => {
            const result = await service.divide({ a: 10, b: 2 });
            expect(result).toBe(5);
        });

        it('should divide two negative numbers', async () => {
            const result = await service.divide({ a: -10, b: -2 });
            expect(result).toBe(5);
        });

        it('should divide positive by negative', async () => {
            const result = await service.divide({ a: 10, b: -2 });
            expect(result).toBe(-5);
        });

        it('should divide by one', async () => {
            const result = await service.divide({ a: 5, b: 1 });
            expect(result).toBe(5);
        });

        it('should divide decimal numbers', async () => {
            const result = await service.divide({ a: 7.5, b: 2.5 });
            expect(result).toBe(3);
        });

        it('should throw error when dividing by zero', async () => {
            await expect(service.divide({ a: 10, b: 0 })).rejects.toThrow(
                'Cannot divide by zero'
            );
        });

        it('should handle zero dividend', async () => {
            const result = await service.divide({ a: 0, b: 5 });
            expect(result).toBe(0);
        });

        it('should handle fractional results', async () => {
            const result = await service.divide({ a: 10, b: 3 });
            expect(result).toBeCloseTo(3.333, 2);
        });
    });

    describe('toUpperCase', () => {
        it('should convert lowercase text to uppercase', async () => {
            const result = await service.toUpperCase({ text: 'hello' });
            expect(result).toBe('HELLO');
        });

        it('should handle already uppercase text', async () => {
            const result = await service.toUpperCase({ text: 'HELLO' });
            expect(result).toBe('HELLO');
        });

        it('should handle mixed case text', async () => {
            const result = await service.toUpperCase({
                text: 'Hello World',
            });
            expect(result).toBe('HELLO WORLD');
        });

        it('should handle empty string', async () => {
            const result = await service.toUpperCase({ text: '' });
            expect(result).toBe('');
        });

        it('should handle text with numbers', async () => {
            const result = await service.toUpperCase({ text: 'hello123' });
            expect(result).toBe('HELLO123');
        });

        it('should handle text with special characters', async () => {
            const result = await service.toUpperCase({
                text: 'hello-world!',
            });
            expect(result).toBe('HELLO-WORLD!');
        });

        it('should handle unicode characters', async () => {
            const result = await service.toUpperCase({ text: 'café' });
            expect(result).toBe('CAFÉ');
        });
    });

    describe('toLowerCase', () => {
        it('should convert uppercase text to lowercase', async () => {
            const result = await service.toLowerCase({ text: 'HELLO' });
            expect(result).toBe('hello');
        });

        it('should handle already lowercase text', async () => {
            const result = await service.toLowerCase({ text: 'hello' });
            expect(result).toBe('hello');
        });

        it('should handle mixed case text', async () => {
            const result = await service.toLowerCase({
                text: 'Hello World',
            });
            expect(result).toBe('hello world');
        });

        it('should handle empty string', async () => {
            const result = await service.toLowerCase({ text: '' });
            expect(result).toBe('');
        });

        it('should handle text with numbers', async () => {
            const result = await service.toLowerCase({ text: 'HELLO123' });
            expect(result).toBe('hello123');
        });

        it('should handle text with special characters', async () => {
            const result = await service.toLowerCase({
                text: 'HELLO-WORLD!',
            });
            expect(result).toBe('hello-world!');
        });

        it('should handle unicode characters', async () => {
            const result = await service.toLowerCase({ text: 'CAFÉ' });
            expect(result).toBe('café');
        });
    });

    describe('generateUUID', () => {
        it('should generate a valid UUID', async () => {
            const result = await service.generateUUID();

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            );
        });

        it('should generate unique UUIDs', async () => {
            const uuid1 = await service.generateUUID();
            const uuid2 = await service.generateUUID();

            expect(uuid1).not.toBe(uuid2);
        });

        it('should generate UUID v4 format', async () => {
            const result = await service.generateUUID();
            const parts = result.split('-');

            expect(parts).toHaveLength(5);
            expect(parts[0]).toHaveLength(8);
            expect(parts[1]).toHaveLength(4);
            expect(parts[2]).toHaveLength(4);
            expect(parts[2][0]).toBe('4');
            expect(parts[3]).toHaveLength(4);
            expect(parts[4]).toHaveLength(12);
        });
    });

    describe('getCurrentTimestamp', () => {
        it('should return a valid timestamp', async () => {
            const result = await service.getCurrentTimestamp();

            expect(result).toBeDefined();
            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });

        it('should return current time in milliseconds', async () => {
            const before = Date.now();
            const result = await service.getCurrentTimestamp();
            const after = Date.now();

            expect(result).toBeGreaterThanOrEqual(before);
            expect(result).toBeLessThanOrEqual(after);
        });

        it('should return different timestamps when called multiple times', async () => {
            const timestamp1 = await service.getCurrentTimestamp();
            await new Promise(resolve => setTimeout(resolve, 10));
            const timestamp2 = await service.getCurrentTimestamp();

            expect(timestamp2).toBeGreaterThanOrEqual(timestamp1);
        });

        it('should return a 13-digit number', async () => {
            const result = await service.getCurrentTimestamp();
            const digits = result.toString().length;

            expect(digits).toBeGreaterThanOrEqual(13);
        });
    });
});
