export class WebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;

    readyState = WebSocket.OPEN;
    url = '';

    constructor(url?: string) {
        if (url) {
            this.url = url;
        }
    }

    send = jest.fn();
    close = jest.fn();
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
}

export class WebSocketServer {
    clients = new Set();

    constructor() {}

    on = jest.fn();
    close = jest.fn();
    handleUpgrade = jest.fn();
}

export default WebSocket;
