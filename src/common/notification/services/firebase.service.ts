import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private readonly firebaseAdmin: admin.app.App;

  constructor() {
    this.firebaseAdmin = admin.initializeApp();
  }

  async sendMessageToDevice(
    deviceToken: string,
    message: any,
  ): Promise<string> {
    return this.firebaseAdmin.messaging().send({
      token: deviceToken,
      data: {
        message,
      },
    });
  }

  async sendMessagesToDevices(
    deviceTokens: string[],
    message: any,
  ): Promise<string[]> {
    return Promise.all(
      deviceTokens.map((token) =>
        this.firebaseAdmin.messaging().send({
          token,
          data: {
            message,
          },
        }),
      ),
    );
  }
}
