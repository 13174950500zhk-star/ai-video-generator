export type VideoStatus = 'queued' | 'processing' | 'succeeded' | 'failed';

export type CreateVideoParams = {
  prompt: string;
  style: string;
  aspectRatio: string;
};

export type CreateVideoResult = {
  taskId: string;
  status: VideoStatus;
};

export type VideoTaskResult = {
  taskId: string;
  status: VideoStatus;
  videoUrl?: string;
  error?: string;
};

export interface VideoProvider {
  createTask(params: CreateVideoParams): Promise<CreateVideoResult>;
  getTask(taskId: string): Promise<VideoTaskResult>;
}
