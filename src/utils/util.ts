export const isDev = process.env.NODE_ENV === 'development' ? true : false;

export const isTest = process.env.NODE_ENV === 'test' ? true : false;

export const IS_PUBLIC_KEY = 'isPublic';

export const TEMPLATES = {
  FORGOT_PASSWORD: 'forgot-password',
  WELCOME: 'welcome',
};

export const Queues = {
  email: 'email',
  notification: 'notification',
};
