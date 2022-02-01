import { Posts } from '../../database/schemas/post.schema';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Posts)
export class PostRepository extends Repository<Posts> {}
