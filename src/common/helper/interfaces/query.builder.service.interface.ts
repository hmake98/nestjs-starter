import {
    IPrismaQueryBuilderOptions,
    IPrismaQueryResult,
    IQueryOptions,
} from './query.builder.interface';

type PrismaDelegate = {
    count: (args?: any) => Promise<number>;
    findMany: (args?: any) => Promise<any[]>;
};

export interface IHelperPrismaQueryBuilderService {
    /**
     * Build and execute a dynamic Prisma query
     *
     * @param delegate - Prisma model delegate
     * @param options - Query options (pagination, search, filters, etc.)
     * @param builderOptions - Query builder configuration
     * @returns Paginated results with metadata
     */
    buildQuery<T>(
        delegate: PrismaDelegate,
        options: IQueryOptions,
        builderOptions?: Partial<IPrismaQueryBuilderOptions>
    ): Promise<IPrismaQueryResult<T>>;

    /**
     * Build query for cursor-based pagination
     *
     * @param delegate - Prisma model delegate
     * @param options - Query options with optional cursor
     * @param builderOptions - Query builder configuration
     * @returns Results with next cursor if available
     */
    buildCursorQuery<T>(
        delegate: PrismaDelegate,
        options: IQueryOptions & { cursor?: Record<string, any> },
        builderOptions?: Partial<IPrismaQueryBuilderOptions>
    ): Promise<{ data: T[]; nextCursor?: Record<string, any> }>;
}
