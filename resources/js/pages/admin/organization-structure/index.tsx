import { Head, router, useForm } from '@inertiajs/react';
import {
    GitBranchPlus,
    Network,
    Save,
    ShieldCheck,
    Unlink2,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    destroyBranch,
    storeBranch,
} from '@/actions/App/Http/Controllers/Admin/OrganizationStructureController';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type OfficialItem = {
    id: number;
    initials: string;
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
    initials: string;
    name: string;
    position: string;
    unit: string;
    photo: string | null;
    sortOrder: number;
    parentId: number | null;
    children: TreeNode[];
};

type BranchFormData = {
    parent_id: string;
    member_id: string;
};

type Props = {
    officials: OfficialItem[];
    tree: TreeNode[];
};

export default function AdminOrganizationStructureIndex({
    officials,
    tree,
}: Props) {
    const [detachingId, setDetachingId] = useState<number | null>(null);
    const [savingBranchId, setSavingBranchId] = useState<number | null>(null);
    const [branchUpdateErrors, setBranchUpdateErrors] = useState<
        Record<number, string>
    >({});
    const [branchParentIds, setBranchParentIds] = useState<
        Record<number, string>
    >(() =>
        Object.fromEntries(
            officials.map((official) => [
                official.id,
                official.parent_id === null ? '' : String(official.parent_id),
            ]),
        ),
    );
    const branchForm = useForm<BranchFormData>({
        parent_id: '',
        member_id: '',
    });

    const officialById = useMemo(
        () => new Map(officials.map((official) => [official.id, official])),
        [officials],
    );
    const parentId = branchForm.data.parent_id
        ? Number(branchForm.data.parent_id)
        : null;
    const selectedMember = branchForm.data.member_id
        ? officialById.get(Number(branchForm.data.member_id))
        : undefined;
    const availableMembers = officials.filter(
        (official) => official.id !== parentId,
    );
    const branches = officials.filter(
        (official) =>
            official.parent_id !== null && officialById.has(official.parent_id),
    );
    const rootCount = officials.filter(
        (official) =>
            official.parent_id === null ||
            !officialById.has(official.parent_id),
    ).length;
    const selectedMemberParent = selectedMember?.parent_id
        ? officialById.get(selectedMember.parent_id)
        : undefined;

    function handleParentChange(value: string) {
        branchForm.setData('parent_id', value);
        branchForm.clearErrors('parent_id');

        if (branchForm.data.member_id === value) {
            branchForm.setData('member_id', '');
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextMemberId = Number(branchForm.data.member_id);
        const nextParentId = branchForm.data.parent_id;

        branchForm.submit(storeBranch(), {
            preserveScroll: true,
            onSuccess: () => {
                setBranchParentIds((current) => ({
                    ...current,
                    [nextMemberId]: nextParentId,
                }));
                branchForm.reset('member_id');
            },
        });
    }

    function handleDetach(official: OfficialItem) {
        const parent = official.parent_id
            ? officialById.get(official.parent_id)
            : undefined;

        if (
            !confirm(
                `Lepaskan hubungan ${parent?.position ?? 'atasan'} ke ${official.position}? Data ${official.name} tidak akan dihapus.`,
            )
        ) {
            return;
        }

        setDetachingId(official.id);
        router.delete(destroyBranch.url(official.id), {
            preserveScroll: true,
            onFinish: () => setDetachingId(null),
        });
    }

    function handleDirectParentUpdate(official: OfficialItem) {
        const nextParentId = Number(branchParentIds[official.id]);

        if (!nextParentId || nextParentId === official.parent_id) {
            return;
        }

        setSavingBranchId(official.id);
        setBranchUpdateErrors((current) => ({
            ...current,
            [official.id]: '',
        }));
        router.post(
            storeBranch.url(),
            {
                parent_id: nextParentId,
                member_id: official.id,
            },
            {
                preserveScroll: true,
                onError: (errors) =>
                    setBranchUpdateErrors((current) => ({
                        ...current,
                        [official.id]:
                            errors.parent_id ??
                            errors.member_id ??
                            'Atasan langsung belum dapat diperbarui.',
                    })),
                onFinish: () => setSavingBranchId(null),
            },
        );
    }

    return (
        <>
            <Head title="Kelola Struktur Organisasi" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="border-b border-sidebar-border/70 pb-6">
                    <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                        Pemerintahan Desa
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                        Kelola Struktur Organisasi
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                        Bentuk cabang dengan menghubungkan satu atasan ke satu
                        atau beberapa perangkat bawahan. Melepas cabang tidak
                        menghapus data perangkat desa.
                    </p>
                </header>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
                    <div className="min-w-0 space-y-6">
                        <section className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background">
                            <div className="border-b border-sidebar-border/70 bg-muted/25 px-5 py-4">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white dark:bg-emerald-600">
                                        <GitBranchPlus className="size-4" />
                                    </span>
                                    <div>
                                        <h2 className="font-bold text-foreground">
                                            Tambah atau pindahkan cabang
                                        </h2>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Pilih atasan, lalu pilih perangkat
                                            yang akan ditempatkan tepat di
                                            bawahnya.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="grid gap-5 p-5 md:grid-cols-2"
                            >
                                <div className="space-y-2">
                                    <label
                                        htmlFor="branch-parent"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Atasan langsung
                                    </label>
                                    <select
                                        id="branch-parent"
                                        value={branchForm.data.parent_id}
                                        onChange={(event) =>
                                            handleParentChange(
                                                event.target.value,
                                            )
                                        }
                                        className="min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    >
                                        <option value="">
                                            Pilih atasan langsung
                                        </option>
                                        {officials.map((official) => (
                                            <option
                                                key={official.id}
                                                value={official.id}
                                            >
                                                {official.position} —{' '}
                                                {official.name}
                                            </option>
                                        ))}
                                    </select>
                                    {branchForm.errors.parent_id && (
                                        <p className="text-xs leading-5 text-red-600 dark:text-red-400">
                                            {branchForm.errors.parent_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="branch-member"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Perangkat bawahan
                                    </label>
                                    <select
                                        id="branch-member"
                                        value={branchForm.data.member_id}
                                        disabled={parentId === null}
                                        onChange={(event) => {
                                            branchForm.setData(
                                                'member_id',
                                                event.target.value,
                                            );
                                            branchForm.clearErrors('member_id');
                                        }}
                                        className="min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-muted/40 disabled:text-muted-foreground"
                                    >
                                        <option value="">
                                            {parentId === null
                                                ? 'Pilih atasan terlebih dahulu'
                                                : 'Pilih perangkat bawahan'}
                                        </option>
                                        {availableMembers.map((official) => (
                                            <option
                                                key={official.id}
                                                value={official.id}
                                            >
                                                {official.position} —{' '}
                                                {official.name}
                                            </option>
                                        ))}
                                    </select>
                                    {branchForm.errors.member_id && (
                                        <p className="text-xs leading-5 text-red-600 dark:text-red-400">
                                            {branchForm.errors.member_id}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 border-t border-sidebar-border/70 pt-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
                                    <p className="max-w-xl text-xs leading-5 text-muted-foreground">
                                        {selectedMemberParent ? (
                                            <>
                                                Saat ini{' '}
                                                <strong className="text-foreground">
                                                    {selectedMember?.position}
                                                </strong>{' '}
                                                berada di bawah{' '}
                                                <strong className="text-foreground">
                                                    {
                                                        selectedMemberParent.position
                                                    }
                                                </strong>
                                                . Menyimpan akan memindahkan
                                                cabangnya.
                                            </>
                                        ) : (
                                            'Cabang baru otomatis ditempatkan setelah bawahan lain pada atasan yang sama.'
                                        )}
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={
                                            branchForm.processing ||
                                            !branchForm.data.parent_id ||
                                            !branchForm.data.member_id
                                        }
                                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                    >
                                        {branchForm.processing ? (
                                            <Spinner />
                                        ) : (
                                            <GitBranchPlus className="size-4" />
                                        )}
                                        {selectedMemberParent
                                            ? 'Pindahkan Cabang'
                                            : 'Tambah Cabang'}
                                    </button>
                                </div>

                                {branchForm.recentlySuccessful && (
                                    <p
                                        className="text-xs font-semibold text-emerald-700 md:col-span-2 dark:text-emerald-400"
                                        role="status"
                                    >
                                        Hubungan cabang berhasil diperbarui.
                                    </p>
                                )}
                            </form>
                        </section>

                        <section className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background">
                            <div className="flex flex-col gap-2 border-b border-sidebar-border/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="font-bold text-foreground">
                                        Cabang yang tersimpan
                                    </h2>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Ubah pilihan atasan pada baris
                                        perangkat, lalu simpan hubungan barunya.
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground">
                                    {branches.length} hubungan
                                </span>
                            </div>

                            {branches.length > 0 ? (
                                <div className="divide-y divide-sidebar-border/70">
                                    {branches.map((official) => {
                                        const parent = officialById.get(
                                            official.parent_id as number,
                                        );

                                        if (!parent) {
                                            return null;
                                        }

                                        return (
                                            <div
                                                key={official.id}
                                                className="grid gap-4 px-5 py-4 transition-colors hover:bg-muted/20 lg:grid-cols-[minmax(13rem,0.9fr)_minmax(15rem,1fr)_auto] lg:items-end"
                                            >
                                                <OfficialIdentity
                                                    official={official}
                                                    label="Perangkat"
                                                />
                                                <div className="min-w-0 space-y-1.5">
                                                    <label
                                                        htmlFor={`branch-parent-${official.id}`}
                                                        className="block text-[11px] font-semibold text-muted-foreground"
                                                    >
                                                        Atasan langsung
                                                    </label>
                                                    <select
                                                        id={`branch-parent-${official.id}`}
                                                        value={
                                                            branchParentIds[
                                                                official.id
                                                            ] ??
                                                            String(parent.id)
                                                        }
                                                        onChange={(event) =>
                                                            setBranchParentIds(
                                                                (current) => ({
                                                                    ...current,
                                                                    [official.id]:
                                                                        event
                                                                            .target
                                                                            .value,
                                                                }),
                                                            )
                                                        }
                                                        className="min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 text-xs font-semibold text-foreground transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                                    >
                                                        {officials
                                                            .filter(
                                                                (candidate) =>
                                                                    candidate.id !==
                                                                    official.id,
                                                            )
                                                            .map(
                                                                (candidate) => (
                                                                    <option
                                                                        key={
                                                                            candidate.id
                                                                        }
                                                                        value={
                                                                            candidate.id
                                                                        }
                                                                    >
                                                                        {
                                                                            candidate.position
                                                                        }{' '}
                                                                        —{' '}
                                                                        {
                                                                            candidate.name
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                    </select>
                                                    {branchUpdateErrors[
                                                        official.id
                                                    ] && (
                                                        <p
                                                            className="text-xs leading-5 text-red-600 dark:text-red-400"
                                                            role="alert"
                                                        >
                                                            {
                                                                branchUpdateErrors[
                                                                    official.id
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDirectParentUpdate(
                                                                official,
                                                            )
                                                        }
                                                        disabled={
                                                            savingBranchId ===
                                                                official.id ||
                                                            !branchParentIds[
                                                                official.id
                                                            ] ||
                                                            Number(
                                                                branchParentIds[
                                                                    official.id
                                                                ],
                                                            ) ===
                                                                official.parent_id
                                                        }
                                                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 text-xs font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-45 lg:flex-none dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                                    >
                                                        {savingBranchId ===
                                                        official.id ? (
                                                            <Spinner />
                                                        ) : (
                                                            <Save className="size-3.5" />
                                                        )}
                                                        Simpan atasan
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDetach(
                                                                official,
                                                            )
                                                        }
                                                        disabled={
                                                            detachingId ===
                                                            official.id
                                                        }
                                                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-background px-3 text-xs font-bold text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                                                    >
                                                        {detachingId ===
                                                        official.id ? (
                                                            <Spinner />
                                                        ) : (
                                                            <Unlink2 className="size-3.5" />
                                                        )}
                                                        <span className="sr-only sm:not-sr-only">
                                                            Lepaskan
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
                                    <Users className="size-6 text-muted-foreground" />
                                    <h3 className="mt-4 font-bold text-foreground">
                                        Belum ada cabang organisasi
                                    </h3>
                                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                        Gunakan formulir di atas untuk
                                        menghubungkan pimpinan dengan perangkat
                                        bawahannya.
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>

                    <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start">
                        <section className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background">
                            <div className="border-b border-sidebar-border/70 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <Network className="size-4 text-emerald-700 dark:text-emerald-400" />
                                    <h2 className="font-bold text-foreground">
                                        Pratinjau bagan publik
                                    </h2>
                                </div>
                                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                    Ini adalah susunan yang tampil pada halaman
                                    Pemerintahan Desa setelah perubahan
                                    disimpan.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 divide-x divide-sidebar-border/70 border-b border-sidebar-border/70 bg-muted/20">
                                <StructureMetric
                                    value={officials.length}
                                    label="Perangkat"
                                />
                                <StructureMetric
                                    value={rootCount}
                                    label="Tingkat utama"
                                />
                                <StructureMetric
                                    value={branches.length}
                                    label="Cabang"
                                />
                            </div>

                            <div className="max-h-[42rem] overflow-y-auto p-4">
                                {tree.length > 0 ? (
                                    <div className="space-y-3">
                                        {tree.map((node) => (
                                            <TreeNodePreview
                                                key={node.id}
                                                node={node}
                                                level={0}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-10 text-center">
                                        <ShieldCheck className="mx-auto size-6 text-muted-foreground" />
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Belum ada perangkat aktif untuk
                                            ditampilkan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </>
    );
}

function OfficialIdentity({
    official,
    label,
}: {
    official: OfficialItem;
    label: string;
}) {
    return (
        <div className="flex min-w-0 items-center gap-2.5">
            {official.photo_url ? (
                <img
                    src={official.photo_url}
                    alt=""
                    className="size-9 shrink-0 rounded-lg object-cover"
                />
            ) : (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-extrabold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {official.initials}
                </span>
            )}
            <span className="min-w-0">
                <span className="block text-[10px] font-semibold text-muted-foreground">
                    {label}
                </span>
                <span className="block truncate text-xs font-bold text-foreground">
                    {official.position}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                    {official.name}
                </span>
            </span>
        </div>
    );
}

function StructureMetric({ value, label }: { value: number; label: string }) {
    return (
        <div className="px-2 py-3 text-center">
            <strong className="block text-base font-bold text-foreground">
                {value}
            </strong>
            <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">
                {label}
            </span>
        </div>
    );
}

function TreeNodePreview({ node, level }: { node: TreeNode; level: number }) {
    return (
        <div
            className={
                level > 0
                    ? 'space-y-2 border-l border-emerald-200 pl-3 dark:border-emerald-900'
                    : 'space-y-2'
            }
        >
            <div className="flex items-center gap-2.5 rounded-lg bg-muted/35 p-2.5">
                {node.photo ? (
                    <img
                        src={node.photo}
                        alt=""
                        className="size-8 shrink-0 rounded-md object-cover"
                    />
                ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-700 text-[10px] font-bold text-white dark:bg-emerald-600">
                        {node.initials}
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-foreground">
                        {node.position}
                    </div>
                    <div className="truncate text-[10px] text-muted-foreground">
                        {node.name}
                    </div>
                </div>
                {node.children.length > 0 && (
                    <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">
                        {node.children.length} cabang
                    </span>
                )}
            </div>

            {node.children.length > 0 && (
                <div className="space-y-2 pl-3">
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
