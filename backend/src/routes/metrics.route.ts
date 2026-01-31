import { Router } from "express";
import { register } from "../metrics/metrics";
import { internalOnly } from "../Middlewares/internalOnly.middleware";

const router = Router();

router.get("/metrics", internalOnly, async (_req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

export default router;
