import { Form, Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Eye,
    EyeOff,
    FileText,
    Layers3,
    ListChecks,
    Plus,
    Search,
    Settings2,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
    create as serviceCreate,
    destroy as serviceDestroy,
    edit as serviceEdit,
    index as serviceIndex,
    toggleActive,
} from '@/actions/App/Http/Controllers/Admin/VillageServiceController';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type VillageServiceItem = {
    id: number;
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    audience: string;
    estimatedDuration: string;
    isActive: boolean;
    requirementsCount: number;
    documentRequirementsCount: number;
    createdAt: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type VillageServiceIndexProps = {
    services: {
        data: VillageServiceItem[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        links: PaginationLink[];
    };
    filters: {
        search: string;
        category: string;
    };
    statistics: {
        total: number;
        active: number;
        inactive: number;
        administration: number;
        population: number;
        agriculture: number;
        reports: number;
    };
};

const categoryLabels: Record<string, string> = {
    administration: 'Administrasi',
    population: 'Kependudukan',
    agriculture: 'Pertanian',
    reports: 'Pengaduan',
};

const categoryStyles: Record<string, string> = {
    administration:
        'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    population:
        'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    agriculture:
        'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    reports:
        'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
};

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Sebelumnya')
        .replace('Next &raquo;', 'Berikutnya');
}

export default function VillageServiceIndex({
    services,
    filters,
    statistics,
}: VillageServiceIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.get(
            serviceIndex.url(),
            { search: searchQuery, category: filters.category },
            { preserveState: true },
        );
    }

    function handleCategoryChange(category: string) {
        router.get(
            serviceIndex.url(),
            { search: searchQuery, category },
            { preserveState: true },
        );
    }

    function handleDelete(id: number, title: string) {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus layanan "${title}"? Data persyaratan dan dokumen terkait juga akan dihapus.`,
            )
        ) {
            setDeletingId(id);
            router.delete(serviceDestroy.url(id), {
                onFinish: () => setDeletingId(null),
            });
        }
    }

    return (
        <>
            <Head title="Kelola Layanan Desa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Administrasi Desa
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Kelola Layanan Desa
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Tambah, edit, hapus jenis layanan beserta persyaratan
                            dan berkas pendukung yang harus dipenuhi warga.
                        </p>
                    </div>

                    <Link
                        href={serviceCreate()}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-800 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Layanan Baru</span>
                    </Link>
                </header>

                {/* Statistics Cards */}
                <section
                    aria-label="Ringkasan layanan"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {[
                        {
                            label: 'Total Layanan',
                            value: statistics.total,
                            icon: Layers3,
                            style: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
                        },
                        {
                            label: 'Layanan Aktif',
                            value: statistics.active,
                            icon: CheckCircle2,
                            style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                        },
                        {
                            label: 'Persyaratan',
                            value: services.data.reduce(
                                (sum, s) => sum + s.requirementsCount,
                                0,
                            ),
                            icon: ListChecks,
                            style: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
                        },
                        {
                            label: 'Berkas Pendukung',
                            value: services.data.reduce(
                                (sum, s) => sum + s.documentRequirementsCount,
                                0,
                            ),
                            icon: FileText,
                            style: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                        },
                    ].map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <article
                                key={stat.label}
                                className="flex items-center justify-between gap-4 rounded-xl border border-sidebar-border/70 bg-background p-5"
                            >
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="mt-1 text-3xl font-bold tracking-tight">
                                        {stat.value}
                                    </p>
                                </div>
                                <span
                                    className={`flex size-11 items-center justify-center rounded-lg ${stat.style}`}
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </article>
                        );
                    })}
                </section>

                {/* Filter & Search */}
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
                            placeholder="Cari nama layanan..."
                            className="min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                            Kategori:
                        </span>
                        {[
                            { key: 'all', label: 'Semua' },
                            {
                                key: 'administration',
                                label: 'Administrasi',
                            },
                            { key: 'population', label: 'Kependudukan' },
                            { key: 'agriculture', label: 'Pertanian' },
                            { key: 'reports', label: 'Pengaduan' },
                        ].map((cat) => (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() =>
                                    handleCategoryChange(cat.key)
                                }
                                className={
                                    filters.category === cat.key
                                        ? 'rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background'
                                        : 'rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-foreground/30'
                                }
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Service Table */}
                {services.data.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-5 py-3.5"
                                        >
                                            Layanan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5"
                                        >
                                            Kategori
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5"
                                        >
                                            Persyaratan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5"
                                        >
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
                                    {services.data.map((service) => (
                                        <tr
                                            key={service.id}
                                            className="transition hover:bg-muted/20"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="max-w-sm min-w-0">
                                                    <h2 className="font-bold text-foreground">
                                                        {service.title}
                                                    </h2>
                                                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                        {
                                                            service.shortDescription
                                                        }
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold ${categoryStyles[service.category] ?? ''}`}
                                                >
                                                    {categoryLabels[
                                                        service.category
                                                    ] ?? service.category}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1.5">
                                                        <ListChecks className="size-3.5 text-emerald-600" />
                                                        {
                                                            service.requirementsCount
                                                        }{' '}
                                                        persyaratan
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <FileText className="size-3.5 text-blue-600" />
                                                        {
                                                            service.documentRequirementsCount
                                                        }{' '}
                                                        dokumen
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1.5">
                                                    <span
                                                        className={
                                                            service.isActive
                                                                ? 'inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                                                : 'inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                                        }
                                                    >
                                                        {service.isActive ? (
                                                            <Eye className="size-3" />
                                                        ) : (
                                                            <EyeOff className="size-3" />
                                                        )}
                                                        {service.isActive
                                                            ? 'Aktif'
                                                            : 'Nonaktif'}
                                                    </span>
                                                    <Form
                                                        {...toggleActive.form(
                                                            service.id,
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
                                                                {service.isActive
                                                                    ? 'Nonaktifkan'
                                                                    : 'Aktifkan'}
                                                            </button>
                                                        )}
                                                    </Form>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={serviceEdit(
                                                            service.id,
                                                        )}
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-foreground transition hover:border-emerald-500 hover:text-emerald-600"
                                                        title="Edit Layanan"
                                                    >
                                                        <Edit3 className="size-4" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                service.id,
                                                                service.title,
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            service.id
                                                        }
                                                        className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                                                        title="Hapus Layanan"
                                                    >
                                                        {deletingId ===
                                                        service.id ? (
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
                            <Settings2 className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold">
                            Layanan tidak ditemukan
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Tidak ada layanan yang cocok dengan pencarian atau
                            filter yang dipilih.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {services.last_page > 1 && (
                    <nav
                        aria-label="Pagination layanan"
                        className="flex flex-wrap items-center justify-center gap-2"
                    >
                        {services.links.map((link, linkIndex) => {
                            const label = paginationLabel(link.label);
                            const isPrevious = linkIndex === 0;
                            const isNext =
                                linkIndex === services.links.length - 1;

                            if (!link.url) {
                                return (
                                    <span
                                        key={`${link.label}-${linkIndex}`}
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
                                    key={`${link.label}-${linkIndex}`}
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

VillageServiceIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Kelola Layanan',
            href: serviceIndex(),
        },
    ],
};
