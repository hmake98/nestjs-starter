import { Posts } from '@prisma/client';
import { CreatePostDto } from '../dtos/create.post.dto';
import {
  GetResponse,
  SuccessResponse,
} from 'src/core/interfaces/response.interface';
import { GetPostsDto } from '../dtos/get.post.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';

export interface IPostService {
  create(userId: string, data: CreatePostDto): Promise<Posts>;
  delete(id: string): Promise<SuccessResponse>;
  getAll(params: GetPostsDto): Promise<GetResponse<Posts>>;
  update(id: string, data: UpdatePostDto): Promise<Posts>;
}
