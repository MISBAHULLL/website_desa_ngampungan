import { Head, Link } from '@inertiajs/react';
import { ArrowRight, FileText, Newspaper, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PublicNewsCard } from '@/components/public-news-card';
import { PublicPageShell } from '@/components/public-page-shell';
import { dummyNewsArticles } from '@/lib/dummy-public-content';

const articlesPerPage = 6;
const newsCategories = [
    'Semua',
    ...new Set(dummyNewsArticles.map((article) => article.category)),
];

export default function NewsIndex() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);
    const [isPageTransitioning, setIsPageTransitioning] = useState(false);

    const handlePageChange = (page: number) => {
        if (page === currentPage || isPageTransitioning) return;
        setIsPageTransitioning(true);
        setTimeout(() => {
            setCurrentPage(page);
            setIsPageTransitioning(false);
        }, 140);

        const headingElement = document.getElementById('daftar-berita-heading');
        if (headingElement) {
            headingElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const filteredArticles = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase('id-ID');

        return dummyNewsArticles.filter((article) => {
            const matchesCategory =
                selectedCategory === 'Semua' ||
                article.category === selectedCategory;
            const matchesSearch =
                normalizedQuery === '' ||
                article.title
                    .toLocaleLowerCase('id-ID')
                    .includes(normalizedQuery);

            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredArticles.length / articlesPerPage),
    );
    const visibleArticles = filteredArticles.slice(
        (currentPage - 1) * articlesPerPage,
        currentPage * articlesPerPage,
    );

    function updateSearchQuery(value: string) {
        setSearchQuery(value);
        setCurrentPage(1);
    }

    function updateCategory(category: string) {
        setSelectedCategory(category);
        setCurrentPage(1);
    }

    return (
        <PublicPageShell activeSection="news">
            <Head title="Berita Desa" />

            <section className="border-b border-village-border bg-white">
                <div className="mx-auto max-w-[1280px] px-5 py-14 md:py-20 lg:px-12">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold tracking-[0.2em] text-village-primary uppercase">
                            Pusat Informasi Desa
                        </p>
                        <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight text-village-ink md:text-6xl">
                            Berita Desa Ngampungan
                        </h1>
                        <p className="mt-5 text-lg leading-8 text-village-muted">
                            Ikuti kegiatan, pembangunan, potensi, dan cerita
                            terbaru dari warga Desa Ngampungan.
                        </p>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="daftar-berita-heading"
                className="py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="rounded-3xl border border-village-border bg-white p-5 shadow-village-soft md:p-6">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                            <div>
                                <label
                                    htmlFor="search-news"
                                    className="text-sm font-bold text-village-ink"
                                >
                                    Cari berdasarkan judul
                                </label>
                                <div className="relative mt-2">
                                    <Search
                                        aria-hidden="true"
                                        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-village-muted"
                                    />
                                    <input
                                        id="search-news"
                                        type="search"
                                        value={searchQuery}
                                        onChange={(event) =>
                                            updateSearchQuery(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Contoh: pertanian atau posyandu"
                                        className="min-h-12 w-full rounded-xl border border-village-border bg-white py-3 pr-4 pl-12 transition outline-none focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="flex items-center gap-2 text-sm font-bold text-village-ink">
                                    <SlidersHorizontal
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                    Filter kategori
                                </p>
                                <div
                                    className="mt-2 flex flex-wrap gap-2"
                                    role="group"
                                    aria-label="Filter kategori berita"
                                >
                                    {newsCategories.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            aria-pressed={
                                                selectedCategory === category
                                            }
                                            onClick={() =>
                                                updateCategory(category)
                                            }
                                            className={
                                                selectedCategory === category
                                                    ? 'min-h-10 rounded-xl bg-village-primary px-4 py-2 text-sm font-bold text-white shadow-sm'
                                                    : 'min-h-10 rounded-xl border border-village-border bg-white px-4 py-2 text-sm font-semibold text-village-muted transition hover:border-village-primary hover:text-village-primary'
                                            }
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                Data dummy frontend
                            </p>
                            <h2
                                id="daftar-berita-heading"
                                className="mt-2 text-2xl font-bold text-village-ink md:text-3xl"
                            >
                                Daftar Berita
                            </h2>
                        </div>
                        <p
                            aria-live="polite"
                            className="text-sm font-medium text-village-muted"
                        >
                            {filteredArticles.length} artikel ditemukan
                        </p>
                    </div>

                    {visibleArticles.length > 0 ? (
                        <div
                            key={currentPage}
                            className={`mt-7 grid min-h-[440px] gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300 ease-out ${
                                isPageTransitioning
                                    ? 'opacity-0 scale-[0.985]'
                                    : 'opacity-100 scale-100'
                            }`}
                        >
                            {visibleArticles.map((article, idx) => (
                                <div
                                    key={article.slug}
                                    className="animate-page-fade-in flex h-full flex-col"
                                    style={{ animationDelay: `${idx * 40}ms` }}
                                >
                                    <PublicNewsCard article={article} />
                                </div>
                            ))}

                            {visibleArticles.length < articlesPerPage && (
                                <div
                                    className="animate-page-fade-in flex flex-col justify-between rounded-3xl border border-dashed border-village-border bg-gradient-to-br from-village-surface-muted/60 via-white to-village-primary-light/20 p-6 shadow-2xs transition-all duration-300 hover:border-village-primary/40 hover:shadow-xs"
                                    style={{
                                        animationDelay: `${visibleArticles.length * 40}ms`,
                                    }}
                                >
                                    <div className="space-y-3">
                                        <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-village-primary-light text-village-primary font-bold shadow-2xs">
                                            <FileText className="size-5" />
                                        </span>
                                        <h4 className="text-base font-extrabold text-village-ink">
                                            Informasi Publik Desa
                                        </h4>
                                        <p className="text-xs leading-relaxed text-village-muted">
                                            Menampilkan sisa {visibleArticles.length} artikel pada halaman ini. Seluruh artikel resmi telah terverifikasi oleh Pemerintah Desa Ngampungan.
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between border-t border-village-border/60 pt-4">
                                        <span className="text-[11px] font-semibold text-village-primary">
                                            Terverifikasi Pemdes
                                        </span>
                                        <a
                                            href="#search-news"
                                            className="inline-flex items-center gap-1.5 rounded-full bg-village-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-village-primary-dark"
                                        >
                                            <span>Cari Lainnya</span>
                                            <ArrowRight className="size-3.5" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-7 rounded-3xl border border-dashed border-village-border bg-white px-6 py-16 text-center">
                            <Newspaper
                                aria-hidden="true"
                                className="mx-auto size-10 text-village-muted"
                            />
                            <h3 className="mt-4 text-xl font-bold">
                                Berita tidak ditemukan
                            </h3>
                            <p className="mt-2 text-sm text-village-muted">
                                Coba gunakan kata kunci atau kategori lain.
                            </p>
                        </div>
                    )}

                    {filteredArticles.length > 0 && totalPages > 1 && (
                        <nav
                            aria-label="Pagination berita"
                            className="mt-10 flex flex-wrap items-center justify-center gap-2"
                        >
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="min-h-11 rounded-xl border border-village-border bg-white px-4 py-2 text-sm font-semibold transition hover:border-village-primary hover:text-village-primary disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Sebelumnya
                            </button>
                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1,
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    aria-current={
                                        currentPage === page
                                            ? 'page'
                                            : undefined
                                    }
                                    onClick={() => handlePageChange(page)}
                                    className={
                                        currentPage === page
                                            ? 'flex size-11 items-center justify-center rounded-xl bg-village-primary font-bold text-white'
                                            : 'flex size-11 items-center justify-center rounded-xl border border-village-border bg-white font-semibold transition hover:border-village-primary hover:text-village-primary'
                                    }
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="min-h-11 rounded-xl border border-village-border bg-white px-4 py-2 text-sm font-semibold transition hover:border-village-primary hover:text-village-primary disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Berikutnya
                            </button>
                        </nav>
                    )}
                </div>
            </section>
        </PublicPageShell>
    );
}
