import { Request, Response, Router } from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "../../Middlewares/BearAuth";
import { ResponseHandler } from "../../utils/responseHandler";

const uploadRouter = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, uniqueName);
    },
});

// File filter: only allow images and videos
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/webm",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max per file
        files: 5, // Max 5 files at once
    },
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload media files (images/videos)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: No files provided or invalid file type
 */
uploadRouter.post(
    "/upload",
    authMiddleware(),
    (req: Request, res: Response, next) => {
        upload.array("files", 5)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return ResponseHandler.badRequest(res, "File too large. Maximum size is 50MB");
                }
                if (err.code === "LIMIT_FILE_COUNT") {
                    return ResponseHandler.badRequest(res, "Too many files. Maximum is 5");
                }
                return ResponseHandler.badRequest(res, err.message);
            }
            if (err) {
                return ResponseHandler.badRequest(res, err.message);
            }
            next();
        });
    },
    (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return ResponseHandler.badRequest(res, "No files provided");
        }

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const uploaded = files.map((file) => ({
            url: `${baseUrl}/uploads/${file.filename}`,
            type: file.mimetype.startsWith("video/") ? "video" : "image",
            originalName: file.originalname,
            size: file.size,
        }));

        return ResponseHandler.ok(res, "Files uploaded successfully", uploaded);
    }
);

export default uploadRouter;
