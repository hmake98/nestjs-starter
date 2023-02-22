export const isDev = process.env.NODE_ENV === 'development' ? true : false;

export const isTest = process.env.NODE_ENV === 'test' ? true : false;

export const statusMessages = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'NonAuthoritativeInfo',
  204: 'NoContent',
  205: 'ResetContent',
  206: 'PartialContent',
};

export const TEMPLATES = {
  FORGOT_PASSWORD: 'forgot-password',
  WELCOME: 'welcome',
};

export const IS_PUBLIC_KEY = 'isPublic';

export const Queues = {
  email: 'email',
  notification: 'notification',
};
