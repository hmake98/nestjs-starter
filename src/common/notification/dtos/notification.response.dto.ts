import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  $Enums,
  Notification,
  NotificationRecipients,
  Prisma,
} from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { IGetResponse } from 'src/core/interfaces/response.interface';
import { UserResponseDto } from 'src/modules/user/dtos/user.response.dto';

export class RecipientsDto implements NotificationRecipients {
  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  id: string;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  @Type(() => UserResponseDto)
  @ValidateNested()
  user: UserResponseDto;

  @ApiHideProperty()
  @Exclude()
  notification_id: string;

  @ApiHideProperty()
  @Exclude()
  users_id: string;
}

export class NotificationResponseDto implements Notification {
  @ApiProperty()
  body: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  deleted_at: Date;

  @ApiProperty()
  id: string;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  payload: Prisma.JsonValue;

  @ApiProperty()
  sender_id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  type: $Enums.NotificationTypes;

  @ApiProperty()
  @Type(() => UserResponseDto)
  @ValidateNested()
  sender: UserResponseDto;

  recipients: RecipientsDto[];
}

export class NotificationCreateResponseDto extends NotificationResponseDto {}

export class NotificationGetResponseDto
  implements IGetResponse<NotificationResponseDto>
{
  @ApiProperty({
    example: 10,
    required: true,
    nullable: false,
  })
  @Expose()
  count: number;

  @ApiProperty({
    example: NotificationResponseDto,
    required: true,
  })
  @Type(() => NotificationResponseDto)
  @ValidateNested()
  data: NotificationResponseDto[];
}
