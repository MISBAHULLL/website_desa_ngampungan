import { Form, Head, Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit3,
    MapPin,
    Plus,
    Search,
    Star,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
    create as agendaCreate,
    destroy as agendaDestroy,
    edit as agendaEdit,
    index as agendaIndex,
    toggleFeatured,
} from '@/actions/App/Http/Controllers/Admin/AgendaController';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type AgendaItem = {
    id: number;
    title: string;
    slug: string;
    category: string;
    summary: string;
    image_path: string | null;
    image_alt: string | null;
    event_date: string;
    day_label: string;
    date_label: string;
    time_label: string;
    location: string;
    organizer: string;
    status: 'upcoming' | 'completed';
    is_featured: boolean;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedAgendas = {
    data: AgendaItem[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

type AgendaIndexProps = {
    agendas: PaginatedAgendas;
    filters: {
        search: string;
        status: string;
    };
};

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Sebelumnya')
        .replace('Next &raquo;', 'Berikutnya');
}

export default function AdminAgendaIndex({
    agendas,
    filters,
}: AgendaIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.get(
            agendaIndex.url(),
            {
                search: searchQuery,
                status: filters.status,
            },
            { preserveState: true },
        );
    }

    function handleStatusChange(status: string) {
        router.get(
            agendaIndex.url(),
            {
                search: searchQuery,
                status: status,
            },
            { preserveState: true },
        );
    }

    function handleDelete(id: number, title: string) {
        if (confirm(`Apakah Anda yakin ingin menghapus agenda "${title}"?`)) {
            setDeletingId(id);
            router.delete(agendaDestroy.url(id), {
                onFinish: () => setDeletingId(null),
            });
        }
    }

    return (
        <>
            <Head title="Kelola Agenda Desa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Jadwal & Kegiatan Warga
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Kelola Agenda Desa
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Buat, perbarui, dan atur agenda pelayanan publik,
                            musyawarah, dan kegiatan kemasyarakatan Desa
                            Ngampungan.
                        </p>
                    </div>

                    <Link
                        href={agendaCreate()}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Agenda Baru</span>
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
                            placeholder="Cari berdasarkan judul agenda atau lokasi..."
                            className="min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </form>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                            Status Agenda:
                        </span>
                        <button
                            type="button"
                            onClick={() => handleStatusChange('all')}
                            className={
                                filters.status === 'all' || !filters.status
                                    ? 'rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background'
                                    : 'rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-foreground/30'
                            }
                        >
                            Semua
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusChange('upcoming')}
                            className={
                                filters.status === 'upcoming'
                                    ? 'rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background'
                                    : 'rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-foreground/30'
                            }
                        >
                            Akan Datang
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusChange('completed')}
                            className={
                                filters.status === 'completed'
                                    ? 'rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background'
                                    : 'rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-foreground/30'
                            }
                        >
                            Selesai
                        </button>
                    </div>
                </div>

                {/* Agendas Table */}
                {agendas.data.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5">
                                            Tanggal & Agenda
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Waktu & Lokasi
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Status
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Utama
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
                                    {agendas.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-muted/20"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-start gap-3">
                                                    {item.image_path ? (
                                                        <img
                                                            src={
                                                                item.image_path
                                                            }
                                                            alt={
                                                                item.image_alt ||
                                                                item.title
                                                            }
                                                            className="size-12 shrink-0 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-center text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                            <span className="text-[9px] font-black uppercase">
                                                                {item.day_label}
                                                            </span>
                                                            <span className="text-base leading-none font-black">
                                                                {
                                                                    item.date_label.split(
                                                                        ' ',
                                                                    )[0]
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="max-w-md min-w-0">
                                                        <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                                                            {item.category}
                                                        </span>
                                                        <h2 className="mt-1 line-clamp-1 font-bold text-foreground">
                                                            {item.title}
                                                        </h2>
                                                        <p className="line-clamp-1 text-xs text-muted-foreground">
                                                            {item.summary}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-xs whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <span className="flex items-center gap-1.5 font-semibold text-foreground">
                                                        <Clock className="size-3.5 text-emerald-600" />
                                                        {item.time_label}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                                        <MapPin className="size-3.5 text-emerald-600" />
                                                        {item.location}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span
                                                    className={
                                                        item.status ===
                                                        'completed'
                                                            ? 'inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                                                            : 'inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                    }
                                                >
                                                    {item.status ===
                                                    'completed' ? (
                                                        <>
                                                            <CheckCircle2 className="size-3 text-slate-400" />
                                                            <span>Selesai</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="size-1.5 rounded-full bg-emerald-600" />
                                                            <span>
                                                                Akan Datang
                                                            </span>
                                                        </>
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Form
                                                    {...toggleFeatured.form(
                                                        item.id,
                                                    )}
                                                >
                                                    {({ processing }) => (
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                            className={
                                                                item.is_featured
                                                                    ? 'inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 transition hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                                                    : 'inline-flex items-center gap-1.5 rounded-full border border-sidebar-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-amber-400 hover:text-amber-700'
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
                                                                    ? 'Utama'
                                                                    : 'Biasa'}
                                                            </span>
                                                        </button>
                                                    )}
                                                </Form>
                                            </td>

                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={agendaEdit(
                                                            item.id,
                                                        )}
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-foreground transition hover:border-emerald-500 hover:text-emerald-600"
                                                        title="Sunting Agenda"
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
                                                        title="Hapus Agenda"
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
                            <CalendarDays className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold">
                            Agenda tidak ditemukan
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Belum ada agenda desa yang terdaftar atau cocok
                            dengan pencarian.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {agendas.last_page > 1 && (
                    <nav
                        aria-label="Pagination agenda admin"
                        className="flex flex-wrap items-center justify-center gap-2"
                    >
                        {agendas.links.map((link, index) => {
                            const label = paginationLabel(link.label);
                            const isPrevious = index === 0;
                            const isNext = index === agendas.links.length - 1;

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

AdminAgendaIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Kelola Agenda', href: agendaIndex() },
    ],
};
