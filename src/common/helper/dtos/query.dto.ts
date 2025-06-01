import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsOptional,
    IsInt,
    Min,
    Max,
    IsString,
    IsEnum,
    IsObject,
    IsArray,
    ValidateNested,
    IsDateString,
    IsNumber,
} from 'class-validator';

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export enum SearchMode {
    DEFAULT = 'default',
    INSENSITIVE = 'insensitive',
}

export class DateFilterDto {
    @ApiPropertyOptional({ description: 'Field name for date filtering' })
    @IsString()
    field: string;

    @ApiPropertyOptional({ description: 'Start date (ISO string)' })
    @IsOptional()
    @IsDateString()
    from?: string;

    @ApiPropertyOptional({ description: 'End date (ISO string)' })
    @IsOptional()
    @IsDateString()
    to?: string;
}

export class RangeFilterDto {
    @ApiPropertyOptional({ description: 'Field name for range filtering' })
    @IsString()
    field: string;

    @ApiPropertyOptional({ description: 'Minimum value' })
    @IsOptional()
    @IsNumber()
    min?: number;

    @ApiPropertyOptional({ description: 'Maximum value' })
    @IsOptional()
    @IsNumber()
    max?: number;
}

export class EnumFilterDto {
    @ApiPropertyOptional({ description: 'Field name for enum filtering' })
    @IsString()
    field: string;

    @ApiPropertyOptional({
        description: 'Array of enum values',
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    values: string[];
}

export class BasePrismaQueryDto {
    @ApiPropertyOptional({
        description: 'Page number for pagination',
        minimum: 1,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        minimum: 1,
        maximum: 100,
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;

    @ApiPropertyOptional({ description: 'Search query string' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    searchQuery?: string;

    @ApiPropertyOptional({
        description: 'Fields to search in',
        type: [String],
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',').map(field => field.trim());
        }
        return value;
    })
    @IsArray()
    @IsString({ each: true })
    searchFields?: string[];

    @ApiPropertyOptional({
        description: 'Search mode',
        enum: SearchMode,
        default: SearchMode.INSENSITIVE,
    })
    @IsOptional()
    @IsEnum(SearchMode)
    searchMode?: SearchMode;

    @ApiPropertyOptional({ description: 'Field to sort by' })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: SortOrder,
        default: SortOrder.ASC,
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder;

    @ApiPropertyOptional({
        description: 'Custom order by object',
        example: { createdAt: 'desc', name: 'asc' },
    })
    @IsOptional()
    @IsObject()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return {};
            }
        }
        return value;
    })
    orderBy?: Record<string, 'asc' | 'desc'>;

    @ApiPropertyOptional({
        description: 'Fields to select',
        example: { id: true, name: true, email: true },
    })
    @IsOptional()
    @IsObject()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return {};
            }
        }
        return value;
    })
    select?: Record<string, boolean>;

    @ApiPropertyOptional({
        description: 'Relations to include',
        example: { posts: true, profile: { select: { bio: true } } },
    })
    @IsOptional()
    @IsObject()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return {};
            }
        }
        return value;
    })
    include?: Record<string, boolean | object>;

    @ApiPropertyOptional({
        description: 'Basic filters as key-value pairs',
        example: { status: 'active', role: 'admin' },
    })
    @IsOptional()
    @IsObject()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return {};
            }
        }
        return value;
    })
    filters?: Record<string, any>;

    @ApiPropertyOptional({
        description: 'Date range filters',
        type: [DateFilterDto],
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => DateFilterDto)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        }
        return value;
    })
    dateFilters?: DateFilterDto[];

    @ApiPropertyOptional({
        description: 'Numeric range filters',
        type: [RangeFilterDto],
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => RangeFilterDto)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        }
        return value;
    })
    rangeFilters?: RangeFilterDto[];

    @ApiPropertyOptional({
        description: 'Enum/array filters',
        type: [EnumFilterDto],
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => EnumFilterDto)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        }
        return value;
    })
    enumFilters?: EnumFilterDto[];

    @ApiPropertyOptional({
        description: 'Distinct fields',
        type: [String],
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',').map(field => field.trim());
        }
        return value;
    })
    @IsArray()
    @IsString({ each: true })
    distinct?: string[];
}

// Specific DTOs for different models
export class UserQueryDto extends BasePrismaQueryDto {
    @ApiPropertyOptional({ description: 'Filter by user role' })
    @IsOptional()
    @IsString()
    role?: string;

    @ApiPropertyOptional({ description: 'Filter by verification status' })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }
        return value;
    })
    isVerified?: boolean;
}

export class PostQueryDto extends BasePrismaQueryDto {
    @ApiPropertyOptional({ description: 'Filter by post status' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: 'Filter by author ID' })
    @IsOptional()
    @IsString()
    authorId?: string;
}

// Response DTOs
export class QueryMetaDto {
    @ApiPropertyOptional({ description: 'Total number of records' })
    total: number;

    @ApiPropertyOptional({ description: 'Current page number' })
    page: number;

    @ApiPropertyOptional({ description: 'Number of items per page' })
    limit: number;

    @ApiPropertyOptional({ description: 'Total number of pages' })
    totalPages: number;

    @ApiPropertyOptional({ description: 'Whether there is a next page' })
    hasNextPage: boolean;

    @ApiPropertyOptional({ description: 'Whether there is a previous page' })
    hasPrevPage: boolean;
}

export class PaginatedResponseDto<T> {
    @ApiPropertyOptional({ description: 'Array of data items' })
    data: T[];

    @ApiPropertyOptional({
        description: 'Pagination metadata',
        type: QueryMetaDto,
    })
    meta: QueryMetaDto;
}
