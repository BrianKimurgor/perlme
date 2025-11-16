import cors from "cors";
import dotenv from 'dotenv';
import express, { Application } from 'express';
import helmet from 'helmet';
import { authRouter } from './Auth/Auth.route';
import { anyAuth } from './Middlewares/BearAuth';
import { checkUserActive } from './Middlewares/checkUserActivity';
import { logger } from './Middlewares/Logger';
import { rateLimiterMiddleware } from './Middlewares/rateLimiter';
import "./Middlewares/schedule";
import blockRouters from './Services/Block/block.routes';
import exploreRouter from './Services/Explore and Recommendations/exploreAndRecommend.routes';
import messageRouter from './Services/Messages/message.route';
import postRouter from './Services/posts/post.route';
import reportRouters from './Services/Reports/report.route';
import userRouters from './Services/Users/user.route';


dotenv.config();
console.log("🟢 Scheduler file loaded");

const app: Application = express();

// Basic Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiterMiddleware);
app.use(logger);
// ✅ Protected routes (require login + active account)
app.use("/api", anyAuth, checkUserActive); // 🔥 GLOBAL MIDDLEWARES


//import route
const PORT = process.env.PORT || 5000;

// ---------------------------- Public / Auth-Free Routes ----------------------------
app.use('/api', authRouter);

app.use('/api', userRouters);
app.use('/api/posts', postRouter)

// ---------------------------- Public / Auth-Free Routes ----------------------------
app.use('/api', authRouter);
app.use('/api/discover', exploreRouter);
app.use('/api/messages', messageRouter);

// ---------------------------- Protected Routes ----------------------------
app.use('/api', anyAuth, checkUserActive, userRouters);
app.use('/api', anyAuth, checkUserActive, postRouter);
app.use('/api', anyAuth, checkUserActive, blockRouters);
app.use('/api', anyAuth, checkUserActive, reportRouters)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

export default app;
