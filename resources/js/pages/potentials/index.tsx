import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PotentialCategoryIcon } from '@/components/potential-category-icon';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillagePotentialCard } from '@/components/village-potential-card';
import {
    dummyVillagePotentialEntries,
    getDummyVillagePotentialEntries,
    villagePotentialCategories,
} from '@/lib/dummy-village-potentials';
import type {
    VillagePotentialEntry,
    VillagePotentialFilter,
    VillagePotentialOffering,
} from '@/lib/dummy-village-potentials';
import { index as potentialsIndex } from '@/routes/potentials';

type PotentialIndexProps = {
    initialCategory: VillagePotentialFilter;
    entries?: readonly VillagePotentialEntry[];
};

const ITEMS_PER_PAGE = 9;

export default function PotentialIndex({
    initialCategory,
    entries,
}: PotentialIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const baseEntries = useMemo(() => {
        if (entries && entries.length > 0) {
            return entries;
        }
        return getDummyVillagePotentialEntries(initialCategory);
    }, [entries, initialCategory]);

    const totalCount = useMemo(() => {
        if (entries && entries.length > 0) {
            return entries.length;
        }
        return dummyVillagePotentialEntries.length;
    }, [entries]);

    const filteredEntries = useMemo(() => {
        const categoryEntries = baseEntries;
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase('id');

        if (normalizedQuery === '') {
            return categoryEntries;
        }

        return categoryEntries.filter((entry: VillagePotentialEntry) =>
            [
                entry.name,
                entry.shortDescription,
                entry.managerName,
                entry.address,
                ...entry.tags,
                ...entry.offerings.map((offering: VillagePotentialOffering) => offering.name),
            ].some((value) =>
                value.toLocaleLowerCase('id').includes(normalizedQuery),
            ),
        );
    }, [baseEntries, searchQuery]);

    // Reset pagination to page 1 whenever category or search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [initialCategory, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredEntries.length / ITEMS_PER_PAGE));

    const paginatedEntries = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredEntries, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const headingElement = document.getElementById('potential-directory-heading');
        if (headingElement) {
            headingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <PublicPageShell activeSection="potentials">
            <Head title="Direktori Potensi Desa">
                <meta
                    name="description"
                    content="Direktori informasi UMKM, pertanian, wisata, budaya, kuliner, dan jasa Desa Ngampungan."
                />
            </Head>

            <section className="bg-village-primary-dark text-white">
                <div className="mx-auto max-w-[1280px] px-5 py-12 md:py-16 lg:px-12">
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                        <div className="max-w-3xl lg:col-span-8">
                            <p className="text-xs font-bold tracking-widest text-village-accent uppercase">
                                Direktori Informasi
                            </p>
                            <h1 className="mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl">
                                Potensi Desa Ngampungan
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
                                Temukan usaha warga, komoditas, pengalaman
                                lokal, budaya, kuliner, dan layanan yang
                                tersedia di desa.
                            </p>
                        </div>

                        <div className="border-l-2 border-village-accent/80 pl-6 lg:col-span-4">
                            <p className="text-4xl font-extrabold tracking-tight text-white">
                                {totalCount}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-white/70">
                                profil potensi terdaftar dalam {villagePotentialCategories.length} kategori utama desa.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="potential-directory-heading"
                className="bg-village-canvas py-10 md:py-14"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    {/* Integrated Search and Category Header */}
                    <div className="flex flex-col gap-6 border-b border-gray-200/80 pb-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2
                                id="potential-directory-heading"
                                className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl"
                            >
                                Jelajahi berdasarkan kategori
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                Pilih kategori atau gunakan kata kunci pencarian untuk menemukan potensi desa.
                            </p>
                        </div>

                        {/* Harmonized Search Input Box */}
                        <div className="relative w-full lg:w-80">
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Cari nama, produk, pengelola..."
                                className="h-11 w-full rounded-xl border border-gray-200 bg-white py-2 pr-4 pl-10 text-xs text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-village-primary focus:ring-2 focus:ring-village-primary/15 shadow-2xs"
                            />
                        </div>
                    </div>

                    {/* Clean Category Pill Filter Strip */}
                    <nav
                        aria-label="Filter kategori potensi desa"
                        className="mt-6 flex flex-wrap gap-2 py-1"
                    >
                        <Link
                            href={potentialsIndex()}
                            preserveScroll
                            className={`flex items-center rounded-full px-4 py-2 text-xs font-bold transition-all ${
                                initialCategory === 'all'
                                    ? 'bg-village-primary text-white shadow-xs font-extrabold'
                                    : 'border border-gray-200 bg-white text-gray-700 hover:border-village-primary/40 hover:bg-gray-50'
                            }`}
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
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                                    initialCategory === category.key
                                        ? 'bg-village-primary text-white shadow-xs font-extrabold'
                                        : 'border border-gray-200 bg-white text-gray-700 hover:border-village-primary/40 hover:bg-gray-50'
                                }`}
                                aria-current={
                                    initialCategory === category.key
                                        ? 'page'
                                        : undefined
                                }
                            >
                                <PotentialCategoryIcon
                                    category={category.key}
                                    className="size-4 shrink-0 object-contain"
                                />
                                {category.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-6 flex items-center justify-between gap-5">
                        <p
                            className="text-xs font-medium text-gray-500"
                            aria-live="polite"
                        >
                            Menampilkan <strong className="font-bold text-gray-900">{paginatedEntries.length}</strong> dari {filteredEntries.length} potensi yang sesuai
                        </p>
                        {searchQuery !== '' && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="text-xs font-bold text-village-primary hover:underline focus-visible:outline-none"
                            >
                                Hapus pencarian
                            </button>
                        )}
                    </div>

                    {paginatedEntries.length > 0 ? (
                        <>
                            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {paginatedEntries.map((entry) => (
                                    <VillagePotentialCard
                                        key={entry.slug}
                                        entry={entry}
                                    />
                                ))}
                            </div>

                            {/* Clean Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-10 flex items-center justify-center gap-2 border-t border-gray-200/80 pt-6">
                                    <button
                                        type="button"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        aria-label="Halaman sebelumnya"
                                        className="flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, index) => {
                                        const pageNumber = index + 1;
                                        const isActive = pageNumber === currentPage;
                                        return (
                                            <button
                                                key={pageNumber}
                                                type="button"
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`flex size-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                                    isActive
                                                        ? 'bg-village-primary text-white shadow-xs'
                                                        : 'border border-gray-200 bg-white text-gray-700 hover:border-village-primary/40 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}

                                    <button
                                        type="button"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        aria-label="Halaman selanjutnya"
                                        className="flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="mt-6 rounded-2xl border border-gray-200/80 bg-white px-6 py-12 text-center shadow-xs">
                            <Search
                                aria-hidden="true"
                                className="mx-auto size-8 text-gray-400"
                            />
                            <h3 className="mt-3 text-lg font-bold text-gray-900">
                                Potensi tidak ditemukan
                            </h3>
                            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-gray-500">
                                Coba gunakan nama usaha, produk, pengelola, atau
                                kata kunci yang lebih singkat.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </PublicPageShell>
    );
}
