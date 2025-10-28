import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import helmet from 'helmet';
import { logger } from './Middlewares/Logger';
import userRouters from './Services/Users/user.route';
import "./Middlewares/schedule";
import { authRouter } from './Auth/Auth.route';
import { anyAuth } from './Middlewares/BearAuth';
import { checkUserActive } from './Middlewares/checkUserActivity';
import postRouter from './Services/posts/post.route';
import exploreRouter from './Services/Explore and Recommendations/exploreAndRecommend.routes';

dotenv.config();
console.log("🟢 Scheduler file loaded");

const app: Application = express();

// Basic Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// ---------------------------- Public / Auth-Free Routes ----------------------------
app.use('/api', authRouter);
app.use('/api/discover', exploreRouter); // ✅ public + optional auth handled internally

// ---------------------------- Protected Routes ----------------------------
app.use('/api', anyAuth, checkUserActive, userRouters);
app.use('/api', anyAuth, checkUserActive, postRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

export default app;
