import { Link } from '@inertiajs/react';
import { ArrowRight, UserCheck } from 'lucide-react';
import type { VillageOfficial } from '@/lib/dummy-village-government';
import { show as officialShow } from '@/routes/government/officials';

export function VillageOfficialCard({
    official,
    onOpenDetail,
}: {
    official: VillageOfficial;
    onOpenDetail?: (official: VillageOfficial) => void;
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

                {official.photo_url || official.photo ? (
                    <img
                        src={official.photo_url || official.photo || ''}
                        alt={`Profil ${official.name}`}
                        className="relative h-48 w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                ) : (
                    <div className="relative mb-6 flex size-24 items-center justify-center rounded-2xl border border-emerald-100 bg-white font-bold text-emerald-800 shadow-md transition-transform duration-300 group-hover:scale-105">
                        <span className="text-2xl font-extrabold tracking-wider">
                            {official.initials}
                        </span>
                    </div>
                )}

                {/* Unit Tag Badge */}
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-800 shadow-xs border border-emerald-100 uppercase">
                    <UserCheck aria-hidden="true" className="size-3 text-emerald-600" />
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
                            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-600 hover:text-white group-hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                        >
                            <span>Lihat Profil Lengkap</span>
                            <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    ) : (
                        <Link
                            href={officialShow(official.slug)}
                            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-600 hover:text-white group-hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                            <span>Lihat Profil Lengkap</span>
                            <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}

