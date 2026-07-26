import { Link } from '@inertiajs/react';
import { ArrowUpRight, BadgeInfo } from 'lucide-react';
import type { VillageOfficial } from '@/lib/dummy-village-government';
import { show as officialShow } from '@/routes/government/officials';

export function VillageOfficialCard({
    official,
}: {
    official: VillageOfficial;
}) {
    return (
        <article className="group flex h-full flex-col overflow-hidden border border-village-border bg-white shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-village-primary/40 hover:shadow-village-soft">
            <div className="relative flex min-h-48 items-end justify-center overflow-hidden bg-village-surface-muted px-6 pt-6">
                <div
                    aria-hidden="true"
                    className="absolute -top-12 -right-12 size-40 rounded-full border-[32px] border-village-primary/[0.055]"
                />

                {official.photo ? (
                    <img
                        src={official.photo}
                        alt={`Ilustrasi sementara ${official.name}`}
                        className="relative h-44 w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="relative mb-7 flex size-24 items-center justify-center rounded-full border-4 border-white bg-village-primary-light text-2xl font-bold text-village-primary-dark shadow-sm">
                        {official.initials}
                    </div>
                )}

                <span className="absolute top-4 left-4 bg-white px-2.5 py-1.5 text-[0.625rem] font-bold tracking-[0.12em] text-village-muted uppercase shadow-sm">
                    Data simulasi
                </span>
            </div>

            <div className="flex grow flex-col p-5">
                <p className="text-xs font-bold tracking-[0.14em] text-village-primary uppercase">
                    {official.unit}
                </p>
                <h3 className="mt-2 text-xl font-bold text-village-ink">
                    {official.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-village-muted">
                    {official.position}
                </p>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-village-muted">
                    {official.summary}
                </p>

                <div className="mt-auto pt-6">
                    <Link
                        href={officialShow(official.slug)}
                        className="inline-flex min-h-11 items-center gap-2 font-bold text-village-primary transition hover:text-village-primary-dark focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                    >
                        <BadgeInfo aria-hidden="true" className="size-4" />
                        Lihat profil
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
