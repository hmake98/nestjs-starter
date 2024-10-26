import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import {
    IPaginationParams,
    IPrismaQueryOptions,
    PrismaDelegate,
} from './pagination.interface';

export interface IHelperPaginationService {
    paginate<T>(
        delegate: PrismaDelegate,
        params: IPaginationParams,
        options?: IPrismaQueryOptions
    ): Promise<ApiPaginatedDataDto<T>>;
}
