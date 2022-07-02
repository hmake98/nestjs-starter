export * from './IToken';
export * from './IAuth';
export * from './IFile';

export interface GetResponse<T> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: T[] | number | {};
}

export interface SuccessResponse {
  message: string;
}
