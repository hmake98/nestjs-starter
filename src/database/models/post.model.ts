import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  BelongsTo,
  UpdatedAt,
  CreatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Post extends Model {
  @Column({ type: DataTypes.STRING })
  title: string;

  @Column({ type: DataTypes.STRING })
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  author_id: number;

  @BelongsTo(() => User)
  author: User;
}
