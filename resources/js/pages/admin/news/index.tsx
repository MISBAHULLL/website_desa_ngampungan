import { Form, Head, Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Newspaper,
    Plus,
    Search,
    Star,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
    create as newsCreate,
    destroy as newsDestroy,
    edit as newsEdit,
    index as newsIndex,
    toggleFeatured,
} from '@/actions/App/Http/Controllers/Admin/NewsController';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type NewsItem = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    author: string;
    image_path: string | null;
    image_alt: string | null;
    is_featured: boolean;
    published_at: string;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedNews = {
    data: NewsItem[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

type NewsIndexProps = {
    news: PaginatedNews;
    categories: string[];
    filters: {
        search: string;
        category: string;
    };
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
});

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Sebelumnya')
        .replace('Next &raquo;', 'Berikutnya');
}

export default function AdminNewsIndex({
    news,
    categories,
    filters,
}: NewsIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.get(
            newsIndex.url(),
            {
                search: searchQuery,
                category: filters.category,
            },
            { preserveState: true },
        );
    }

    function handleCategoryChange(category: string) {
        router.get(
            newsIndex.url(),
            {
                search: searchQuery,
                category: category,
            },
            { preserveState: true },
        );
    }

    function handleDelete(id: number, title: string) {
        if (confirm(`Apakah Anda yakin ingin menghapus berita "${title}"?`)) {
            setDeletingId(id);
            router.delete(newsDestroy.url(id), {
                onFinish: () => setDeletingId(null),
            });
        }
    }

    return (
        <>
            <Head title="Kelola Berita Desa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Pusat Informasi & Publikasi
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Kelola Berita Desa
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Tambah, sunting, hapus, dan atur Berita Utama (Headline) yang tampil pada halaman publik Desa Ngampungan.
                        </p>
                    </div>

                    <Link
                        href={newsCreate()}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Berita Baru</span>
                    </Link>
                </header>

                {/* Filter & Search Bar */}
                <div className="flex flex-col gap-4 rounded-xl border border-sidebar-border/70 bg-background p-4 md:flex-row md:items-center md:justify-between">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex-1"
                    >
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari berdasarkan judul berita..."
                            className="min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                            Kategori:
                        </span>
                        <button
                            type="button"
                            onClick={() => handleCategoryChange('Semua')}
                            className={
                                filters.category === 'Semua'
                                    ? 'rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background'
                                    : 'rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-foreground/30'
                            }
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryChange(cat)}
                                className={
                                    filters.category === cat
                                        ? 'rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background'
                                        : 'rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-foreground/30'
                                }
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* News Table */}
                {news.data.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5">
                                            Artikel Berita
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Kategori
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Status Utama
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Tanggal Rilis
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3.5 text-right"
                                        >
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/70">
                                    {news.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-muted/20"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-sidebar-border/60 bg-muted">
                                                        {item.image_path ? (
                                                            <img
                                                                src={item.image_path}
                                                                alt={item.image_alt || item.title}
                                                                className="size-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex size-full items-center justify-center text-muted-foreground">
                                                                <Newspaper className="size-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 max-w-md">
                                                        <h2 className="line-clamp-1 font-bold text-foreground">
                                                            {item.title}
                                                        </h2>
                                                        <p className="line-clamp-1 mt-1 text-xs text-muted-foreground">
                                                            {item.excerpt}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="inline-flex rounded-md border border-sidebar-border/70 bg-muted/40 px-2.5 py-1 text-xs font-bold text-foreground">
                                                    {item.category}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Form
                                                    {...toggleFeatured.form(item.id)}
                                                >
                                                    {({ processing }) => (
                                                        <button
                                                            type="submit"
                                                            disabled={processing}
                                                            className={
                                                                item.is_featured
                                                                    ? 'inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 transition hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                                                    : 'inline-flex items-center gap-1.5 rounded-full border border-sidebar-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-amber-400 hover:text-amber-700'
                                                            }
                                                            title={
                                                                item.is_featured
                                                                    ? 'Klik untuk ubah jadi berita biasa'
                                                                    : 'Klik untuk jadikan Berita Utama'
                                                            }
                                                        >
                                                            <Star
                                                                className={`size-3.5 ${
                                                                    item.is_featured
                                                                        ? 'fill-amber-500 text-amber-500'
                                                                        : ''
                                                                }`}
                                                            />
                                                            <span>
                                                                {item.is_featured
                                                                    ? 'Berita Utama'
                                                                    : 'Biasa'}
                                                            </span>
                                                        </button>
                                                    )}
                                                </Form>
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays className="size-3.5 text-emerald-600" />
                                                    <span>
                                                        {dateFormatter.format(
                                                            new Date(item.published_at),
                                                        )}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={newsEdit(item.id)}
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-foreground transition hover:border-emerald-500 hover:text-emerald-600"
                                                        title="Sunting Berita"
                                                    >
                                                        <Edit3 className="size-4" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                                item.title,
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId === item.id
                                                        }
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                                                        title="Hapus Berita"
                                                    >
                                                        {deletingId === item.id ? (
                                                            <Spinner />
                                                        ) : (
                                                            <Trash2 className="size-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border bg-muted/20 p-8 text-center">
                        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Newspaper className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold">
                            Berita tidak ditemukan
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Tidak ada data berita yang cocok dengan kriteria pencarian atau filter yang dipilih.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {news.last_page > 1 && (
                    <nav
                        aria-label="Pagination berita admin"
                        className="flex flex-wrap items-center justify-center gap-2"
                    >
                        {news.links.map((link, index) => {
                            const label = paginationLabel(link.label);
                            const isPrevious = index === 0;
                            const isNext = index === news.links.length - 1;

                            if (!link.url) {
                                return (
                                    <span
                                        key={`${link.label}-${index}`}
                                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-sidebar-border/50 px-3 text-sm text-muted-foreground/40"
                                    >
                                        {isPrevious ? (
                                            <ChevronLeft className="size-4" />
                                        ) : isNext ? (
                                            <ChevronRight className="size-4" />
                                        ) : (
                                            label
                                        )}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url}
                                    preserveScroll
                                    className={
                                        link.active
                                            ? 'inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg bg-foreground px-3 text-sm font-bold text-background'
                                            : 'inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm font-semibold transition hover:border-foreground/30'
                                    }
                                >
                                    {isPrevious ? (
                                        <ChevronLeft className="size-4" />
                                    ) : isNext ? (
                                        <ChevronRight className="size-4" />
                                    ) : (
                                        label
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>
        </>
    );
}

AdminNewsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Kelola Berita',
            href: newsIndex(),
        },
    ],
};
