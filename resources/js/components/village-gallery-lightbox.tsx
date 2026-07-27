import { ArrowLeft, ArrowRight, CalendarDays, X } from 'lucide-react';
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
            className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-village-primary-dark/95 p-4 backdrop-blur-sm md:p-8"
        >
            <div className="relative w-full max-w-6xl bg-white shadow-2xl">
                <button
                    type="button"
                    aria-label="Tutup galeri"
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center bg-village-primary-dark/85 text-white transition hover:bg-village-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-village-primary-dark focus-visible:outline-none"
                >
                    <X aria-hidden="true" className="size-5" />
                </button>

                <div className="grid lg:grid-cols-[minmax(0,1fr)_21rem]">
                    <div className="relative flex min-h-[18rem] items-center justify-center bg-black lg:min-h-[38rem]">
                        <img
                            src={photo.image}
                            alt={photo.alt}
                            className="max-h-[72vh] w-full object-contain"
                        />

                        {photos.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Foto sebelumnya"
                                    onClick={() => onNavigate(previousPhoto)}
                                    className="absolute top-1/2 left-3 flex size-11 -translate-y-1/2 items-center justify-center bg-black/65 text-white transition hover:bg-village-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
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
                                    className="absolute top-1/2 right-3 flex size-11 -translate-y-1/2 items-center justify-center bg-black/65 text-white transition hover:bg-village-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                >
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col justify-between gap-8 p-6 md:p-8">
                        <div>
                            <span className="text-xs font-bold tracking-[0.15em] text-village-primary uppercase">
                                {photo.category}
                            </span>
                            <h2 className="mt-3 text-2xl leading-tight font-bold tracking-tight text-village-ink">
                                {photo.title}
                            </h2>
                            <p className="mt-4 text-sm leading-6 text-village-muted">
                                {photo.caption}
                            </p>
                        </div>

                        <dl className="grid gap-4 border-t border-village-border pt-5 text-sm">
                            <div>
                                <dt className="text-xs font-bold tracking-[0.1em] text-village-muted uppercase">
                                    Album
                                </dt>
                                <dd className="mt-1 font-semibold text-village-ink">
                                    {photo.album}
                                </dd>
                            </div>
                            <div>
                                <dt className="sr-only">Tanggal dokumentasi</dt>
                                <dd className="flex items-center gap-2 text-village-muted">
                                    <CalendarDays
                                        aria-hidden="true"
                                        className="size-4 text-village-primary"
                                    />
                                    {photo.capturedLabel}
                                </dd>
                            </div>
                            <div className="text-xs text-village-muted">
                                Foto {currentIndex + 1} dari {photos.length}
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
