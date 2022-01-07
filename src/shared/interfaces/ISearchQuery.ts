import { Role } from 'src/database/entities';
import { FindOperator } from 'typeorm';

export interface ISearchQuery {
  order: {
    [field: string]: string;
  };
  take: number;
  skip: number;
  where: {
    role: Role;
    email?: FindOperator<string>;
  };
}
