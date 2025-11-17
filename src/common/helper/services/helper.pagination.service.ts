import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import {
    IPaginationParams,
    IPrismaQueryOptions,
    PrismaDelegate,
} from '../interfaces/pagination.interface';
import { IHelperPaginationService } from '../interfaces/pagination.service.interface';

/**
 * Simple pagination service for Prisma queries
 *
 * Usage:
 * ```typescript
 * const result = await this.paginationService.paginate(
 *   this.databaseService.user,
 *   { page: 1, limit: 10 },
 *   {
 *     where: { role: 'USER' },
 *     include: { posts: true },
 *     orderBy: { createdAt: 'desc' }
 *   }
 * );
 * ```
 */
@Injectable()
export class HelperPaginationService implements IHelperPaginationService {
    private readonly DEFAULT_LIMIT = 10;
    private readonly MAX_LIMIT = 100;

    constructor(private readonly logger: PinoLogger) {
        this.logger.setContext(HelperPaginationService.name);
    }

    /**
     * Paginate Prisma query results
     *
     * @param delegate - Prisma model delegate (e.g., databaseService.user)
     * @param params - Pagination parameters (page, limit)
     * @param options - Prisma query options (where, include, orderBy, etc.)
     * @returns Paginated results with metadata
     */
    async paginate<T>(
        delegate: PrismaDelegate,
        { page = 1, limit = this.DEFAULT_LIMIT }: IPaginationParams,
        options: IPrismaQueryOptions = {}
    ): Promise<ApiPaginatedDataDto<T>> {
        // Validate and sanitize inputs
        const currentPage = Math.max(1, page);
        const itemsPerPage = Math.min(Math.max(1, limit), this.MAX_LIMIT);
        const skip = (currentPage - 1) * itemsPerPage;

        try {
            // Execute count and fetch in parallel for better performance
            const [totalItems, items] = await Promise.all([
                delegate.count({
                    where: options.where,
                }),
                delegate.findMany({
                    ...options,
                    take: itemsPerPage,
                    skip,
                }),
            ]);

            const totalPages = Math.ceil(totalItems / itemsPerPage);

            return {
                metadata: {
                    totalItems,
                    itemsPerPage,
                    totalPages,
                    currentPage,
                },
                items,
            };
        } catch (error) {
            this.logger.error(`Pagination failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Simple helper to build search conditions for multiple fields
     *
     * @param searchQuery - Search term
     * @param fields - Fields to search in
     * @returns Prisma OR condition
     */
    buildSearchCondition(
        searchQuery: string,
        fields: string[]
    ): { OR: Array<Record<string, any>> } | null {
        if (!searchQuery || !fields.length) {
            return null;
        }

        return {
            OR: fields.map(field => ({
                [field]: {
                    contains: searchQuery,
                    mode: 'insensitive',
                },
            })),
        };
    }
}
