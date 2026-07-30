import {
    CalendarClock,
    CircleAlert,
    Info,
    Pin,
    TriangleAlert,
    Waves,
} from 'lucide-react';
import type {
    Announcement,
    AnnouncementPriority,
} from '@/lib/dummy-public-content';

const priorityPresentation: Record<
    AnnouncementPriority,
    {
        label: string;
        badgeClassName: string;
        iconClassName: string;
        borderTopGradient: string;
        glowBg: string;
        icon: typeof Info;
    }
> = {
    normal: {
        label: 'Normal',
        badgeClassName:
            'border-emerald-200/90 bg-emerald-50/90 text-emerald-800 shadow-2xs',
        iconClassName: 'bg-emerald-100/90 text-emerald-700 ring-4 ring-emerald-500/10',
        borderTopGradient: 'from-emerald-500 via-teal-400 to-emerald-600',
        glowBg: 'from-emerald-500/5 via-teal-500/5 to-transparent',
        icon: Info,
    },
    important: {
        label: 'Penting',
        badgeClassName: 'border-amber-200/90 bg-amber-50/90 text-amber-900 shadow-2xs',
        iconClassName: 'bg-amber-100/90 text-amber-800 ring-4 ring-amber-500/10',
        borderTopGradient: 'from-amber-500 via-yellow-400 to-amber-600',
        glowBg: 'from-amber-500/8 via-yellow-500/5 to-transparent',
        icon: TriangleAlert,
    },
    emergency: {
        label: 'Darurat',
        badgeClassName: 'border-red-200/90 bg-red-50/90 text-red-900 shadow-2xs font-extrabold',
        iconClassName: 'bg-red-100/90 text-red-700 ring-4 ring-red-500/15 animate-pulse',
        borderTopGradient: 'from-red-500 via-rose-400 to-red-600',
        glowBg: 'from-red-500/10 via-rose-500/5 to-transparent',
        icon: CircleAlert,
    },
};

export function PublicAnnouncementCard({
    announcement,
    compact = false,
}: {
    announcement: Announcement;
    compact?: boolean;
}) {
    const presentation = priorityPresentation[announcement.priority];
    const PriorityIcon = presentation.icon;

    return (
        <article
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-village-border/90 bg-white/95 backdrop-blur-md shadow-village-soft transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-village-primary/40 hover:shadow-village-floating motion-reduce:transform-none motion-reduce:transition-none ${
                compact ? 'p-5 sm:p-6' : 'p-6 md:p-8'
            }`}
        >
            {/* Top Glowing Color Accent Bar */}
            <div
                aria-hidden="true"
                className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${presentation.borderTopGradient} transition-opacity duration-300 group-hover:opacity-100`}
            />

            {/* Background Soft Ambient Glow */}
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute -inset-full bg-gradient-to-br ${presentation.glowBg} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />

            {/* Subtle SVG Wave Lines Backdrop Pattern */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -bottom-6 size-48 text-emerald-900/[0.03] transition-transform duration-700 group-hover:scale-110 group-hover:text-emerald-900/[0.05]"
                fill="none"
                viewBox="0 0 200 200"
            >
                <path
                    d="M 0,100 C 40,70 80,130 120,100 C 160,70 200,130 240,100"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <path
                    d="M 0,130 C 40,100 80,160 120,130 C 160,100 200,160 240,130"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
                <path
                    d="M 0,70 C 40,40 80,100 120,70 C 160,40 200,100 240,70"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>

            {/* Pinned Badge */}
            {announcement.pinned && (
                <span className="absolute top-0 right-6 inline-flex items-center gap-1.5 rounded-b-xl bg-gradient-to-r from-village-primary-dark to-emerald-900 px-3.5 py-1.5 text-[0.625rem] font-extrabold tracking-wider text-white uppercase shadow-md transition-transform duration-300 group-hover:translate-y-0.5">
                    <Pin aria-hidden="true" className="size-3 text-amber-300" />
                    Disematkan
                </span>
            )}

            <div>
                {/* Header Icon & Priority Badge */}
                <div className="flex items-start gap-4">
                    <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${presentation.iconClassName}`}
                    >
                        <PriorityIcon aria-hidden="true" className="size-5" />
                    </div>
                    <div className={announcement.pinned ? 'pr-20' : ''}>
                        <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.625rem] font-extrabold tracking-wider uppercase ${presentation.badgeClassName}`}
                        >
                            Prioritas {presentation.label}
                        </span>
                        <h2
                            className={`${
                                compact ? 'mt-2.5 text-lg' : 'mt-3.5 text-xl md:text-2xl'
                            } leading-snug font-extrabold text-village-ink transition-colors group-hover:text-village-primary`}
                        >
                            {announcement.title}
                        </h2>
                    </div>
                </div>

                {/* Announcement Body Summary */}
                <p
                    className={`${
                        compact ? 'mt-3.5 line-clamp-2 text-sm' : 'mt-4 text-sm md:text-base'
                    } leading-relaxed text-slate-600 font-normal`}
                >
                    {announcement.summary}
                </p>
            </div>

            {/* Footer Period Label */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                    <CalendarClock aria-hidden="true" className="size-4 text-village-primary shrink-0" />
                    <span>
                        Berlaku{' '}
                        <time
                            dateTime={announcement.startsAt}
                            data-ends-at={announcement.endsAt}
                            className="font-bold text-slate-700"
                        >
                            {announcement.periodLabel}
                        </time>
                    </span>
                </div>

                <Waves aria-hidden="true" className="size-4 text-emerald-400/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
        </article>
    );
}
