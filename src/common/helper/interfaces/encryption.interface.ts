export interface IEncryptDataPayload {
  iv: string;
  data: string;
}

export interface IAuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}
