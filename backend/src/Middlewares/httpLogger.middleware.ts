import pinoHttp from "pino-http";
import { logger } from "../utils/logger";

export const httpLogger = pinoHttp({
    logger,
    customProps: (req) => ({
        requestId: (req as any).requestId,
    }),
    serializers: {
        req(req) {
            return {
                method: req.method,
                url: req.url,
                remoteAddress: req.socket.remoteAddress,
            };
        },
    },
});
