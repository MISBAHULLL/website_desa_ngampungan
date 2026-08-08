import { Film, Play } from 'lucide-react';
import { useState } from 'react';
import { getVideoThumbnailUrl, isDirectVideoUrl } from '@/lib/video-media';

type NewsMediaThumbnailProps = {
    image?: string | null;
    video?: string | null;
    videoUrl?: string | null;
    alt: string;
    className?: string;
    imageClassName?: string;
    showVideoLabel?: boolean;
};

export function NewsMediaThumbnail({
    image,
    video,
    videoUrl,
    alt,
    className = '',
    imageClassName = '',
    showVideoLabel = true,
}: NewsMediaThumbnailProps) {
    const [failedSource, setFailedSource] = useState<string | null>(null);
    const directVideo = video || (isDirectVideoUrl(videoUrl) ? videoUrl : null);
    const externalThumbnail = getVideoThumbnailUrl(videoUrl);
    const hasVideo = Boolean(video || videoUrl);

    function revealFirstVideoFrame(
        event: React.SyntheticEvent<HTMLVideoElement>,
    ) {
        const element = event.currentTarget;

        if (Number.isFinite(element.duration) && element.duration > 0.1) {
            element.currentTime = 0.1;
        }
    }

    return (
        <div
            className={`relative overflow-hidden bg-slate-900 ${className}`}
            role={hasVideo ? 'img' : undefined}
            aria-label={hasVideo ? `Thumbnail video ${alt}` : undefined}
        >
            {directVideo && failedSource !== directVideo ? (
                <video
                    src={directVideo}
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    onLoadedMetadata={revealFirstVideoFrame}
                    onError={() => setFailedSource(directVideo)}
                    className={`size-full object-cover ${imageClassName}`}
                />
            ) : externalThumbnail && failedSource !== externalThumbnail ? (
                <img
                    src={externalThumbnail}
                    alt=""
                    loading="lazy"
                    onError={() => setFailedSource(externalThumbnail)}
                    className={`size-full object-cover ${imageClassName}`}
                />
            ) : !hasVideo && image && failedSource !== image ? (
                <img
                    src={image}
                    alt={alt}
                    loading="lazy"
                    onError={() => setFailedSource(image)}
                    className={`size-full object-cover ${imageClassName}`}
                />
            ) : hasVideo ? (
                <div className="flex size-full items-center justify-center bg-slate-900 text-slate-400">
                    <Film aria-hidden="true" className="size-8" />
                    <span className="sr-only">
                        Pratinjau video tidak tersedia
                    </span>
                </div>
            ) : (
                <img
                    src="/images/news/default.png"
                    alt={alt}
                    loading="lazy"
                    className={`size-full object-cover ${imageClassName}`}
                />
            )}

            {hasVideo && (
                <>
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-linear-to-t from-slate-950/45 via-transparent to-transparent"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex size-11 items-center justify-center rounded-full border border-white/50 bg-slate-950/55 text-white shadow-lg backdrop-blur-sm">
                            <Play
                                aria-hidden="true"
                                className="ml-0.5 size-5 fill-current"
                            />
                        </span>
                    </span>
                    {showVideoLabel && (
                        <span className="absolute right-3 bottom-3 rounded-md border border-white/25 bg-slate-950/70 px-2 py-1 text-[10px] font-bold tracking-wide text-white uppercase backdrop-blur-sm">
                            Video
                        </span>
                    )}
                </>
            )}
        </div>
    );
}
