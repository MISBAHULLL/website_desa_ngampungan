import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Edit3,
    ImageIcon,
    Plus,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import {
    create as officialCreate,
    destroy as officialDestroy,
    edit as officialEdit,
    index as officialIndex,
} from '@/actions/App/Http/Controllers/Admin/VillageOfficialController';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type OfficialItem = {
    id: number;
    slug: string;
    name: string;
    initials: string;
    position: string;
    unit: string;
    group: string;
    photo_path: string | null;
    photo_url: string | null;
    term: string | null;
    employee_id: string | null;
    sort_order: number;
    parent_id: number | null;
    is_active: boolean;
};

type PaginationLink = { url: string | null; label: string; active: boolean };
type PaginatedOfficials = {
    data: OfficialItem[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

type Props = {
    officials: PaginatedOfficials;
    filters: { search: string; group: string };
};

const groupLabels: Record<string, string> = {
    leadership: 'Pimpinan',
    secretariat: 'Sekretariat',
    technical: 'Pelaksana Teknis',
    territorial: 'Kewilayahan',
};

const groupFilters = [
    { key: 'all', label: 'Semua' },
    { key: 'leadership', label: 'Pimpinan' },
    { key: 'secretariat', label: 'Sekretariat' },
    { key: 'technical', label: 'Pelaksana Teknis' },
    { key: 'territorial', label: 'Kewilayahan' },
];

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Sebelumnya')
        .replace('Next &raquo;', 'Berikutnya');
}

export default function AdminVillageOfficialsIndex({ officials, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.get(officialIndex.url(), { search: searchQuery, group: filters.group }, { preserveState: true });
    }

    function handleGroupChange(group: string) {
        router.get(officialIndex.url(), { search: searchQuery, group }, { preserveState: true });
    }

    function handleDelete(id: number, name: string) {
        if (confirm(`Apakah Anda yakin ingin menghapus perangkat "${name}"?`)) {
            setDeletingId(id);
            router.delete(officialDestroy.url(id), { onFinish: () => setDeletingId(null) });
        }
    }

    return (
        <>
            <Head title="Kelola Perangkat Desa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Aparatur Pemerintah Desa
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Kelola Perangkat Desa
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Tambah, sunting, dan atur data perangkat desa termasuk foto, jabatan, dan profil detail modal.
                        </p>
                    </div>
                    <Link
                        href={officialCreate()}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Perangkat Baru</span>
                    </Link>
                </header>

                {/* Filter & Search */}
                <div className="flex flex-col gap-4 rounded-xl border border-sidebar-border/70 bg-background p-4 md:flex-row md:items-center md:justify-between">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari berdasarkan nama atau jabatan..."
                            className="min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </form>
                    <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
                        {groupFilters.map((f) => (
                            <button
                                key={f.key}
                                type="button"
                                onClick={() => handleGroupChange(f.key)}
                                className={
                                    (filters.group === f.key || (f.key === 'all' && !filters.group))
                                        ? 'shrink-0 rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background'
                                        : 'shrink-0 rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-foreground/30'
                                }
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                {officials.data.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5">Perangkat</th>
                                        <th scope="col" className="px-4 py-3.5">Jabatan</th>
                                        <th scope="col" className="px-4 py-3.5">Kelompok</th>
                                        <th scope="col" className="px-4 py-3.5">Urutan</th>
                                        <th scope="col" className="px-4 py-3.5">Status</th>
                                        <th scope="col" className="px-5 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/70">
                                    {officials.data.map((item) => (
                                        <tr key={item.id} className="transition hover:bg-muted/20">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {item.photo_url ? (
                                                        <img
                                                            src={item.photo_url}
                                                            alt={item.name}
                                                            className="size-10 rounded-lg object-cover border border-sidebar-border/70"
                                                        />
                                                    ) : (
                                                        <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-xs font-extrabold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                                                            {item.initials}
                                                        </span>
                                                    )}
                                                    <div className="min-w-0">
                                                        <h2 className="font-bold text-foreground line-clamp-1">{item.name}</h2>
                                                        <p className="text-xs text-muted-foreground">{item.employee_id || '-'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-xs font-medium text-foreground">{item.position}</td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                    {groupLabels[item.group] || item.group}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-xs font-semibold text-muted-foreground">{item.sort_order}</td>
                                            <td className="px-4 py-4">
                                                <span className={item.is_active
                                                    ? 'inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                    : 'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                                                }>
                                                    <span className={`size-1.5 rounded-full ${item.is_active ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                                                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={officialEdit(item.id)}
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-foreground transition hover:border-emerald-500 hover:text-emerald-600"
                                                        title="Sunting Perangkat"
                                                    >
                                                        <Edit3 className="size-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id, item.name)}
                                                        disabled={deletingId === item.id}
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                                                        title="Hapus Perangkat"
                                                    >
                                                        {deletingId === item.id ? <Spinner /> : <Trash2 className="size-4" />}
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
                            <Users className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold">Perangkat tidak ditemukan</h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Belum ada data perangkat desa yang terdaftar atau cocok dengan pencarian.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {officials.last_page > 1 && (
                    <nav aria-label="Pagination perangkat admin" className="flex flex-wrap items-center justify-center gap-2">
                        {officials.links.map((link, index) => {
                            const label = paginationLabel(link.label);
                            const isPrevious = index === 0;
                            const isNext = index === officials.links.length - 1;
                            if (!link.url) {
                                return (
                                    <span key={`${link.label}-${index}`} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-sidebar-border/50 px-3 text-sm text-muted-foreground/40">
                                        {isPrevious ? <ChevronLeft className="size-4" /> : isNext ? <ChevronRight className="size-4" /> : label}
                                    </span>
                                );
                            }
                            return (
                                <Link key={`${link.label}-${index}`} href={link.url} preserveScroll className={link.active ? 'inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg bg-foreground px-3 text-sm font-bold text-background' : 'inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm font-semibold transition hover:border-foreground/30'}>
                                    {isPrevious ? <ChevronLeft className="size-4" /> : isNext ? <ChevronRight className="size-4" /> : label}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>
        </>
    );
}

AdminVillageOfficialsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Perangkat Desa', href: officialIndex() },
    ],
};
