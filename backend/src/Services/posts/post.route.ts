import { Router } from "express";
import {commentOnPostController,createPostController,deletePostController,getAllPublicPostsController,getPostByIdController,getPostsByUserController,likePostController,unlikePostController, updatePostController,} from "./post.controller";
import { authMiddleware } from "../../Middlewares/BearAuth";

const postRouter = Router();

postRouter.get("/posts", getAllPublicPostsController);
postRouter.get("/posts/:postId", getPostByIdController);
postRouter.post("/posts", authMiddleware(), createPostController);
postRouter.delete("/posts/:postId", authMiddleware(), deletePostController);

postRouter.post("/posts/:postId/like", authMiddleware(), likePostController);
postRouter.delete("/posts/:postId/like", authMiddleware(), unlikePostController);

postRouter.post("/posts/:postId/comments", authMiddleware(), commentOnPostController);

export default postRouter;
