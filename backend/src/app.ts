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
import messageRouter from './Services/Messages/message.route';
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
// ✅ Protected routes (require login + active account)
app.use("/api", anyAuth, checkUserActive); // 🔥 GLOBAL MIDDLEWARES


//import route
const PORT = process.env.PORT || 5000;

app.use('/api', authRouter);
app.use('/api', userRouters);
app.use('/api/posts', postRouter)
app.use('/api', messageRouter);

// ---------------------------- Scheduler ----------------------------

// ---------------------------- Protected Routes ----------------------------
app.use('/api', anyAuth, checkUserActive, userRouters);
app.use('/api', anyAuth, checkUserActive, postRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

export default app;
