import { randomUUID } from 'crypto';
import { CreateVideoParams, CreateVideoResult, VideoProvider, VideoTaskResult } from './types';

type InternalTask = {
  id: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  status: VideoTaskResult['status'];
  videoUrl?: string;
  error?: string;
  createdAt: number;
};

const store = new Map<string, InternalTask>();

export class GenericVideoProvider implements VideoProvider {
  constructor(private readonly apiKey: string, private readonly apiEndpoint: string) {}

  async createTask(params: CreateVideoParams): Promise<CreateVideoResult> {
    if (!this.apiKey || !this.apiEndpoint) {
      throw new Error('服务端缺少 VIDEO_API_KEY 或 VIDEO_API_ENDPOINT 配置。');
    }

    const id = randomUUID();
    store.set(id, {
      id,
      ...params,
      status: 'queued',
      createdAt: Date.now()
    });

    return { taskId: id, status: 'queued' };
  }

  async getTask(taskId: string): Promise<VideoTaskResult> {
    const task = store.get(taskId);
    if (!task) {
      return { taskId, status: 'failed', error: '任务不存在。' };
    }

    const elapsed = Date.now() - task.createdAt;
    if (task.status === 'queued' && elapsed > 2000) {
      task.status = 'processing';
    }

    if (task.status === 'processing' && elapsed > 6000) {
      task.status = 'succeeded';
      task.videoUrl = `${this.apiEndpoint.replace(/\/$/, '')}/mock-video/${task.id}.mp4`;
    }

    return {
      taskId: task.id,
      status: task.status,
      videoUrl: task.videoUrl,
      error: task.error
    };
  }
}
