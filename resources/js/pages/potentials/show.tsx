import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    Clock3,
    Info,
    MapPin,
    Navigation,
    PackageOpen,
    PhoneCall,
    UserRound,
} from 'lucide-react';
import { PotentialCategoryIcon } from '@/components/potential-category-icon';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillagePotentialCard } from '@/components/village-potential-card';
import {
    findDummyVillagePotentialEntry,
    findVillagePotentialCategory,
    getRelatedDummyVillagePotentialEntries,
} from '@/lib/dummy-village-potentials';
import { home } from '@/routes';
import { index as potentialsIndex } from '@/routes/potentials';

type PotentialShowProps = {
    slug: string;
};

export default function PotentialShow({ slug }: PotentialShowProps) {
    const entry = findDummyVillagePotentialEntry(slug);

    if (!entry) {
        return (
            <PublicPageShell activeSection="potentials">
                <Head title="Potensi Tidak Ditemukan" />
                <section className="bg-village-canvas py-24">
                    <div className="mx-auto max-w-2xl px-5 text-center">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Profil potensi tidak ditemukan
                        </h1>
                        <p className="mt-4 leading-7 text-village-muted">
                            Data dummy dengan alamat tersebut tidak tersedia.
                        </p>
                        <Link
                            href={potentialsIndex()}
                            className="mt-8 inline-flex min-h-11 items-center gap-2 bg-village-primary px-5 py-3 text-sm font-bold text-white"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Kembali ke direktori
                        </Link>
                    </div>
                </section>
            </PublicPageShell>
        );
    }

    const category = findVillagePotentialCategory(entry.category);
    const relatedEntries = getRelatedDummyVillagePotentialEntries(entry);

    return (
        <PublicPageShell activeSection="potentials">
            <Head title={entry.name}>
                <meta name="description" content={entry.shortDescription} />
            </Head>

            <section className="border-b border-village-border bg-white">
                <div className="mx-auto max-w-[1280px] px-5 py-6 lg:px-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-sm"
                    >
                        <Link
                            href={home()}
                            className="font-semibold text-village-muted hover:text-village-primary"
                        >
                            Beranda
                        </Link>
                        <span aria-hidden="true" className="text-village-muted">
                            /
                        </span>
                        <Link
                            href={potentialsIndex({
                                query: { category: entry.category },
                            })}
                            className="font-semibold text-village-muted hover:text-village-primary"
                        >
                            {category.label}
                        </Link>
                        <span aria-hidden="true" className="text-village-muted">
                            /
                        </span>
                        <span className="font-semibold text-village-ink">
                            {entry.name}
                        </span>
                    </nav>
                </div>
            </section>

            <section className="overflow-hidden bg-village-primary-dark text-white">
                <div className="mx-auto grid max-w-[1280px] lg:grid-cols-12">
                    <div className="px-5 py-14 md:py-20 lg:col-span-7 lg:px-12">
                        <p className="text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                            {category.eyebrow} · {category.label}
                        </p>
                        <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-bold tracking-tight md:text-6xl">
                            {entry.name}
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                            {entry.shortDescription}
                        </p>

                        <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                            <div className="flex items-start gap-3 border-t border-white/15 pt-4">
                                <UserRound
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0 text-village-accent"
                                />
                                <div>
                                    <dt className="text-white/55">
                                        {entry.managerLabel}
                                    </dt>
                                    <dd className="mt-1 font-bold">
                                        {entry.managerName}
                                    </dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 border-t border-white/15 pt-4">
                                <MapPin
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0 text-village-accent"
                                />
                                <div>
                                    <dt className="text-white/55">Alamat</dt>
                                    <dd className="mt-1 font-bold">
                                        {entry.address}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </div>

                    <div className="relative flex min-h-80 items-center justify-center overflow-hidden bg-village-primary-light text-village-primary-dark lg:col-span-5">
                        <span
                            aria-hidden="true"
                            className="absolute -top-28 -right-28 size-80 rounded-full border-[56px] border-white/45"
                        />
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-28 -left-28 size-72 rounded-full border-[44px] border-village-primary/10"
                        />
                        <div className="relative text-center">
                            <span className="mx-auto flex size-24 items-center justify-center bg-white shadow-lg">
                                <PotentialCategoryIcon
                                    category={entry.category}
                                    className="size-10"
                                />
                            </span>
                            <p
                                aria-hidden="true"
                                className="mt-5 text-7xl font-bold tracking-tighter text-village-primary/10"
                            >
                                {entry.name.charAt(0)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="potential-profile-heading"
                className="bg-village-canvas py-12 md:py-16"
            >
                <div className="mx-auto grid max-w-[1280px] gap-8 px-5 lg:grid-cols-12 lg:px-12">
                    <div className="lg:col-span-8">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            Profil
                        </p>
                        <h2
                            id="potential-profile-heading"
                            className="mt-3 text-3xl font-bold tracking-tight"
                        >
                            Tentang {entry.name}
                        </h2>
                        <div className="mt-6 grid gap-4 text-base leading-8 text-village-muted">
                            {entry.description.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-2">
                            {entry.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="border border-village-border bg-white px-3 py-2 text-xs font-bold text-village-primary-dark"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <aside className="border border-village-border bg-white p-6 shadow-sm lg:col-span-4">
                        <div className="flex items-center gap-3">
                            <BriefcaseBusiness
                                aria-hidden="true"
                                className="size-5 text-village-primary"
                            />
                            <h2 className="text-xl font-bold">
                                Informasi pengelola
                            </h2>
                        </div>

                        <dl className="mt-6 grid gap-5 text-sm">
                            <div className="border-t border-village-border pt-4">
                                <dt className="flex items-center gap-2 text-village-muted">
                                    <UserRound
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                    {entry.managerLabel}
                                </dt>
                                <dd className="mt-2 font-bold">
                                    {entry.managerName}
                                </dd>
                            </div>
                            <div className="border-t border-village-border pt-4">
                                <dt className="flex items-center gap-2 text-village-muted">
                                    <PhoneCall
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                    Nomor kontak simulasi
                                </dt>
                                <dd className="mt-2 font-bold">
                                    {entry.phoneLabel}
                                </dd>
                            </div>
                            <div className="border-t border-village-border pt-4">
                                <dt className="flex items-center gap-2 text-village-muted">
                                    <Clock3
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                    Waktu layanan
                                </dt>
                                <dd className="mt-2 font-bold">
                                    {entry.openingHours}
                                </dd>
                            </div>
                        </dl>

                        <button
                            type="button"
                            disabled
                            aria-disabled="true"
                            className="mt-6 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 bg-village-surface-muted px-4 py-3 text-sm font-bold text-village-muted opacity-75"
                        >
                            <PhoneCall aria-hidden="true" className="size-4" />
                            Kontak belum aktif
                        </button>
                    </aside>
                </div>
            </section>

            <section
                aria-labelledby="potential-offerings-heading"
                className="border-t border-village-border bg-white py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            Produk dan Layanan
                        </p>
                        <h2
                            id="potential-offerings-heading"
                            className="mt-3 text-3xl font-bold tracking-tight"
                        >
                            Yang tersedia
                        </h2>
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                        {entry.offerings.map((offering, index) => (
                            <article
                                key={offering.name}
                                className="border-t-4 border-village-accent bg-village-canvas p-6"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <PackageOpen
                                        aria-hidden="true"
                                        className="size-6 text-village-primary"
                                    />
                                    <span className="text-sm font-bold text-village-muted/60">
                                        0{index + 1}
                                    </span>
                                </div>
                                <h3 className="mt-6 text-xl font-bold">
                                    {offering.name}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-village-muted">
                                    {offering.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="potential-location-heading"
                className="border-t border-village-border bg-village-surface-muted py-12 md:py-16"
            >
                <div className="mx-auto grid max-w-[1280px] gap-8 px-5 lg:grid-cols-12 lg:px-12">
                    <div className="lg:col-span-4">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            Lokasi
                        </p>
                        <h2
                            id="potential-location-heading"
                            className="mt-3 text-3xl font-bold tracking-tight"
                        >
                            Peta lokasi usaha
                        </h2>
                        <p className="mt-4 leading-7 text-village-muted">
                            {entry.address}
                        </p>

                        <dl className="mt-6 border-t border-village-border pt-5 text-sm">
                            <dt className="text-village-muted">
                                Koordinat simulasi
                            </dt>
                            <dd className="mt-1 font-mono font-bold text-village-ink">
                                {entry.map.latitude}, {entry.map.longitude}
                            </dd>
                        </dl>
                    </div>

                    <div className="relative min-h-80 overflow-hidden border border-village-border bg-[#e5ede8] lg:col-span-8">
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 [background-image:linear-gradient(to_right,#8ea499_1px,transparent_1px),linear-gradient(to_bottom,#8ea499_1px,transparent_1px)] [background-size:48px_48px] opacity-45"
                        />
                        <span
                            aria-hidden="true"
                            className="absolute top-[18%] -left-[8%] h-20 w-[120%] rotate-6 border-y-[18px] border-white/80 bg-[#c9d6ce]"
                        />
                        <span
                            aria-hidden="true"
                            className="absolute top-[-10%] left-[48%] h-[130%] w-16 -rotate-12 border-x-[12px] border-white/70 bg-[#c9d6ce]"
                        />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative flex flex-col items-center">
                                <span className="flex size-16 items-center justify-center rounded-full bg-village-primary text-white shadow-xl ring-8 ring-white/75">
                                    <MapPin
                                        aria-hidden="true"
                                        className="size-7"
                                    />
                                </span>
                                <div className="mt-4 max-w-xs bg-white px-4 py-3 text-center shadow-lg">
                                    <p className="text-sm font-bold text-village-ink">
                                        {entry.name}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-village-muted">
                                        {entry.map.locationLabel}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute right-4 bottom-4 flex items-center gap-2 bg-white/90 px-3 py-2 text-xs font-bold text-village-muted shadow-sm">
                            <Navigation
                                aria-hidden="true"
                                className="size-4 text-village-primary"
                            />
                            Peta simulasi
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-6 max-w-[1280px] px-5 lg:px-12">
                    <div className="flex items-start gap-3 border border-[#efdcae] bg-[#fff8ea] p-4 text-sm leading-6 text-[#755018]">
                        <Info
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                        <p>
                            Lokasi, koordinat, kontak, dan informasi pengelola
                            pada halaman ini merupakan simulasi antarmuka.
                        </p>
                    </div>
                </div>
            </section>

            {relatedEntries.length > 0 && (
                <section
                    aria-labelledby="related-potentials-heading"
                    className="border-t border-village-border bg-village-canvas py-12 md:py-16"
                >
                    <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                    Kategori {category.label}
                                </p>
                                <h2
                                    id="related-potentials-heading"
                                    className="mt-3 text-3xl font-bold tracking-tight"
                                >
                                    Potensi serupa
                                </h2>
                            </div>
                            <Link
                                href={potentialsIndex({
                                    query: { category: entry.category },
                                })}
                                className="inline-flex min-h-11 w-fit items-center gap-2 border border-village-border bg-white px-5 py-3 text-sm font-bold text-village-primary transition hover:border-village-primary"
                            >
                                Lihat kategori {category.label}
                            </Link>
                        </div>

                        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {relatedEntries.map((relatedEntry) => (
                                <VillagePotentialCard
                                    key={relatedEntry.slug}
                                    entry={relatedEntry}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicPageShell>
    );
}
