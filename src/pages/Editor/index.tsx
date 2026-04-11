import { useCallback, useEffect, useState } from 'react';

import VideoPlayer from '@/components/VideoPlayer';
import { getScenes, submitVideo } from '@/services/api';

import VideoUrlForm from './VideoUrlForm';

type Phase = 'idle' | 'submitting' | 'processing' | 'ready' | 'error';

function extractTaskId(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === 'string' || typeof data === 'number') return String(data);
  if (
    typeof data === 'object' &&
    'taskId' in data &&
    (data as { taskId: unknown }).taskId != null
  ) {
    return String((data as { taskId: string | number }).taskId);
  }
  if (typeof data === 'object' && 'id' in data && (data as { id: unknown }).id != null) {
    return String((data as { id: string | number }).id);
  }
  return null;
}

export default function Editor() {
  const [url, setUrl] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [statusText, setStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmitUrl = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setErrorMessage('');
    setPhase('submitting');
    setScenes([]);

    try {
      const res: any = await submitVideo(trimmed);
      if (res?.code !== 200) {
        setPhase('error');
        setErrorMessage(res?.message ?? res?.msg ?? '提交失败');
        return;
      }
      const id = extractTaskId(res?.data);
      if (!id) {
        setPhase('error');
        setErrorMessage('接口未返回任务 ID');
        return;
      }
      setTaskId(id);
      setPhase('processing');
      setStatusText(res?.status ?? 'processing');
    } catch {
      setPhase('error');
      setErrorMessage('网络异常，请重试');
    }
  }, [url]);

  // 任务创建后轮询 getScenes（仅完成时返回数据）
  useEffect(() => {
    if (!taskId) {
      return () => {};
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const poll = async () => {
      try {
        const res: any = await getScenes(taskId);
        if (cancelled) return;

        if (res?.status != null) setStatusText(String(res.status));

        if (res?.code === 200 && res?.data != null) {
          setScenes(Array.isArray(res.data) ? res.data : []);
          setPhase('ready');
          return;
        }

        timer = setTimeout(poll, 2000);
      } catch {
        if (cancelled) return;
        setPhase('error');
        setErrorMessage('获取切片失败');
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [taskId]);

  const handleReset = () => {
    setTaskId(null);
    setScenes([]);
    setPhase('idle');
    setStatusText('');
    setErrorMessage('');
  };

  const showProcessing = phase === 'processing' || phase === 'submitting';
  const showPlayer = phase === 'ready' && scenes.length > 0;

  return (
    <div style={{ padding: 20, background: '#0f0f0f', color: '#fff' }}>
      <h2>🎬 AI 视频编辑器 V1.3</h2>

      <VideoUrlForm
        value={url}
        onChange={setUrl}
        onSubmit={handleSubmitUrl}
        loading={phase === 'submitting'}
        disabled={phase === 'processing'}
      />

      {phase === 'error' && errorMessage && (
        <div style={{ marginBottom: 12, color: '#ff6b6b' }}>{errorMessage}</div>
      )}

      {phase === 'ready' && (
        <button
          type='button'
          onClick={handleReset}
          style={{
            marginBottom: 16,
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid #444',
            background: '#2a2a2a',
            color: '#fff',
            cursor: 'pointer'
          }}>
          分析新视频
        </button>
      )}

      {showPlayer && <VideoPlayer scenes={scenes} />}

      {showProcessing && (
        <div style={{ marginTop: 10 }}>
          ⏳ {phase === 'submitting' ? '正在提交…' : '正在分析视频…'}
          {statusText ? `（${statusText}）` : ''}
        </div>
      )}

      {phase === 'ready' && scenes.length === 0 && (
        <div style={{ marginTop: 10, color: '#aaa' }}>任务已完成，但未返回切片数据</div>
      )}
    </div>
  );
}
