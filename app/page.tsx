'use client';

import { useMemo, useState } from 'react';

type VideoTaskStatus = 'queued' | 'processing' | 'succeeded' | 'failed';

type GenerateResponse = {
  taskId: string;
  status: VideoTaskStatus;
};

type TaskResponse = {
  taskId: string;
  status: VideoTaskStatus;
  videoUrl?: string;
  error?: string;
};

const styles = ['写实', '电影感', '电商广告', '产品展示', '短视频封面'];
const aspectRatios = ['16:9', '9:16', '1:1'];

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(styles[0]);
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0]);
  const [status, setStatus] = useState<VideoTaskStatus | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isGenerating = status === 'queued' || status === 'processing';
  const buttonText = useMemo(() => {
    if (status === 'queued') return '任务排队中...';
    if (status === 'processing') return '视频生成中...';
    return '生成视频';
  }, [status]);

  const pollTask = async (id: string) => {
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const res = await fetch(`/api/generate-video/${id}`);
      const data = (await res.json()) as TaskResponse;

      if (!res.ok) {
        throw new Error(data.error ?? '查询任务状态失败');
      }

      setStatus(data.status);

      if (data.status === 'succeeded') {
        setVideoUrl(data.videoUrl ?? null);
        return;
      }

      if (data.status === 'failed') {
        throw new Error(data.error ?? '视频生成失败');
      }
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入视频提示词。');
      return;
    }

    setError(null);
    setVideoUrl(null);
    setStatus('queued');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, aspectRatio })
      });

      const data = (await res.json()) as GenerateResponse & { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? '创建任务失败');
      }

      setTaskId(data.taskId);
      setStatus(data.status);
      await pollTask(data.taskId);
    } catch (err) {
      setStatus('failed');
      setError(err instanceof Error ? err.message : '未知错误');
    }
  };

  return (
    <main className="container">
      <section className="card">
        <h1>AI 视频生成器</h1>
        <p className="subtitle">输入提示词，选择风格和比例，一键生成视频。</p>

        <label>提示词</label>
        <textarea
          placeholder="例如：一台银色跑车在雨夜城市街道飞驰，电影感镜头，霓虹反光。"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        <div className="row">
          <div>
            <label>风格</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              {styles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>画面比例</label>
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
              {aspectRatios.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={isGenerating}>
          {buttonText}
        </button>

        {taskId && <p className="status">任务 ID: {taskId}</p>}
        {isGenerating && <p className="status">生成中，请稍候...</p>}
        {error && <p className="error">{error}</p>}

        <div className="preview">
          <h2>视频预览</h2>
          {videoUrl ? (
            <>
              <video src={videoUrl} controls className="video" />
              <a className="download" href={videoUrl} download>
                下载视频
              </a>
            </>
          ) : (
            <p>生成完成后将显示视频结果。</p>
          )}
        </div>
      </section>
    </main>
  );
}
