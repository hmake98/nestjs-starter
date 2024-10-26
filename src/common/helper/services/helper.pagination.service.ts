import { Injectable } from '@nestjs/common';

import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import {
    IPaginationParams,
    IPrismaQueryOptions,
    PrismaDelegate,
} from '../interfaces/pagination.interface';

@Injectable()
export class HelperPaginationService {
    async paginate<T>(
        delegate: PrismaDelegate,
        { page, limit }: IPaginationParams,
        options: IPrismaQueryOptions = {}
    ): Promise<ApiPaginatedDataDto<T>> {
        const skip = (page - 1) * limit;

        const [totalItems, items] = await Promise.all([
            delegate.count({
                where: options.where,
            }),
            delegate.findMany({
                ...options,
                take: limit,
                skip,
            }),
        ]);

        return {
            metadata: {
                totalItems,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
            items,
        };
    }
}
