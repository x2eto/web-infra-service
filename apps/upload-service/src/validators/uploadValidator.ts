import type { RequestHandler } from 'express';
import type { UploadStatusQuery, UploadChunkBody, MergeChunksBody } from '@web-infra/shared';
import path from 'path';

export const validateUploadStatus: RequestHandler<Record<string, any>, any, any, UploadStatusQuery> = (
  req,
  res,
  next,
) => {
  const { fileHash } = req.query;
  if (!fileHash || typeof fileHash !== 'string') {
    return res.status(400).json({ error: 'fileHash 参数是必需的' });
  }
  // 验证 fileHash 格式（只允许字母数字）
  if (!/^[a-zA-Z0-9]+$/.test(fileHash)) {
    return res.status(400).json({ error: 'fileHash 格式不正确' });
  }
  next();
};

export const validateUploadChunk: RequestHandler<Record<string, any>, any, UploadChunkBody, any> = (req, res, next) => {
  const { fileHash, chunkIndex } = req.body;
  if (!fileHash || chunkIndex === undefined) {
    return res.status(400).json({ error: 'fileHash 和 chunkIndex 参数是必需的' });
  }
  if (!req.file) {
    return res.status(400).json({ error: '文件是必需的' });
  }
  // 验证 fileHash 和 chunkIndex
  if (!/^[a-zA-Z0-9]+$/.test(fileHash)) {
    return res.status(400).json({ error: 'fileHash 格式不正确' });
  }
  const index = Number(chunkIndex);
  if (isNaN(index) || index < 0) {
    return res.status(400).json({ error: 'chunkIndex 必须是非负整数' });
  }
  next();
};

export const validateMergeChunks: RequestHandler<Record<string, any>, any, MergeChunksBody, any> = (req, res, next) => {
  const { fileHash, filename, totalChunks } = req.body;
  if (!fileHash || !filename || !totalChunks) {
    return res.status(400).json({ error: 'fileHash、filename 和 totalChunks 参数是必需的' });
  }
  // 验证 fileHash
  if (!/^[a-zA-Z0-9]+$/.test(fileHash)) {
    return res.status(400).json({ error: 'fileHash 格式不正确' });
  }
  // 验证文件名安全性
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);
  if (!/^[a-zA-Z0-9._-]+$/.test(basename) || ext.length > 10) {
    return res.status(400).json({ error: '文件名格式不正确' });
  }
  // 验证 totalChunks
  const total = Number(totalChunks);
  if (isNaN(total) || total <= 0 || total > 10000) {
    return res.status(400).json({ error: 'totalChunks 必须是 1-10000 之间的整数' });
  }
  next();
};
