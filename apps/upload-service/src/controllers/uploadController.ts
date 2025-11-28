import type { Request, Response } from 'express';
import type {
  UploadStatusQuery,
  UploadChunkBody,
  MergeChunksBody,
  UploadStatusResponse,
  UploadChunkResponse,
  MergeChunksResponse,
} from '@web-infra/shared';
import { UploadService } from '../services/uploadService';

export class UploadController {
  private readonly service: UploadService;

  constructor(service: UploadService) {
    this.service = service;
  }

  /**
   * 获取断点续传的上传状态
   * @param req - 包含 fileHash 查询参数的请求对象
   * @param res - 用于发送上传状态的响应对象
   */
  getStatus = async (
    req: Request<Record<string, any>, UploadStatusResponse, Record<string, any>, UploadStatusQuery>,
    res: Response,
  ) => {
    const { fileHash } = req.query;
    const result = await this.service.getUploadStatus(fileHash!);
    res.json(result);
  };

  /**
   * 上传文件分片
   * @param req - 包含分片数据的请求对象
   * @param res - 用于发送上传结果的响应对象
   */
  uploadChunk = async (req: Request<Record<string, any>, UploadChunkResponse, UploadChunkBody>, res: Response) => {
    const { fileHash, chunkIndex } = req.body;
    const filePath = req.file!.path;

    const result = await this.service.uploadChunk(filePath, fileHash, Number(chunkIndex));
    res.json(result);
  };

  /**
   * 将已上传的分片合并为最终文件
   * @param req - 包含合并参数的请求对象
   * @param res - 用于发送合并结果的响应对象
   */
  mergeChunks = async (req: Request<Record<string, any>, MergeChunksResponse, MergeChunksBody>, res: Response) => {
    const { fileHash, filename, totalChunks } = req.body;

    try {
      const result = await this.service.mergeFileChunks(fileHash, filename, Number(totalChunks));
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: '合并失败',
        details: error instanceof Error ? error.message : error,
      });
    }
  };
}
