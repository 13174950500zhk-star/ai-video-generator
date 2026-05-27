import { NextResponse } from 'next/server';
import { getVideoProvider } from '@/lib/video-providers';

export async function GET(_: Request, { params }: { params: { taskId: string } }) {
  try {
    const provider = getVideoProvider();
    const result = await provider.getTask(params.taskId);

    const statusCode = result.status === 'failed' ? 404 : 200;
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '查询视频任务失败。' },
      { status: 500 }
    );
  }
}
