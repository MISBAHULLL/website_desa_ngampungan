import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2, MapPin, Search } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import {
    create as potentialsCreate,
    edit as potentialsEdit,
    destroy as potentialsDestroy,
    index as potentialsIndex,
} from '@/actions/App/Http/Controllers/Admin/VillagePotentialController';
import { dashboard } from '@/routes';

type PotentialItem = {
    id: number;
    slug: string;
    category: string;
    name: string;
    manager_name: string;
    manager_label: string;
    address: string;
    phone: string;
    image_path: string | null;
};

type AdminPotentialsIndexProps = {
    potentials: PotentialItem[];
    filters: {
        search: string;
        category: string;
    };
};

export default function AdminPotentialsIndex({
    potentials,
    filters,
}: AdminPotentialsIndexProps) {
    const [search, setSearch] = useState(filters.search);
    const [category, setCategory] = useState(filters.category);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const applyFilters = useCallback((query: string, cat: string) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        
        debounceTimeout.current = setTimeout(() => {
            router.get(
                potentialsIndex.url(),
                { search: query, category: cat },
                { preserveState: true, replace: true }
            );
        }, 300);
    }, []);

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearch(value);
        applyFilters(value, category);
    }

    function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        setCategory(value);
        applyFilters(search, value);
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus potensi desa ini?')) {
            router.delete(potentialsDestroy({ potential: id }));
        }
    }

    const categoryLabels: Record<string, string> = {
        umkm: 'UMKM',
        agriculture: 'Pertanian',
        tourism: 'Wisata',
        culture: 'Budaya',
        culinary: 'Kuliner',
        services: 'Jasa',
    };

    return (
        <>
            <Head title="Kelola Potensi Desa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Kelola Potensi Desa
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola data UMKM, hasil bumi, pariwisata, budaya, kuliner, dan jasa warga.
                        </p>
                    </div>
                    <Link
                        href={potentialsCreate()}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Potensi Desa</span>
                    </Link>
                </header>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari nama, alamat, pengelola..."
                                value={search}
                                onChange={handleSearchChange}
                                className="h-10 w-full rounded-lg border border-sidebar-border/70 bg-background pl-10 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                            />
                        </div>
                        <select
                            value={category}
                            onChange={handleCategoryChange}
                            className="h-10 rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                        >
                            <option value="all">Semua Kategori</option>
                            <option value="umkm">UMKM</option>
                            <option value="agriculture">Pertanian</option>
                            <option value="tourism">Wisata</option>
                            <option value="culture">Budaya</option>
                            <option value="culinary">Kuliner</option>
                            <option value="services">Jasa</option>
                        </select>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background shadow-xs">
                    {potentials.length === 0 ? (
                        <div className="flex min-h-60 flex-col items-center justify-center p-8 text-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <MapPin className="size-6" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-foreground">
                                Belum ada Potensi Desa
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Tambahkan data potensi desa pertama untuk ditampilkan di website.
                            </p>
                            <Link
                                href={potentialsCreate()}
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800"
                            >
                                <Plus className="size-4" />
                                <span>Tambah Potensi Pertama</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-sidebar-border/70 bg-muted/40">
                                        <th className="px-6 py-4 font-bold text-foreground">
                                            Nama Potensi
                                        </th>
                                        <th className="px-6 py-4 font-bold text-foreground">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-4 font-bold text-foreground">
                                            Pengelola
                                        </th>
                                        <th className="px-6 py-4 text-right font-bold text-foreground">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {potentials.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-sidebar-border/70 transition hover:bg-muted/30 last:border-0"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 shrink-0 overflow-hidden rounded-md border border-sidebar-border/70 bg-muted">
                                                        {item.image_path ? (
                                                            <img
                                                                src={item.image_path.startsWith('http') ? item.image_path : `/storage/${item.image_path}`}
                                                                alt={item.name}
                                                                className="size-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex size-full items-center justify-center bg-emerald-50 text-emerald-600">
                                                                <MapPin className="size-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-foreground">
                                                            {item.name}
                                                        </div>
                                                        <div className="mt-1 line-clamp-1 max-w-[300px] text-xs text-muted-foreground">
                                                            {item.address}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                                                    {categoryLabels[item.category] || item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-foreground">
                                                    {item.manager_name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.manager_label}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={potentialsEdit({
                                                            potential: item.id,
                                                        })}
                                                        className="inline-flex size-8 items-center justify-center rounded-md border border-sidebar-border/70 text-foreground transition hover:bg-muted"
                                                    >
                                                        <Edit className="size-4" />
                                                        <span className="sr-only">
                                                            Sunting
                                                        </span>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(item.id)
                                                        }
                                                        className="inline-flex size-8 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 className="size-4" />
                                                        <span className="sr-only">
                                                            Hapus
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AdminPotentialsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Potensi Desa',
            href: '',
        },
    ],
};
