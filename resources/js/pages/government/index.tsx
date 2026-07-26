import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    ChevronRight,
    CircleUserRound,
    FileText,
    Info,
    Landmark,
    Network,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageOfficialCard } from '@/components/village-official-card';
import { VillageOrganizationChart } from '@/components/village-organization-chart';
import {
    dummyVillageInstitutions,
    dummyVillageOfficials,
} from '@/lib/dummy-village-government';
import type { VillageOfficialGroup } from '@/lib/dummy-village-government';
import { home } from '@/routes';
import { show as officialShow } from '@/routes/government/officials';

type VillageGovernmentPageProps = {
    canonicalUrl: string;
};

type OfficialFilter = 'all' | Exclude<VillageOfficialGroup, 'leadership'>;

const governmentSectionLinks = [
    {
        label: 'Kepala Desa',
        href: '#kepala-desa',
        icon: CircleUserRound,
    },
    {
        label: 'Struktur Organisasi',
        href: '#struktur-organisasi',
        icon: Network,
    },
    {
        label: 'Perangkat Desa',
        href: '#perangkat-desa',
        icon: Users,
    },
    {
        label: 'Lembaga Desa',
        href: '#lembaga-desa',
        icon: Landmark,
    },
] as const;

const officialFilters: {
    key: OfficialFilter;
    label: string;
}[] = [
    { key: 'all', label: 'Semua Perangkat' },
    { key: 'secretariat', label: 'Sekretariat' },
    { key: 'technical', label: 'Pelaksana Teknis' },
    { key: 'territorial', label: 'Kewilayahan' },
];

export default function VillageGovernmentIndex({
    canonicalUrl,
}: VillageGovernmentPageProps) {
    const [activeOfficialFilter, setActiveOfficialFilter] =
        useState<OfficialFilter>('all');
    const villageHead = dummyVillageOfficials.find(
        (official) => official.group === 'leadership',
    );
    const villageApparatus = dummyVillageOfficials.filter(
        (official) => official.group !== 'leadership',
    );
    const visibleOfficials =
        activeOfficialFilter === 'all'
            ? villageApparatus
            : villageApparatus.filter(
                  (official) => official.group === activeOfficialFilter,
              );
    const pageDescription =
        'Informasi Pemerintah Desa Ngampungan yang memuat profil Kepala Desa, struktur organisasi, perangkat desa, dan lembaga desa.';

    if (!villageHead) {
        return null;
    }

    return (
        <PublicPageShell activeSection="government">
            <Head>
                <title>Pemerintahan Desa Ngampungan</title>
                <meta
                    head-key="description"
                    name="description"
                    content={pageDescription}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content="Pemerintahan Desa Ngampungan"
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={pageDescription}
                />
                <meta head-key="og:type" property="og:type" content="website" />
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

            <section className="relative isolate overflow-hidden bg-village-primary-dark text-white">
                <div
                    aria-hidden="true"
                    className="absolute inset-y-0 right-0 -z-10 w-[42%] border-l border-white/10 bg-white/[0.035]"
                />
                <div
                    aria-hidden="true"
                    className="absolute -top-28 right-[7%] -z-10 size-80 rounded-full border-[56px] border-white/[0.035]"
                />

                <div className="mx-auto max-w-[1280px] px-5 py-14 md:py-20 lg:px-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-sm text-white/65"
                    >
                        <Link
                            href={home()}
                            className="transition hover:text-white focus-visible:ring-2 focus-visible:ring-village-accent focus-visible:outline-none"
                        >
                            Beranda
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-4 text-white/35"
                        />
                        <span aria-current="page" className="text-white">
                            Pemerintahan Desa
                        </span>
                    </nav>

                    <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
                        <div className="max-w-3xl lg:col-span-8">
                            <p className="text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                                Tata Kelola Desa
                            </p>
                            <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
                                Pemerintahan Desa Ngampungan
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                                Mengenal pimpinan, aparatur, susunan organisasi,
                                dan lembaga yang mendukung pelayanan masyarakat
                                Desa Ngampungan.
                            </p>
                        </div>

                        <dl className="grid grid-cols-2 border-y border-white/15 lg:col-span-4">
                            <div className="border-r border-white/15 py-5 pr-5">
                                <dt className="text-xs tracking-[0.14em] text-white/55 uppercase">
                                    Perangkat
                                </dt>
                                <dd className="mt-2 text-2xl font-bold">
                                    {villageApparatus.length}
                                </dd>
                            </div>
                            <div className="py-5 pl-5">
                                <dt className="text-xs tracking-[0.14em] text-white/55 uppercase">
                                    Lembaga
                                </dt>
                                <dd className="mt-2 text-2xl font-bold">
                                    {dummyVillageInstitutions.length}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            <nav
                aria-label="Daftar isi Pemerintahan Desa"
                className="sticky top-20 z-40 border-b border-village-border bg-white/95 backdrop-blur-xl"
            >
                <div className="mx-auto flex max-w-[1280px] [scrollbar-width:none] gap-2 overflow-x-auto px-5 py-3 [-ms-overflow-style:none] lg:px-12 [&::-webkit-scrollbar]:hidden">
                    {governmentSectionLinks.map((section) => (
                        <a
                            key={section.href}
                            href={section.href}
                            className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-village-border bg-white px-4 py-2.5 text-sm font-bold text-village-muted transition hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary-dark focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                        >
                            <section.icon
                                aria-hidden="true"
                                className="size-4"
                            />
                            {section.label}
                        </a>
                    ))}
                </div>
            </nav>

            <section
                id="kepala-desa"
                aria-labelledby="kepala-desa-heading"
                className="scroll-mt-40 bg-village-canvas py-14 md:py-20"
            >
                <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 lg:grid-cols-12 lg:gap-16 lg:px-12">
                    <div className="lg:col-span-5">
                        <figure className="group relative mx-auto max-w-md">
                            <div
                                aria-hidden="true"
                                className="absolute inset-y-5 -right-3 w-full border border-village-primary/20 bg-village-primary-light/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                            />
                            <div className="relative aspect-[4/5] overflow-hidden border border-village-border bg-white shadow-village-soft">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-village-primary-light to-transparent"
                                />
                                <img
                                    src={villageHead.photo ?? ''}
                                    alt={`Ilustrasi sementara ${villageHead.name}`}
                                    className="relative h-full w-full object-contain object-bottom p-5 transition-transform duration-300 group-hover:scale-[1.02]"
                                />
                                <span className="absolute top-5 left-5 bg-[#fff2cf] px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.12em] text-[#755018] uppercase">
                                    Foto sementara
                                </span>
                            </div>
                        </figure>
                    </div>

                    <div className="lg:col-span-7">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            01 · Kepala Desa
                        </p>
                        <h2
                            id="kepala-desa-heading"
                            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
                        >
                            {villageHead.name}
                        </h2>
                        <p className="mt-2 text-lg font-semibold text-village-primary">
                            {villageHead.position}
                        </p>
                        <blockquote className="mt-7 border-l-2 border-village-accent pl-5 text-xl leading-8 font-semibold text-village-ink">
                            “Melayani dengan transparan dan dekat dengan warga.”
                        </blockquote>
                        <p className="mt-6 max-w-3xl leading-8 text-village-muted">
                            {villageHead.summary}
                        </p>

                        <dl className="mt-8 grid gap-4 border-y border-village-border py-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-bold tracking-[0.12em] text-village-muted uppercase">
                                    Periode
                                </dt>
                                <dd className="mt-2 font-bold">
                                    {villageHead.term}{' '}
                                    <span className="font-normal text-village-muted">
                                        (simulasi)
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-bold tracking-[0.12em] text-village-muted uppercase">
                                    Fokus Pelayanan
                                </dt>
                                <dd className="mt-2 font-bold">
                                    Pelayanan publik dan pembangunan
                                </dd>
                            </div>
                        </dl>

                        <Link
                            href={officialShow(villageHead.slug)}
                            className="mt-8 inline-flex min-h-11 items-center gap-2 bg-village-primary px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-village-primary-dark hover:shadow-lg focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            Baca profil Kepala Desa
                            <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <section
                id="struktur-organisasi"
                aria-labelledby="struktur-organisasi-heading"
                className="scroll-mt-40 border-t border-village-border bg-village-surface-muted py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            02 · Susunan Pemerintahan
                        </p>
                        <h2
                            id="struktur-organisasi-heading"
                            className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                        >
                            Struktur Organisasi
                        </h2>
                        <p className="mt-4 leading-7 text-village-muted">
                            Hubungan kerja antara Kepala Desa, Sekretariat,
                            Pelaksana Teknis, dan Pelaksana Kewilayahan.
                        </p>
                    </div>

                    <div className="mt-9">
                        <VillageOrganizationChart />
                    </div>
                </div>
            </section>

            <section
                id="perangkat-desa"
                aria-labelledby="perangkat-desa-heading"
                className="scroll-mt-40 border-t border-village-border bg-white py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                03 · Aparatur Desa
                            </p>
                            <h2
                                id="perangkat-desa-heading"
                                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Perangkat Desa
                            </h2>
                            <p className="mt-4 leading-7 text-village-muted">
                                Pilih kelompok jabatan lalu buka profil untuk
                                melihat tugas, fokus layanan, dan riwayat
                                perangkat.
                            </p>
                        </div>
                        <p
                            aria-live="polite"
                            className="text-sm font-semibold text-village-muted"
                        >
                            {visibleOfficials.length} profil ditampilkan
                        </p>
                    </div>

                    <div
                        role="group"
                        aria-label="Filter kelompok perangkat desa"
                        className="mt-8 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {officialFilters.map((filter) => (
                            <button
                                key={filter.key}
                                type="button"
                                aria-pressed={
                                    activeOfficialFilter === filter.key
                                }
                                onClick={() =>
                                    setActiveOfficialFilter(filter.key)
                                }
                                className={
                                    activeOfficialFilter === filter.key
                                        ? 'min-h-11 shrink-0 bg-village-primary px-4 py-2.5 text-sm font-bold text-white'
                                        : 'min-h-11 shrink-0 border border-village-border bg-white px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:border-village-primary hover:text-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none'
                                }
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {visibleOfficials.map((official) => (
                            <VillageOfficialCard
                                key={official.slug}
                                official={official}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="lembaga-desa"
                aria-labelledby="lembaga-desa-heading"
                className="scroll-mt-40 border-t border-village-border bg-village-canvas py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-4">
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                04 · Mitra Pemerintahan
                            </p>
                            <h2
                                id="lembaga-desa-heading"
                                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Lembaga Desa
                            </h2>
                            <p className="mt-4 leading-7 text-village-muted">
                                Lembaga yang membantu menyalurkan aspirasi,
                                menggerakkan pemberdayaan, dan memperkuat
                                partisipasi masyarakat.
                            </p>

                            <div className="mt-8 flex items-start gap-3 border border-[#efdcae] bg-[#fff8ea] p-4 text-sm leading-6 text-[#755018]">
                                <Info
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0"
                                />
                                Nama pengurus dan jumlah anggota masih berupa
                                simulasi.
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
                            {dummyVillageInstitutions.map(
                                (institution, index) => (
                                    <article
                                        key={institution.acronym}
                                        className="group border border-village-border bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-village-primary/40 hover:shadow-village-soft"
                                    >
                                        <div className="flex items-start justify-between gap-5">
                                            <span className="flex min-h-12 min-w-12 items-center justify-center bg-village-primary-light px-3 text-sm font-bold text-village-primary-dark">
                                                {institution.acronym}
                                            </span>
                                            <span className="text-4xl font-bold text-village-primary/[0.08]">
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                        </div>
                                        <h3 className="mt-6 text-xl font-bold">
                                            {institution.name}
                                        </h3>
                                        <p className="mt-3 leading-7 text-village-muted">
                                            {institution.focus}
                                        </p>

                                        <dl className="mt-6 grid grid-cols-2 border-y border-village-border py-4 text-sm">
                                            <div className="pr-3">
                                                <dt className="text-village-muted">
                                                    Ketua
                                                </dt>
                                                <dd className="mt-1 font-bold">
                                                    {institution.leader}
                                                </dd>
                                            </div>
                                            <div className="border-l border-village-border pl-4">
                                                <dt className="text-village-muted">
                                                    Anggota
                                                </dt>
                                                <dd className="mt-1 font-bold">
                                                    {institution.memberCount}{' '}
                                                    orang
                                                </dd>
                                            </div>
                                        </dl>

                                        <ul className="mt-5 grid gap-3">
                                            {institution.responsibilities.map(
                                                (responsibility) => (
                                                    <li
                                                        key={responsibility}
                                                        className="flex items-start gap-3 text-sm leading-6 text-village-muted"
                                                    >
                                                        <Check
                                                            aria-hidden="true"
                                                            className="mt-1 size-4 shrink-0 text-village-primary"
                                                        />
                                                        {responsibility}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </article>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-village-border bg-village-primary-dark py-10 text-white">
                <div className="mx-auto grid max-w-[1280px] gap-6 px-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-center lg:px-12">
                    <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-village-accent">
                        <ShieldCheck aria-hidden="true" className="size-5" />
                    </span>
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-lg font-bold">
                                Data simulasi frontend
                            </h2>
                            <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">
                                Nama aparatur, periode, susunan jabatan, serta
                                data lembaga harus diverifikasi sebelum
                                dipublikasikan sebagai informasi resmi.
                            </p>
                        </div>
                        <a
                            href="#struktur-organisasi"
                            className="inline-flex min-h-11 w-fit items-center gap-2 border border-white/20 px-4 py-2.5 text-sm font-bold transition hover:border-white/50 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-village-accent focus-visible:outline-none"
                        >
                            <FileText aria-hidden="true" className="size-4" />
                            Lihat kembali struktur
                        </a>
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
