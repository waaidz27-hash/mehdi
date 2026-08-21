import { useState, useEffect, useRef } from 'react';
import type { LessonSection, ImageResource, VideoResource } from '../types';
import { YouTubeEmbed } from './YouTubeEmbed';
import { Lightbulb, AlertTriangle, Sparkles, ImageOff } from 'lucide-react';

interface LessonImageProps {
  url: string;
  alt: string;
  caption?: string;
}

function LessonImage({ url, alt, caption }: LessonImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="my-6 flex items-center justify-center rounded-2xl border border-slate-700/30 bg-ink-800/30 py-12">
        <div className="flex flex-col items-center gap-2 text-slate-600">
          <ImageOff className="h-8 w-8" />
          <span className="text-sm">{caption || alt}</span>
        </div>
      </div>
    );
  }

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-700/50 shadow-2xl">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        onError={() => setErrored(true)}
        className="w-full object-cover max-h-[400px] transition duration-700 hover:scale-[1.02]"
      />
      {caption && (
        <figcaption className="bg-gradient-to-r from-ink-800 to-ink-800/80 px-6 py-3 text-center text-sm text-slate-400 leading-relaxed border-t border-slate-700/30">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

const calloutConfig = {
  info: {
    container: 'bg-teal-500/10 border-teal-500/30',
    title: 'text-teal-300',
    icon: Lightbulb,
    iconColor: 'text-teal-400',
  },
  warning: {
    container: 'bg-rose-500/10 border-rose-500/30',
    title: 'text-rose-300',
    icon: AlertTriangle,
    iconColor: 'text-rose-400',
  },
  tip: {
    container: 'bg-amber-500/10 border-amber-500/30',
    title: 'text-amber-300',
    icon: Sparkles,
    iconColor: 'text-amber-400',
  },
} as const;

function CalloutBox({ callout }: { callout: NonNullable<LessonSection['callout']> }) {
  const config = calloutConfig[callout.type];
  const Icon = config.icon;

  return (
    <div className={`my-6 rounded-2xl border p-6 ${config.container} animate-fade-in`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ${config.iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h4 className={`text-lg font-bold ${config.title}`}>{callout.title}</h4>
      </div>
      <p className="text-slate-300 leading-loose">{callout.content}</p>
    </div>
  );
}

export interface ResolvedMedia {
  image?: ImageResource;
  videos?: VideoResource[];
}

interface Props {
  section: LessonSection;
  resolvedMedia: ResolvedMedia;
  sectionIndex: number;
  isActive: boolean;
}

export function LessonSectionView({ section, resolvedMedia, sectionIndex, isActive }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
    }
  }, [isActive]);

  const { image, videos } = resolvedMedia;

  return (
    <section
      ref={ref}
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {/* Section heading with decorative element */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/20">
          <span className="text-lg font-bold text-teal-400">{sectionIndex + 1}</span>
        </div>
        <h3 className="flex-1 text-xl font-bold leading-tight text-white sm:text-2xl">
          {section.heading}
        </h3>
      </div>

      {/* Image — shown before text for visual hook */}
      {image && (
        <LessonImage url={image.url} alt={image.alt} caption={image.caption} />
      )}

      {/* Body text */}
      <div className="lesson-content space-y-5 text-slate-300 leading-relaxed">
        {section.body.map((paragraph, i) => (
          <p key={i} className="text-base sm:text-lg">{paragraph}</p>
        ))}
      </div>

      {/* Callout */}
      {section.callout && <CalloutBox callout={section.callout} />}

      {/* Videos */}
      {videos && videos.length > 0 && (
        <div>
          {videos.map((video) => (
            <YouTubeEmbed key={video.id} youtubeId={video.youtubeId} title={video.title} />
          ))}
        </div>
      )}
    </section>
  );
}
