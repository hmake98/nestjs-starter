// Http messages for Swagger docs
export const HTTP_STATUS_MESSAGES_SWAGGER: Record<number, string> = {
    // Success
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    204: 'No Content',
    206: 'Partial Content',

    // Error
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

// Response key serialization
export const DOC_RESPONSE_SERIALIZATION_META_KEY =
    'ResponseSerializationMetaKey';
