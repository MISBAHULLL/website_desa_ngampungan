import { ArrowLeft, ArrowRight, CalendarDays, Camera, X } from 'lucide-react';
import { useEffect } from 'react';
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

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`Foto: ${photo.title}`}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
            className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-900/75 p-4 md:p-8 animate-in fade-in duration-200"
        >
            <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Close Button Floating */}
                <button
                    type="button"
                    aria-label="Tutup galeri"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-emerald-700 hover:text-white hover:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                >
                    <X aria-hidden="true" className="size-5" />
                </button>

                <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
                    {/* Main Image Stage - Pure Light Stage */}
                    <div className="relative flex min-h-[22rem] items-center justify-center bg-slate-950 p-4 lg:min-h-[38rem]">
                        <img
                            src={photo.image}
                            alt={photo.alt}
                            className="max-h-[75vh] w-full rounded-lg object-contain shadow-md transition-all duration-300"
                        />

                        {photos.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Foto sebelumnya"
                                    onClick={() => onNavigate(previousPhoto)}
                                    className="absolute top-1/2 left-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg transition hover:bg-emerald-700 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
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
                                    className="absolute top-1/2 right-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg transition hover:bg-emerald-700 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
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
                    <div className="flex flex-col justify-between gap-8 bg-white p-7 text-slate-900 md:p-8 border-t lg:border-t-0 lg:border-l border-slate-200">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200">
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
                                <dt className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                                    Album Dokumentasi
                                </dt>
                                <dd className="mt-1 font-bold text-emerald-800">
                                    {photo.album}
                                </dd>
                            </div>
                            <div>
                                <dt className="sr-only">Tanggal dokumentasi</dt>
                                <dd className="flex items-center gap-2 text-slate-600 font-medium">
                                    <CalendarDays
                                        aria-hidden="true"
                                        className="size-4 text-emerald-700"
                                    />
                                    <span>Dipublikasikan: {photo.capturedLabel}</span>
                                </dd>
                            </div>
                            <div className="mt-2 rounded-xl bg-slate-100 p-3 text-center text-xs font-semibold text-slate-600 border border-slate-200">
                                Foto {currentIndex + 1} dari {photos.length}
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
