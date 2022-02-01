import { Schema } from 'mongoose';
import { Role } from 'src/database/schemas/role.schema';

export interface GenerateToken {
  _id?: Schema.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
