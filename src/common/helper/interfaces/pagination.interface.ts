export interface IPaginationParams {
    page: number;
    limit: number;
}

export interface IPrismaQueryOptions<WhereType = any> {
    where?: WhereType;
    include?: Record<string, boolean | object>;
    orderBy?: Record<string, 'asc' | 'desc'>;
}

export type PrismaDelegate = {
    count: (args: any) => Promise<number>;
    findMany: (args: any) => Promise<any[]>;
};
