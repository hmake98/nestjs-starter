export interface IPaginationOptions {
    page?: number;
    limit?: number;
    skip?: number;
    take?: number;
}

export interface ISearchOptions {
    searchFields?: string[];
    searchQuery?: string;
    searchMode?: 'insensitive' | 'default';
}

export interface IFilterOptions {
    filters?: Record<string, any>;
    dateFilters?: {
        field: string;
        from?: string | Date;
        to?: string | Date;
    }[];
    rangeFilters?: {
        field: string;
        min?: number;
        max?: number;
    }[];
    enumFilters?: {
        field: string;
        values: string[];
    }[];
}

export interface ISortOptions {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface ISelectOptions {
    select?: Record<string, boolean>;
    include?: Record<string, boolean | object>;
}

export interface IQueryOptions
    extends IPaginationOptions,
        ISearchOptions,
        IFilterOptions,
        ISortOptions,
        ISelectOptions {
    distinct?: string[];
    cursor?: Record<string, any>;
}

export interface IPrismaQueryResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface IPrismaQueryBuilderOptions {
    defaultLimit?: number;
    maxLimit?: number;
    allowedSortFields?: string[];
    allowedFilterFields?: string[];
    allowedSearchFields?: string[];
}
