import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';
import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import { PostCreateDto } from '../dtos/request/post.create.request';
import { PostGetDto } from '../dtos/request/post.get.request';
import { PostUpdateDto } from '../dtos/request/post.update.request';
import {
    PostCreateResponseDto,
    PostResponseDto,
    PostUpdateResponseDto,
} from '../dtos/response/post.response';

export interface IPostService {
    create(userId: string, data: PostCreateDto): Promise<PostCreateResponseDto>;
    delete(userId: string, id: string): Promise<ApiGenericResponseDto>;
    getAll(params: PostGetDto): Promise<ApiPaginatedDataDto<PostResponseDto>>;
    update(
        userId: string,
        id: string,
        data: PostUpdateDto
    ): Promise<PostUpdateResponseDto>;
}
