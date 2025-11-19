export const credentials = {
    createInsecure: jest.fn(),
    createSsl: jest.fn(),
};

export const Server = class MockServer {
    addService = jest.fn();
    bindAsync = jest.fn();
    start = jest.fn();
};

export const ServerCredentials = {
    createInsecure: jest.fn(),
    createSsl: jest.fn(),
};

export const loadPackageDefinition = jest.fn();

export const Client = class MockClient {
    constructor() {}
};

export default {
    credentials,
    Server,
    ServerCredentials,
    loadPackageDefinition,
    Client,
};
