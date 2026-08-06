import { Link } from '@inertiajs/react';
import { ArrowRight, UserCheck } from 'lucide-react';
import { useState } from 'react';
import type { VillageOfficialData } from '@/components/village-official-detail-modal';
import { show as officialShow } from '@/routes/government/officials';

type VillageOfficialCardData = VillageOfficialData & {
    slug: string;
    initials: string;
};

function OfficialCardPortrait({
    photoSrc,
    name,
    initials,
}: {
    photoSrc: string | null | undefined;
    name: string;
    initials: string;
}) {
    const [hasImageError, setHasImageError] = useState(false);

    if (photoSrc && !hasImageError) {
        return (
            <img
                src={photoSrc}
                alt={`Profil ${name}`}
                className="relative h-48 w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.04]"
                onError={() => setHasImageError(true)}
            />
        );
    }

    return (
        <div className="relative mb-6 flex size-24 items-center justify-center rounded-2xl border border-emerald-100 bg-white font-bold text-emerald-800 shadow-md transition-transform duration-300 group-hover:scale-105">
            <span className="text-2xl font-extrabold tracking-wider">
                {initials}
            </span>
        </div>
    );
}

export function VillageOfficialCard({
    official,
    onOpenDetail,
}: {
    official: VillageOfficialCardData;
    onOpenDetail?: (official: VillageOfficialCardData) => void;
}) {
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-950/5">
            {/* Header Image / Avatar Container */}
            <div className="relative flex h-52 items-end justify-center overflow-hidden bg-gradient-to-b from-emerald-50/70 via-gray-50 to-white px-6 pt-6">
                {/* Decorative background shape */}
                <div
                    aria-hidden="true"
                    className="absolute -top-10 -right-10 size-36 rounded-full bg-emerald-500/5 blur-xl transition-all duration-500 group-hover:scale-125"
                />

                <OfficialCardPortrait
                    key={`${official.id ?? official.slug}-${official.photo_url ?? official.photo ?? 'initials'}`}
                    photoSrc={official.photo_url || official.photo}
                    name={official.name}
                    initials={official.initials}
                />

                {/* Unit Tag Badge */}
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-800 uppercase shadow-xs">
                    <UserCheck
                        aria-hidden="true"
                        className="size-3 text-emerald-600"
                    />
                    {official.unit}
                </span>
            </div>

            {/* Content Details */}
            <div className="flex grow flex-col p-6">
                <h3 className="text-lg font-extrabold tracking-tight text-gray-900 transition-colors group-hover:text-emerald-700">
                    {official.name}
                </h3>
                <p className="mt-1 text-xs font-bold tracking-wide text-emerald-600 uppercase">
                    {official.position}
                </p>

                <p className="mt-3.5 line-clamp-3 text-xs leading-relaxed text-gray-600">
                    {official.summary}
                </p>

                <div className="mt-auto pt-6">
                    {onOpenDetail ? (
                        <button
                            type="button"
                            onClick={() => onOpenDetail(official)}
                            className="inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 text-xs font-bold text-emerald-800 transition-all group-hover:shadow-md hover:bg-emerald-600 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                        >
                            <span>Lihat Profil Lengkap</span>
                            <ArrowRight
                                aria-hidden="true"
                                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                            />
                        </button>
                    ) : (
                        <Link
                            href={officialShow(official.slug)}
                            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 text-xs font-bold text-emerald-800 transition-all group-hover:shadow-md hover:bg-emerald-600 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                        >
                            <span>Lihat Profil Lengkap</span>
                            <ArrowRight
                                aria-hidden="true"
                                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                            />
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
