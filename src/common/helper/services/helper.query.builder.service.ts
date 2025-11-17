import { Injectable, BadRequestException } from '@nestjs/common';
import {
    IPrismaQueryBuilderOptions,
    IPrismaQueryResult,
    IQueryOptions,
} from '../interfaces/query.builder.interface';
import { IHelperPrismaQueryBuilderService } from '../interfaces/query.builder.service.interface';

type PrismaDelegate = {
    count: (args?: any) => Promise<number>;
    findMany: (args?: any) => Promise<any[]>;
};

@Injectable()
export class HelperPrismaQueryBuilderService
    implements IHelperPrismaQueryBuilderService
{
    private readonly defaultOptions: IPrismaQueryBuilderOptions = {
        defaultLimit: 10,
        maxLimit: 100,
        allowedSortFields: [],
        allowedFilterFields: [],
        allowedSearchFields: [],
    };

    /**
     * Build and execute a dynamic Prisma query
     */
    async buildQuery<T>(
        delegate: PrismaDelegate,
        options: IQueryOptions,
        builderOptions?: Partial<IPrismaQueryBuilderOptions>
    ): Promise<IPrismaQueryResult<T>> {
        const config = { ...this.defaultOptions, ...builderOptions };

        // Build query parts
        const whereClause = this.buildWhereClause(options, config);
        const orderByClause = this.buildOrderByClause(options, config);
        const selectClause = this.buildSelectClause(options);
        const paginationClause = this.buildPaginationClause(options, config);

        // Build final query
        const query = {
            ...selectClause,
            where: whereClause,
            orderBy: orderByClause,
            ...paginationClause,
        };

        // Remove undefined values
        const cleanQuery = this.cleanQuery(query);

        // Execute queries
        const [data, total] = await Promise.all([
            delegate.findMany(cleanQuery),
            delegate.count({ where: whereClause }),
        ]);

        // Build metadata
        const meta = this.buildMetadata(total, options, config);

        return { data, meta };
    }

    /**
     * Build WHERE clause with search, filters, and conditions
     */
    private buildWhereClause(
        options: IQueryOptions,
        config: IPrismaQueryBuilderOptions
    ): Record<string, any> {
        const conditions: any[] = [];

        // Basic filters
        if (options.filters) {
            const basicFilters = this.buildBasicFilters(
                options.filters,
                config
            );
            if (Object.keys(basicFilters).length > 0) {
                conditions.push(basicFilters);
            }
        }

        // Search conditions
        if (options.searchQuery && options.searchFields?.length) {
            const searchConditions = this.buildSearchConditions(
                options,
                config
            );
            if (searchConditions) {
                conditions.push(searchConditions);
            }
        }

        // Date filters
        if (options.dateFilters?.length) {
            const dateConditions = this.buildDateFilters(options.dateFilters);
            conditions.push(...dateConditions);
        }

        // Range filters
        if (options.rangeFilters?.length) {
            const rangeConditions = this.buildRangeFilters(
                options.rangeFilters
            );
            conditions.push(...rangeConditions);
        }

        // Enum filters
        if (options.enumFilters?.length) {
            const enumConditions = this.buildEnumFilters(options.enumFilters);
            conditions.push(...enumConditions);
        }

        return conditions.length > 0 ? { AND: conditions } : {};
    }

    /**
     * Build basic filters from key-value pairs
     */
    private buildBasicFilters(
        filters: Record<string, any>,
        config: IPrismaQueryBuilderOptions
    ): Record<string, any> {
        const allowedFields = config.allowedFilterFields;
        const basicFilters: Record<string, any> = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (allowedFields?.length && !allowedFields.includes(key)) {
                return; // Skip non-allowed fields
            }

            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    basicFilters[key] = { in: value };
                } else if (typeof value === 'string' && value.includes(',')) {
                    basicFilters[key] = {
                        in: value.split(',').map(v => v.trim()),
                    };
                } else {
                    basicFilters[key] = value;
                }
            }
        });

        return basicFilters;
    }

    /**
     * Build search conditions across multiple fields
     */
    private buildSearchConditions(
        options: IQueryOptions,
        config: IPrismaQueryBuilderOptions
    ): Record<string, any> | null {
        const {
            searchQuery,
            searchFields,
            searchMode = 'insensitive',
        } = options;
        const allowedFields = config.allowedSearchFields;

        if (!searchQuery || !searchFields?.length) return null;

        const fieldsToSearch = allowedFields?.length
            ? searchFields.filter(field => allowedFields.includes(field))
            : searchFields;

        if (!fieldsToSearch.length) return null;

        return {
            OR: fieldsToSearch.map(field => ({
                [field]: {
                    contains: searchQuery,
                    mode: searchMode,
                },
            })),
        };
    }

    /**
     * Build date range filters
     */
    private buildDateFilters(dateFilters: any[]): Record<string, any>[] {
        return dateFilters
            .map(({ field, from, to }) => {
                const condition: any = {};

                if (from || to) {
                    condition[field] = {};
                    if (from) condition[field].gte = new Date(from);
                    if (to) condition[field].lte = new Date(to);
                }

                return condition;
            })
            .filter(condition => Object.keys(condition).length > 0);
    }

    /**
     * Build numeric range filters
     */
    private buildRangeFilters(rangeFilters: any[]): Record<string, any>[] {
        return rangeFilters
            .map(({ field, min, max }) => {
                const condition: any = {};

                if (min !== undefined || max !== undefined) {
                    condition[field] = {};
                    if (min !== undefined) condition[field].gte = min;
                    if (max !== undefined) condition[field].lte = max;
                }

                return condition;
            })
            .filter(condition => Object.keys(condition).length > 0);
    }

    /**
     * Build enum/array filters
     */
    private buildEnumFilters(enumFilters: any[]): Record<string, any>[] {
        return enumFilters
            .map(({ field, values }) => ({
                [field]: { in: values },
            }))
            .filter(condition => Object.keys(condition).length > 0);
    }

    /**
     * Build ORDER BY clause
     */
    private buildOrderByClause(
        options: IQueryOptions,
        config: IPrismaQueryBuilderOptions
    ):
        | Record<string, 'asc' | 'desc'>
        | Record<string, 'asc' | 'desc'>[]
        | undefined {
        const { sortBy, sortOrder = 'asc', orderBy } = options;
        const allowedFields = config.allowedSortFields;

        // Custom orderBy takes precedence
        if (orderBy) {
            return orderBy;
        }

        // Simple sort
        if (sortBy) {
            if (allowedFields?.length && !allowedFields.includes(sortBy)) {
                throw new BadRequestException(
                    `Sorting by '${sortBy}' is not allowed`
                );
            }
            return { [sortBy]: sortOrder };
        }

        // Default sort by createdAt if available
        return { createdAt: 'desc' };
    }

    /**
     * Build SELECT/INCLUDE clause
     */
    private buildSelectClause(options: IQueryOptions): Record<string, any> {
        const clause: Record<string, any> = {};

        if (options.select) {
            clause.select = options.select;
        }

        if (options.include) {
            clause.include = options.include;
        }

        return clause;
    }

    /**
     * Build pagination clause
     */
    private buildPaginationClause(
        options: IQueryOptions,
        config: IPrismaQueryBuilderOptions
    ): Record<string, number> {
        const page = Math.max(1, options.page || 1);
        const limit = Math.min(
            options.limit || config.defaultLimit!,
            config.maxLimit!
        );

        return {
            skip: (page - 1) * limit,
            take: limit,
        };
    }

    /**
     * Build response metadata
     */
    private buildMetadata(
        total: number,
        options: IQueryOptions,
        config: IPrismaQueryBuilderOptions
    ) {
        const page = Math.max(1, options.page || 1);
        const limit = Math.min(
            options.limit || config.defaultLimit!,
            config.maxLimit!
        );
        const totalPages = Math.ceil(total / limit);

        return {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }

    /**
     * Remove undefined values from query object
     */
    private cleanQuery(query: Record<string, any>): Record<string, any> {
        const cleaned: Record<string, any> = {};

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined) {
                if (
                    typeof value === 'object' &&
                    value !== null &&
                    !Array.isArray(value)
                ) {
                    const cleanedNested = this.cleanQuery(value);
                    if (Object.keys(cleanedNested).length > 0) {
                        cleaned[key] = cleanedNested;
                    }
                } else {
                    cleaned[key] = value;
                }
            }
        });

        return cleaned;
    }

    /**
     * Build query for cursor-based pagination
     */
    async buildCursorQuery<T>(
        delegate: PrismaDelegate,
        options: IQueryOptions & { cursor?: Record<string, any> },
        builderOptions?: Partial<IPrismaQueryBuilderOptions>
    ): Promise<{ data: T[]; nextCursor?: Record<string, any> }> {
        const config = { ...this.defaultOptions, ...builderOptions };

        const whereClause = this.buildWhereClause(options, config);
        const orderByClause = this.buildOrderByClause(options, config);
        const selectClause = this.buildSelectClause(options);
        const limit = Math.min(
            options.limit || config.defaultLimit!,
            config.maxLimit!
        );

        const query = {
            ...selectClause,
            where: whereClause,
            orderBy: orderByClause,
            take: limit + 1, // Get one extra to check if there's a next page
            ...(options.cursor && { cursor: options.cursor }),
        };

        const cleanQuery = this.cleanQuery(query);
        const results = await delegate.findMany(cleanQuery);

        const hasNextPage = results.length > limit;
        const data = hasNextPage ? results.slice(0, -1) : results;
        const nextCursor = hasNextPage
            ? { id: results[results.length - 2].id }
            : undefined;

        return { data, nextCursor };
    }
}
