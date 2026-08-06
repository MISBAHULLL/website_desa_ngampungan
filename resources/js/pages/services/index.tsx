import { Head, Link } from '@inertiajs/react';
import {
    BadgeCheck,
    ChevronRight,
    FileCheck2,
    Filter,
    Search,
    Sparkles,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { FadeIn } from '@/components/animations/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger';
import { PublicPageShell } from '@/components/public-page-shell';
import { home } from '@/routes';
import { index as servicesIndex, show as serviceShow } from '@/routes/services';

export type VillageServiceCategoryKey =
    | 'administration'
    | 'population'
    | 'agriculture'
    | 'reports';

export type VillageServiceFilter = VillageServiceCategoryKey | 'all';

export const villageServiceCategories: {
    key: VillageServiceCategoryKey;
    label: string;
    shortLabel: string;
    description: string;
}[] = [
    {
        key: 'administration',
        label: 'Administrasi Umum',
        shortLabel: 'Administrasi',
        description:
            'Layanan persuratan dan administrasi umum untuk keperluan warga Desa Ngampungan.',
    },
    {
        key: 'population',
        label: 'Kependudukan',
        shortLabel: 'Kependudukan',
        description:
            'Layanan pencatatan sipil dan kependudukan seperti KTP, KK, dan surat kelahiran.',
    },
    {
        key: 'agriculture',
        label: 'Pertanian & Peternakan',
        shortLabel: 'Pertanian',
        description:
            'Layanan administrasi terkait kelompok tani, pupuk bersubsidi, dan usaha ternak.',
    },
    {
        key: 'reports',
        label: 'Pengaduan Masyarakat',
        shortLabel: 'Pengaduan',
        description:
            'Layanan pengaduan terkait fasilitas umum, keamanan, dan ketertiban desa.',
    },
];

export function findVillageServiceCategory(key: string) {
    return (
        villageServiceCategories.find((cat) => cat.key === key) ||
        villageServiceCategories[0]
    );
}

const categoryPresentation: Record<
    VillageServiceCategoryKey,
    {
        iconSrc: string;
        accentClassName: string;
        badgeClassName: string;
    }
> = {
    administration: {
        iconSrc: '/assets/dokumen.png',
        accentClassName: 'bg-emerald-600',
        badgeClassName:
            'bg-emerald-100/70 text-emerald-800 border border-emerald-200/80',
    },
    population: {
        iconSrc: '/assets/penduduk.png',
        accentClassName: 'bg-blue-600',
        badgeClassName:
            'bg-blue-100/70 text-blue-800 border border-blue-200/80',
    },
    agriculture: {
        iconSrc: '/assets/pertanian.png',
        accentClassName: 'bg-amber-600',
        badgeClassName:
            'bg-amber-100/70 text-amber-800 border border-amber-200/80',
    },
    reports: {
        iconSrc: '/assets/darurat.png',
        accentClassName: 'bg-rose-600',
        badgeClassName:
            'bg-rose-100/70 text-rose-800 border border-rose-200/80',
    },
};

type ServiceData = {
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    audience: string;
    channel: string;
    estimatedDuration: string;
    fee: string;
    requirementsCount: number;
    documentRequirementsCount: number;
};

type ServiceIndexPageProps = {
    services: ServiceData[];
    initialCategory: VillageServiceFilter;
    canonicalUrl: string;
};

export default function ServiceIndex({
    services,
    initialCategory,
    canonicalUrl,
}: ServiceIndexPageProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const visibleServices = useMemo(() => {
        let categoryServices = services;
        if (initialCategory !== 'all') {
            categoryServices = services.filter(
                (s) => s.category === initialCategory,
            );
        }

        const normalizedQuery = searchQuery.trim().toLocaleLowerCase('id-ID');

        if (normalizedQuery === '') {
            return categoryServices;
        }

        return categoryServices.filter((service) =>
            [
                service.title,
                service.shortDescription,
                service.audience,
                service.channel,
            ].some((value) =>
                value.toLocaleLowerCase('id-ID').includes(normalizedQuery),
            ),
        );
    }, [services, initialCategory, searchQuery]);

    const activeCategory =
        initialCategory === 'all'
            ? null
            : findVillageServiceCategory(initialCategory);
    const pageDescription =
        'Direktori informasi pelayanan administrasi, kependudukan, pertanian, dan pengaduan Desa Ngampungan.';

    return (
        <PublicPageShell activeSection="services">
            <Head>
                <title>Informasi Pelayanan Desa Ngampungan</title>
                <meta
                    head-key="description"
                    name="description"
                    content={pageDescription}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content="Informasi Pelayanan Desa Ngampungan"
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

            {/* HERO HEADER SECTION */}
            <section className="bg-village-primary-dark text-white">
                <FadeIn
                    direction="up"
                    duration={0.5}
                    className="mx-auto max-w-[1280px] px-5 py-12 md:py-16 lg:px-12"
                >
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                        <div className="max-w-3xl lg:col-span-8">
                            <nav
                                aria-label="Breadcrumb"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90"
                            >
                                <Link
                                    href={home()}
                                    className="transition hover:text-emerald-300"
                                >
                                    Beranda
                                </Link>
                                <ChevronRight className="size-3 text-emerald-300/80" />
                                <span className="font-bold text-white">
                                    Informasi Pelayanan
                                </span>
                            </nav>

                            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Layanan & Administrasi Publik Desa Ngampungan
                            </h1>
                            <p className="mt-4 text-sm leading-relaxed text-emerald-100/90 sm:text-base lg:text-lg">
                                Temukan informasi persyaratan, alur pengajuan
                                surat, kependudukan, pertanian, serta pengaduan
                                masyarakat secara efisien, transparan, dan
                                terintegrasi.
                            </p>
                        </div>

                        {/* Quick Stats Cards (Solid White High-Contrast Style) */}
                        <div className="grid grid-cols-2 gap-4 lg:col-span-4">
                            <div className="rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-xl shadow-emerald-950/10 transition-all hover:-translate-y-1">
                                <p className="text-4xl font-black text-emerald-950">
                                    {services.length}
                                </p>
                                <p className="mt-1.5 text-xs font-bold tracking-wider text-emerald-800 uppercase">
                                    Total Layanan Publik
                                </p>
                            </div>
                            <div className="rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-xl shadow-emerald-950/10 transition-all hover:-translate-y-1">
                                <p className="text-4xl font-black text-emerald-950">
                                    {villageServiceCategories.length}
                                </p>
                                <p className="mt-1.5 text-xs font-bold tracking-wider text-emerald-800 uppercase">
                                    Kategori Pelayanan
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* MAIN DIRECTORY CONTENT */}
            <section
                aria-labelledby="service-directory-heading"
                className="bg-slate-50/50 py-10 md:py-14"
            >
                <div className="mx-auto max-w-[1280px] space-y-6 px-5 lg:px-12">
                    {/* HORIZONTAL CATEGORY FILTER BAR */}
                    <FadeIn
                        direction="up"
                        duration={0.5}
                        className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-xs sm:p-5"
                    >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex shrink-0 items-center gap-2.5">
                                <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                    <Filter className="size-4" />
                                </div>
                                <div>
                                    <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                                        Filter Kategori:
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        Pilih kategori layanan yang ingin
                                        ditampilkan
                                    </p>
                                </div>
                            </div>

                            {/* Horizontal Pill Filters */}
                            <nav
                                aria-label="Kategori Layanan"
                                className="flex flex-wrap items-center gap-2"
                            >
                                <Link
                                    href={servicesIndex()}
                                    preserveScroll
                                    className={
                                        initialCategory === 'all'
                                            ? 'inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition-all'
                                            : 'inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-900'
                                    }
                                >
                                    <span>Semua Layanan</span>
                                    <span
                                        className={
                                            initialCategory === 'all'
                                                ? 'rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black text-white'
                                                : 'rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600'
                                        }
                                    >
                                        {services.length}
                                    </span>
                                </Link>

                                {villageServiceCategories.map((category) => {
                                    const count = services.filter(
                                        (s) => s.category === category.key,
                                    ).length;
                                    const isSelected =
                                        initialCategory === category.key;

                                    return (
                                        <Link
                                            key={category.key}
                                            href={servicesIndex({
                                                query: {
                                                    category: category.key,
                                                },
                                            })}
                                            preserveScroll
                                            className={
                                                isSelected
                                                    ? 'inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition-all'
                                                    : 'inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-900'
                                            }
                                        >
                                            <span>{category.shortLabel}</span>
                                            <span
                                                className={
                                                    isSelected
                                                        ? 'rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black text-white'
                                                        : 'rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600'
                                                }
                                            >
                                                {count}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </FadeIn>

                    {/* DIRECTORY HEADER & SEARCH CONTROL */}
                    <FadeIn
                        direction="up"
                        delay={0.1}
                        duration={0.5}
                        className="space-y-5 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs"
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2
                                    id="service-directory-heading"
                                    className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
                                >
                                    {activeCategory
                                        ? activeCategory.label
                                        : 'Semua Layanan Desa'}
                                </h2>
                                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
                                    {activeCategory
                                        ? activeCategory.description
                                        : 'Ringkasan seluruh layanan publik dan administrasi yang dapat diakses oleh warga Desa Ngampungan.'}
                                </p>
                            </div>

                            <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 sm:self-center">
                                <BadgeCheck className="size-4 text-emerald-600" />
                                Informasi Publik Terverifikasi
                            </span>
                        </div>

                        {/* Search Bar Input */}
                        <div className="relative pt-1">
                            <label htmlFor="service-search" className="sr-only">
                                Cari nama layanan atau sasaran warga
                            </label>
                            <div className="relative">
                                <Search
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="service-search"
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    placeholder="Cari nama layanan, KTP, surat usaha, atau pengaduan..."
                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-10 pl-11 text-sm font-medium text-slate-800 placeholder-slate-400 shadow-2xs transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs font-semibold text-slate-500">
                            <span>
                                Menampilkan {visibleServices.length} layanan
                            </span>
                            {searchQuery && (
                                <span className="text-emerald-700">
                                    Filter pencarian aktif: "{searchQuery}"
                                </span>
                            )}
                        </div>
                    </FadeIn>

                    {/* SERVICE CARDS GRID */}
                    {visibleServices.length > 0 ? (
                        <StaggerContainer
                            staggerDelay={0.08}
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {visibleServices.map((service, index) => {
                                const category = findVillageServiceCategory(
                                    service.category,
                                );
                                const presentation =
                                    categoryPresentation[
                                        service.category as VillageServiceCategoryKey
                                    ];
                                return (
                                    <StaggerItem
                                        key={service.slug}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/5"
                                    >
                                        {/* Top Accent Hover Bar */}
                                        <span
                                            aria-hidden="true"
                                            className={`absolute top-0 left-0 h-1.5 w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${presentation.accentClassName}`}
                                        />

                                        <div className="space-y-4">
                                            {/* Top Row: Asset Image Icon & Category Badge */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-2.5 shadow-2xs transition-colors group-hover:border-emerald-200/80 group-hover:bg-emerald-50/80">
                                                        <img
                                                            src={
                                                                presentation.iconSrc
                                                            }
                                                            alt={service.title}
                                                            className="size-7 object-contain"
                                                        />
                                                    </div>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase ${presentation.badgeClassName}`}
                                                    >
                                                        {category.label}
                                                    </span>
                                                </div>

                                                <span className="font-mono text-xs font-bold tracking-wider text-slate-300 transition-colors group-hover:text-emerald-500">
                                                    #
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                            </div>

                                            {/* Title & Description */}
                                            <div>
                                                <h3 className="text-lg leading-snug font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                                                    {service.title}
                                                </h3>
                                                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
                                                    {service.shortDescription}
                                                </p>
                                            </div>

                                            {/* Metadata Pills Grid */}
                                            <div className="grid grid-cols-3 gap-1.5 pt-2 sm:gap-2">
                                                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-1.5 text-[10px] sm:p-2 sm:text-[11px]">
                                                    <span className="block text-[8px] font-bold tracking-wider text-slate-400 uppercase sm:text-[9px]">
                                                        Sasaran
                                                    </span>
                                                    <span
                                                        className="mt-0.5 block truncate font-semibold text-slate-700"
                                                        title={service.audience}
                                                    >
                                                        {service.audience}
                                                    </span>
                                                </div>
                                                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-1.5 text-[10px] sm:p-2 sm:text-[11px]">
                                                    <span className="block text-[8px] font-bold tracking-wider text-slate-400 uppercase sm:text-[9px]">
                                                        Estimasi
                                                    </span>
                                                    <span
                                                        className="mt-0.5 block truncate font-semibold text-slate-700"
                                                        title={
                                                            service.estimatedDuration
                                                        }
                                                    >
                                                        {
                                                            service.estimatedDuration
                                                        }
                                                    </span>
                                                </div>
                                                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-1.5 text-[10px] sm:p-2 sm:text-[11px]">
                                                    <span className="block text-[8px] font-bold tracking-wider text-slate-400 uppercase sm:text-[9px]">
                                                        Kanal
                                                    </span>
                                                    <span
                                                        className="mt-0.5 block truncate font-semibold text-slate-700"
                                                        title={service.channel}
                                                    >
                                                        {service.channel}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action Row */}
                                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                <FileCheck2
                                                    aria-hidden="true"
                                                    className="size-4 text-emerald-600"
                                                />
                                                {service.requirementsCount}{' '}
                                                Persyaratan
                                            </span>

                                            <Link
                                                href={serviceShow(service.slug)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-800 transition-all group-hover:bg-emerald-700 group-hover:text-white hover:bg-emerald-700 hover:text-white hover:shadow-md hover:shadow-emerald-700/20"
                                            >
                                                Lihat Detail
                                                <ChevronRight
                                                    aria-hidden="true"
                                                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                                                />
                                            </Link>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerContainer>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <Search className="size-7" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">
                                Layanan tidak ditemukan
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Coba gunakan kata kunci pencarian yang lain atau
                                pilih kategori lain.
                            </p>
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    )}

                    {/* Informational Banner Footer */}
                    <FadeIn
                        direction="up"
                        duration={0.5}
                        className="mt-10 rounded-3xl border border-emerald-200/80 bg-emerald-50/60 p-6 shadow-xs"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                                <FileCheck2 className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Pusat Administrasi & Pelayanan Terpadu Desa
                                    Ngampungan
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                    Direktori pelayanan ini menyediakan
                                    informasi ringkas persyaratan, perkiraan
                                    alur kerja, dan mekanisme pengajuan online.
                                    Untuk informasi resmi lebih lanjut, Anda
                                    dapat berkunjung langsung ke Balai Desa
                                    Ngampungan.
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </PublicPageShell>
    );
}
