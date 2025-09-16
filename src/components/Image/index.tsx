import React, { useState } from 'react';

import DefaultImageSrc from '@/assets/images/no-content.png';

interface Props {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
  onError?: (event: any) => void;
}
function Image(props: Props) {
  const { src, alt = '', className, style, onError, fallbackSrc } = props;
  const [imgSrc, setImgSrc] = useState(src || DefaultImageSrc);
  const [hasError, setHasError] = useState(false);

  const onImageError = (event: any) => {
    // 防止无限循环
    if (!hasError) {
      setHasError(true);
      // 使用传入的 fallbackSrc 或默认图片
      const fallback = fallbackSrc || DefaultImageSrc;
      setImgSrc(fallback);
      // 调用外部传入的 onError 回调（如果存在）
      if (onError) {
        onError(event);
      }
    }
  };

  // 当 src 改变时重置状态
  React.useEffect(() => {
    if (src && src !== imgSrc) {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, imgSrc]);

  return <img src={imgSrc} alt={alt} onError={onImageError} className={className} style={style} />;
}

export default Image;
