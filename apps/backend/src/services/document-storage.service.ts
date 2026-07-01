import { env } from '../config/env';
import { storageClient } from '../config/storage';
import { AppError } from '../utils/app-error';

interface UploadInput {
  buffer: Buffer;
  mimeType: string;
  storagePath: string;
}

interface StorageUploadResult {
  storage_provider: string;
  storage_path: string;
}

export class DocumentStorageService {
  constructor(
    private readonly clientFactory = storageClient,
    private readonly bucketName = env.STORAGE_BUCKET_NAME,
  ) {}

  async ensureBucket(): Promise<void> {
    const client = this.clientFactory();
    const { error } = await client.storage.createBucket(this.bucketName, {
      public: false,
    });

    if (error && !this.isExistingBucketError(error.message)) {
      throw new AppError('Unable to create storage bucket', 500);
    }
  }

  async upload(input: UploadInput): Promise<StorageUploadResult> {
    const client = this.clientFactory();
    const { error } = await client.storage.from(this.bucketName).upload(input.storagePath, input.buffer, {
      contentType: input.mimeType,
      upsert: false,
    });

    if (error) {
      throw new AppError('Unable to upload document', 500);
    }

    return {
      storage_provider: 'database',
      storage_path: input.storagePath,
    };
  }

  async createSignedDownloadUrl(storagePath: string): Promise<string> {
    const client = this.clientFactory();
    const { data, error } = await client.storage.from(this.bucketName).createSignedUrl(storagePath, 60);

    if (error || !data?.signedUrl) {
      throw new AppError('Unable to create document download URL', 500);
    }

    return data.signedUrl;
  }

  async deletePhysicalFile(storagePath: string): Promise<void> {
    const client = this.clientFactory();
    const { error } = await client.storage.from(this.bucketName).remove([storagePath]);

    if (error) {
      throw new AppError('Unable to remove document from storage', 500);
    }
  }

  private isExistingBucketError(message: string) {
    return message.toLowerCase().includes('already') || message.toLowerCase().includes('exists');
  }
}
