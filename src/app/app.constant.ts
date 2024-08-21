export const RESPONSE_SERIALIZATION_META_KEY = 'ResponseSerializationMetaKey';

export const PUBLIC_ROUTE_KEY = 'PUBLIC';

export const HTTP_STATUS_MESSAGES_SWAGGER: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  206: 'Partial Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
};

export const EMAIL_TEMPLATE_SUBJECTS = {
  'welcome-email': 'Welcome to the service!',
};

export enum ENUM_FILE_ALLOWED {
  JPEG = 'jpeg',
  PNG = 'png',
}

export enum ENUM_BULL_QUEUES {
  EMAIL = 'email',
}

export enum ENUM_EMAIL_TEMPLATES {
  WELCOME_EMAIL = 'welcome-email',
}

export enum ENUM_FILE_STORE {
  USER_PROFILES = 'user-profiles',
  POST_IMAGES = 'post-images',
}
