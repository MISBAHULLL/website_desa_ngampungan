import { Link } from '@inertiajs/react';
import { Building2, ChevronRight, Network } from 'lucide-react';
import { useMemo } from 'react';
import { show as officialShow } from '@/routes/government/officials';

export type OfficialProp = {
    id: number;
    slug: string;
    name: string;
    initials: string;
    position: string;
    unit: string;
    group: string;
    photo_url: string | null;
    term: string | null;
    employee_id: string | null;
    summary: string;
    about: string | null;
    responsibilities: string[];
    service_focus: string[];
    education: string[];
    career: { period: string; role: string }[];
    parent_id: number | null;
    children?: OfficialProp[];
};

export type OrganizationTreeNode = {
    id: number;
    children: OrganizationTreeNode[];
};

function OrganizationNode({
    official,
    emphasis = false,
    onOpenDetail,
}: {
    official: OfficialProp;
    emphasis?: boolean;
    onOpenDetail?: (official: OfficialProp) => void;
}) {
    const nodeContent = (
        <>
            <span
                className={
                    emphasis
                        ? 'mx-auto flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-emerald-300 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105'
                        : 'mx-auto flex size-10 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-sm font-extrabold text-emerald-800 ring-1 ring-emerald-200/60 transition-transform duration-300 group-hover:scale-105'
                }
            >
                {official.photo_url ? (
                    <img
                        src={official.photo_url}
                        alt={official.name}
                        className="size-full object-cover"
                    />
                ) : emphasis ? (
                    <Building2 aria-hidden="true" className="size-7" />
                ) : (
                    official.initials
                )}
            </span>
            <span
                className={
                    emphasis
                        ? 'mt-3.5 block text-lg font-extrabold tracking-tight text-white'
                        : 'mt-2.5 block text-sm font-bold text-gray-900 group-hover:text-emerald-700'
                }
            >
                {official.name}
            </span>
            <span
                className={
                    emphasis
                        ? 'mt-1 block text-xs font-semibold tracking-wider text-emerald-200/90 uppercase'
                        : 'mt-0.5 block text-xs font-medium text-gray-500'
                }
            >
                {official.position}
            </span>
            <span
                className={
                    emphasis
                        ? 'mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-emerald-200'
                        : 'mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 transition-colors group-hover:text-emerald-700'
                }
            >
                <span>Detail Profil</span>
                <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
        </>
    );

    const className = emphasis
        ? 'group relative z-10 block w-full max-w-md cursor-pointer rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-center text-white shadow-xl shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/20 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none'
        : 'group relative z-10 block w-full cursor-pointer rounded-xl border border-gray-200/90 bg-white p-4 text-center shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none';

    if (onOpenDetail) {
        return (
            <button
                type="button"
                onClick={() => onOpenDetail(official)}
                className={className}
            >
                {nodeContent}
            </button>
        );
    }

    return (
        <Link href={officialShow(official.slug)} className={className}>
            {nodeContent}
        </Link>
    );
}

function branchGridClass(childCount: number): string {
    if (childCount === 1) {
        return 'mx-auto max-w-sm grid-cols-1';
    }

    if (childCount === 2) {
        return 'sm:grid-cols-2';
    }

    return 'sm:grid-cols-2';
}

function OrganizationBranch({
    node,
    officialById,
    onOpenDetail,
}: {
    node: OrganizationTreeNode;
    officialById: Map<number, OfficialProp>;
    onOpenDetail?: (official: OfficialProp) => void;
}) {
    const official = officialById.get(node.id);

    if (!official) {
        return null;
    }

    const children = node.children.filter((child) =>
        officialById.has(child.id),
    );

    return (
        <div className="flex min-w-0 flex-col items-center">
            <div className="w-full max-w-xs">
                <OrganizationNode
                    official={official}
                    onOpenDetail={onOpenDetail}
                />
            </div>

            {children.length > 0 && (
                <div className="w-full">
                    <div
                        aria-hidden="true"
                        className="mx-auto h-5 w-px bg-emerald-300"
                    />
                    <div className="rounded-xl bg-white/70 p-3 ring-1 ring-gray-200/80">
                        <p className="mb-3 text-center text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                            Bawahan langsung {official.position}
                        </p>
                        <div
                            className={`grid w-full gap-3 ${branchGridClass(children.length)}`}
                        >
                            {children.map((child) => (
                                <OrganizationBranch
                                    key={child.id}
                                    node={child}
                                    officialById={officialById}
                                    onOpenDetail={onOpenDetail}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const branchGroupDefinitions = [
    {
        key: 'secretariat',
        title: 'Sekretariat Desa',
        badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    {
        key: 'technical',
        title: 'Pelaksana Teknis (Kasi)',
        badgeClass: 'border-teal-200 bg-teal-50 text-teal-700',
    },
    {
        key: 'territorial',
        title: 'Pelaksana Kewilayahan',
        badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
    },
] as const;

type BranchGroup = {
    key: string;
    title: string;
    badgeClass: string;
    nodes: OrganizationTreeNode[];
};

function OrganizationGroup({
    title,
    badgeClass,
    nodes,
    officialById,
    onOpenDetail,
}: {
    title: string;
    badgeClass: string;
    nodes: OrganizationTreeNode[];
    officialById: Map<number, OfficialProp>;
    onOpenDetail?: (official: OfficialProp) => void;
}) {
    return (
        <section className="min-w-0 rounded-2xl border border-gray-200/80 bg-gray-50/75 p-4 shadow-2xs sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${badgeClass}`}
                    >
                        <Network aria-hidden="true" className="size-3.5" />
                    </span>
                    <h3 className="truncate text-xs font-extrabold tracking-wider text-gray-800 uppercase">
                        {title}
                    </h3>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-gray-400">
                    {nodes.length} cabang
                </span>
            </div>
            <div className={`grid gap-3 ${branchGridClass(nodes.length)}`}>
                {nodes.map((node) => (
                    <OrganizationBranch
                        key={node.id}
                        node={node}
                        officialById={officialById}
                        onOpenDetail={onOpenDetail}
                    />
                ))}
            </div>
        </section>
    );
}

export function VillageOrganizationChart({
    allOfficials = [],
    tree = [],
    onOpenDetail,
}: {
    allOfficials?: OfficialProp[];
    tree?: OrganizationTreeNode[];
    onOpenDetail?: (official: OfficialProp) => void;
}) {
    const officialById = useMemo(
        () => new Map(allOfficials.map((official) => [official.id, official])),
        [allOfficials],
    );
    const visibleRoots = tree.filter((node) => officialById.has(node.id));
    const mainRoot =
        visibleRoots.find((node) => {
            const official = officialById.get(node.id);

            return (
                official?.position === 'Kepala Desa' ||
                official?.group === 'leadership'
            );
        }) ?? visibleRoots[0];
    const mainOfficial = mainRoot ? officialById.get(mainRoot.id) : undefined;
    const directChildren =
        mainRoot?.children.filter((node) => officialById.has(node.id)) ?? [];
    const groupedChildIds = new Set<number>();
    const branchGroups: BranchGroup[] = branchGroupDefinitions
        .map((definition) => {
            const nodes = directChildren.filter((node) => {
                const matches =
                    officialById.get(node.id)?.group === definition.key;

                if (matches) {
                    groupedChildIds.add(node.id);
                }

                return matches;
            });

            return { ...definition, nodes };
        })
        .filter((group) => group.nodes.length > 0);
    const otherDirectChildren = directChildren.filter(
        (node) => !groupedChildIds.has(node.id),
    );

    if (otherDirectChildren.length > 0) {
        branchGroups.push({
            key: 'other',
            title: 'Perangkat Lainnya',
            badgeClass: 'border-slate-200 bg-slate-50 text-slate-700',
            nodes: otherDirectChildren,
        });
    }

    const otherRoots = visibleRoots.filter((node) => node.id !== mainRoot?.id);

    if (!mainRoot || !mainOfficial) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                <p className="text-sm font-semibold text-gray-700">
                    Struktur organisasi belum tersedia.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    Susunan perangkat akan tampil setelah ditetapkan oleh admin
                    desa.
                </p>
            </div>
        );
    }

    return (
        <div
            aria-label="Bagan struktur organisasi Pemerintah Desa Ngampungan"
            className="relative overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-5 shadow-xl shadow-gray-200/40 sm:p-8 lg:p-10"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-35"
            />

            <div className="relative flex flex-col items-center">
                <OrganizationNode
                    official={mainOfficial}
                    emphasis
                    onOpenDetail={onOpenDetail}
                />

                {branchGroups.length > 0 && (
                    <>
                        <div
                            aria-hidden="true"
                            className="h-8 w-px bg-gradient-to-b from-emerald-800 to-emerald-300"
                        />
                        <div className="relative w-full pt-6">
                            <div
                                aria-hidden="true"
                                className="absolute top-0 right-[10%] left-[10%] hidden h-px bg-emerald-200 lg:block"
                            />
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {branchGroups.map((group) => (
                                    <div
                                        key={group.key}
                                        className="relative before:absolute before:top-[-1.5rem] before:left-1/2 before:hidden before:h-6 before:w-px before:bg-emerald-200 lg:before:block"
                                    >
                                        <OrganizationGroup
                                            title={group.title}
                                            badgeClass={group.badgeClass}
                                            nodes={group.nodes}
                                            officialById={officialById}
                                            onOpenDetail={onOpenDetail}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {otherRoots.length > 0 && (
                    <section className="mt-8 w-full border-t border-dashed border-gray-300 pt-6">
                        <div className="mb-4 text-center">
                            <h3 className="text-xs font-extrabold tracking-wider text-gray-700 uppercase">
                                Perangkat tingkat utama lainnya
                            </h3>
                            <p className="mt-1 text-[11px] text-gray-500">
                                Belum memiliki atasan langsung pada struktur
                                utama.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {otherRoots.map((root) => (
                                <OrganizationBranch
                                    key={root.id}
                                    node={root}
                                    officialById={officialById}
                                    onOpenDetail={onOpenDetail}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <p className="relative mt-8 text-center text-xs leading-relaxed font-medium text-gray-500">
                Pilih nama atau jabatan untuk melihat rincian tugas dan profil
                perangkat desa.
            </p>
        </div>
    );
}
