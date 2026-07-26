import { Link } from '@inertiajs/react';
import { ArrowUpRight, MapPin, UserRound } from 'lucide-react';
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

    return (
        <article className="group h-full overflow-hidden border border-village-border bg-white shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-village-primary/35 hover:shadow-village-floating motion-reduce:transform-none motion-reduce:transition-none">
            <Link
                href={potentialShow(entry.slug)}
                prefetch
                viewTransition
                aria-label={`Lihat detail ${entry.name}`}
                className="flex h-full flex-col focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none focus-visible:ring-inset"
            >
                <div
                    className={`relative aspect-[16/10] overflow-hidden ${presentation.panelClassName}`}
                >
                    <span
                        aria-hidden="true"
                        className="absolute -top-20 -right-16 size-52 rounded-full border-[28px] border-white/35 transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute right-8 bottom-0 h-24 w-px rotate-45 bg-current/10"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute right-20 bottom-0 h-32 w-px rotate-45 bg-current/10"
                    />

                    {!isImageUnavailable && (
                        <>
                            <img
                                src={entry.image}
                                alt={entry.imageAlt}
                                loading="lazy"
                                onError={() => setIsImageUnavailable(true)}
                                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                            />
                            <span
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-t from-[#0b3728]/80 via-[#0b3728]/5 to-black/15"
                            />
                        </>
                    )}

                    <div className="relative flex items-start justify-between gap-4 p-5">
                        <span className="flex size-11 items-center justify-center border border-white/55 bg-white/90 text-village-primary-dark shadow-sm backdrop-blur-sm">
                            <PotentialCategoryIcon
                                category={entry.category}
                                className="size-5"
                            />
                        </span>
                        <span className="border border-white/55 bg-white/90 px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.12em] text-village-primary-dark uppercase shadow-sm backdrop-blur-sm">
                            {category.label}
                        </span>
                    </div>

                    {isImageUnavailable ? (
                        <p
                            aria-hidden="true"
                            className="absolute right-5 bottom-2 text-7xl leading-none font-bold tracking-tighter text-current/8"
                        >
                            {entry.name.charAt(0)}
                        </p>
                    ) : (
                        <p className="absolute bottom-4 left-5 border border-white/25 bg-[#0b3728]/70 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.1em] text-white uppercase backdrop-blur-sm">
                            Foto ilustrasi
                        </p>
                    )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-bold tracking-[0.14em] text-village-primary uppercase">
                        {category.eyebrow}
                    </p>
                    <h3 className="mt-2 text-xl leading-7 font-bold text-village-ink transition-colors group-hover:text-village-primary-dark">
                        {entry.name}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-village-muted">
                        {entry.shortDescription}
                    </p>

                    <dl className="mt-5 grid gap-2 text-sm text-village-muted">
                        <div className="flex items-start gap-2">
                            <UserRound
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0 text-village-primary"
                            />
                            <dt className="sr-only">{entry.managerLabel}</dt>
                            <dd>{entry.managerName}</dd>
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0 text-village-primary"
                            />
                            <dt className="sr-only">Alamat</dt>
                            <dd className="line-clamp-1">{entry.address}</dd>
                        </div>
                    </dl>

                    <ul
                        aria-label={`Penanda ${entry.name}`}
                        className="mt-5 flex flex-wrap gap-2"
                    >
                        {entry.tags.slice(0, 2).map((tag) => (
                            <li
                                key={tag}
                                className="border border-village-border bg-village-canvas px-2.5 py-1 text-xs font-semibold text-village-primary-dark"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-village-border pt-5">
                        <span className="text-sm font-bold text-village-primary">
                            Lihat profil
                        </span>
                        <span className="flex size-9 items-center justify-center bg-village-primary-light text-village-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none">
                            <ArrowUpRight
                                aria-hidden="true"
                                className="size-4"
                            />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
