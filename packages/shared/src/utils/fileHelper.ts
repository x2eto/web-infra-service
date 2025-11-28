import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
export const MERGE_DIR = process.env.MERGE_DIR || path.join(__dirname, '../../merged');

// 确保目录存在
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
ensureDir(UPLOAD_DIR);
ensureDir(MERGE_DIR);

// 保存分片
export async function saveChunk(tempPath: string, fileHash: string, chunkIndex: number) {
  const chunkDir = path.join(UPLOAD_DIR, fileHash);
  ensureDir(chunkDir);

  const chunkPath = path.join(chunkDir, String(chunkIndex));
  // 使用异步 rename，保证同盘原子移动
  await fs.promises.rename(tempPath, chunkPath);
}

// 获取已上传的分片列表
export async function getUploadedChunks(fileHash: string): Promise<number[]> {
  const chunkDir = path.join(UPLOAD_DIR, fileHash);
  try {
    const files = await fs.promises.readdir(chunkDir);
    return files.map((filename) => Number(filename)).sort((a, b) => a - b);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: unknown }).code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

// 合并分片
export async function mergeChunks(fileHash: string, filename: string, totalChunks: number): Promise<string> {
  const chunkDir = path.join(UPLOAD_DIR, fileHash);
  const outputPath = path.join(MERGE_DIR, filename);
  const writeStream = fs.createWriteStream(outputPath);

  try {
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunkDir, String(i));

      await new Promise<void>((resolve, reject) => {
        const readStream = fs.createReadStream(chunkPath);

        readStream.pipe(writeStream, { end: false });

        readStream.on('end', () => {
          fs.promises
            .unlink(chunkPath) // 删除分片
            .then(() => resolve())
            .catch((err) => reject(err instanceof Error ? err : new Error(String(err))));
        });

        readStream.on('error', (err) => {
          readStream.destroy();
          reject(err);
        });
      });
    }

    writeStream.end();
    await fs.promises.rm(chunkDir, { recursive: true, force: true });
    return outputPath;
  } catch (err) {
    writeStream.end();
    throw err;
  }
}
