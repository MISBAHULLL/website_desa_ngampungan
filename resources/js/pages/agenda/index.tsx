import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarCheck,
    CalendarDays,
    ChevronRight,
    Clock3,
    MapPin,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageAgendaCard } from '@/components/village-agenda-card';
import {
    completedDummyVillageAgendas,
    dummyVillageAgendas,
    featuredDummyVillageAgenda,
    upcomingDummyVillageAgendas,
} from '@/lib/dummy-village-agendas';
import type { VillageAgendaStatus } from '@/lib/dummy-village-agendas';
import { home } from '@/routes';
import { index as galleryIndex } from '@/routes/gallery';

type AgendaIndexPageProps = {
    canonicalUrl: string;
};

const agendaCategories = [
    'Semua',
    ...new Set(dummyVillageAgendas.map((agenda) => agenda.category)),
];

export default function AgendaIndex({ canonicalUrl }: AgendaIndexPageProps) {
    const [activeStatus, setActiveStatus] =
        useState<VillageAgendaStatus>('upcoming');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    const visibleAgendas = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase('id-ID');

        return dummyVillageAgendas.filter((agenda) => {
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
    }, [activeStatus, searchQuery, selectedCategory]);

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

            <section className="relative overflow-hidden bg-village-primary-dark text-white">
                <div
                    aria-hidden="true"
                    className="absolute top-0 right-0 size-80 translate-x-1/3 -translate-y-1/3 rounded-full border-[3.5rem] border-white/5"
                />
                <div className="relative mx-auto grid max-w-[1280px] gap-10 px-5 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:px-12">
                    <div>
                        <nav
                            aria-label="Breadcrumb"
                            className="flex items-center gap-2 text-sm text-white/70"
                        >
                            <Link href={home()} className="hover:text-white">
                                Beranda
                            </Link>
                            <ChevronRight
                                aria-hidden="true"
                                className="size-4"
                            />
                            <span className="font-semibold text-white">
                                Agenda Desa
                            </span>
                        </nav>
                        <p className="mt-10 text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                            Kalender Kegiatan Warga
                        </p>
                        <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-bold tracking-tight md:text-6xl">
                            Agenda Desa Ngampungan
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                            Temukan jadwal pelayanan, kegiatan masyarakat,
                            musyawarah, dan program pemberdayaan dalam satu
                            tempat.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 border border-white/20 bg-white/5 backdrop-blur-sm">
                        <div className="border-r border-white/20 p-5">
                            <span className="text-xs tracking-[0.13em] text-white/60 uppercase">
                                Mendatang
                            </span>
                            <strong className="mt-2 block text-3xl">
                                {upcomingDummyVillageAgendas.length}
                            </strong>
                        </div>
                        <div className="p-5">
                            <span className="text-xs tracking-[0.13em] text-white/60 uppercase">
                                Selesai
                            </span>
                            <strong className="mt-2 block text-3xl">
                                {completedDummyVillageAgendas.length}
                            </strong>
                        </div>
                    </div>
                </div>
            </section>

            {featuredDummyVillageAgenda && (
                <section
                    aria-labelledby="agenda-terdekat-heading"
                    className="border-b border-village-border bg-white py-12 md:py-16"
                >
                    <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                        <div className="grid overflow-hidden border border-village-primary/25 bg-village-primary-light lg:grid-cols-[16rem_minmax(0,1fr)]">
                            <div className="flex min-h-64 flex-col justify-between bg-village-primary p-7 text-white">
                                <div className="flex size-12 items-center justify-center border border-white/25 bg-white/10">
                                    <CalendarCheck
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-bold tracking-[0.18em] text-white/65 uppercase">
                                        Agenda Terdekat
                                    </p>
                                    <p className="mt-3 text-4xl leading-none font-bold">
                                        {
                                            featuredDummyVillageAgenda.dateLabel.split(
                                                ' ',
                                            )[0]
                                        }
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-white/80">
                                        {featuredDummyVillageAgenda.dateLabel
                                            .split(' ')
                                            .slice(1)
                                            .join(' ')}
                                    </p>
                                </div>
                            </div>

                            <div className="p-7 md:p-10">
                                <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                    {featuredDummyVillageAgenda.category}
                                </p>
                                <h2
                                    id="agenda-terdekat-heading"
                                    className="mt-3 max-w-3xl text-2xl leading-tight font-bold tracking-tight md:text-4xl"
                                >
                                    {featuredDummyVillageAgenda.title}
                                </h2>
                                <p className="mt-4 max-w-3xl leading-7 text-village-muted">
                                    {featuredDummyVillageAgenda.summary}
                                </p>
                                <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
                                    <span className="flex items-center gap-2.5 font-semibold">
                                        <Clock3
                                            aria-hidden="true"
                                            className="size-4 text-village-primary"
                                        />
                                        {featuredDummyVillageAgenda.timeLabel}
                                    </span>
                                    <span className="flex items-center gap-2.5 font-semibold">
                                        <MapPin
                                            aria-hidden="true"
                                            className="size-4 text-village-primary"
                                        />
                                        {featuredDummyVillageAgenda.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section
                aria-labelledby="daftar-agenda-heading"
                className="py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1100px] px-5">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                Jadwal Terpublikasi
                            </p>
                            <h2
                                id="daftar-agenda-heading"
                                className="mt-2 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Daftar Agenda
                            </h2>
                        </div>

                        <div
                            role="tablist"
                            aria-label="Status agenda"
                            className="inline-flex self-start border border-village-border bg-white p-1.5"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeStatus === 'upcoming'}
                                onClick={() => changeStatus('upcoming')}
                                className={
                                    activeStatus === 'upcoming'
                                        ? 'min-h-10 bg-village-primary px-4 py-2 text-sm font-bold text-white'
                                        : 'min-h-10 px-4 py-2 text-sm font-semibold text-village-muted hover:text-village-primary'
                                }
                            >
                                Akan Datang (
                                {upcomingDummyVillageAgendas.length})
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeStatus === 'completed'}
                                onClick={() => changeStatus('completed')}
                                className={
                                    activeStatus === 'completed'
                                        ? 'min-h-10 bg-village-primary px-4 py-2 text-sm font-bold text-white'
                                        : 'min-h-10 px-4 py-2 text-sm font-semibold text-village-muted hover:text-village-primary'
                                }
                            >
                                Selesai ({completedDummyVillageAgendas.length})
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-5 border-y border-village-border py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                        <div>
                            <label
                                htmlFor="agenda-search"
                                className="text-sm font-bold"
                            >
                                Cari agenda atau lokasi
                            </label>
                            <div className="relative mt-2">
                                <Search
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-village-muted"
                                />
                                <input
                                    id="agenda-search"
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    placeholder="Contoh: posyandu atau balai desa"
                                    className="min-h-12 w-full border border-village-border bg-white py-3 pr-4 pl-12 outline-hidden transition focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                />
                            </div>
                        </div>
                        <div
                            role="group"
                            aria-label="Filter kategori agenda"
                            className="flex max-w-xl flex-wrap gap-2"
                        >
                            {agendaCategories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    aria-pressed={selectedCategory === category}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className={
                                        selectedCategory === category
                                            ? 'min-h-10 bg-village-primary px-3.5 py-2 text-xs font-bold text-white'
                                            : 'min-h-10 border border-village-border bg-white px-3.5 py-2 text-xs font-semibold text-village-muted transition hover:border-village-primary hover:text-village-primary'
                                    }
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p
                        aria-live="polite"
                        className="mt-6 text-sm font-medium text-village-muted"
                    >
                        {visibleAgendas.length} agenda ditemukan · data simulasi
                        frontend
                    </p>

                    {visibleAgendas.length > 0 ? (
                        <div role="tabpanel" className="mt-6 grid gap-5">
                            {visibleAgendas.map((agenda) => (
                                <VillageAgendaCard
                                    key={agenda.slug}
                                    agenda={agenda}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 border border-dashed border-village-border bg-white px-6 py-16 text-center">
                            <CalendarDays
                                aria-hidden="true"
                                className="mx-auto size-10 text-village-muted"
                            />
                            <h3 className="mt-4 text-xl font-bold">
                                Agenda tidak ditemukan
                            </h3>
                            <p className="mt-2 text-sm text-village-muted">
                                Coba gunakan kata kunci atau kategori lain.
                            </p>
                        </div>
                    )}

                    <div className="mt-12 flex flex-col justify-between gap-5 border-t border-village-border pt-8 sm:flex-row sm:items-center">
                        <p className="max-w-xl text-sm leading-6 text-village-muted">
                            Setelah kegiatan selesai, dokumentasinya dapat
                            dipublikasikan pada Galeri Desa.
                        </p>
                        <Link
                            href={galleryIndex()}
                            className="inline-flex min-h-11 items-center gap-2 self-start border border-village-border bg-white px-4 py-2.5 text-sm font-bold transition hover:border-village-primary hover:text-village-primary"
                        >
                            Buka Galeri Desa
                            <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
