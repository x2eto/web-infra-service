import fs from 'fs';
import path from 'path';
import { mergeLimiter } from '../limiter';
import { MERGE_DIR, UPLOAD_DIR, getUploadedChunks, saveChunk } from '@web-infra/shared';
import type { UploadStatusResponse, UploadChunkResponse, MergeChunksResponse } from '@web-infra/shared';

export class UploadService {
  /**
   * 获取指定文件哈希的已上传分片列表
   * @param fileHash - 文件哈希值
   * @returns 包含已上传分片索引列表的对象
   */
  async getUploadStatus(fileHash: string): Promise<UploadStatusResponse> {
    const uploadedChunks = await getUploadedChunks(fileHash);
    return { uploadedChunks };
  }

  /**
   * 保存文件分片
   * @param filePath - 临时文件路径
   * @param fileHash - 文件哈希值
   * @param chunkIndex - 分片索引
   * @returns 表示成功和分片索引的对象
   */
  async uploadChunk(filePath: string, fileHash: string, chunkIndex: number): Promise<UploadChunkResponse> {
    await saveChunk(filePath, fileHash, chunkIndex);
    return { success: true, chunkIndex };
  }

  /**
   * 将所有分片合并为单个文件
   * @param fileHash - 文件哈希值
   * @param filename - 期望的文件名
   * @param totalChunks - 总分片数
   * @returns 表示成功和最终文件路径的对象
   */
  async mergeFileChunks(fileHash: string, filename: string, totalChunks: number): Promise<MergeChunksResponse> {
    try {
      const safeName = this.sanitizeFilename(filename);
      const chunkDir = path.join(UPLOAD_DIR, fileHash);
      const finalPath = path.join(MERGE_DIR, safeName);
      const tempPath = `${finalPath}.tmp`;

      await fs.promises.mkdir(MERGE_DIR, { recursive: true });

      // 以受控并发方式顺序写入，确保顺序正确（单 writer）
      const writeStream = fs.createWriteStream(tempPath);

      try {
        for (let i = 0; i < totalChunks; i++) {
          const chunkPath = path.join(chunkDir, String(i));
          await mergeLimiter(async () => {
            await new Promise<void>((resolve, reject) => {
              const readStream = fs.createReadStream(chunkPath);
              readStream.on('error', reject);
              readStream.on('end', resolve);
              readStream.pipe(writeStream, { end: false });
            });
          });
          await fs.promises.unlink(chunkPath);
        }
        writeStream.end();
        await fs.promises.rename(tempPath, finalPath);
        await fs.promises.rm(chunkDir, { recursive: true, force: true });
      } catch (err) {
        writeStream.end();
        // 清理临时文件
        try {
          await fs.promises.unlink(tempPath);
        } catch {
          // ignore
        }
        throw err;
      }

      const filePath = finalPath;
      return { success: true, filePath };
    } catch (error) {
      throw new Error(`合并失败: ${String(error)}`);
    }
  }

  private sanitizeFilename(name: string): string {
    // 去除路径分隔符与上级目录
    const base = path.basename(name).replace(/[\\/:*?"<>|]+/g, '_');
    return base || 'merged-file';
  }
}
