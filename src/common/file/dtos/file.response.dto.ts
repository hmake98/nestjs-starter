import { ApiProperty } from '@nestjs/swagger';

export class FilePutPresignResponseDto {
    @ApiProperty({
        example:
            'https://s3.amazonaws.com/finance-department-bucket/2022/tax-certificate.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3SGQVQG7FGA6KKA6%2F20221104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221104T140227Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=b228dbec8c1008c80c162e1210e4503dceead1e4d4751b4d9787314fd6da4d55',
        required: true,
        nullable: false,
    })
    url: string;

    @ApiProperty({
        example: 1200,
        required: true,
        nullable: false,
    })
    expiresIn: number;
}
