import { ClassConstructor } from 'class-transformer';

export interface IPaginationMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface IGetResponse<T> {
  data: T[];
  metadata: IPaginationMetadata;
}

export interface IGenericResponse {
  success: boolean;
  message: string;
}

export interface IResponseOptions<T> {
  serialization?: ClassConstructor<T>;
  httpStatus: number;
}
