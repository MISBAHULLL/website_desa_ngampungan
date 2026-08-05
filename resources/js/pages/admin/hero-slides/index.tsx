import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Edit3,
    Image as ImageIcon,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
    create as heroSlideCreate,
    destroy as heroSlideDestroy,
    edit as heroSlideEdit,
    index as heroSlideIndex,
} from '@/actions/App/Http/Controllers/Admin/HeroSlideController';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type HeroSlide = {
    id: number;
    title: string;
    subtitle?: string;
    description: string;
    primaryCtaText?: string;
    primaryCtaUrl?: string;
    secondaryCtaText?: string;
    secondaryCtaUrl?: string;
    backgroundImage?: string;
    order: number;
    isActive: boolean;
    createdAt?: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedSlides = {
    data: HeroSlide[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

type Props = {
    slides: PaginatedSlides;
    filters?: {
        search: string;
    };
};

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Sebelumnya')
        .replace('Next &raquo;', 'Berikutnya');
}

export default function AdminHeroSlidesIndex({ slides, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.get(
            heroSlideIndex.url(),
            { search: searchQuery },
            { preserveState: true },
        );
    }

    function handleDelete(id: number, title: string) {
        if (confirm(`Apakah Anda yakin ingin menghapus slide "${title}"?`)) {
            setDeletingId(id);
            router.delete(heroSlideDestroy.url(id), {
                onFinish: () => setDeletingId(null),
            });
        }
    }

    return (
        <>
            <Head title="Kelola Hero Slides" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Halaman Depan & Banner
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Kelola Hero Slides
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Tambah, sunting, dan atur slide hero banner yang
                            tampil pada halaman depan website.
                        </p>
                    </div>

                    <Link
                        href={heroSlideCreate()}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Slide Baru</span>
                    </Link>
                </header>

                {/* Search Bar */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex-1"
                    >
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari berdasarkan judul slide..."
                            className="min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </form>
                </div>

                {/* Slides Table */}
                {slides.data.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5">
                                            Urutan
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Slide
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            CTA Buttons
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Status
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
                                    {slides.data.map((slide) => (
                                        <tr
                                            key={slide.id}
                                            className="transition hover:bg-muted/20"
                                        >
                                            <td className="px-5 py-4 text-center font-bold text-foreground">
                                                #{slide.order}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-sidebar-border/60 bg-muted">
                                                        {slide.backgroundImage ? (
                                                            <img
                                                                src={
                                                                    slide.backgroundImage
                                                                }
                                                                alt={
                                                                    slide.title
                                                                }
                                                                className="size-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex size-full items-center justify-center text-muted-foreground">
                                                                <ImageIcon className="size-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="max-w-md min-w-0">
                                                        <h2 className="line-clamp-1 font-bold text-foreground">
                                                            {slide.title}
                                                        </h2>
                                                        {slide.subtitle && (
                                                            <p className="mt-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                                                {slide.subtitle}
                                                            </p>
                                                        )}
                                                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                            {slide.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="space-y-1 text-xs">
                                                    {slide.primaryCtaText && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-semibold text-foreground">
                                                                Primary:
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                {
                                                                    slide.primaryCtaText
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {slide.secondaryCtaText && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-semibold text-foreground">
                                                                Secondary:
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                {
                                                                    slide.secondaryCtaText
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {!slide.primaryCtaText &&
                                                        !slide.secondaryCtaText && (
                                                            <span className="text-muted-foreground">
                                                                -
                                                            </span>
                                                        )}
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={
                                                        slide.isActive
                                                            ? 'inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                            : 'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                                                    }
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${slide.isActive ? 'bg-emerald-600' : 'bg-slate-400'}`}
                                                    />
                                                    {slide.isActive
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={heroSlideEdit(
                                                            slide.id,
                                                        )}
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-foreground transition hover:border-emerald-500 hover:text-emerald-600"
                                                        title="Sunting Slide"
                                                    >
                                                        <Edit3 className="size-4" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                slide.id,
                                                                slide.title,
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            slide.id
                                                        }
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                                                        title="Hapus Slide"
                                                    >
                                                        {deletingId ===
                                                        slide.id ? (
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
                            <ImageIcon className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold">
                            Slide tidak ditemukan
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Tidak ada data hero slide yang tersedia.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {slides.last_page > 1 && (
                    <nav
                        aria-label="Pagination slides admin"
                        className="flex flex-wrap items-center justify-center gap-2"
                    >
                        {slides.links.map((link, index) => {
                            const label = paginationLabel(link.label);
                            const isPrevious = index === 0;
                            const isNext = index === slides.links.length - 1;

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

AdminHeroSlidesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Hero Slides', href: heroSlideIndex() },
    ],
};
