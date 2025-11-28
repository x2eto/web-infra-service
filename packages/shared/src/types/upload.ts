export interface UploadStatusQuery {
  fileHash?: string;
}

export interface UploadChunkBody {
  fileHash: string;
  chunkIndex: string | number;
}

export interface MergeChunksBody {
  fileHash: string;
  filename: string;
  totalChunks: string | number;
}

export interface UploadStatusResponse {
  uploadedChunks: number[];
}

export interface UploadChunkResponse {
  success: boolean;
  chunkIndex: number;
}

export interface MergeChunksResponse {
  success: boolean;
  filePath: string;
}
