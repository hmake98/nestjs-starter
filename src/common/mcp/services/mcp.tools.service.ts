import { Injectable } from '@nestjs/common';
import { MCPTool, MCPToolWithParams } from '@hmake98/nestjs-mcp';

@Injectable()
export class MCPToolsService {
    /**
     * Simple calculator tool - Add two numbers
     */
    @MCPTool({
        name: 'add',
        description: 'Add two numbers together',
    })
    async add(params: { a: number; b: number }): Promise<number> {
        return params.a + params.b;
    }

    /**
     * Simple calculator tool - Subtract two numbers
     */
    @MCPTool({
        name: 'subtract',
        description: 'Subtract second number from first number',
    })
    async subtract(params: { a: number; b: number }): Promise<number> {
        return params.a - params.b;
    }

    /**
     * Calculator tool with explicit parameters - Multiply
     */
    @MCPToolWithParams({
        name: 'multiply',
        description: 'Multiply two numbers',
        parameters: [
            {
                name: 'a',
                type: 'number',
                description: 'First number',
                required: true,
            },
            {
                name: 'b',
                type: 'number',
                description: 'Second number',
                required: true,
            },
        ],
    })
    async multiply(params: { a: number; b: number }): Promise<number> {
        return params.a * params.b;
    }

    /**
     * Calculator tool with explicit parameters - Divide
     */
    @MCPToolWithParams({
        name: 'divide',
        description: 'Divide first number by second number',
        parameters: [
            {
                name: 'a',
                type: 'number',
                description: 'Numerator',
                required: true,
            },
            {
                name: 'b',
                type: 'number',
                description: 'Denominator',
                required: true,
            },
        ],
    })
    async divide(params: { a: number; b: number }): Promise<number> {
        if (params.b === 0) {
            throw new Error('Cannot divide by zero');
        }
        return params.a / params.b;
    }

    /**
     * Text utility tool - Convert to uppercase
     */
    @MCPToolWithParams({
        name: 'toUpperCase',
        description: 'Convert text to uppercase',
        parameters: [
            {
                name: 'text',
                type: 'string',
                description: 'Text to convert',
                required: true,
            },
        ],
    })
    async toUpperCase(params: { text: string }): Promise<string> {
        return params.text.toUpperCase();
    }

    /**
     * Text utility tool - Convert to lowercase
     */
    @MCPToolWithParams({
        name: 'toLowerCase',
        description: 'Convert text to lowercase',
        parameters: [
            {
                name: 'text',
                type: 'string',
                description: 'Text to convert',
                required: true,
            },
        ],
    })
    async toLowerCase(params: { text: string }): Promise<string> {
        return params.text.toLowerCase();
    }

    /**
     * UUID generator tool
     */
    @MCPTool({
        name: 'generateUUID',
        description: 'Generate a random UUID v4',
    })
    async generateUUID(): Promise<string> {
        return crypto.randomUUID();
    }

    /**
     * Current timestamp tool
     */
    @MCPTool({
        name: 'getCurrentTimestamp',
        description: 'Get current Unix timestamp in milliseconds',
    })
    async getCurrentTimestamp(): Promise<number> {
        return Date.now();
    }
}
