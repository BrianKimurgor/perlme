import { Response } from "express";

export interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    meta?: Record<string, any>;
    error?: any;
}

/**
 * Centralized Response Handler
 * Provides all common success and error response patterns.
 */
export class ResponseHandler {
    // ===== SUCCESS RESPONSES =====
    static ok<T>(
        res: Response,
        message = "Success",
        data?: T,
        meta?: Record<string, any>
    ): Response<ApiResponse<T>> {
        return this.send(res, 200, true, message, data, meta);
    }

    static created<T>(
        res: Response,
        message = "Created successfully",
        data?: T
    ): Response<ApiResponse<T>> {
        return this.send(res, 201, true, message, data);
    }

    static accepted<T>(
        res: Response,
        message = "Request accepted",
        data?: T
    ): Response<ApiResponse<T>> {
        return this.send(res, 202, true, message, data);
    }

    static noContent(res: Response, message = "No content") {
        return res.status(204).json({
            success: true,
            statusCode: 204,
            message,
        });
    }

    // ===== CLIENT ERRORS (4xx) =====
    static badRequest(res: Response, message = "Bad request", error?: any) {
        return this.send(res, 400, false, message, undefined, undefined, error);
    }

    static unauthorized(res: Response, message = "Unauthorized", error?: any) {
        return this.send(res, 401, false, message, undefined, undefined, error);
    }

    static paymentRequired(res: Response, message = "Payment required", error?: any) {
        return this.send(res, 402, false, message, undefined, undefined, error);
    }

    static forbidden(res: Response, message = "Forbidden", error?: any) {
        return this.send(res, 403, false, message, undefined, undefined, error);
    }

    static notFound(res: Response, message = "Not found", error?: any) {
        return this.send(res, 404, false, message, undefined, undefined, error);
    }

    static conflict(res: Response, message = "Conflict", error?: any) {
        return this.send(res, 409, false, message, undefined, undefined, error);
    }

    static gone(res: Response, message = "Resource gone", error?: any) {
        return this.send(res, 410, false, message, undefined, undefined, error);
    }

    static unprocessable(res: Response, message = "Unprocessable entity", error?: any) {
        return this.send(res, 422, false, message, undefined, undefined, error);
    }

    static tooManyRequests(res: Response, message = "Too many requests", error?: any) {
        return this.send(res, 429, false, message, undefined, undefined, error);
    }

    // ===== SERVER ERRORS (5xx) =====
    static internal(res: Response, message = "Internal server error", error?: any) {
        return this.send(res, 500, false, message, undefined, undefined, error);
    }

    static notImplemented(res: Response, message = "Not implemented", error?: any) {
        return this.send(res, 501, false, message, undefined, undefined, error);
    }

    static badGateway(res: Response, message = "Bad gateway", error?: any) {
        return this.send(res, 502, false, message, undefined, undefined, error);
    }

    static serviceUnavailable(res: Response, message = "Service unavailable", error?: any) {
        return this.send(res, 503, false, message, undefined, undefined, error);
    }

    static gatewayTimeout(res: Response, message = "Gateway timeout", error?: any) {
        return this.send(res, 504, false, message, undefined, undefined, error);
    }

    // ===== CORE METHOD =====
    private static send<T>(
        res: Response,
        statusCode: number,
        success: boolean,
        message: string,
        data?: T,
        meta?: Record<string, any>,
        error?: any
    ): Response<ApiResponse<T>> {
        return res.status(statusCode).json({
            success,
            statusCode,
            message,
            ...(data && { data }),
            ...(meta && { meta }),
            ...(error && { error }),
        });
    }
}
