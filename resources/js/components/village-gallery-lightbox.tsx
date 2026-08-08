import { ArrowLeft, ArrowRight, CalendarDays, Camera, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { VillageGalleryPhoto } from '@/lib/dummy-village-gallery';

type VillageGalleryLightboxProps = {
    photo: VillageGalleryPhoto;
    photos: readonly VillageGalleryPhoto[];
    onClose: () => void;
    onNavigate: (photo: VillageGalleryPhoto) => void;
};

export function VillageGalleryLightbox({
    photo,
    photos,
    onClose,
    onNavigate,
}: VillageGalleryLightboxProps) {
    const currentIndex = photos.findIndex(
        (candidate) => candidate.id === photo.id,
    );
    const previousPhoto =
        photos[(currentIndex - 1 + photos.length) % photos.length];
    const nextPhoto = photos[(currentIndex + 1) % photos.length];
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }

            if (event.key === 'ArrowLeft') {
                onNavigate(previousPhoto);
            }

            if (event.key === 'ArrowRight') {
                onNavigate(nextPhoto);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [nextPhoto, onClose, onNavigate, previousPhoto]);

    const isVideo = photo.mediaType === 'video';
    const videoSrc = photo.video || null;
    const videoEmbedUrl = photo.videoUrl
        ? photo.videoUrl.includes('youtube.com') || photo.videoUrl.includes('youtu.be')
            ? photo.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
            : photo.videoUrl.includes('vimeo.com')
            ? photo.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')
            : photo.videoUrl
        : null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`${isVideo ? 'Video' : 'Foto'}: ${photo.title}`}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
            className="fixed inset-0 z-[100] grid animate-in place-items-center overflow-y-auto bg-slate-900/75 p-4 duration-200 fade-in md:p-8"
        >
            <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Close Button Floating */}
                <button
                    type="button"
                    aria-label="Tutup galeri"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:border-emerald-700 hover:bg-emerald-700 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                >
                    <X aria-hidden="true" className="size-5" />
                </button>

                <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
                    {/* Main Media Stage */}
                    <div className="relative flex min-h-[22rem] items-center justify-center bg-slate-950 lg:min-h-[38rem]">
                        {isVideo ? (
                            <>
                                {videoSrc ? (
                                    <video
                                        ref={videoRef}
                                        key={videoSrc}
                                        src={videoSrc}
                                        controls
                                        autoPlay
                                        className="h-full w-full object-cover"
                                    />
                                ) : videoEmbedUrl ? (
                                    <div className="flex h-full w-full items-center justify-center" style={{ minHeight: '22rem' }}>
                                        <iframe
                                            src={videoEmbedUrl}
                                            title={photo.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="aspect-video w-full max-w-full"
                                            style={{ maxHeight: '75vh' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex aspect-video w-full items-center justify-center">
                                        <svg className="size-24 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                )}
                            </>
                        ) : (
                            <img
                                src={photo.image}
                                alt={photo.alt}
                                className="max-h-[75vh] w-full rounded-lg object-contain p-4 shadow-md transition-all duration-300"
                            />
                        )}

                        {photos.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Foto sebelumnya"
                                    onClick={() => onNavigate(previousPhoto)}
                                    className="absolute top-1/2 left-4 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg transition hover:bg-emerald-700 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                                >
                                    <ArrowLeft
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Foto berikutnya"
                                    onClick={() => onNavigate(nextPhoto)}
                                    className="absolute top-1/2 right-4 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg transition hover:bg-emerald-700 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                                >
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Meta Detail Sidebar - Pure Light Theme */}
                    <div className="flex flex-col justify-between gap-8 border-t border-slate-200 bg-white p-7 text-slate-900 md:p-8 lg:border-t-0 lg:border-l">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                                <Camera className="size-3 text-emerald-700" />
                                {photo.category}
                            </span>
                            <h2 className="mt-4 text-2xl leading-snug font-extrabold tracking-tight text-slate-900">
                                {photo.title}
                            </h2>
                            <p className="mt-4 text-xs leading-relaxed text-slate-600">
                                {photo.caption}
                            </p>
                        </div>

                        <dl className="grid gap-4 border-t border-slate-200 pt-6 text-xs">
                            <div>
                                <dt className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                                    Album Dokumentasi
                                </dt>
                                <dd className="mt-1 font-bold text-emerald-800">
                                    {photo.album}
                                </dd>
                            </div>
                            <div>
                                <dt className="sr-only">Tanggal dokumentasi</dt>
                                <dd className="flex items-center gap-2 font-medium text-slate-600">
                                    <CalendarDays
                                        aria-hidden="true"
                                        className="size-4 text-emerald-700"
                                    />
                                    <span>
                                        Dipublikasikan: {photo.capturedLabel}
                                    </span>
                                </dd>
                            </div>
                            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-100 p-3 text-center text-xs font-semibold text-slate-600">
                                {isVideo ? 'Video' : 'Foto'} {currentIndex + 1} dari {photos.length}
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
