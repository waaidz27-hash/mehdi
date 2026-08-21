import { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  youtubeId: string;
  title: string;
}

export function YouTubeEmbed({ youtubeId, title }: YouTubeEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-700/50 bg-ink-800/50 shadow-xl group">
      <div className="relative aspect-video w-full bg-black">
        {loaded ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 h-full w-full"
            aria-label={`تشغيل: ${title}`}
          >
            <img
              src={thumb}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${youtubeId}/default.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-2xl transition-transform duration-300 group-hover:scale-110">
                <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 left-0 p-4 text-right">
              <p className="text-sm font-semibold text-white drop-shadow-lg line-clamp-2">{title}</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
