import { useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import useMusicStore from '@/store/useMuisicStore';
import { toast } from 'sonner';
import { APIURL, IP } from '@/lib/constoct';

const Footer = () => {
  const {
    index,
    playlist,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    url,
    setCurrentTime,
    setDuration,
    setVolume,
    setIsPlaying,
    setCurrentSong,
    setIndex,
    playSong,
  } = useMusicStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMuted = volume === 0;

  // 检查歌曲是否有版权
  const checkSong = async (songId: number) => {
    try {
      const res = await fetch(
        `${APIURL}/check/music/url?id=${songId}&realIP=${IP}`
      );
      const data = await res.json();
      return data.success;
    } catch (error) {
      console.error('检查歌曲失败:', error);
      return false;
    }
  };

  // 处理切换歌曲
  const handleChangeSong = async (newIndex: number) => {
    if (playlist.length === 0) return;
    setIsPlaying(false);
    // console.log(newIndex);
    // 循环播放逻辑
    if (newIndex < 0) newIndex = playlist.length - 1;
    if (newIndex >= playlist.length) newIndex = 0;

    const songId = playlist[newIndex].id;
    const hasCopyright = await checkSong(songId);

    if (!hasCopyright) {
      toast.error('暂无版权，自动播放下一首');
      return handleChangeSong(newIndex + 1);
    }

    // 更新索引并播放
    setIndex(newIndex);
    await setCurrentSong(newIndex);
    playSong();
  };

  // 上一首
  const handlePrev = () => handleChangeSong(index! - 1);

  // 下一首
  const handleNext = () => handleChangeSong(index! + 1);

  // 播放/暂停
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => {
          console.error('播放失败:', e);
          toast.error('播放失败，请重试');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 静音/取消静音
  const toggleMute = () => {
    setVolume(isMuted ? 0.5 : 0);
  };

  // 时间更新处理
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // 歌曲结束自动播放下一首
  const handleEnded = () => {
    // console.log('歌曲播放结束');
    handleNext();
  };

  // 初始化音频元素
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      audio.addEventListener('onEnded', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', () => {
          setDuration(audio.duration);
        });
      };
    }
  }, [url]);

  // 同步音频元素与store状态
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying && url) {
        audioRef.current.play().catch((e) => console.error('自动播放失败:', e));
      }
    }
  }, [volume, isPlaying, url]);

  return (
    <footer className="bottom-0 left-0 right-0 bg-background/20 backdrop-sepia-50 border-t border-gray-700 p-4 z-50">
      <div className="flex items-center justify-between gap-4">
        {/* 歌曲信息 */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {currentSong ? (
            <>
              <img
                src={currentSong.al.picUrl}
                alt={currentSong.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="font-medium truncate">{currentSong.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentSong.ar.map((ar) => ar.name).join(' / ')}
                </p>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">未选择歌曲</div>
          )}
        </div>

        {/* 播放控制 */}
        <div className="flex items-center space-x-6 mr-15">
          <div
            onClick={handlePrev}
            aria-label="上一首"
            className="cursor-pointer"
          >
            <SkipBack color="#8E51FF" className="h-5 w-5" />
          </div>
          <div
            onClick={handlePlayPause}
            aria-label={isPlaying ? '暂停' : '播放'}
            className="cursor-pointer"
          >
            {isPlaying ? (
              <Pause color="#8E51FF" className="h-5 w-5" />
            ) : (
              <Play color="#8E51FF" className="h-5 w-5" />
            )}
          </div>
          <div
            onClick={handleNext}
            aria-label="下一首"
            className="cursor-pointer"
          >
            <SkipForward color="#8E51FF" className="h-5 w-5" />
          </div>
        </div>

        {/* 进度条和音量控制 */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
          <span className="text-sm text-muted-foreground w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 1}
            step={0.1}
            onValueChange={([value]) => {
              if (audioRef.current) {
                audioRef.current.currentTime = value;
                setCurrentTime(value);
              }
            }}
            className="flex-1 w-44"
          />
          <span className="text-sm text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
          <div
            onClick={toggleMute}
            aria-label={isMuted ? '取消静音' : '静音'}
            className="cursor-pointer"
          >
            {isMuted ? (
              <VolumeX color="#8E51FF" className="h-5 w-5" />
            ) : (
              <Volume2 color="#8E51FF" className="h-5 w-5" />
            )}
          </div>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([value]) => setVolume(value / 100)}
            className="w-24"
          />
        </div>

        {/* 隐藏的音频元素 */}
        <audio ref={audioRef} src={url} onEnded={handleEnded} />
      </div>
    </footer>
  );
};

// 辅助函数：格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default Footer;
