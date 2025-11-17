import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

/**
 * Simple query builder service for common listing API patterns
 *
 * This service provides easy-to-use methods for building Prisma queries
 * with pagination, search, filtering, and sorting.
 *
 * Usage:
 * ```typescript
 * const query = this.queryService
 *   .query(this.databaseService.user)
 *   .paginate({ page: 1, limit: 10 })
 *   .search('john', ['name', 'email'])
 *   .filter({ role: 'USER', isActive: true })
 *   .sort({ createdAt: 'desc' })
 *   .include({ posts: true })
 *   .execute();
 * ```
 */
@Injectable()
export class HelperQueryService {
    private readonly DEFAULT_LIMIT = 10;
    private readonly MAX_LIMIT = 100;

    constructor(private readonly logger: PinoLogger) {
        this.logger.setContext(HelperQueryService.name);
    }

    /**
     * Start building a query
     *
     * @param delegate - Prisma model delegate
     * @returns QueryBuilder instance
     */
    query<T>(delegate: any): QueryBuilder<T> {
        return new QueryBuilder<T>(delegate, this.logger, {
            defaultLimit: this.DEFAULT_LIMIT,
            maxLimit: this.MAX_LIMIT,
        });
    }
}

/**
 * Fluent query builder for Prisma
 */
class QueryBuilder<T> {
    private whereConditions: any[] = [];
    private page = 1;
    private limit: number;
    private orderByClause: any;
    private includeClause: any;
    private selectClause: any;

    constructor(
        private delegate: any,
        private logger: PinoLogger,
        private config: { defaultLimit: number; maxLimit: number }
    ) {
        this.limit = config.defaultLimit;
    }

    /**
     * Add pagination
     *
     * @param params - Page and limit
     */
    paginate(params: { page?: number; limit?: number }): this {
        this.page = Math.max(1, params.page || 1);
        this.limit = Math.min(
            Math.max(1, params.limit || this.config.defaultLimit),
            this.config.maxLimit
        );
        return this;
    }

    /**
     * Add search across multiple fields
     *
     * @param searchQuery - Search term
     * @param fields - Fields to search in
     */
    search(searchQuery?: string, fields?: string[]): this {
        if (!searchQuery || !fields?.length) {
            return this;
        }

        this.whereConditions.push({
            OR: fields.map(field => ({
                [field]: {
                    contains: searchQuery,
                    mode: 'insensitive',
                },
            })),
        });

        return this;
    }

    /**
     * Add filters
     *
     * @param filters - Key-value pairs to filter by
     */
    filter(filters?: Record<string, any>): this {
        if (!filters || Object.keys(filters).length === 0) {
            return this;
        }

        // Filter out null/undefined values
        const cleanFilters = Object.entries(filters).reduce(
            (acc, [key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, any>
        );

        if (Object.keys(cleanFilters).length > 0) {
            this.whereConditions.push(cleanFilters);
        }

        return this;
    }

    /**
     * Add custom where condition
     *
     * @param condition - Prisma where condition
     */
    where(condition: any): this {
        if (condition && Object.keys(condition).length > 0) {
            this.whereConditions.push(condition);
        }
        return this;
    }

    /**
     * Add sorting
     *
     * @param orderBy - Prisma orderBy clause
     */
    sort(orderBy: Record<string, 'asc' | 'desc'>): this {
        this.orderByClause = orderBy;
        return this;
    }

    /**
     * Add relations to include
     *
     * @param include - Prisma include clause
     */
    include(include: Record<string, boolean | object>): this {
        this.includeClause = include;
        return this;
    }

    /**
     * Specify fields to select
     *
     * @param select - Prisma select clause
     */
    select(select: Record<string, boolean>): this {
        this.selectClause = select;
        return this;
    }

    /**
     * Execute the query and return paginated results
     */
    async execute(): Promise<ApiPaginatedDataDto<T>> {
        const skip = (this.page - 1) * this.limit;

        // Build where clause
        const whereClause =
            this.whereConditions.length > 0
                ? { AND: this.whereConditions }
                : {};

        // Build query
        const query: any = {
            where: whereClause,
            take: this.limit,
            skip,
        };

        if (this.orderByClause) {
            query.orderBy = this.orderByClause;
        }

        if (this.includeClause) {
            query.include = this.includeClause;
        }

        if (this.selectClause) {
            query.select = this.selectClause;
        }

        try {
            // Execute in parallel
            const [totalItems, items] = await Promise.all([
                this.delegate.count({ where: whereClause }),
                this.delegate.findMany(query),
            ]);

            const totalPages = Math.ceil(totalItems / this.limit);

            return {
                metadata: {
                    totalItems,
                    itemsPerPage: this.limit,
                    totalPages,
                    currentPage: this.page,
                },
                items,
            };
        } catch (error) {
            this.logger.error(`Query execution failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Execute and return only the items (no pagination)
     */
    async getMany(): Promise<T[]> {
        const whereClause =
            this.whereConditions.length > 0
                ? { AND: this.whereConditions }
                : {};

        const query: any = {
            where: whereClause,
        };

        if (this.orderByClause) {
            query.orderBy = this.orderByClause;
        }

        if (this.includeClause) {
            query.include = this.includeClause;
        }

        if (this.selectClause) {
            query.select = this.selectClause;
        }

        try {
            return await this.delegate.findMany(query);
        } catch (error) {
            this.logger.error(`Query execution failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Execute and return first result
     */
    async getFirst(): Promise<T | null> {
        const whereClause =
            this.whereConditions.length > 0
                ? { AND: this.whereConditions }
                : {};

        const query: any = {
            where: whereClause,
        };

        if (this.orderByClause) {
            query.orderBy = this.orderByClause;
        }

        if (this.includeClause) {
            query.include = this.includeClause;
        }

        if (this.selectClause) {
            query.select = this.selectClause;
        }

        try {
            return await this.delegate.findFirst(query);
        } catch (error) {
            this.logger.error(`Query execution failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get count only
     */
    async count(): Promise<number> {
        const whereClause =
            this.whereConditions.length > 0
                ? { AND: this.whereConditions }
                : {};

        try {
            return await this.delegate.count({ where: whereClause });
        } catch (error) {
            this.logger.error(`Count failed: ${error.message}`);
            throw error;
        }
    }
}
