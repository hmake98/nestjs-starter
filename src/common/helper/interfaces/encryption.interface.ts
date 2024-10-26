export interface IEncryptDataPayload {
    iv: string;
    data: string;
    tag: string;
    salt: string;
}

export interface IAuthTokenResponse {
    accessToken: string;
    refreshToken: string;
}
