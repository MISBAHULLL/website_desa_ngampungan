import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Edit3,
    Landmark,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
    create as institutionCreate,
    destroy as institutionDestroy,
    edit as institutionEdit,
    index as institutionIndex,
} from '@/actions/App/Http/Controllers/Admin/VillageInstitutionController';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type InstitutionItem = {
    id: number;
    acronym: string;
    name: string;
    leader: string | null;
    member_count: number;
    focus: string;
    responsibilities: string[];
    sort_order: number;
    is_active: boolean;
};

type PaginationLink = { url: string | null; label: string; active: boolean };
type PaginatedInstitutions = {
    data: InstitutionItem[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

type Props = {
    institutions: PaginatedInstitutions;
    filters: { search: string };
};

const badgeColors: Record<string, string> = {
    BPD: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
    LPMD: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
    PKK: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800',
    KARTAR: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
};

function getBadgeStyle(acronym: string) {
    return badgeColors[acronym] || 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800';
}

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Sebelumnya')
        .replace('Next &raquo;', 'Berikutnya');
}

export default function AdminVillageInstitutionsIndex({ institutions, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.get(institutionIndex.url(), { search: searchQuery }, { preserveState: true });
    }

    function handleDelete(id: number, name: string) {
        if (confirm(`Apakah Anda yakin ingin menghapus lembaga "${name}"?`)) {
            setDeletingId(id);
            router.delete(institutionDestroy.url(id), { onFinish: () => setDeletingId(null) });
        }
    }

    return (
        <>
            <Head title="Kelola Lembaga Desa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Kelembagaan Masyarakat Desa
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Kelola Lembaga Desa
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Kelola data lembaga kemasyarakatan desa seperti BPD, LPMD, PKK, dan Karang Taruna.
                        </p>
                    </div>
                    <Link
                        href={institutionCreate()}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Lembaga Baru</span>
                    </Link>
                </header>

                {/* Search */}
                <div className="flex flex-col gap-4 rounded-xl border border-sidebar-border/70 bg-background p-4 md:flex-row md:items-center">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari berdasarkan nama lembaga, singkatan, atau ketua..."
                            className="min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </form>
                </div>

                {/* Table */}
                {institutions.data.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5">Singkatan & Nama Lembaga</th>
                                        <th scope="col" className="px-4 py-3.5">Ketua</th>
                                        <th scope="col" className="px-4 py-3.5">Anggota</th>
                                        <th scope="col" className="px-4 py-3.5">Fokus Utama</th>
                                        <th scope="col" className="px-4 py-3.5">Status</th>
                                        <th scope="col" className="px-5 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/70">
                                    {institutions.data.map((item) => (
                                        <tr key={item.id} className="transition hover:bg-muted/20">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-black tracking-wider ${getBadgeStyle(item.acronym)}`}>
                                                        {item.acronym}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <h2 className="font-bold text-foreground line-clamp-1">{item.name}</h2>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-xs font-medium text-foreground">{item.leader || '-'}</td>
                                            <td className="px-4 py-4 text-xs font-semibold text-muted-foreground">{item.member_count} orang</td>
                                            <td className="px-4 py-4 text-xs text-muted-foreground max-w-xs line-clamp-2">{item.focus}</td>
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
                                                        href={institutionEdit(item.id)}
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-foreground transition hover:border-emerald-500 hover:text-emerald-600"
                                                        title="Sunting Lembaga"
                                                    >
                                                        <Edit3 className="size-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id, item.name)}
                                                        disabled={deletingId === item.id}
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                                                        title="Hapus Lembaga"
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
                            <Landmark className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold">Lembaga tidak ditemukan</h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Belum ada data lembaga desa yang terdaftar.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {institutions.last_page > 1 && (
                    <nav aria-label="Pagination lembaga admin" className="flex flex-wrap items-center justify-center gap-2">
                        {institutions.links.map((link, index) => {
                            const label = paginationLabel(link.label);
                            const isPrevious = index === 0;
                            const isNext = index === institutions.links.length - 1;
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

AdminVillageInstitutionsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Lembaga Desa', href: institutionIndex() },
    ],
};
