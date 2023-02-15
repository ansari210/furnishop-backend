declare namespace Express {
    export interface Request {
        user: any;
        io: any;
    }
    export interface Response {
        user: any;
    }
}

interface IActiveUser {
    socketId: string;
    orderId?: string;
}
