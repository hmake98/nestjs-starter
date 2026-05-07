export interface ILogContext {
    operation?: string;
    userId?: string;
    correlationId?: string;
    traceId?: string;
    [key: string]: unknown;
}

export interface ISerializedError {
    type: string;
    code?: string;
    message: string;
    stack?: string;
}
