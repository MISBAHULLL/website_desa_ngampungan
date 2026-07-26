import {
    CalendarClock,
    CircleAlert,
    Info,
    Pin,
    TriangleAlert,
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
        icon: typeof Info;
    }
> = {
    normal: {
        label: 'Normal',
        badgeClassName:
            'border-village-border bg-village-surface-muted text-village-muted',
        iconClassName: 'bg-village-primary-light text-village-primary',
        icon: Info,
    },
    important: {
        label: 'Penting',
        badgeClassName: 'border-[#efdcae] bg-[#fff8ea] text-[#85560a]',
        iconClassName: 'bg-[#fff2cf] text-[#94620d]',
        icon: TriangleAlert,
    },
    emergency: {
        label: 'Darurat',
        badgeClassName: 'border-red-200 bg-red-50 text-red-700',
        iconClassName: 'bg-red-100 text-red-700',
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
            className={`group relative overflow-hidden rounded-3xl border border-village-border bg-white shadow-village-soft transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-village-primary/30 hover:shadow-village-floating motion-reduce:transform-none motion-reduce:transition-none ${compact ? 'p-5' : 'p-6 md:p-7'}`}
        >
            {announcement.pinned && (
                <span className="absolute top-0 right-6 inline-flex items-center gap-1.5 rounded-b-xl bg-village-primary-dark px-3 py-2 text-[0.625rem] font-bold tracking-wide text-white uppercase">
                    <Pin aria-hidden="true" className="size-3" />
                    Disematkan
                </span>
            )}

            <div className="flex items-start gap-4">
                <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${presentation.iconClassName}`}
                >
                    <PriorityIcon aria-hidden="true" className="size-5" />
                </div>
                <div className={announcement.pinned ? 'pr-20' : ''}>
                    <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[0.625rem] font-bold tracking-wide uppercase ${presentation.badgeClassName}`}
                    >
                        Prioritas {presentation.label}
                    </span>
                    <h2
                        className={`${compact ? 'mt-3 text-lg' : 'mt-4 text-xl'} leading-snug font-bold text-village-ink`}
                    >
                        {announcement.title}
                    </h2>
                </div>
            </div>

            <p
                className={`${compact ? 'mt-4 line-clamp-2 text-sm' : 'mt-5 text-sm md:text-base'} leading-7 text-village-muted`}
            >
                {announcement.summary}
            </p>

            <div className="mt-5 flex items-center gap-2 border-t border-village-border pt-4 text-xs font-medium text-village-muted">
                <CalendarClock aria-hidden="true" className="size-4" />
                <span>
                    Berlaku{' '}
                    <time
                        dateTime={announcement.startsAt}
                        data-ends-at={announcement.endsAt}
                    >
                        {announcement.periodLabel}
                    </time>
                </span>
            </div>
        </article>
    );
}
