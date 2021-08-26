import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import * as firebase from 'firebase-admin';

@Injectable()
export class NotificationService {
  constructor(private readonly configService: ConfigService) {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        credential: firebase.credential.cert(this.configService.get('firebase')),
      });
    }
  }

  public sendMessage(token: string, message?: string, payload?: any): Promise<string> {
    return firebase.messaging().send({
      token,
      notification: {
        body: message,
      },
      data: payload,
    });
  }

  public async multiCastMessage(
    tokens: [],
    message?: string,
    payload?: any,
  ): Promise<firebase.messaging.BatchResponse> {
    return firebase.messaging().sendMulticast({
      tokens,
      notification: {
        body: message,
      },
      data: payload,
    });
  }
}
