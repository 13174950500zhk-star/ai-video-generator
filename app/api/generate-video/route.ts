import { NextRequest, NextResponse } from 'next/server';
import { getVideoProvider } from '@/lib/video-providers';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      prompt?: string;
      style?: string;
      aspectRatio?: string;
    };

    if (!body.prompt?.trim()) {
      return NextResponse.json({ error: '提示词不能为空。' }, { status: 400 });
    }

    const provider = getVideoProvider();
    const result = await provider.createTask({
      prompt: body.prompt,
      style: body.style ?? '写实',
      aspectRatio: body.aspectRatio ?? '16:9'
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '创建视频任务失败。' },
      { status: 500 }
    );
  }
}
