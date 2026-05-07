import { type HttpStatus } from '@nestjs/common';
import type { ClassConstructor } from 'class-transformer';

export interface IDocBaseOptions {
    summary: string;
    messageKey: string;
    httpStatus?: HttpStatus;
}

export interface IDocTypedOptions<T> extends IDocBaseOptions {
    serialization: ClassConstructor<T>;
}

export interface IDocPaginatedOptions<T> extends IDocBaseOptions {
    serialization: ClassConstructor<T>;
    paginated: true;
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
