import { ArrowRight, Heart, MapPin, UserRound } from 'lucide-react';
import { useState } from 'react';
import {
    PotentialCategoryIcon,
    potentialCategoryPresentation,
} from '@/components/potential-category-icon';
import { findVillagePotentialCategory } from '@/lib/dummy-village-potentials';
import type { VillagePotentialEntry } from '@/lib/dummy-village-potentials';

export function VillagePotentialCard({
    entry,
    onOpenDetail,
}: {
    entry: VillagePotentialEntry;
    onOpenDetail?: (entry: VillagePotentialEntry) => void;
}) {
    const category = findVillagePotentialCategory(entry.category);
    const presentation = potentialCategoryPresentation[entry.category];
    const [isImageUnavailable, setIsImageUnavailable] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite((prev) => !prev);
    };

    const handleCardClick = (e: React.MouseEvent | React.KeyboardEvent) => {
        if (onOpenDetail) {
            e.preventDefault();
            onOpenDetail(entry);
        }
    };

    return (
        <article className="group relative flex h-full flex-col justify-between rounded-[28px] border border-gray-100 bg-white p-3.5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-village-primary/20 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none">
            <div
                role="button"
                tabIndex={0}
                onClick={handleCardClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleCardClick(e);
                    }
                }}
                aria-label={`Lihat detail ${entry.name}`}
                className="flex h-full cursor-pointer flex-col justify-between rounded-[24px] focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none focus-visible:ring-inset"
            >
                {/* Image Banner Section */}
                <div
                    className={`relative aspect-[16/10] w-full overflow-hidden rounded-[22px] ${presentation.panelClassName}`}
                >
                    {!isImageUnavailable ? (
                        <img
                            src={entry.image}
                            alt={entry.imageAlt}
                            loading="lazy"
                            onError={() => setIsImageUnavailable(true)}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex size-full flex-col items-center justify-center p-4 text-center">
                            <PotentialCategoryIcon
                                category={entry.category}
                                className="size-10 text-gray-400"
                            />
                            <span className="mt-2 text-xs font-semibold text-gray-500">
                                Gambar tidak tersedia
                            </span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                    {/* Category Badge Pill (Top-Left) */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-3 py-1 text-[11px] font-bold text-gray-800 shadow-sm backdrop-blur-xs">
                        <PotentialCategoryIcon
                            category={entry.category}
                            className="size-3.5 shrink-0"
                        />
                        <span>{category.label}</span>
                    </div>

                    {/* Favorite / Bookmark Button (Top-Right) */}
                    <button
                        type="button"
                        onClick={toggleFavorite}
                        aria-label={
                            isFavorite
                                ? `Hapus ${entry.name} dari favorit`
                                : `Simpan ${entry.name} ke favorit`
                        }
                        className={`absolute top-3 right-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/90 shadow-sm backdrop-blur-xs transition hover:scale-110 active:scale-95 ${
                            isFavorite ? 'text-rose-500' : 'text-gray-600'
                        }`}
                    >
                        <Heart
                            className={`size-4 ${isFavorite ? 'fill-current' : ''}`}
                        />
                    </button>
                </div>

                {/* Card Content Details */}
                <div className="mt-4 flex flex-1 flex-col justify-between px-1">
                    <div className="space-y-2">
                        {/* Title */}
                        <h3 className="text-base leading-snug font-extrabold text-gray-900 transition-colors group-hover:text-village-primary">
                            {entry.name}
                        </h3>

                        {/* Location Subtitle */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin className="size-3.5 shrink-0 text-village-primary" />
                            <span className="truncate">{entry.address}</span>
                        </div>

                        {/* Short Description */}
                        <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                            {entry.shortDescription}
                        </p>
                    </div>

                    {/* Stats Metric Row & CTA Pill Button */}
                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="truncate text-xs leading-snug font-bold text-gray-900">
                                    {entry.managerName}
                                </p>
                                <p className="mt-0.5 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                                    {entry.managerLabel}
                                </p>
                            </div>
                            <div>
                                <p className="truncate text-xs leading-snug font-bold text-gray-900">
                                    {entry.offerings.length} Produk
                                </p>
                                <p className="mt-0.5 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                                    Layanan
                                </p>
                            </div>
                        </div>

                        {/* Primary Pill Button */}
                        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-village-primary px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all group-hover:bg-village-primary-dark group-hover:shadow-lg">
                            <span>Lihat detail</span>
                            <ArrowRight
                                aria-hidden="true"
                                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                            />
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}
