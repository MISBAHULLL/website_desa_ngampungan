import { Head, Link } from '@inertiajs/react';
import { Info, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillagePotentialCard } from '@/components/village-potential-card';
import {
    dummyVillagePotentialEntries,
    getDummyVillagePotentialEntries,
    villagePotentialCategories,
} from '@/lib/dummy-village-potentials';
import type { VillagePotentialFilter } from '@/lib/dummy-village-potentials';
import { home } from '@/routes';
import { index as potentialsIndex } from '@/routes/potentials';

type PotentialIndexProps = {
    initialCategory: VillagePotentialFilter;
};

export default function PotentialIndex({
    initialCategory,
}: PotentialIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEntries = useMemo(() => {
        const categoryEntries =
            getDummyVillagePotentialEntries(initialCategory);
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase('id');

        if (normalizedQuery === '') {
            return categoryEntries;
        }

        return categoryEntries.filter((entry) =>
            [
                entry.name,
                entry.shortDescription,
                entry.managerName,
                entry.address,
                ...entry.tags,
                ...entry.offerings.map((offering) => offering.name),
            ].some((value) =>
                value.toLocaleLowerCase('id').includes(normalizedQuery),
            ),
        );
    }, [initialCategory, searchQuery]);

    return (
        <PublicPageShell activeSection="potentials">
            <Head title="Direktori Potensi Desa">
                <meta
                    name="description"
                    content="Direktori informasi UMKM, pertanian, wisata, budaya, kuliner, dan jasa Desa Ngampungan."
                />
            </Head>

            <section className="bg-village-primary-dark text-white">
                <div className="mx-auto max-w-[1280px] px-5 py-14 md:py-20 lg:px-12">
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                        <div className="max-w-3xl lg:col-span-8">
                            <p className="text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                                Direktori Informasi
                            </p>
                            <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
                                Potensi Desa Ngampungan
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                                Temukan usaha warga, komoditas, pengalaman
                                lokal, budaya, kuliner, dan layanan yang
                                tersedia di desa.
                            </p>
                        </div>

                        <div className="border-l-2 border-village-accent pl-5 lg:col-span-4">
                            <p className="text-3xl font-bold">
                                {dummyVillagePotentialEntries.length}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-white/65">
                                profil simulasi dalam enam kategori potensi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="potential-directory-heading"
                className="bg-village-canvas py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Link
                            href={home()}
                            className="font-semibold text-village-muted transition hover:text-village-primary"
                        >
                            Beranda
                        </Link>
                        <span aria-hidden="true" className="text-village-muted">
                            /
                        </span>
                        <span className="font-semibold text-village-ink">
                            Potensi Desa
                        </span>
                    </div>

                    <div className="mt-8 grid gap-6 border-b border-village-border pb-8 lg:grid-cols-12 lg:items-end">
                        <div className="lg:col-span-7">
                            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                <SlidersHorizontal
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                Filter Direktori
                            </p>
                            <h2
                                id="potential-directory-heading"
                                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Jelajahi berdasarkan kategori
                            </h2>
                        </div>

                        <label className="relative block lg:col-span-5">
                            <span className="sr-only">
                                Cari potensi berdasarkan nama atau produk
                            </span>
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-village-muted"
                            />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Cari nama, produk, atau pengelola..."
                                className="min-h-12 w-full border border-village-border bg-white py-3 pr-4 pl-12 text-sm transition outline-none placeholder:text-village-muted/80 focus:border-village-primary focus:ring-2 focus:ring-village-primary/15"
                            />
                        </label>
                    </div>

                    <nav
                        aria-label="Filter kategori potensi desa"
                        className="mt-6 flex gap-2 overflow-x-auto pb-2"
                    >
                        <Link
                            href={potentialsIndex()}
                            preserveScroll
                            className={
                                initialCategory === 'all'
                                    ? 'shrink-0 bg-village-primary px-4 py-2.5 text-sm font-bold text-white'
                                    : 'shrink-0 border border-village-border bg-white px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:border-village-primary hover:text-village-primary'
                            }
                            aria-current={
                                initialCategory === 'all' ? 'page' : undefined
                            }
                        >
                            Semua
                        </Link>
                        {villagePotentialCategories.map((category) => (
                            <Link
                                key={category.key}
                                href={potentialsIndex({
                                    query: { category: category.key },
                                })}
                                preserveScroll
                                className={
                                    initialCategory === category.key
                                        ? 'shrink-0 bg-village-primary px-4 py-2.5 text-sm font-bold text-white'
                                        : 'shrink-0 border border-village-border bg-white px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:border-village-primary hover:text-village-primary'
                                }
                                aria-current={
                                    initialCategory === category.key
                                        ? 'page'
                                        : undefined
                                }
                            >
                                {category.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-8 flex items-center justify-between gap-5">
                        <p
                            className="text-sm text-village-muted"
                            aria-live="polite"
                        >
                            Menampilkan{' '}
                            <strong className="text-village-ink">
                                {filteredEntries.length}
                            </strong>{' '}
                            profil potensi
                        </p>
                        {searchQuery !== '' && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="text-sm font-bold text-village-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                            >
                                Hapus pencarian
                            </button>
                        )}
                    </div>

                    {filteredEntries.length > 0 ? (
                        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {filteredEntries.map((entry) => (
                                <VillagePotentialCard
                                    key={entry.slug}
                                    entry={entry}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 border border-village-border bg-white px-6 py-14 text-center">
                            <Search
                                aria-hidden="true"
                                className="mx-auto size-8 text-village-muted"
                            />
                            <h3 className="mt-4 text-xl font-bold">
                                Potensi tidak ditemukan
                            </h3>
                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-village-muted">
                                Coba gunakan nama usaha, produk, pengelola, atau
                                kata kunci yang lebih singkat.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 flex items-start gap-3 border border-[#efdcae] bg-[#fff8ea] p-4 text-sm leading-6 text-[#755018]">
                        <Info
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                        <p>
                            <strong>Data simulasi frontend.</strong> Profil,
                            kontak, lokasi, dan produk akan diganti setelah data
                            resmi pelaku potensi diverifikasi.
                        </p>
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
