import { Router } from "express";
import {commentOnPostController,createPostController,deletePostController,getAllPublicPostsController,getPostByIdController,getPostsByUserController,likePostController,unlikePostController, updatePostController,} from "./post.controller";
import { authMiddleware } from "../../Middlewares/BearAuth";

const postRouter = Router();

postRouter.get("/", authMiddleware(),getAllPublicPostsController);
postRouter.get("/:postId",authMiddleware(), getPostByIdController);

postRouter.post("/", authMiddleware(), createPostController);
postRouter.get("/user/:userId", authMiddleware(), getPostsByUserController);
postRouter.patch("/:postId", authMiddleware(), updatePostController);
postRouter.delete("/:postId", authMiddleware(), deletePostController);

postRouter.post("/posts/:postId/comments", authMiddleware(), commentOnPostController);

export default postRouter;
