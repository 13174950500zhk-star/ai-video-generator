import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 视频生成器 MVP',
  description: '输入提示词并生成 AI 视频'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
