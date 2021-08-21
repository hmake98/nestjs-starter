import { Posts } from '../../database/entities';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Posts)
export class PostRepository extends Repository<Posts> {}
