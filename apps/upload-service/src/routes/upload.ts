import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '@web-infra/shared';
import { UploadService } from '../services/uploadService';
import { UploadController } from '../controllers/uploadController';
import { validateUploadStatus, validateUploadChunk, validateMergeChunks } from '../validators/uploadValidator';

const upload = multer({
  dest: 'temp/',
  limits: {
    fileSize: Number(process.env.UPLOAD_MAX_SIZE || 50 * 1024 * 1024), // 50MB 默认
    files: 1,
  },
});

export function createUploadRouter(uploadService: UploadService): Router {
  const router = Router();
  const controller = new UploadController(uploadService);

  // 查询已上传分片（断点续传用）
  router.get('/upload/status', validateUploadStatus, asyncHandler(controller.getStatus));

  // 上传分片
  router.post('/upload', upload.single('file'), validateUploadChunk, asyncHandler(controller.uploadChunk));

  // 合并分片
  router.post('/upload/merge', validateMergeChunks, asyncHandler(controller.mergeChunks));

  return router;
}
