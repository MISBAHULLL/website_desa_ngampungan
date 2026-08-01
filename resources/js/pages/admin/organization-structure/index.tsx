import { Head, useForm } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    Check,
    Network,
    Save,
    Trash2,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { updateStructure } from '@/actions/App/Http/Controllers/Admin/OrganizationStructureController';
import { dashboard } from '@/routes';

type OfficialItem = {
    id: number;
    name: string;
    position: string;
    unit: string;
    group: string;
    photo_url: string | null;
    parent_id: number | null;
    sort_order: number;
};

type TreeNode = {
    id: number;
    name: string;
    position: string;
    unit: string;
    photo: string | null;
    sortOrder: number;
    parentId: number | null;
    children: TreeNode[];
};

type Props = {
    officials: OfficialItem[];
    tree: TreeNode[];
};

export default function AdminOrganizationStructureIndex({
    officials,
    tree: initialTree,
}: Props) {
    // We keep state of updates: map of official id -> { parent_id, sort_order }
    const [structure, setStructure] = useState<
        Record<number, { parent_id: number | null; sort_order: number }>
    >(() => {
        const initialMap: Record<
            number,
            { parent_id: number | null; sort_order: number }
        > = {};
        officials.forEach((off) => {
            initialMap[off.id] = {
                parent_id: off.parent_id,
                sort_order: off.sort_order,
            };
        });
        return initialMap;
    });

    const { patch, processing, wasSuccessful } = useForm();

    function handleParentChange(id: number, newParentId: string) {
        const parsedParentId =
            newParentId === '' ? null : parseInt(newParentId);
        setStructure((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                parent_id: parsedParentId,
            },
        }));
    }

    function handleOrderChange(id: number, delta: number) {
        setStructure((prev) => {
            const currentOrder = prev[id]?.sort_order || 0;
            const newOrder = Math.max(0, currentOrder + delta);
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    sort_order: newOrder,
                },
            };
        });
    }

    function handleSave() {
        const payload = Object.entries(structure).map(([id, val]) => ({
            id: parseInt(id),
            parent_id: val.parent_id,
            sort_order: val.sort_order,
        }));

        // Submit patch using useForm or router
        patch(updateStructure.url(), {
            data: { updates: payload },
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Struktur Organisasi Dinamis" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Pohon Hirarki Pemerintahan Desa
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Kelola Struktur Organisasi
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Atur hubungan atasan-bawahan dan urutan hirarki
                            perangkat desa secara bebas dan dinamis.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={processing}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        {wasSuccessful ? (
                            <Check className="size-4" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        <span>
                            {processing
                                ? 'Menyimpan...'
                                : wasSuccessful
                                  ? 'Tersimpan!'
                                  : 'Simpan Perubahan Struktur'}
                        </span>
                    </button>
                </header>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Panel: Table of hierarchy settings */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 shadow-xs">
                            <h2 className="mb-1 text-sm font-bold text-foreground">
                                Pengaturan Hirarki & Atasan Direct
                            </h2>
                            <p className="mb-4 text-xs text-muted-foreground">
                                Pilih siapa atasan langsung dari masing-masing
                                perangkat desa. Sistem akan mengelompokkan
                                cabang secara otomatis.
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-4 py-3"
                                            >
                                                Perangkat Desa
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-4 py-3"
                                            >
                                                Atasan Langsung (Parent)
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-4 py-3 text-center"
                                            >
                                                Urutan (Order)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sidebar-border/70">
                                        {officials.map((official) => {
                                            const currentParentId =
                                                structure[official.id]
                                                    ?.parent_id ?? null;
                                            const currentSortOrder =
                                                structure[official.id]
                                                    ?.sort_order ?? 0;

                                            return (
                                                <tr
                                                    key={official.id}
                                                    className="transition hover:bg-muted/20"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="font-bold text-foreground">
                                                            {official.name}
                                                        </div>
                                                        <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                            {official.position}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <select
                                                            value={
                                                                currentParentId ===
                                                                null
                                                                    ? ''
                                                                    : currentParentId
                                                            }
                                                            onChange={(e) =>
                                                                handleParentChange(
                                                                    official.id,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                                                        >
                                                            <option value="">
                                                                -- Pimpinan /
                                                                Root (Top) --
                                                            </option>
                                                            {officials
                                                                .filter(
                                                                    (o) =>
                                                                        o.id !==
                                                                        official.id,
                                                                )
                                                                .map((p) => (
                                                                    <option
                                                                        key={
                                                                            p.id
                                                                        }
                                                                        value={
                                                                            p.id
                                                                        }
                                                                    >
                                                                        {p.name}{' '}
                                                                        (
                                                                        {
                                                                            p.position
                                                                        }
                                                                        )
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleOrderChange(
                                                                        official.id,
                                                                        -1,
                                                                    )
                                                                }
                                                                className="rounded border border-sidebar-border p-1 text-muted-foreground hover:bg-muted"
                                                            >
                                                                <ArrowUp className="size-3" />
                                                            </button>
                                                            <span className="w-6 text-xs font-bold text-foreground">
                                                                {
                                                                    currentSortOrder
                                                                }
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleOrderChange(
                                                                        official.id,
                                                                        1,
                                                                    )
                                                                }
                                                                className="rounded border border-sidebar-border p-1 text-muted-foreground hover:bg-muted"
                                                            >
                                                                <ArrowDown className="size-3" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Live Tree Preview */}
                    <div className="space-y-4">
                        <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 shadow-xs">
                            <h2 className="mb-1 flex items-center gap-2 text-sm font-bold text-foreground">
                                <Network className="size-4 text-emerald-700" />
                                <span>Ringkasan Hirarki Realtime</span>
                            </h2>
                            <p className="mb-4 text-xs text-muted-foreground">
                                Visual struktur yang saat ini tersimpan di
                                database.
                            </p>

                            <div className="max-h-[600px] space-y-3 overflow-y-auto pr-1">
                                {initialTree.map((node) => (
                                    <TreeNodePreview
                                        key={node.id}
                                        node={node}
                                        level={0}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function TreeNodePreview({ node, level }: { node: TreeNode; level: number }) {
    return (
        <div
            className={`space-y-2 ${level > 0 ? 'ml-4 border-l-2 border-emerald-200 pl-3 dark:border-emerald-900' : ''}`}
        >
            <div className="flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-muted/20 p-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-700 text-xs font-bold text-white">
                    {node.position.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-foreground">
                        {node.name}
                    </div>
                    <div className="truncate text-[10px] text-muted-foreground">
                        {node.position}
                    </div>
                </div>
            </div>

            {node.children && node.children.length > 0 && (
                <div className="space-y-2">
                    {node.children.map((child) => (
                        <TreeNodePreview
                            key={child.id}
                            node={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

AdminOrganizationStructureIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Struktur Organisasi', href: '#' },
    ],
};
