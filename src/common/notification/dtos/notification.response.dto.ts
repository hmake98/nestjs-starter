import { ApiProperty } from '@nestjs/swagger';
import {
  $Enums,
  Notification,
  NotificationRecipients,
  Prisma,
  Users,
} from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IGetResponse } from 'src/core/interfaces/response.interface';

export class UserDto implements Users {
  avatar_id: string;
  created_at: Date;
  deleted_at: Date;
  email: string;
  first_name: string;
  id: string;
  is_deleted: boolean;
  is_verified: boolean;
  last_name: string;
  password: string;
  phone: string;
  role: $Enums.Roles;
  updated_at: Date;
}

export class RecipientsDto implements NotificationRecipients {
  created_at: Date;
  id: string;
  updated_at: Date;

  @Transform(({ value }) => value.user)
  @Type(() => UserDto)
  user: UserDto;

  @Exclude()
  notification_id: string;

  @Exclude()
  users_id: string;
}

export class NotificationDto implements Notification {
  body: string;
  created_at: Date;
  deleted_at: Date;
  id: string;
  is_deleted: boolean;
  payload: Prisma.JsonValue;
  sender_id: string;
  title: string;
  updated_at: Date;
  type: $Enums.NotificationType;

  @Transform(({ value }) => value.sender)
  @Type(() => UserDto)
  sender: UserDto;

  recipients: RecipientsDto[];
}

export class NotificationCreateResponseDto extends NotificationDto {}

export class NotificationGetResponseDto
  implements IGetResponse<NotificationDto>
{
  @ApiProperty({
    example: 10,
    required: true,
    nullable: false,
  })
  @Expose()
  count: number;

  @ApiProperty({
    example: NotificationDto,
    required: true,
  })
  @Expose()
  data: NotificationDto[];
}
