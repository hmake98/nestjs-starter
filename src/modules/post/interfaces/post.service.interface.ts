import { ApiGenericResponseDto, ApiPaginatedDataDto } from 'src/core/dtos/response.dto';

import { CreatePostDto } from '../dtos/create.post.dto';
import { GetPostsDto } from '../dtos/get.post.dto';
import {
  CreatePostResponseDto,
  PostResponseDto,
  UpdatePostResponseDto,
} from '../dtos/post.response.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';

export interface IPostService {
  create(userId: string, data: CreatePostDto): Promise<CreatePostResponseDto>;
  delete(userId: string, id: string): Promise<ApiGenericResponseDto>;
  getAll(params: GetPostsDto): Promise<ApiPaginatedDataDto<PostResponseDto>>;
  update(userId: string, id: string, data: UpdatePostDto): Promise<UpdatePostResponseDto>;
}
