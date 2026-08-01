import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarCheck,
    CalendarDays,
    ChevronRight,
    Clock3,
    MapPin,
    Search,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageAgendaCard } from '@/components/village-agenda-card';
import { dummyVillageAgendas } from '@/lib/dummy-village-agendas';
import type {
    VillageAgenda,
    VillageAgendaStatus,
} from '@/lib/dummy-village-agendas';
import { home } from '@/routes';
import { index as galleryIndex } from '@/routes/gallery';

type AgendaIndexPageProps = {
    canonicalUrl: string;
    dbAgendas?: VillageAgenda[];
};

export default function AgendaIndex({
    canonicalUrl,
    dbAgendas,
}: AgendaIndexPageProps) {
    const [activeStatus, setActiveStatus] =
        useState<VillageAgendaStatus>('upcoming');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    const agendasList = useMemo(() => {
        if (dbAgendas && dbAgendas.length > 0) {
            return dbAgendas;
        }
        return dummyVillageAgendas;
    }, [dbAgendas]);

    const upcomingAgendas = useMemo(
        () => agendasList.filter((a) => a.status === 'upcoming'),
        [agendasList],
    );
    const completedAgendas = useMemo(
        () => agendasList.filter((a) => a.status === 'completed'),
        [agendasList],
    );
    const featuredAgenda = useMemo(
        () =>
            agendasList.find((a) => a.featured && a.status === 'upcoming') ||
            upcomingAgendas[0],
        [agendasList, upcomingAgendas],
    );

    const categoriesList = useMemo(() => {
        const cats = Array.from(new Set(agendasList.map((a) => a.category)));
        return ['Semua', ...cats];
    }, [agendasList]);

    const visibleAgendas = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase('id-ID');

        return agendasList.filter((agenda) => {
            const matchesStatus = agenda.status === activeStatus;
            const matchesCategory =
                selectedCategory === 'Semua' ||
                agenda.category === selectedCategory;
            const matchesQuery =
                normalizedQuery === '' ||
                agenda.title
                    .toLocaleLowerCase('id-ID')
                    .includes(normalizedQuery) ||
                agenda.location
                    .toLocaleLowerCase('id-ID')
                    .includes(normalizedQuery);

            return matchesStatus && matchesCategory && matchesQuery;
        });
    }, [activeStatus, searchQuery, selectedCategory, agendasList]);

    function changeStatus(status: VillageAgendaStatus) {
        setActiveStatus(status);
        setSelectedCategory('Semua');
        setSearchQuery('');
    }

    const pageDescription =
        'Jadwal kegiatan, pelayanan, musyawarah, dan agenda masyarakat Desa Ngampungan.';

    return (
        <PublicPageShell activeSection="agenda">
            <Head>
                <title>Agenda Desa</title>
                <meta
                    head-key="description"
                    name="description"
                    content={pageDescription}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content="Agenda Desa Ngampungan"
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={pageDescription}
                />
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={canonicalUrl}
                />
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={canonicalUrl}
                />
            </Head>

            {/* LIGHT THEME HERO HEADER */}
            <section className="border-b border-slate-200 bg-white py-12 md:py-18">
                <div className="mx-auto grid max-w-[1280px] gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:px-12">
                    <div>
                        <nav
                            aria-label="Breadcrumb"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-600"
                        >
                            <Link
                                href={home()}
                                className="transition hover:text-emerald-700"
                            >
                                Beranda
                            </Link>
                            <ChevronRight
                                aria-hidden="true"
                                className="size-3.5 text-slate-400"
                            />
                            <span className="font-bold text-emerald-800">
                                Agenda Desa
                            </span>
                        </nav>

                        <h1 className="mt-6 max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                            Agenda Desa Ngampungan
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                            Temukan jadwal pelayanan publik, kegiatan
                            kemasyarakatan, musyawarah desa, dan program kerja
                            pemberdayaan dalam satu platform resmi.
                        </p>
                    </div>

                    {/* Stats Counter Light Cards */}
                    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-xs">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center transition-all duration-300 hover:border-emerald-300 hover:shadow-sm">
                            <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
                                Mendatang
                            </span>
                            <strong className="mt-2 block text-4xl font-black text-slate-900">
                                {upcomingAgendas.length}
                            </strong>
                            <span className="mt-1 block text-xs text-slate-500">
                                kegiatan terdaftar
                            </span>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center transition-all duration-300 hover:border-emerald-300 hover:shadow-sm">
                            <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
                                Selesai
                            </span>
                            <strong className="mt-2 block text-4xl font-black text-slate-900">
                                {completedAgendas.length}
                            </strong>
                            <span className="mt-1 block text-xs text-slate-500">
                                agenda terlaksana
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED UPCOMING AGENDA BANNER */}
            {featuredAgenda && (
                <section
                    aria-labelledby="agenda-terdekat-heading"
                    className="border-b border-slate-200 bg-slate-50/70 py-12 md:py-16"
                >
                    <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                        <div className="group grid overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-xs transition-all duration-300 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-950/5 lg:grid-cols-[18rem_minmax(0,1fr)]">
                            {/* Date Badge Side Banner */}
                            <div className="group-hover:bg-emerald-850 flex min-h-64 flex-col justify-between bg-emerald-800 p-8 text-white transition-colors duration-300">
                                <div className="flex size-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 transition-transform duration-300 group-hover:scale-110">
                                    <CalendarCheck
                                        aria-hidden="true"
                                        className="size-6 text-emerald-200"
                                    />
                                </div>
                                <div>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-widest text-emerald-100 uppercase">
                                        Agenda Terdekat
                                    </span>
                                    <p className="mt-4 origin-left text-5xl leading-none font-black tracking-tight text-white transition-transform duration-300 group-hover:scale-105">
                                        {featuredAgenda.dateLabel.split(' ')[0]}
                                    </p>
                                    <p className="mt-2 text-sm font-bold tracking-wider text-emerald-200 uppercase">
                                        {featuredAgenda.dateLabel
                                            .split(' ')
                                            .slice(1)
                                            .join(' ')}
                                    </p>
                                </div>
                            </div>

                            {/* Info Details */}
                            <div className="flex flex-col justify-between p-8 md:p-10">
                                <div>
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                                        {featuredAgenda.category}
                                    </span>
                                    <h2
                                        id="agenda-terdekat-heading"
                                        className="mt-4 max-w-3xl text-2xl leading-snug font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-emerald-800 md:text-3xl"
                                    >
                                        {featuredAgenda.title}
                                    </h2>
                                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                                        {featuredAgenda.summary}
                                    </p>
                                </div>

                                <div className="mt-8 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-700 transition-colors group-hover:border-slate-300 sm:grid-cols-2">
                                    <span className="flex items-center gap-2.5">
                                        <Clock3
                                            aria-hidden="true"
                                            className="size-4 text-emerald-700"
                                        />
                                        <span>
                                            Waktu: {featuredAgenda.timeLabel}
                                        </span>
                                    </span>
                                    <span className="flex items-center gap-2.5">
                                        <MapPin
                                            aria-hidden="true"
                                            className="size-4 text-emerald-700"
                                        />
                                        <span>
                                            Lokasi: {featuredAgenda.location}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* MAIN AGENDA SEARCH & LIST SECTION */}
            <section
                aria-labelledby="daftar-agenda-heading"
                className="bg-white py-12 md:py-18"
            >
                <div className="mx-auto max-w-[1100px] px-5">
                    {/* Header & Status Selector */}
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <p className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
                                Jadwal Terpublikasi
                            </p>
                            <h2
                                id="daftar-agenda-heading"
                                className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl"
                            >
                                Daftar Agenda Desa
                            </h2>
                        </div>

                        {/* Status Toggle Switch */}
                        <div
                            role="tablist"
                            aria-label="Status agenda"
                            className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1.5"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeStatus === 'upcoming'}
                                onClick={() => changeStatus('upcoming')}
                                className={
                                    activeStatus === 'upcoming'
                                        ? 'min-h-10 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition'
                                        : 'min-h-10 rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 transition hover:text-emerald-700'
                                }
                            >
                                Akan Datang ({upcomingAgendas.length})
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeStatus === 'completed'}
                                onClick={() => changeStatus('completed')}
                                className={
                                    activeStatus === 'completed'
                                        ? 'min-h-10 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition'
                                        : 'min-h-10 rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 transition hover:text-emerald-700'
                                }
                            >
                                Selesai ({completedAgendas.length})
                            </button>
                        </div>
                    </div>

                    {/* Search & Category Filter Control */}
                    <div className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                        <div className="relative">
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                id="agenda-search"
                                type="search"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Cari berdasarkan judul agenda atau lokasi..."
                                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-12 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/80 pt-2">
                            <span className="mr-2 text-xs font-bold text-slate-500">
                                Kategori:
                            </span>
                            {categoriesList.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    aria-pressed={selectedCategory === category}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className={
                                        selectedCategory === category
                                            ? 'rounded-full bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-xs'
                                            : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50'
                                    }
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <p aria-live="polite">
                            Menampilkan {visibleAgendas.length} agenda kegiatan
                        </p>
                    </div>

                    {/* Cards Container */}
                    {visibleAgendas.length > 0 ? (
                        <div role="tabpanel" className="mt-6 space-y-5">
                            {visibleAgendas.map((agenda) => (
                                <VillageAgendaCard
                                    key={agenda.slug}
                                    agenda={agenda}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                            <CalendarDays
                                aria-hidden="true"
                                className="mx-auto size-12 text-slate-400"
                            />
                            <h3 className="mt-4 text-xl font-bold text-slate-900">
                                Agenda tidak ditemukan
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Tidak ada jadwal kegiatan yang sesuai dengan
                                kriteria pencarian atau kategori ini.
                            </p>
                        </div>
                    )}

                    {/* Bottom CTA Banner */}
                    <div className="mt-14 flex flex-col justify-between gap-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900">
                                Ingin melihat hasil dokumentasi kegiatan?
                            </h3>
                            <p className="mt-1 text-xs text-slate-600">
                                Foto dan dokumentasi resmi dari setiap kegiatan
                                desa yang telah dilaksanakan tersimpan rapi di
                                Galeri Desa.
                            </p>
                        </div>
                        <Link
                            href={galleryIndex()}
                            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800"
                        >
                            <span>Buka Galeri Foto Desa</span>
                            <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
