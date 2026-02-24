import { Injectable } from '@nestjs/common';
import { Tool, ToolParam } from '@hmake98/nest-mcp';

@Injectable()
export class MCPToolsService {
    /**
     * Simple calculator tool - Add two numbers
     */
    @Tool({
        name: 'add',
        description: 'Add two numbers together',
    })
    async add(
        @ToolParam('a', {
            description: 'First number',
            type: 'number',
            required: true,
        })
        a: number,
        @ToolParam('b', {
            description: 'Second number',
            type: 'number',
            required: true,
        })
        b: number
    ): Promise<number> {
        return a + b;
    }

    /**
     * Simple calculator tool - Subtract two numbers
     */
    @Tool({
        name: 'subtract',
        description: 'Subtract second number from first number',
    })
    async subtract(
        @ToolParam('a', {
            description: 'First number',
            type: 'number',
            required: true,
        })
        a: number,
        @ToolParam('b', {
            description: 'Second number',
            type: 'number',
            required: true,
        })
        b: number
    ): Promise<number> {
        return a - b;
    }

    /**
     * Calculator tool - Multiply two numbers
     */
    @Tool({
        name: 'multiply',
        description: 'Multiply two numbers',
    })
    async multiply(
        @ToolParam('a', {
            description: 'First number',
            type: 'number',
            required: true,
        })
        a: number,
        @ToolParam('b', {
            description: 'Second number',
            type: 'number',
            required: true,
        })
        b: number
    ): Promise<number> {
        return a * b;
    }

    /**
     * Calculator tool - Divide two numbers
     */
    @Tool({
        name: 'divide',
        description: 'Divide first number by second number',
    })
    async divide(
        @ToolParam('a', {
            description: 'Numerator',
            type: 'number',
            required: true,
        })
        a: number,
        @ToolParam('b', {
            description: 'Denominator',
            type: 'number',
            required: true,
        })
        b: number
    ): Promise<number> {
        if (b === 0) {
            throw new Error('Cannot divide by zero');
        }
        return a / b;
    }

    /**
     * Text utility tool - Convert to uppercase
     */
    @Tool({
        name: 'toUpperCase',
        description: 'Convert text to uppercase',
    })
    async toUpperCase(
        @ToolParam('text', {
            description: 'Text to convert',
            type: 'string',
            required: true,
        })
        text: string
    ): Promise<string> {
        return text.toUpperCase();
    }

    /**
     * Text utility tool - Convert to lowercase
     */
    @Tool({
        name: 'toLowerCase',
        description: 'Convert text to lowercase',
    })
    async toLowerCase(
        @ToolParam('text', {
            description: 'Text to convert',
            type: 'string',
            required: true,
        })
        text: string
    ): Promise<string> {
        return text.toLowerCase();
    }

    /**
     * UUID generator tool
     */
    @Tool({
        name: 'generateUUID',
        description: 'Generate a random UUID v4',
    })
    async generateUUID(): Promise<string> {
        return crypto.randomUUID();
    }

    /**
     * Current timestamp tool
     */
    @Tool({
        name: 'getCurrentTimestamp',
        description: 'Get current Unix timestamp in milliseconds',
    })
    async getCurrentTimestamp(): Promise<number> {
        return Date.now();
    }
}
