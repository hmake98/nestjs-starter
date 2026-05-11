# Firebase Plugin

Firebase Admin SDK for push notifications (FCM), Firestore access, Firebase Auth verification, and Remote Config. Use when your mobile/web clients already use Firebase.

## Packages

```bash
npm install firebase-admin
```

## Environment Variables

```
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

`FIREBASE_PRIVATE_KEY` must retain literal `\n` characters in the `.env` file.

## Module Structure

### `src/app/config/firebase.config.ts`

```typescript
registerAs('firebase', () => ({
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  // Replace escaped \n with real newlines (env vars flatten them)
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
}))
```

### `src/common/firebase/firebase.module.ts`

Standard NestJS module (mark `@Global()` — `FirebaseService` is used across many feature modules).
Register `ConfigModule.forFeature(firebaseConfig)`.
Provide and export: `FirebaseService`.

### `src/common/firebase/services/firebase.service.ts`

Key implementation details:
- Import `* as admin from 'firebase-admin'` and `App` from `firebase-admin/app`
- In `onModuleInit`: call `admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) })`; store the app as `private app`
- Guard against double-initialization: check `admin.apps.length` before calling `initializeApp`
- Expose:
  - `sendPushNotification(token: string, title: string, body: string, data?: Record<string, string>): Promise<string>` — sends FCM notification, returns message ID
  - `sendMulticast(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<admin.messaging.BatchResponse>`
  - `verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken>` — for validating Firebase Auth tokens on protected endpoints

### `src/common/firebase/interfaces/firebase.interface.ts`

```typescript
export interface IPushNotificationOptions {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}
```

## CommonModule Wiring

Import `FirebaseModule` in `src/common/common.module.ts` and add to `exports`.

## Usage Example

```typescript
constructor(private readonly firebase: FirebaseService) {}

async notifyUser(fcmToken: string, message: string): Promise<void> {
  await this.firebase.sendPushNotification(
    fcmToken,
    'New notification',
    message,
    { type: 'info' },
  );
}

// Verifying a Firebase ID token (e.g., in a custom guard):
const decodedToken = await this.firebase.verifyIdToken(bearerToken);
```

## Notes

- Download the service account JSON from Firebase Console → Project Settings → Service Accounts → Generate new private key
- The `FIREBASE_PRIVATE_KEY` contains literal `\n` characters that must be preserved when copied to `.env`
- For FCM, store the device FCM token on the `User` model (add a Prisma migration for `fcmToken String?`)
- `admin.apps.length` check prevents `FirebaseApp named "[DEFAULT]" already exists` errors during hot reload in dev
