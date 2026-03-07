import pinoHttp from "pino-http";
import { pinoLogger } from "../utils/logger";

export const httpLogger = pinoHttp({
    logger: pinoLogger,
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
