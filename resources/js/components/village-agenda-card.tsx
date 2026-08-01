import {
    CalendarDays,
    CheckCircle2,
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
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-950/5">
            <div className="grid md:grid-cols-[9.5rem_minmax(0,1fr)]">
                {/* Date Block Sidebar - Centered Compact Calendar Block */}
                <div
                    className={
                        isCompleted
                            ? 'flex flex-col items-center justify-center border-b border-slate-200 bg-slate-100/80 p-6 text-center transition-colors duration-300 group-hover:bg-slate-200/70 md:border-r md:border-b-0'
                            : 'flex flex-col items-center justify-center border-b border-emerald-100 bg-emerald-50/80 p-6 text-center transition-colors duration-300 group-hover:bg-emerald-100/70 md:border-r md:border-b-0'
                    }
                >
                    <span
                        className={
                            isCompleted
                                ? 'rounded-full bg-slate-200 px-3 py-1 text-[10px] font-extrabold tracking-wider text-slate-700 uppercase'
                                : 'rounded-full border border-emerald-200/80 bg-emerald-100 px-3 py-1 text-[10px] font-extrabold tracking-wider text-emerald-900 uppercase'
                        }
                    >
                        {agenda.dayLabel}
                    </span>
                    <span className="mt-3 block text-4xl leading-none font-black tracking-tight text-emerald-950 transition-transform duration-300 group-hover:scale-110">
                        {agenda.dateLabel.split(' ')[0]}
                    </span>
                    <span className="mt-2 block text-xs font-bold tracking-wider text-emerald-800 uppercase">
                        {agenda.dateLabel.split(' ').slice(1).join(' ')}
                    </span>
                </div>

                {/* Body Details Content */}
                <div className="p-6 md:p-7">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-emerald-200/60 bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-900">
                            {agenda.category}
                        </span>
                        <span
                            className={
                                isCompleted
                                    ? 'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600'
                                    : 'inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800'
                            }
                        >
                            {isCompleted ? (
                                <>
                                    <CheckCircle2 className="size-3 text-slate-400" />
                                    <span>Selesai</span>
                                </>
                            ) : (
                                <>
                                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-600" />
                                    <span>Akan datang</span>
                                </>
                            )}
                        </span>
                    </div>

                    <h2 className="mt-4 text-xl leading-snug font-extrabold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-emerald-700 md:text-2xl">
                        {agenda.title}
                    </h2>
                    <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-slate-600">
                        {agenda.summary}
                    </p>

                    <dl className="mt-5 grid gap-3 text-xs text-slate-700 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 transition-colors group-hover:border-slate-300">
                            <Clock3
                                aria-hidden="true"
                                className="size-4 shrink-0 text-emerald-700"
                            />
                            <div>
                                <dt className="sr-only">Waktu</dt>
                                <dd className="font-semibold text-slate-800">
                                    {agenda.timeLabel}
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 transition-colors group-hover:border-slate-300">
                            <MapPin
                                aria-hidden="true"
                                className="size-4 shrink-0 text-emerald-700"
                            />
                            <div>
                                <dt className="sr-only">Lokasi</dt>
                                <dd className="font-semibold text-slate-800">
                                    {agenda.location}
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 transition-colors group-hover:border-slate-300">
                            <UserRoundCheck
                                aria-hidden="true"
                                className="size-4 shrink-0 text-emerald-700"
                            />
                            <div>
                                <dt className="sr-only">Penyelenggara</dt>
                                <dd className="font-semibold text-slate-800">
                                    {agenda.organizer}
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 transition-colors group-hover:border-slate-300">
                            <CalendarDays
                                aria-hidden="true"
                                className="size-4 shrink-0 text-emerald-700"
                            />
                            <div>
                                <dt className="sr-only">Pendaftaran</dt>
                                <dd className="font-semibold text-slate-800">
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
                        className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-emerald-800 transition-all hover:border-emerald-300 hover:bg-emerald-100/80 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                    >
                        <span>
                            {isExpanded
                                ? 'Sembunyikan rincian'
                                : 'Lihat rincian lengkap'}
                        </span>
                        <ChevronDown
                            aria-hidden="true"
                            className={`size-4 transition-transform duration-300 ${
                                isExpanded ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {isExpanded && (
                        <div
                            id={detailsId}
                            className="mt-5 animate-in rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 duration-300 fade-in slide-in-from-top-2"
                        >
                            <h3 className="mb-3 text-xs font-extrabold tracking-wider text-emerald-900 uppercase">
                                Rincian Agenda & Ketentuan:
                            </h3>
                            <ul className="space-y-2 text-xs leading-relaxed text-slate-700">
                                {agenda.details.map((detail) => (
                                    <li
                                        key={detail}
                                        className="flex items-start gap-2.5"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-600"
                                        />
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 flex items-center gap-2 border-t border-emerald-200/80 pt-3 text-xs font-bold text-emerald-900">
                                <PhoneCall
                                    aria-hidden="true"
                                    className="size-4 text-emerald-700"
                                />
                                <span>Kontak Informasi: {agenda.contact}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
