import { Exclude } from 'class-transformer';
import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { Posts } from './post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', unique: true })
  public email: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude({ toPlainOnly: true })
  public password: string;

  @Column({ type: 'varchar', nullable: true })
  public firstName: string;

  @Column({ type: 'varchar', nullable: true })
  public lastName: string;

  @Column({ type: 'varchar', nullable: true })
  public userProfile: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  public phone: string;

  @Column({ type: 'enum', enum: Role })
  public role: Role;

  @OneToMany(() => Posts, (post) => post.author)
  public posts: Posts[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
