import {
    CalendarDays,
    ChevronDown,
    Clock3,
    MapPin,
    PhoneCall,
    UserRoundCheck,
} from 'lucide-react';
import { useState } from 'react';
import type { VillageAgenda } from '@/lib/dummy-village-agendas';

export function VillageAgendaCard({ agenda }: { agenda: VillageAgenda }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const detailsId = `agenda-details-${agenda.slug}`;
    const isCompleted = agenda.status === 'completed';

    return (
        <article className="group border border-village-border bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-village-primary/35 hover:shadow-village-soft motion-reduce:transform-none motion-reduce:transition-none">
            <div className="grid md:grid-cols-[9.5rem_minmax(0,1fr)]">
                <div
                    className={
                        isCompleted
                            ? 'flex min-h-36 flex-col justify-between border-b border-village-border bg-village-surface-muted p-5 md:border-r md:border-b-0'
                            : 'flex min-h-36 flex-col justify-between border-b border-village-primary/20 bg-village-primary-light p-5 md:border-r md:border-b-0'
                    }
                >
                    <span className="text-xs font-bold tracking-[0.14em] text-village-muted uppercase">
                        {agenda.dayLabel}
                    </span>
                    <div>
                        <span className="block text-4xl leading-none font-bold tracking-tight text-village-primary-dark">
                            {agenda.dateLabel.split(' ')[0]}
                        </span>
                        <span className="mt-1 block text-sm font-semibold text-village-primary">
                            {agenda.dateLabel.split(' ').slice(1).join(' ')}
                        </span>
                    </div>
                </div>

                <div className="p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-village-primary-light px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.1em] text-village-primary-dark uppercase">
                            {agenda.category}
                        </span>
                        <span
                            className={
                                isCompleted
                                    ? 'border border-village-border px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.1em] text-village-muted uppercase'
                                    : 'border border-village-primary/25 px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.1em] text-village-primary uppercase'
                            }
                        >
                            {isCompleted ? 'Selesai' : 'Akan datang'}
                        </span>
                    </div>

                    <h2 className="mt-4 text-xl leading-tight font-bold tracking-tight text-village-ink md:text-2xl">
                        {agenda.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-village-muted">
                        {agenda.summary}
                    </p>

                    <dl className="mt-5 grid gap-3 text-sm text-village-muted sm:grid-cols-2">
                        <div className="flex items-start gap-2.5">
                            <Clock3
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0 text-village-primary"
                            />
                            <div>
                                <dt className="sr-only">Waktu</dt>
                                <dd>{agenda.timeLabel}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <MapPin
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0 text-village-primary"
                            />
                            <div>
                                <dt className="sr-only">Lokasi</dt>
                                <dd>{agenda.location}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <UserRoundCheck
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0 text-village-primary"
                            />
                            <div>
                                <dt className="sr-only">Penyelenggara</dt>
                                <dd>{agenda.organizer}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <CalendarDays
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0 text-village-primary"
                            />
                            <div>
                                <dt className="sr-only">Pendaftaran</dt>
                                <dd>
                                    {agenda.registrationRequired
                                        ? 'Perlu pendaftaran'
                                        : 'Terbuka tanpa pendaftaran'}
                                </dd>
                            </div>
                        </div>
                    </dl>

                    <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        onClick={() => setIsExpanded((expanded) => !expanded)}
                        className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-village-primary/35 text-sm font-bold text-village-primary transition hover:border-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                    >
                        {isExpanded ? 'Tutup rincian' : 'Lihat rincian'}
                        <ChevronDown
                            aria-hidden="true"
                            className={`size-4 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {isExpanded && (
                        <div
                            id={detailsId}
                            className="mt-5 border-t border-village-border pt-5"
                        >
                            <ul className="grid gap-2.5 text-sm leading-6 text-village-muted">
                                {agenda.details.map((detail) => (
                                    <li
                                        key={detail}
                                        className="flex items-start gap-3"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="mt-2.5 size-1.5 shrink-0 bg-village-accent"
                                        />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-village-ink">
                                <PhoneCall
                                    aria-hidden="true"
                                    className="size-4 text-village-primary"
                                />
                                {agenda.contact}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
