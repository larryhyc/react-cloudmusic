// src/components/Footer.tsx
import { useEffect, useRef } from 'react';
import useMusicStore from '@/store/useMuisicStore';
import Image from '@/components/ui/Image';
import { Button } from './ui/button';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Slider } from './ui/slider';
import { formatTime } from '@/lib/utils';

const Footer = () => {
  const {
    currentSong,
    playlist,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    setCurrentTime,
    setDuration,
    setVolume,
    nextSong,
    prevSong,
    togglePlayMode,
    playMode,
  } = useMusicStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  // 处理播放/暂停
  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // 更新当前播放时间
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // 处理进度条变化
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // 处理音量变化
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // 静音/取消静音
  const toggleMute = () => {
    if (volume === 0) {
      setVolume(0.8); // 恢复默认音量
    } else {
      setVolume(0); // 静音
    }
  };

  // 当歌曲加载元数据时
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // 当歌曲结束时
  const handleEnded = () => {
    nextSong();
  };

  // 控制播放状态
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error('播放失败:', error);
        pause();
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // 初始化音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  return (
    <div className="bg-background border-t border-gray-600/30 px-4 py-2 h-20">
      {/* 隐藏的audio元素 */}
      <audio
        ref={audioRef}
        src={currentSong?.url || ''}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* 播放控件 - 更新颜色 */}
      <div className="flex items-center justify-between h-full max-w-6xl mx-auto">
        {/* 歌曲信息 */}
        <div className="flex items-center w-1/4 min-w-[180px]">
          {currentSong && (
            <>
              <Image
                src={currentSong.al.picUrl}
                alt={`${currentSong.name} cover`}
                width={36}
                height={36}
                className="rounded-lg mr-2"
              />
              <div className="truncate">
                <p className="text-sm font-medium truncate ">
                  {currentSong.name}
                </p>
                <p className="text-xs truncate">
                  {currentSong.ar.map((ar) => ar.name).join(' / ')}
                </p>
              </div>
            </>
          )}
        </div>

        {/* 播放控制按钮 - 更新颜色 */}
        <div className="flex flex-col items-center w-2/4 h-full justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-violet-600 rounded-full hover:bg-violet-100"
              onClick={prevSong}
              disabled={!currentSong || playlist.length <= 1}
            >
              <SkipBack className="h-4 w-4 text-violet-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-violet-600 rounded-full hover:bg-violet-100"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-violet-600" />
              ) : (
                <Play className="h-5 w-5 text-violet-600" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-violet-600 rounded-full hover:bg-violet-100"
              onClick={nextSong}
              disabled={!currentSong || playlist.length <= 1}
            >
              <SkipForward className="h-4 w-4 text-violet-600" />
            </Button>
          </div>

          {/* 进度条 - 更新颜色 */}
          <div className="w-full flex items-center space-x-2 mt-1">
            <span className="text-xs text-violet-500 w-8 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 1}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1 h-2 [&>div]:bg-violet-500"
              disabled={!currentSong}
            />
            <span className="text-xs text-violet-500 w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* 音量控制 - 更新颜色 */}
        <div className="flex items-center w-1/4 justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-violet-600  rounded-full hover:bg-violet-100"
            onClick={toggleMute}
            disabled={!currentSong}
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4 text-violet-600" />
            ) : (
              <Volume2 className="h-4 w-4 text-violet-600" />
            )}
          </Button>
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20 h-2 [&>div]:bg-violet-500"
            disabled={!currentSong}
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 px-2 text-violet-500"
            onClick={togglePlayMode}
          >
            {playMode === 'sequential' && '顺序'}
            {playMode === 'random' && '随机'}
            {playMode === 'loop' && '循环'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
