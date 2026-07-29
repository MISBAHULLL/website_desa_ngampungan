import { Link } from '@inertiajs/react';
import { ArrowRight, Heart, MapPin, UserRound } from 'lucide-react';
import { useState } from 'react';
import {
    PotentialCategoryIcon,
    potentialCategoryPresentation,
} from '@/components/potential-category-icon';
import { findVillagePotentialCategory } from '@/lib/dummy-village-potentials';
import type { VillagePotentialEntry } from '@/lib/dummy-village-potentials';
import { show as potentialShow } from '@/routes/potentials';

export function VillagePotentialCard({
    entry,
}: {
    entry: VillagePotentialEntry;
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

    return (
        <article className="group relative flex h-full flex-col justify-between rounded-[28px] border border-gray-100 bg-white p-3.5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-village-primary/20 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none">
            <Link
                href={potentialShow(entry.slug)}
                prefetch
                viewTransition
                aria-label={`Lihat detail ${entry.name}`}
                className="flex h-full flex-col justify-between focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none focus-visible:ring-inset"
            >
                {/* Image Banner Section */}
                <div
                    className={`relative aspect-[16/10] w-full overflow-hidden rounded-[22px] ${presentation.panelClassName}`}
                >
                    {!isImageUnavailable ? (
                        <>
                            <img
                                src={entry.image}
                                alt={entry.imageAlt}
                                loading="lazy"
                                onError={() => setIsImageUnavailable(true)}
                                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                            />
                            <span
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"
                            />
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-3xl font-extrabold text-gray-400">
                            {entry.name.charAt(0)}
                        </div>
                    )}

                    {/* Top Category Badge Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-900 shadow-xs backdrop-blur-md">
                        <PotentialCategoryIcon
                            category={entry.category}
                            className="size-4 shrink-0 object-contain"
                        />
                        <span className="tracking-wide">{category.label}</span>
                    </div>
                </div>

                {/* Card Body Content */}
                <div className="flex flex-1 flex-col justify-between px-2 pt-4 pb-1">
                    <div>
                        {/* Title & Location Row with Heart Favorite Button */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-bold text-gray-900 leading-tight tracking-tight transition-colors group-hover:text-village-primary line-clamp-1">
                                    {entry.name}
                                </h3>
                                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-500">
                                    <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-village-primary" />
                                    <span className="truncate">{entry.address}</span>
                                </p>
                            </div>

                            {/* Circular Bookmark / Heart Button */}
                            <button
                                type="button"
                                onClick={toggleFavorite}
                                aria-label={isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                                className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200 shadow-2xs ${
                                    isFavorite
                                        ? 'border-red-200 bg-red-50 text-red-500'
                                        : 'border-gray-200/80 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50/50 hover:text-red-500'
                                }`}
                            >
                                <Heart
                                    className={`size-4 transition-transform duration-200 ${
                                        isFavorite ? 'fill-red-500 text-red-500 scale-110' : ''
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Short Description */}
                        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-gray-600 font-normal">
                            {entry.shortDescription}
                        </p>
                    </div>

                    {/* Stats Metric Row & CTA Pill Button */}
                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="truncate text-xs font-bold text-gray-900 leading-snug">
                                    {entry.managerName}
                                </p>
                                <p className="mt-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                                    {entry.managerLabel}
                                </p>
                            </div>
                            <div>
                                <p className="truncate text-xs font-bold text-gray-900 leading-snug">
                                    {entry.offerings.length} Produk
                                </p>
                                <p className="mt-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                                    Layanan
                                </p>
                            </div>
                        </div>

                        {/* Primary Pill Button */}
                        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-village-primary px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all group-hover:bg-village-primary-dark group-hover:shadow-lg">
                            <span>Lihat detail</span>
                            <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
