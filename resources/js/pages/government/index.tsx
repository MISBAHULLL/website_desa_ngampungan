import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    CheckCircle2,
    ChevronRight,
    CircleUserRound,
    FileText,
    Info,
    Landmark,
    MapPin,
    Network,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageOfficialCard } from '@/components/village-official-card';
import { VillageOfficialDetailModal } from '@/components/village-official-detail-modal';
import { OfficialProp, VillageOrganizationChart } from '@/components/village-organization-chart';
import { home } from '@/routes';

type InstitutionProp = {
    id: number;
    acronym: string;
    name: string;
    leader: string | null;
    member_count: number;
    focus: string;
    responsibilities: string[];
    sort_order: number;
};

type VillageGovernmentPageProps = {
    canonicalUrl: string;
    officials: {
        all: OfficialProp[];
        leadership: OfficialProp[];
        secretariat: OfficialProp[];
        technical: OfficialProp[];
        territorial: OfficialProp[];
        orgTree: any[];
    };
    institutions: InstitutionProp[];
};

type OfficialFilter = 'all' | 'secretariat' | 'technical' | 'territorial';

const governmentSectionLinks = [
    {
        label: 'Kepala Desa',
        href: '#kepala-desa',
        icon: CircleUserRound,
    },
    {
        label: 'Struktur Organisasi',
        href: '#struktur-organisasi',
        icon: Network,
    },
    {
        label: 'Perangkat Desa',
        href: '#perangkat-desa',
        icon: Users,
    },
    {
        label: 'Lembaga Desa',
        href: '#lembaga-desa',
        icon: Landmark,
    },
] as const;

const officialFilters: {
    key: OfficialFilter;
    label: string;
}[] = [
    { key: 'all', label: 'Semua Perangkat' },
    { key: 'secretariat', label: 'Sekretariat' },
    { key: 'technical', label: 'Pelaksana Teknis' },
    { key: 'territorial', label: 'Kewilayahan' },
];

const institutionBadgeColors: Record<string, string> = {
    BPD: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    LPMD: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    PKK: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
    KARTAR: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-300',
};

function getInstitutionBadgeStyle(acronym: string) {
    return institutionBadgeColors[acronym] || 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
}

export default function VillageGovernmentIndex({
    canonicalUrl,
    officials,
    institutions,
}: VillageGovernmentPageProps) {
    const [activeOfficialFilter, setActiveOfficialFilter] =
        useState<OfficialFilter>('all');
    const [selectedOfficial, setSelectedOfficial] =
        useState<OfficialProp | null>(null);

    const villageHead = officials.leadership[0] || officials.all.find((o) => o.group === 'leadership');
    const villageApparatus = officials.all.filter((o) => o.group !== 'leadership');

    const visibleOfficials =
        activeOfficialFilter === 'all'
            ? villageApparatus
            : villageApparatus.filter((o) => o.group === activeOfficialFilter);

    const pageDescription =
        'Informasi Pemerintah Desa Ngampungan yang memuat profil Kepala Desa, struktur organisasi, perangkat desa, dan lembaga desa.';

    return (
        <PublicPageShell activeSection="government">
            <Head>
                <title>Pemerintahan Desa Ngampungan</title>
                <meta
                    head-key="description"
                    name="description"
                    content={pageDescription}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content="Pemerintahan Desa Ngampungan"
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={pageDescription}
                />
                <meta head-key="og:type" property="og:type" content="website" />
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={canonicalUrl}
                />
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={canonicalUrl}
                />
            </Head>

            {/* HERO SECTION (Official Primary Green Header matching Potensi, Layanan, Profil, Transparansi) */}
            <section className="bg-village-primary-dark text-white">
                <div className="mx-auto max-w-[1280px] px-5 py-12 md:py-16 lg:px-12">
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                        <div className="max-w-3xl lg:col-span-8">
                            <nav
                                aria-label="Breadcrumb"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90"
                            >
                                <Link
                                    href={home()}
                                    className="transition hover:text-emerald-300"
                                >
                                    Beranda
                                </Link>
                                <ChevronRight className="size-3 text-emerald-300/80" />
                                <span className="font-bold text-white">
                                    Pemerintahan Desa
                                </span>
                            </nav>

                            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Struktur Pemerintahan & Tata Kelola Desa Ngampungan
                            </h1>
                            <p className="mt-4 text-sm leading-relaxed text-emerald-100/90 sm:text-base lg:text-lg">
                                Transparansi kepemimpinan, jajaran aparatur pemerintah desa, dan lembaga kemasyarakatan yang melayani warga Desa Ngampungan dengan dedikasi dan profesionalitas.
                            </p>
                        </div>

                        {/* Quick Navigation Cards */}
                        <div className="grid grid-cols-2 gap-3 lg:col-span-4">
                            {governmentSectionLinks.map((section) => {
                                const IconComponent = section.icon;
                                return (
                                    <a
                                        key={section.href}
                                        href={section.href}
                                        className="group flex flex-col rounded-2xl border border-white/15 bg-white/10 p-4 transition-all duration-300 hover:border-emerald-300/40 hover:bg-white/15 hover:shadow-lg"
                                    >
                                        <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 text-emerald-300 transition-transform duration-300 group-hover:scale-110">
                                            <IconComponent className="size-4" />
                                        </span>
                                        <span className="mt-3 text-xs font-bold text-white group-hover:text-emerald-200">
                                            {section.label}
                                        </span>
                                        <span className="mt-0.5 text-[10px] font-medium text-emerald-100/70">
                                            Lihat Bagian
                                        </span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <main className="bg-slate-50/60 pb-20">
                <div className="mx-auto max-w-[1280px] space-y-16 px-5 pt-12 lg:px-12">
                    {/* SECTION 1: SAMBUTAN & CARD KEPALA DESA */}
                    {villageHead && (
                        <section id="kepala-desa" className="scroll-mt-24">
                            <div className="mb-6 flex flex-col gap-2">
                                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
                                    <CircleUserRound className="size-3.5 text-emerald-600" />
                                    <span>Kepemimpinan Desa</span>
                                </span>
                                <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                                    Kepala Desa Ngampungan
                                </h2>
                            </div>

                            <div className="overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-xl shadow-gray-200/40 lg:grid lg:grid-cols-12">
                                <div className="relative bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 p-8 text-white lg:col-span-5 lg:p-10 flex flex-col justify-between">
                                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

                                    <div className="relative z-10 space-y-6">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-emerald-200 backdrop-blur-xs">
                                            <Award className="size-3.5" />
                                            <span>Masa Jabatan {villageHead.term || '2022–2028'}</span>
                                        </span>

                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                                {villageHead.name}
                                            </h3>
                                            <p className="mt-1 text-sm font-semibold text-emerald-300 uppercase tracking-wider">
                                                {villageHead.position}
                                            </p>
                                        </div>

                                        <p className="text-xs leading-relaxed text-emerald-100/90 sm:text-sm">
                                            {villageHead.summary}
                                        </p>

                                        <div className="space-y-2.5 pt-2">
                                            {villageHead.responsibilities.slice(0, 3).map((item, index) => (
                                                <div key={index} className="flex items-start gap-2.5 text-xs text-emerald-100">
                                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">Unit Kerja</p>
                                            <p className="text-xs font-bold text-white">{villageHead.unit}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedOfficial(villageHead)}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-emerald-950 transition hover:bg-emerald-50 shadow-md cursor-pointer"
                                        >
                                            <span>Detail Profil</span>
                                            <ArrowRight className="size-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 lg:col-span-7 lg:p-10 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                                <FileText className="size-5" />
                                            </span>
                                            <div>
                                                <h4 className="text-base font-bold text-gray-900">Visi & Komitmen Pelayanan</h4>
                                                <p className="text-xs text-gray-500">Mewujudkan Desa Ngampungan yang Sejahtera & Mandiri</p>
                                            </div>
                                        </div>

                                        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-3">
                                            <p>
                                                {villageHead.about || 'Pemerintah Desa Ngampungan berkomitmen tinggi untuk menghadirkan tata kelola pemerintahan yang terbuka, akuntabel, dan berorientasi penuh pada pelayanan masyarakat.'}
                                            </p>
                                        </div>

                                        {villageHead.service_focus.length > 0 && (
                                            <div>
                                                <p className="text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">Fokus Utama Pelayanan</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {villageHead.service_focus.map((focus, idx) => (
                                                        <span key={idx} className="rounded-lg bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-bold text-emerald-800">
                                                            {focus}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <ShieldCheck className="size-4 text-emerald-600" />
                                            Pemerintah Desa Ngampungan
                                        </span>
                                        <span className="font-semibold text-emerald-700">Periode Jabatan Aktif</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION 2: STRUKTUR ORGANISASI (Dynamic Database Tree) */}
                    <section id="struktur-organisasi" className="scroll-mt-24">
                        <div className="mb-6 flex flex-col gap-2">
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
                                <Network className="size-3.5 text-emerald-600" />
                                <span>Bagan Organisasi Resmi</span>
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                                Struktur Hirarki Organisasi Desa Ngampungan
                            </h2>
                            <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                                Visualisasi bagan kerja dan koordinasi internal antar aparatur pemerintah desa.
                            </p>
                        </div>

                        <VillageOrganizationChart
                            allOfficials={officials.all}
                            onOpenDetail={(official) => setSelectedOfficial(official)}
                        />
                    </section>

                    {/* SECTION 3: PERANGKAT DESA (Grid Cards) */}
                    <section id="perangkat-desa" className="scroll-mt-24">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
                                    <Users className="size-3.5 text-emerald-600" />
                                    <span>Jajaran Perangkat Desa</span>
                                </span>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                                    Direktori Perangkat Desa Ngampungan
                                </h2>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-1.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xs">
                                {officialFilters.map((filter) => (
                                    <button
                                        key={filter.key}
                                        type="button"
                                        onClick={() => setActiveOfficialFilter(filter.key)}
                                        className={
                                            activeOfficialFilter === filter.key
                                                ? 'rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-bold text-white shadow-2xs'
                                                : 'rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {visibleOfficials.map((official) => (
                                <VillageOfficialCard
                                    key={official.slug}
                                    official={official as any}
                                    onOpenDetail={(off) => setSelectedOfficial(off as any)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* SECTION 4: LEMBAGA DESA (Redesigned Soft Emerald Badges & Layout) */}
                    <section id="lembaga-desa" className="scroll-mt-24">
                        <div className="mb-6 flex flex-col gap-2">
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
                                <Landmark className="size-3.5 text-emerald-600" />
                                <span>Mitra Kerja & Kemasyarakatan</span>
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                                Lembaga Kemasyarakatan Desa (LKD)
                            </h2>
                            <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                                Wadah partisipasi warga dalam pembangunan, pemberdayaan, dan pengawasan tata kelola desa.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                            {institutions.map((institution) => (
                                <div
                                    key={institution.id}
                                    className="flex flex-col justify-between rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-md"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <span className={`inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-xs font-black tracking-wider shadow-2xs ${getInstitutionBadgeStyle(institution.acronym)}`}>
                                                {institution.acronym}
                                            </span>
                                            {institution.member_count > 0 && (
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                                    {institution.member_count} Anggota
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {institution.name}
                                            </h3>
                                            {institution.leader && (
                                                <p className="mt-0.5 text-xs font-medium text-emerald-700">
                                                    Ketua: <span className="font-semibold text-gray-800">{institution.leader}</span>
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-xs leading-relaxed text-gray-600">
                                            {institution.focus}
                                        </p>

                                        {institution.responsibilities && institution.responsibilities.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                                <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Tugas & Fungsi Utama</p>
                                                <div className="space-y-1.5">
                                                    {institution.responsibilities.map((resp, idx) => (
                                                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                                            <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                            <span>{resp}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                        <span className="font-medium">Mitra Resmi Pemdes</span>
                                        <span className="font-bold text-emerald-800">Desa Ngampungan</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* MODAL DETAIL PERANGKAT */}
            {selectedOfficial && (
                <VillageOfficialDetailModal
                    official={selectedOfficial as any}
                    onClose={() => setSelectedOfficial(null)}
                />
            )}
        </PublicPageShell>
    );
}
