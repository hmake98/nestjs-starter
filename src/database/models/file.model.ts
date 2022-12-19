import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  UpdatedAt,
  CreatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class File extends Model {
  @Column({ type: DataTypes.STRING })
  name: string;

  @Column({ type: DataTypes.STRING })
  link: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @ForeignKey(() => User)
  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  author_id: number;

  @BelongsTo(() => User)
  user: User;
}
