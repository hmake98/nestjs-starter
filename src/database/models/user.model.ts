import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
    @Column
    name: string;

    @Column
    age: number;

    @Column
    breed: string;
}

export const userProviders = [
    {
        provide: 'USER_REPOSITORY',
        useValue: User,
    },
];