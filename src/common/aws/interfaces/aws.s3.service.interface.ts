export interface IAwsS3Service {
    /**
     * Generate a presigned URL for uploading an object to S3
     * @param key - The S3 object key (path)
     * @param contentType - The content type of the file
     * @param expiresIn - Optional expiration time in seconds
     * @returns Presigned URL and expiration time
     */
    getPresignedUploadUrl(
        key: string,
        contentType: string,
        expiresIn?: number
    ): Promise<{ url: string; expiresIn: number }>;

    /**
     * Upload an object directly to S3
     * @param key - The S3 object key (path)
     * @param body - The file content (Buffer or string)
     * @param contentType - The content type of the file
     */
    uploadObject(
        key: string,
        body: Buffer | string,
        contentType: string
    ): Promise<void>;

    /**
     * Get the public URL for an S3 object
     * @param key - The S3 object key (path)
     * @returns Public URL
     */
    getPublicUrl(key: string): string;
}
