import { ClassConstructor } from 'class-transformer';

export interface IPaginationMetadata {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

interface IApiBaseResponse {
    statusCode: number;
    message: string;
    timestamp: string;
}

export interface IApiSuccessResponse<T> extends IApiBaseResponse {
    data: T;
}

export interface IApiPaginatedData<T> {
    items: T[];
    metadata: IPaginationMetadata;
}

export interface IApiPaginatedResponse<T> extends IApiBaseResponse {
    data: IApiPaginatedData<T>;
}

export interface IApiErrorResponse extends IApiBaseResponse {
    error?: string | string[] | Record<string, unknown>;
}

export interface IGenericResponse {
    success: boolean;
    message: string;
}

export interface IResponseDocOptions<T> {
    httpStatus: number;
    messageKey: string;
    serialization?: ClassConstructor<T>;
}

export interface IGenericResponseOptions {
    httpStatus: number;
    messageKey: string;
}
