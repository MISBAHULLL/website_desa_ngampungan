import { Link } from '@inertiajs/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import {
    PotentialCategoryIcon,
    potentialCategoryPresentation,
} from '@/components/potential-category-icon';
import { findVillagePotentialCategory } from '@/lib/dummy-village-potentials';
import type { VillagePotentialEntry } from '@/lib/dummy-village-potentials';
import { show as potentialShow } from '@/routes/potentials';

type VillagePotentialCarouselProps = {
    entries: VillagePotentialEntry[];
    label: string;
};

type CarouselPosition = 'active' | 'previous' | 'next' | 'hidden';

const positionStyles: Record<CarouselPosition, CSSProperties> = {
    active: {
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1) saturate(1)',
        transform: 'translate(-50%, -50%) translateX(0) scale(1) rotateY(0deg)',
    },
    previous: {
        zIndex: 20,
        opacity: 0.78,
        filter: 'brightness(0.72) saturate(0.78)',
        transform:
            'translate(-50%, -50%) translateX(-52%) scale(0.78) rotateY(10deg)',
    },
    next: {
        zIndex: 20,
        opacity: 0.78,
        filter: 'brightness(0.72) saturate(0.78)',
        transform:
            'translate(-50%, -50%) translateX(52%) scale(0.78) rotateY(-10deg)',
    },
    hidden: {
        zIndex: 10,
        opacity: 0,
        filter: 'brightness(0.6) saturate(0.6)',
        pointerEvents: 'none',
        transform:
            'translate(-50%, -50%) translateX(0) scale(0.64) rotateY(0deg)',
    },
};

function CoverflowPotentialCard({
    entry,
    isActive,
    onActivate,
    position,
    positionLabel,
}: {
    entry: VillagePotentialEntry;
    isActive: boolean;
    onActivate: () => void;
    position: CarouselPosition;
    positionLabel: string;
}) {
    const [isImageUnavailable, setIsImageUnavailable] = useState(false);
    const category = findVillagePotentialCategory(entry.category);
    const presentation = potentialCategoryPresentation[entry.category];

    const cardContent = (
        <>
            <div
                className={`absolute inset-0 overflow-hidden ${presentation.panelClassName}`}
            >
                {!isImageUnavailable && (
                    <img
                        src={entry.image}
                        alt={entry.imageAlt}
                        loading={isActive ? 'eager' : 'lazy'}
                        onError={() => setIsImageUnavailable(true)}
                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
                    />
                )}

                {isImageUnavailable && (
                    <>
                        <span
                            aria-hidden="true"
                            className="absolute -top-20 -right-14 size-56 rounded-full border-[32px] border-white/35"
                        />
                        <span
                            aria-hidden="true"
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] leading-none font-black tracking-tighter text-current/8"
                        >
                            {entry.name.charAt(0)}
                        </span>
                    </>
                )}
            </div>

            <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
            />
            <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80"
            />

            <div className="absolute inset-0 flex flex-col justify-between p-5 text-white sm:p-7">
                <div className="flex items-start justify-between gap-4">
                    <span className="flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3.5 py-1.5 text-[0.625rem] font-bold tracking-widest uppercase">
                        <PotentialCategoryIcon
                            category={entry.category}
                            className="size-3.5 text-amber-400"
                        />
                        {category.label}
                    </span>
                    <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[0.625rem] font-bold tracking-widest">
                        {positionLabel}
                    </span>
                </div>

                <div
                    className={
                        isActive
                            ? 'max-w-[34rem] translate-y-0 opacity-100 transition duration-500 motion-reduce:transition-none'
                            : 'max-w-[34rem] translate-y-3 opacity-90 transition duration-500 motion-reduce:transition-none'
                    }
                >
                    <p className="text-[0.6875rem] font-extrabold tracking-widest text-amber-400 uppercase">
                        {category.eyebrow}
                    </p>
                    <h3 className="mt-2 text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl">
                        {entry.name}
                    </h3>
                    <p
                        className={
                            isActive
                                ? 'mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/80 sm:block'
                                : 'hidden'
                        }
                    >
                        {entry.shortDescription}
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/15 pt-4">
                        <p className="flex min-w-0 items-center gap-2 text-xs font-medium text-white/80 sm:text-sm">
                            <MapPin
                                aria-hidden="true"
                                className="size-4 shrink-0 text-amber-400"
                            />
                            <span className="truncate">{entry.address}</span>
                        </p>
                        {isActive && (
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-village-primary-dark shadow-md transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="size-4 stroke-[2.5]"
                                />
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <article
            data-carousel-item
            data-carousel-position={position}
            className="group relative size-full overflow-hidden rounded-3xl border border-gray-100/20 bg-village-primary-dark text-left shadow-2xl transition-all duration-300"
        >
            {isActive ? (
                <Link
                    href={potentialShow(entry.slug)}
                    prefetch
                    viewTransition
                    aria-label={`Lihat detail ${entry.name}`}
                    className="block size-full focus-visible:ring-2 focus-visible:ring-[#f4c75c] focus-visible:outline-none focus-visible:ring-inset"
                >
                    {cardContent}
                </Link>
            ) : (
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={onActivate}
                    aria-label={`Tampilkan ${entry.name}`}
                    className="block size-full cursor-pointer text-left"
                >
                    {cardContent}
                </button>
            )}
        </article>
    );
}

export function VillagePotentialCarousel({
    entries,
    label,
}: VillagePotentialCarouselProps) {
    const carouselId = `potential-carousel-${useId().replaceAll(':', '')}`;
    const [activeIndex, setActiveIndex] = useState(0);
    const pointerStartX = useRef<number | null>(null);

    const moveCarousel = (direction: -1 | 1) => {
        if (entries.length === 0) {
            return;
        }

        setActiveIndex(
            (currentIndex) =>
                (currentIndex + direction + entries.length) % entries.length,
        );
    };

    const getPosition = (index: number): CarouselPosition => {
        if (index === activeIndex) {
            return 'active';
        }

        const relativeIndex =
            (index - activeIndex + entries.length) % entries.length;

        if (relativeIndex === 1) {
            return 'next';
        }

        if (relativeIndex === entries.length - 1) {
            return 'previous';
        }

        return 'hidden';
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        pointerStartX.current = event.clientX;
    };

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        if (pointerStartX.current === null) {
            return;
        }

        const distance = event.clientX - pointerStartX.current;
        pointerStartX.current = null;

        if (Math.abs(distance) < 45) {
            return;
        }

        moveCarousel(distance < 0 ? 1 : -1);
    };

    return (
        <div className="mt-7">
            <div
                id={carouselId}
                role="region"
                aria-roledescription="carousel"
                aria-label={label}
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft') {
                        event.preventDefault();
                        moveCarousel(-1);
                    }

                    if (event.key === 'ArrowRight') {
                        event.preventDefault();
                        moveCarousel(1);
                    }
                }}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => {
                    pointerStartX.current = null;
                }}
                className="relative mx-auto h-[390px] max-w-[1120px] touch-pan-y overflow-hidden perspective-[1400px] focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-4 focus-visible:outline-none sm:h-[500px] lg:h-[540px]"
            >
                {entries.map((entry, index) => {
                    const position = getPosition(index);
                    const isActive = position === 'active';

                    return (
                        <div
                            key={entry.slug}
                            style={positionStyles[position]}
                            className="absolute top-1/2 left-1/2 h-[350px] w-[82%] max-w-[660px] transition-[transform,opacity,filter] duration-500 ease-out will-change-transform transform-3d motion-reduce:duration-0 sm:aspect-[16/10] sm:h-auto"
                        >
                            <CoverflowPotentialCard
                                entry={entry}
                                isActive={isActive}
                                onActivate={() => setActiveIndex(index)}
                                position={position}
                                positionLabel={`${String(index + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="mx-auto mt-1 flex max-w-[660px] items-center justify-between gap-5 border-t border-village-border pt-5 sm:mt-0">
                <button
                    type="button"
                    onClick={() => moveCarousel(-1)}
                    aria-controls={carouselId}
                    aria-label="Kartu potensi sebelumnya"
                    className="flex size-11 shrink-0 items-center justify-center border border-village-border bg-white text-village-primary transition hover:-translate-x-0.5 hover:border-village-primary hover:bg-village-primary-light focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none active:scale-95 motion-reduce:transform-none"
                >
                    <ChevronLeft aria-hidden="true" className="size-5" />
                </button>

                <div
                    role="group"
                    aria-label="Pilih kartu potensi"
                    className="flex flex-1 items-center justify-center gap-2"
                >
                    {entries.map((entry, index) => (
                        <button
                            key={entry.slug}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Tampilkan ${entry.name}`}
                            aria-current={
                                activeIndex === index ? 'true' : undefined
                            }
                            className={
                                activeIndex === index
                                    ? 'size-3 rounded-full bg-village-primary ring-4 ring-village-primary/20 transition-all duration-300 motion-reduce:transition-none'
                                    : 'size-2.5 rounded-full bg-gray-200 hover:bg-village-primary/60 transition-all duration-300 motion-reduce:transition-none'
                            }
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => moveCarousel(1)}
                    aria-controls={carouselId}
                    aria-label="Kartu potensi berikutnya"
                    className="flex size-11 shrink-0 items-center justify-center bg-village-primary text-white transition hover:translate-x-0.5 hover:bg-village-primary-dark focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 motion-reduce:transform-none"
                >
                    <ChevronRight aria-hidden="true" className="size-5" />
                </button>
            </div>

            <p aria-live="polite" aria-atomic="true" className="sr-only">
                {entries[activeIndex]
                    ? `Kartu ${activeIndex + 1} dari ${entries.length}: ${entries[activeIndex].name}`
                    : 'Belum ada potensi untuk ditampilkan'}
            </p>
        </div>
    );
}
