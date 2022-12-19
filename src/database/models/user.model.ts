import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  HasMany,
  HasOne,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Role } from 'src/shared';
import { File } from './file.model';
import { Post } from './post.model';

@Table
export class User extends Model {
  @Column({ type: DataTypes.STRING })
  first_name: string;

  @Column({ type: DataTypes.STRING })
  last_name: string;

  @Column({
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  password: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @Column({
    type: DataTypes.ENUM(...Object.values(Role)),
    allowNull: false,
  })
  role: Role;

  @HasMany(() => Post)
  posts: Post[];

  @HasOne(() => File)
  profile: File;
}
