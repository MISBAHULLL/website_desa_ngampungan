import { Link } from '@inertiajs/react';
import { Building2, ChevronRight, Network, UserCheck } from 'lucide-react';
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

    if (onOpenDetail) {
        return (
            <button
                type="button"
                onClick={() => onOpenDetail(official)}
                className={
                    emphasis
                        ? 'group relative z-10 block w-full max-w-md cursor-pointer rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-center text-white shadow-xl shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/20 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none'
                        : 'group relative z-10 block w-full cursor-pointer rounded-xl border border-gray-200/90 bg-white p-4 text-center shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none'
                }
            >
                {nodeContent}
            </button>
        );
    }

    return (
        <Link
            href={officialShow(official.slug)}
            className={
                emphasis
                    ? 'group relative z-10 block w-full max-w-md rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-center text-white shadow-xl shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/20 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none'
                    : 'group relative z-10 block w-full rounded-xl border border-gray-200/90 bg-white p-4 text-center shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none'
            }
        >
            {nodeContent}
        </Link>
    );
}

function OrganizationGroup({
    title,
    officials,
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200',
    onOpenDetail,
}: {
    title: string;
    officials: OfficialProp[];
    badgeColor?: string;
    onOpenDetail?: (official: OfficialProp) => void;
}) {
    return (
        <div className="rounded-2xl border border-gray-200/80 bg-gray-50/50 p-5 shadow-2xs">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span
                        className={`flex size-7 items-center justify-center rounded-lg border text-xs ${badgeColor}`}
                    >
                        <Network aria-hidden="true" className="size-3.5" />
                    </span>
                    <h3 className="text-xs font-extrabold tracking-wider text-gray-800 uppercase">
                        {title}
                    </h3>
                </div>
                <span className="text-[11px] font-bold text-gray-400">
                    {officials.length} Perangkat
                </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                {officials.map((official) => (
                    <OrganizationNode
                        key={official.slug}
                        official={official}
                        onOpenDetail={onOpenDetail}
                    />
                ))}
            </div>
        </div>
    );
}

export function VillageOrganizationChart({
    allOfficials = [],
    onOpenDetail,
}: {
    allOfficials?: OfficialProp[];
    onOpenDetail?: (official: OfficialProp) => void;
}) {
    const villageHead = allOfficials.find(
        (official) => official.group === 'leadership',
    );
    const villageSecretary = allOfficials.find(
        (official) => official.position === 'Sekretaris Desa',
    );
    const secretariatOfficials = allOfficials.filter(
        (official) =>
            official.group === 'secretariat' &&
            official.position !== 'Sekretaris Desa',
    );
    const technicalOfficials = allOfficials.filter(
        (official) => official.group === 'technical',
    );
    const territorialOfficials = allOfficials.filter(
        (official) => official.group === 'territorial',
    );

    if (!villageHead && !villageSecretary) {
        return null;
    }

    return (
        <div
            aria-label="Bagan struktur organisasi Pemerintah Desa Ngampungan"
            className="relative overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xl shadow-gray-200/40 sm:p-10"
        >
            {/* Background Decorative Grid */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"
            />

            <div className="relative flex flex-col items-center">
                {/* Level 1: Kepala Desa */}
                {villageHead && (
                    <OrganizationNode
                        official={villageHead}
                        emphasis
                        onOpenDetail={onOpenDetail}
                    />
                )}

                {/* Connecting Vertical Line */}
                {villageHead && villageSecretary && (
                    <div
                        aria-hidden="true"
                        className="h-8 w-0.5 bg-gradient-to-b from-emerald-800 to-emerald-400"
                    />
                )}

                {/* Level 2: Sekretaris Desa */}
                {villageSecretary && (
                    <div className="w-full max-w-sm">
                        <OrganizationNode
                            official={villageSecretary}
                            onOpenDetail={onOpenDetail}
                        />
                    </div>
                )}

                {/* Connecting Vertical Line */}
                <div aria-hidden="true" className="h-8 w-0.5 bg-emerald-300" />

                {/* Level 3: Urusan Sekretariat & Pelaksana Teknis */}
                <div className="relative w-full pt-6">
                    <div
                        aria-hidden="true"
                        className="absolute top-0 right-1/4 left-1/4 h-0.5 bg-emerald-200"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute top-0 left-1/4 h-6 w-0.5 bg-emerald-200"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute top-0 right-1/4 h-6 w-0.5 bg-emerald-200"
                    />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <OrganizationGroup
                            title="Urusan Sekretariat"
                            officials={secretariatOfficials}
                            badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
                            onOpenDetail={onOpenDetail}
                        />
                        <OrganizationGroup
                            title="Pelaksana Teknis"
                            officials={technicalOfficials}
                            badgeColor="bg-teal-50 text-teal-700 border-teal-200"
                            onOpenDetail={onOpenDetail}
                        />
                    </div>
                </div>

                {/* Connecting Line to Territorial */}
                <div aria-hidden="true" className="h-8 w-0.5 bg-emerald-200" />

                {/* Level 4: Pelaksana Kewilayahan (Kepala Dusun) */}
                <div className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-800 shadow-2xs">
                                <UserCheck
                                    aria-hidden="true"
                                    className="size-3.5 text-emerald-600"
                                />
                            </span>
                            <h3 className="text-xs font-extrabold tracking-wider text-emerald-900 uppercase">
                                Pelaksana Kewilayahan (Kepala Dusun)
                            </h3>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700">
                            {territorialOfficials.length} Wilayah Kasun
                        </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {territorialOfficials.map((official) => (
                            <OrganizationNode
                                key={official.slug}
                                official={official}
                                onOpenDetail={onOpenDetail}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <p className="mt-8 text-center text-xs leading-relaxed font-medium text-gray-500">
                💡 Klik nama atau jabatan untuk melihat rincian tugas dan profil
                lengkap perangkat desa.
            </p>
        </div>
    );
}
