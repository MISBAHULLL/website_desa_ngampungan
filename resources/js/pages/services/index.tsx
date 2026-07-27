import { Head, Link } from '@inertiajs/react';
import {
    BadgeCheck,
    ChevronRight,
    Clock3,
    FileCheck2,
    FileText,
    Headphones,
    Leaf,
    Search,
    ShieldAlert,
    UsersRound,
    Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PublicPageShell } from '@/components/public-page-shell';
import {
    dummyVillageServices,
    findVillageServiceCategory,
    getDummyVillageServices,
    villageServiceCategories,
} from '@/lib/dummy-village-services';
import type {
    VillageServiceCategoryKey,
    VillageServiceFilter,
} from '@/lib/dummy-village-services';
import { home } from '@/routes';
import { index as servicesIndex, show as serviceShow } from '@/routes/services';

type ServiceIndexPageProps = {
    initialCategory: VillageServiceFilter;
    canonicalUrl: string;
};

const categoryPresentation: Record<
    VillageServiceCategoryKey,
    {
        icon: LucideIcon;
        iconClassName: string;
        accentClassName: string;
    }
> = {
    administration: {
        icon: FileText,
        iconClassName: 'bg-village-primary-light text-village-primary',
        accentClassName: 'bg-village-primary',
    },
    population: {
        icon: UsersRound,
        iconClassName: 'bg-[#e7f1fb] text-village-info',
        accentClassName: 'bg-village-info',
    },
    agriculture: {
        icon: Leaf,
        iconClassName: 'bg-orange-50 text-village-secondary',
        accentClassName: 'bg-village-secondary',
    },
    reports: {
        icon: ShieldAlert,
        iconClassName: 'bg-red-50 text-village-error',
        accentClassName: 'bg-village-error',
    },
};

export default function ServiceIndex({
    initialCategory,
    canonicalUrl,
}: ServiceIndexPageProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const visibleServices = useMemo(() => {
        const categoryServices = getDummyVillageServices(initialCategory);
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
    }, [initialCategory, searchQuery]);

    const activeCategory =
        initialCategory === 'all'
            ? null
            : findVillageServiceCategory(initialCategory);
    const pageDescription =
        'Direktori informasi pelayanan administrasi, kependudukan, pertanian, dan pengaduan Desa Ngampungan.';

    return (
        <PublicPageShell activeSection="services">
            <Head>
                <title>Informasi Pelayanan Desa</title>
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

            <section className="relative overflow-hidden bg-village-primary-dark text-white">
                <div
                    aria-hidden="true"
                    className="absolute top-0 right-0 size-96 translate-x-1/3 -translate-y-1/2 rounded-full border-[4.5rem] border-white/5"
                />
                <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:py-20 lg:px-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-2 text-sm text-white/65"
                    >
                        <Link href={home()} className="hover:text-white">
                            Beranda
                        </Link>
                        <ChevronRight aria-hidden="true" className="size-4" />
                        <span className="font-semibold text-white">
                            Informasi Pelayanan
                        </span>
                    </nav>

                    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-end">
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                                Pusat Informasi Warga
                            </p>
                            <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
                                Temukan Layanan yang Anda Butuhkan
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                                Telusuri ringkasan layanan desa berdasarkan
                                kategori, sasaran warga, kanal pelayanan, dan
                                estimasi waktunya.
                            </p>
                        </div>

                        <dl className="grid grid-cols-2 border border-white/20 bg-white/5 backdrop-blur-sm">
                            <div className="border-r border-white/20 p-5">
                                <dt className="text-xs tracking-[0.12em] text-white/55 uppercase">
                                    Layanan
                                </dt>
                                <dd className="mt-2 text-3xl font-bold">
                                    {dummyVillageServices.length}
                                </dd>
                            </div>
                            <div className="p-5">
                                <dt className="text-xs tracking-[0.12em] text-white/55 uppercase">
                                    Kategori
                                </dt>
                                <dd className="mt-2 text-3xl font-bold">
                                    {villageServiceCategories.length}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="service-directory-heading"
                className="py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
                        <aside
                            aria-labelledby="service-category-heading"
                            className="border border-village-border bg-white lg:sticky lg:top-28"
                        >
                            <div className="border-b border-village-border p-5">
                                <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                    Filter Direktori
                                </p>
                                <h2
                                    id="service-category-heading"
                                    className="mt-2 text-xl font-bold"
                                >
                                    Kategori Layanan
                                </h2>
                            </div>

                            <nav
                                aria-label="Kategori layanan"
                                className="grid p-2"
                            >
                                <Link
                                    href={servicesIndex()}
                                    preserveScroll
                                    className={
                                        initialCategory === 'all'
                                            ? 'flex items-center justify-between gap-4 bg-village-primary px-4 py-3 text-sm font-bold text-white'
                                            : 'flex items-center justify-between gap-4 px-4 py-3 text-sm font-semibold text-village-muted transition hover:bg-village-surface-muted hover:text-village-ink'
                                    }
                                >
                                    Semua Layanan
                                    <span
                                        className={
                                            initialCategory === 'all'
                                                ? 'text-white/70'
                                                : 'text-village-muted'
                                        }
                                    >
                                        {dummyVillageServices.length}
                                    </span>
                                </Link>

                                {villageServiceCategories.map((category) => {
                                    const count = getDummyVillageServices(
                                        category.key,
                                    ).length;

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
                                                initialCategory === category.key
                                                    ? 'flex items-center justify-between gap-4 bg-village-primary px-4 py-3 text-sm font-bold text-white'
                                                    : 'flex items-center justify-between gap-4 px-4 py-3 text-sm font-semibold text-village-muted transition hover:bg-village-surface-muted hover:text-village-ink'
                                            }
                                        >
                                            {category.shortLabel}
                                            <span
                                                className={
                                                    initialCategory ===
                                                    category.key
                                                        ? 'text-white/70'
                                                        : 'text-village-muted'
                                                }
                                            >
                                                {count}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </aside>

                        <div>
                            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                        Direktori Pelayanan
                                    </p>
                                    <h2
                                        id="service-directory-heading"
                                        className="mt-2 text-3xl font-bold tracking-tight md:text-4xl"
                                    >
                                        {activeCategory
                                            ? activeCategory.label
                                            : 'Semua Layanan'}
                                    </h2>
                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-village-muted">
                                        {activeCategory
                                            ? activeCategory.description
                                            : 'Ringkasan seluruh layanan publik yang sedang disiapkan untuk warga Desa Ngampungan.'}
                                    </p>
                                </div>
                                <span className="inline-flex min-h-9 items-center gap-2 self-start border border-village-border bg-white px-3 py-2 text-xs font-semibold text-village-muted">
                                    <BadgeCheck
                                        aria-hidden="true"
                                        className="size-4 text-village-primary"
                                    />
                                    Data dummy frontend
                                </span>
                            </div>

                            <div className="mt-7 border-y border-village-border py-5">
                                <label
                                    htmlFor="service-search"
                                    className="text-sm font-bold"
                                >
                                    Cari nama layanan atau sasaran warga
                                </label>
                                <div className="relative mt-2">
                                    <Search
                                        aria-hidden="true"
                                        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-village-muted"
                                    />
                                    <input
                                        id="service-search"
                                        type="search"
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(event.target.value)
                                        }
                                        placeholder="Contoh: surat usaha, KTP, atau pengaduan"
                                        className="min-h-12 w-full border border-village-border bg-white py-3 pr-4 pl-12 outline-hidden transition focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between gap-5">
                                <p
                                    aria-live="polite"
                                    className="text-sm font-medium text-village-muted"
                                >
                                    {visibleServices.length} layanan ditemukan
                                </p>
                                <p className="hidden text-xs text-village-muted sm:block">
                                    Informasi ringkas layanan desa
                                </p>
                            </div>

                            {visibleServices.length > 0 ? (
                                <div className="mt-6 grid gap-5 md:grid-cols-2">
                                    {visibleServices.map((service, index) => {
                                        const category =
                                            findVillageServiceCategory(
                                                service.category,
                                            );
                                        const presentation =
                                            categoryPresentation[
                                                service.category
                                            ];
                                        const ServiceIcon = presentation.icon;

                                        return (
                                            <article
                                                key={service.slug}
                                                className="group relative overflow-hidden border border-village-border bg-white p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-village-primary/35 hover:shadow-village-soft motion-reduce:transform-none motion-reduce:transition-none"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`absolute top-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${presentation.accentClassName}`}
                                                />
                                                <div className="flex items-start justify-between gap-5">
                                                    <span
                                                        className={`flex size-12 shrink-0 items-center justify-center ${presentation.iconClassName}`}
                                                    >
                                                        <ServiceIcon
                                                            aria-hidden="true"
                                                            className="size-5"
                                                        />
                                                    </span>
                                                    <span className="text-xs font-bold tracking-[0.12em] text-village-muted">
                                                        {String(
                                                            index + 1,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                </div>

                                                <p className="mt-6 text-[0.68rem] font-bold tracking-[0.13em] text-village-primary uppercase">
                                                    {category.label}
                                                </p>
                                                <h3 className="mt-2 text-xl leading-tight font-bold">
                                                    {service.title}
                                                </h3>
                                                <p className="mt-3 text-sm leading-6 text-village-muted">
                                                    {service.shortDescription}
                                                </p>

                                                <dl className="mt-6 grid gap-3 border-t border-village-border pt-5 text-sm">
                                                    <div className="flex items-start gap-2.5">
                                                        <UsersRound
                                                            aria-hidden="true"
                                                            className="mt-0.5 size-4 shrink-0 text-village-primary"
                                                        />
                                                        <div>
                                                            <dt className="sr-only">
                                                                Sasaran
                                                            </dt>
                                                            <dd className="text-village-muted">
                                                                {
                                                                    service.audience
                                                                }
                                                            </dd>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2.5">
                                                        <Headphones
                                                            aria-hidden="true"
                                                            className="mt-0.5 size-4 shrink-0 text-village-primary"
                                                        />
                                                        <div>
                                                            <dt className="sr-only">
                                                                Kanal
                                                            </dt>
                                                            <dd className="text-village-muted">
                                                                {
                                                                    service.channel
                                                                }
                                                            </dd>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="flex items-start gap-2.5">
                                                            <Clock3
                                                                aria-hidden="true"
                                                                className="mt-0.5 size-4 shrink-0 text-village-primary"
                                                            />
                                                            <div>
                                                                <dt className="sr-only">
                                                                    Estimasi
                                                                </dt>
                                                                <dd className="text-village-muted">
                                                                    {
                                                                        service.estimatedDuration
                                                                    }
                                                                </dd>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-2.5">
                                                            <Wallet
                                                                aria-hidden="true"
                                                                className="mt-0.5 size-4 shrink-0 text-village-primary"
                                                            />
                                                            <div>
                                                                <dt className="sr-only">
                                                                    Biaya
                                                                </dt>
                                                                <dd className="font-semibold text-village-primary">
                                                                    {
                                                                        service.fee
                                                                    }
                                                                </dd>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </dl>

                                                <div className="mt-5 flex items-center justify-between gap-4 border-t border-dashed border-village-border pt-4">
                                                    <p className="flex items-center gap-2 text-xs font-semibold text-village-muted">
                                                        <FileCheck2
                                                            aria-hidden="true"
                                                            className="size-4 text-village-primary"
                                                        />
                                                        Persyaratan tersedia
                                                    </p>
                                                    <Link
                                                        href={serviceShow(
                                                            service.slug,
                                                        )}
                                                        className="inline-flex items-center gap-1.5 text-sm font-bold text-village-primary transition group-hover:gap-2.5 hover:text-village-primary-dark"
                                                    >
                                                        Lihat detail
                                                        <ChevronRight
                                                            aria-hidden="true"
                                                            className="size-4"
                                                        />
                                                    </Link>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="mt-6 border border-dashed border-village-border bg-white px-6 py-16 text-center">
                                    <Search
                                        aria-hidden="true"
                                        className="mx-auto size-10 text-village-muted"
                                    />
                                    <h3 className="mt-4 text-xl font-bold">
                                        Layanan tidak ditemukan
                                    </h3>
                                    <p className="mt-2 text-sm text-village-muted">
                                        Coba gunakan kata kunci yang lebih umum.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-village-accent-light mt-14 border border-village-accent/45 p-5 md:p-6">
                        <div className="flex items-start gap-4">
                            <FileCheck2
                                aria-hidden="true"
                                className="mt-0.5 size-6 shrink-0 text-village-secondary"
                            />
                            <div>
                                <h2 className="font-bold text-village-ink">
                                    Data pelayanan belum menjadi informasi resmi
                                </h2>
                                <p className="mt-2 max-w-4xl text-sm leading-6 text-village-muted">
                                    Direktori ini menampilkan ringkasan awal.
                                    Persyaratan dokumen, langkah pengajuan,
                                    formulir, dan kontak petugas belum menjadi
                                    informasi pelayanan resmi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
