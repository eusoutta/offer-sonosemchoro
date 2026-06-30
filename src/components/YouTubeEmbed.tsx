import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useVibrate } from '../hooks/useVibrate';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  channel?: string;
  duration?: string;
  onProgress?: (seconds: number, total: number) => void;
  onComplete?: () => void;
  dayNumber: number;
  isNightMode: boolean;
}

export function YouTubeEmbed({
  videoId,
  title,
  channel,
  duration,
  onProgress,
  onComplete,
  dayNumber,
  isNightMode,
}: YouTubeEmbedProps) {
  const { vibrate } = useVibrate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedPercent, setWatchedPercent] = useState(0);
  const [markedComplete, setMarkedComplete] = useState(false);
  const progressIntervalRef = useRef<number | null>(null);

  const handleStateChange = (event: YouTubePlayerEvent) => {
    // YT.PlayerState: -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = video cued
    if (event.data === 1) {
      setIsPlaying(true);
      startProgressTracking();
    } else {
      setIsPlaying(false);
      stopProgressTracking();
    }
    if (event.data === 0) {
      // Video ended
      handleVideoEnded();
    }
  };

  const startProgressTracking = () => {
    if (progressIntervalRef.current) return;

    progressIntervalRef.current = window.setInterval(() => {
      // @ts-expect-error YouTube iframe API
      const player = window.YT?.get?.(`yt-player-${videoId}`);
      if (player) {
        const currentTime = player.getCurrentTime?.() || 0;
        const totalTime = player.getDuration?.() || 0;
        const percent = totalTime > 0 ? Math.round((currentTime / totalTime) * 100) : 0;
        setWatchedPercent(percent);
        onProgress?.(Math.floor(currentTime), Math.floor(totalTime));

        if (percent >= 90 && !markedComplete) {
          handleVideoEnded();
        }
      }
    }, 5000); // Update every 5 seconds
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleVideoEnded = () => {
    if (!markedComplete) {
      setMarkedComplete(true);
      vibrate(100);
      onComplete?.();
    }
    stopProgressTracking();
    setWatchedPercent(100);
  };

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      // @ts-expect-error YouTube API
      if (window.YT && window.YT.Player) {
        // @ts-expect-error YouTube API
        new window.YT.Player(`yt-player-${videoId}`, {
          events: {
            onStateChange: handleStateChange,
            onReady: () => {
              // Player ready
            },
          },
        });
      }
    };

    // @ts-expect-error YouTube API
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // @ts-expect-error YouTube API
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      stopProgressTracking();
    };
  }, [videoId]);

  return (
    <div className={`rounded-xl overflow-hidden ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      {/* Header */}
      <div className={`p-3 border-b ${isNightMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className={`font-medium text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h4>
            {channel && (
              <p className={`text-xs mt-0.5 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {channel} {duration && `• ${duration}`}
              </p>
            )}
          </div>
          {markedComplete && (
            <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
              ✓
            </div>
          )}
        </div>
      </div>

      {/* Video Frame */}
      <div className="relative" style={{ paddingBottom: '56.25%' }}>
        <iframe
          id={`yt-player-${videoId}`}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0`}
          title={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Progress Bar */}
      {watchedPercent > 0 && watchedPercent < 100 && (
        <div className={`h-1 ${isNightMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-coral-400 transition-all duration-300"
            style={{ width: `${watchedPercent}%` }}
          />
        </div>
      )}

      {/* Note */}
      <div className={`px-3 py-2 ${isNightMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
          📝 Vídeo de uma consultora brasileira. Os conceitos aplicam-se na mesma.
        </p>
      </div>
    </div>
  );
}

// Type for YouTube Player events
interface YouTubePlayerEvent {
  data: number;
  target: {
    getCurrentTime: () => number;
    getDuration: () => number;
  };
}

// Extend window for YT API
declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: {
        events?: {
          onStateChange?: (event: YouTubePlayerEvent) => void;
          onReady?: () => void;
        };
      }) => void;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
