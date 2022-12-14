export * from "./IToken";
export * from "./IAuth";
export * from "./IFile";

export interface GetResponse<T> {
  count: number;
  data: T[];
}

export interface SuccessResponse {
  status: boolean;
  message: string;
}
