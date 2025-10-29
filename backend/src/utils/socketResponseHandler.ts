import { ExtendedError } from "socket.io";

export interface SocketResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    error?: any;
}

/**
 * A custom Socket error that still conforms to Socket.IO's ExtendedError.
 */
export class SocketResponseError<T = unknown>
    extends Error
    implements ExtendedError {
    public response: SocketResponse<T>;
    public data?: any;

    constructor(response: SocketResponse<T>) {
        super(response.message);
        this.name = "SocketResponseError";
        this.response = response;
        this.data = response;
    }
}

/**
 * Factory helper for consistent socket responses
 */
export class SocketResponseHandler {
    static ok<T>(message = "Success", data?: T): SocketResponse<T> {
        return this.format(200, true, message, data);
    }

    static created<T>(message = "Created successfully", data?: T): SocketResponse<T> {
        return this.format(201, true, message, data);
    }

    static badRequest(message = "Bad request", error?: any): SocketResponse {
        return this.format(400, false, message, undefined, error);
    }

    static unauthorized(message = "Unauthorized", error?: any): SocketResponse {
        return this.format(401, false, message, undefined, error);
    }

    static forbidden(message = "Forbidden", error?: any): SocketResponse {
        return this.format(403, false, message, undefined, error);
    }

    static notFound(message = "Not found", error?: any): SocketResponse {
        return this.format(404, false, message, undefined, error);
    }

    static internal(message = "Internal server error", error?: any): SocketResponse {
        return this.format(500, false, message, undefined, error);
    }

    static toError<T>(response: SocketResponse<T>): SocketResponseError<T> {
        return new SocketResponseError(response);
    }

    private static format<T>(
        statusCode: number,
        success: boolean,
        message: string,
        data?: T,
        error?: any
    ): SocketResponse<T> {
        return {
            success,
            statusCode,
            message,
            ...(data && { data }),
            ...(error && { error }),
        };
    }
}
