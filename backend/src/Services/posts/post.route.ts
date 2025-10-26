import { Router } from "express";
import {commentOnPostController,createPostController,deletePostController,getAllPublicPostsController,getPostByIdController,likePostController,unlikePostController,} from "./post.controller";
import { authMiddleware } from "../../Middlewares/BearAuth";

const postRouter = Router();

postRouter.get("/", getAllPublicPostsController);
postRouter.get("/:postId", getPostByIdController);

postRouter.post("/", authMiddleware(), createPostController);
postRouter.delete("/:postId", authMiddleware(), deletePostController);

postRouter.post("/:postId/like", authMiddleware(), likePostController);
postRouter.delete("/:postId/like", authMiddleware(), unlikePostController);

postRouter.post("/:postId/comments", authMiddleware(), commentOnPostController);

export default postRouter;
