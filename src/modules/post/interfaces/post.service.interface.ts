import { Posts } from '@prisma/client';
import { CreatePostDto } from '../dtos/create.post.dto';
import { IGetResponse } from 'src/core/interfaces/response.interface';
import { GetPostsDto } from '../dtos/get.post.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';

export interface IPostService {
  create(userId: string, data: CreatePostDto): Promise<Posts>;
  delete(id: string): Promise<Posts>;
  getAll(params: GetPostsDto): Promise<IGetResponse<Posts>>;
  update(id: string, data: UpdatePostDto): Promise<Posts>;
}
