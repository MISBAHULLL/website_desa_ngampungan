import { Form, Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Archive,
    Bell,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Megaphone,
    Pin,
    Plus,
    Search,
    ShieldAlert,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
    create as announcementCreate,
    destroy as announcementDestroy,
    edit as announcementEdit,
    index as announcementIndex,
    togglePinned,
} from '@/actions/App/Http/Controllers/Admin/AnnouncementController';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type AnnouncementItem = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    priority: 'normal' | 'important' | 'emergency';
    status: 'active' | 'archived';
    is_pinned: boolean;
    starts_at: string;
    ends_at: string | null;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedAnnouncements = {
    data: AnnouncementItem[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

type AnnouncementIndexProps = {
    announcements: PaginatedAnnouncements;
    filters: {
        search: string;
        priority: string;
        status: string;
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

export default function AdminAnnouncementIndex({
    announcements,
    filters,
}: AnnouncementIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.get(
            announcementIndex.url(),
            {
                search: searchQuery,
                priority: filters.priority,
                status: filters.status,
            },
            { preserveState: true },
        );
    }

    function handleFilterChange(priority: string, status: string) {
        router.get(
            announcementIndex.url(),
            {
                search: searchQuery,
                priority: priority,
                status: status,
            },
            { preserveState: true },
        );
    }

    function handleDelete(id: number, title: string) {
        if (
            confirm(`Apakah Anda yakin ingin menghapus pengumuman "${title}"?`)
        ) {
            setDeletingId(id);
            router.delete(announcementDestroy.url(id), {
                onFinish: () => setDeletingId(null),
            });
        }
    }

    return (
        <>
            <Head title="Kelola Pengumuman Desa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Pusat Informasi & Publikasi
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Kelola Pengumuman Desa
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Tambah, edit, hapus, dan atur prioritas pengumuman
                            resmi yang dipublikasikan untuk warga Desa
                            Ngampungan.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/pengumuman/create"
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-800 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        <Plus className="size-4" />
                        <span>Buat Pengumuman Baru</span>
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
                            placeholder="Cari berdasarkan judul pengumuman..."
                            className="min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                            Prioritas:
                        </span>
                        {['Semua', 'normal', 'important', 'emergency'].map(
                            (p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() =>
                                        handleFilterChange(p, filters.status)
                                    }
                                    className={
                                        filters.priority === p
                                            ? 'rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background capitalize'
                                            : 'rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground capitalize hover:border-foreground/30'
                                    }
                                >
                                    {p === 'important'
                                        ? 'Penting'
                                        : p === 'emergency'
                                          ? 'Darurat'
                                          : p}
                                </button>
                            ),
                        )}

                        <span className="ml-2 text-xs font-semibold text-muted-foreground">
                            Status:
                        </span>
                        {['Semua', 'active', 'archived'].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() =>
                                    handleFilterChange(filters.priority, s)
                                }
                                className={
                                    filters.status === s
                                        ? 'rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white capitalize'
                                        : 'rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground capitalize hover:border-foreground/30'
                                }
                            >
                                {s === 'active'
                                    ? 'Aktif'
                                    : s === 'archived'
                                      ? 'Arsip'
                                      : s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Announcement Table */}
                {announcements.data.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5">
                                            Judul & Ringkasan
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Prioritas
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Status & Pin
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Masa Berlaku
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
                                    {announcements.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-muted/20"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="max-w-md min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="font-bold text-foreground">
                                                            {item.title}
                                                        </h2>
                                                        {item.is_pinned && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                                                                <Pin className="size-3 fill-emerald-700" />
                                                                Disematkan
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                        {item.summary}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {item.priority ===
                                                'emergency' ? (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-800 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                                                        <ShieldAlert className="size-3.5" />
                                                        Darurat
                                                    </span>
                                                ) : item.priority ===
                                                  'important' ? (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                                        <AlertTriangle className="size-3.5" />
                                                        Penting
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                        <Bell className="size-3.5" />
                                                        Normal
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1.5">
                                                    <span
                                                        className={
                                                            item.status ===
                                                            'active'
                                                                ? 'inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                                                : 'inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                                        }
                                                    >
                                                        {item.status ===
                                                        'active'
                                                            ? 'Aktif'
                                                            : 'Arsip'}
                                                    </span>

                                                    <Form
                                                        {...togglePinned.form(
                                                            item.id,
                                                        )}
                                                    >
                                                        {({ processing }) => (
                                                            <button
                                                                type="submit"
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="text-left text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                                                            >
                                                                {item.is_pinned
                                                                    ? 'Lepas Pin'
                                                                    : 'Sematkan di Atas'}
                                                            </button>
                                                        )}
                                                    </Form>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium whitespace-nowrap text-muted-foreground">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="size-3.5 text-emerald-600" />
                                                        <span>
                                                            Mulai:{' '}
                                                            {dateFormatter.format(
                                                                new Date(
                                                                    item.starts_at,
                                                                ),
                                                            )}
                                                        </span>
                                                    </div>
                                                    {item.ends_at && (
                                                        <div className="flex items-center gap-1.5 text-slate-500">
                                                            <Archive className="size-3.5" />
                                                            <span>
                                                                Selesai:{' '}
                                                                {dateFormatter.format(
                                                                    new Date(
                                                                        item.ends_at,
                                                                    ),
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={announcementEdit(
                                                            item.id,
                                                        )}
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-foreground transition hover:border-emerald-500 hover:text-emerald-600"
                                                        title="Sunting Pengumuman"
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
                                                            deletingId ===
                                                            item.id
                                                        }
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                                                        title="Hapus Pengumuman"
                                                    >
                                                        {deletingId ===
                                                        item.id ? (
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
                            <Megaphone className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold">
                            Pengumuman tidak ditemukan
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Tidak ada data pengumuman yang cocok dengan
                            pencarian atau filter yang dipilih.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {announcements.last_page > 1 && (
                    <nav
                        aria-label="Pagination pengumuman admin"
                        className="flex flex-wrap items-center justify-center gap-2"
                    >
                        {announcements.links.map((link, index) => {
                            const label = paginationLabel(link.label);
                            const isPrevious = index === 0;
                            const isNext =
                                index === announcements.links.length - 1;

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

AdminAnnouncementIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Kelola Pengumuman',
            href: announcementIndex(),
        },
    ],
};
