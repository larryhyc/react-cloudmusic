interface ImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  cover?: boolean;
  className?: string;
}

import { cn } from '@/lib/utils';

const Image = ({ src, alt, width, height, cover, className }: ImageProps) => {
  return (
    <img
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      style={{ width, height, objectFit: cover ? 'cover' : 'contain' }}
      className={cn(className)}
    />
  );
};

export default Image;
