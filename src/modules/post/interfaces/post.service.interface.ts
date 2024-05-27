import { GenericResponseDto } from 'src/core/dtos/response.dto';

import { CreatePostDto } from '../dtos/create.post.dto';
import { GetPostsDto } from '../dtos/get.post.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';
import {
  CreatePostResponseDto,
  GetPostsResponseDto,
  UpdatePostResponseDto,
} from '../dtos/post.response.dto';

export interface IPostService {
  create(userId: string, data: CreatePostDto): Promise<CreatePostResponseDto>;
  delete(id: string): Promise<GenericResponseDto>;
  getAll(params: GetPostsDto): Promise<GetPostsResponseDto>;
  update(id: string, data: UpdatePostDto): Promise<UpdatePostResponseDto>;
}
