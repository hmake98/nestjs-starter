export interface GetResponse<T> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: T[] | number | {};
}
