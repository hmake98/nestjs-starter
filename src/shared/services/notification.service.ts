import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import path from 'path';

@Injectable()
export class NotificationService {
  constructor() {
    if (!firebase.apps.length) {
      // firebase.initializeApp({
      //   credential: firebase.credential.cert(
      //     path.join(__dirname, '../../../firebase.config.json'),
      //   ),
      // });
    }
  }

  public sendMessage(
    token: string,
    message?: string,
    payload?: any,
  ): Promise<string> {
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
