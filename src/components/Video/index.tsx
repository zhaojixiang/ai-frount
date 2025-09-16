import classnames from 'classnames';
import React, { useRef, useState } from 'react';

import videoPlayIcon from '@/assets/images/play-video@2x.png';

import S from './index.module.less';

export default function Video(props: any) {
  const { src, cover, className, onStart = () => {}, onEnded = () => {} } = props;
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<any>(null);

  // 暂停
  const pause = () => {
    setPlaying(false);
  };
  // 结束
  const ended = () => {
    setPlaying(false);
    if (onEnded) {
      onEnded();
    }
  };
  // 播放
  const play = () => {
    if (!videoRef.current) {
      return;
    }
    if (!playing) {
      videoRef.current.play();
      onStart?.();
    } else {
      videoRef.current.pause();
    }
    const delay = setTimeout(() => {
      setPlaying(!playing);
      clearTimeout(delay);
    }, 100);
  };

  if (!src) {
    return null;
  }
  return (
    <div className={classnames(S.videoWp, className)}>
      <div className={classnames(S.poster, playing ? S.visible : S.invisible)} onClick={play}>
        <img className={S.playBtn} src={videoPlayIcon} alt='' />
      </div>
      <video
        src={src}
        style={{ width: '100%', height: '100%', objectFit: 'fill' }}
        controls={false}
        controlsList='nodownload'
        ref={videoRef}
        poster={cover}
        x5-playsinline='true'
        playsInline
        webkit-playsinline='true'
        x-webkit-airplay='true'
        x5-video-player-type='h5'
        x5-video-player-fullscreen='true'
        onPause={pause}
        onEnded={ended}
      />
    </div>
  );
}
