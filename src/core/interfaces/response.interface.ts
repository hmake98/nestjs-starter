import { ClassConstructor } from 'class-transformer';

export interface IGetResponse<T> {
  count: number;
  data: T[];
}

export interface IGenericResponse {
  status: boolean;
  message: string;
}

export interface IResponseOptions<T> {
  serialization: ClassConstructor<T>;
  httpStatus: number;
}
