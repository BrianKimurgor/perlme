import express, { Application,Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors"

import helmet from 'helmet';
import { logger } from './Middlewares/Logger';
import userRouters from './Services/Users/user.route';

dotenv.config();
console.log("🟢 Scheduler file loaded");

import "./Middlewares/schedule";
import { authRouter } from './Auth/Auth.route';

const app: Application = express();

// Basic Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

//default route
app.get('/', (req, res:Response) => {
    res.send("CISLU API is running");
});

//import route
const PORT = process.env.PORT || 5000;

app.use('/api', authRouter);
app.use('/api', userRouters);

// ---------------------------- Scheduler ----------------------------


// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});
export default app;
  