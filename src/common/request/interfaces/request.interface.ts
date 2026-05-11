import { type UserRole } from 'src/common/database/enums/role.enum';

export interface IAuthUser {
    userId: string;
    role: UserRole;
}

export interface IRequest {
    user: IAuthUser;
}
