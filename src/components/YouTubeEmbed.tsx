import { useState } from 'react';
import { Play, CheckCircle2, ExternalLink } from 'lucide-react';
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
  onComplete,
  dayNumber,
  isNightMode,
}: YouTubeEmbedProps) {
  const { vibrate } = useVibrate();
  const [markedComplete, setMarkedComplete] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const handleMarkComplete = () => {
    if (!markedComplete) {
      setMarkedComplete(true);
      vibrate(100);
      onComplete?.();
    }
  };

  const handlePlayClick = () => {
    vibrate(30);
    setShowVideo(true);
  };

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className={`rounded-2xl overflow-hidden ${isNightMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white border border-gray-100'} shadow-lg`}>
      {/* Header */}
      <div className={`p-3.5 border-b ${isNightMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className={`font-semibold text-sm leading-snug ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h4>
            {channel && (
              <p className={`text-xs mt-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {channel} {duration && `• ${duration}`}
              </p>
            )}
          </div>
          {markedComplete && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Visto
            </div>
          )}
        </div>
      </div>

      {/* Video Frame */}
      <div className="relative" style={{ paddingBottom: '56.25%' }}>
        {showVideo ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => setLoadError(true)}
          />
        ) : (
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 w-full h-full group cursor-pointer"
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </div>
            </div>
          </button>
        )}

        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-center p-4">
              <p className="text-white text-sm mb-2">Vídeo indisponível</p>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs rounded-full font-medium"
              >
                Tente novamente mais tarde
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={`p-3 flex items-center justify-end ${isNightMode ? 'bg-gray-800/50' : 'bg-gray-50/80'}`}>

        <button
          onClick={handleMarkComplete}
          disabled={markedComplete}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            markedComplete
              ? 'bg-green-500 text-white'
              : isNightMode
                ? 'bg-coral-500/20 text-coral-300 hover:bg-coral-500/30 active:scale-95'
                : 'bg-coral-100 text-coral-600 hover:bg-coral-200 active:scale-95'
          }`}
        >
          {markedComplete ? '✓ Vídeo visto' : 'Marcar como visto'}
        </button>
      </div>
    </div>
  );
}
