import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    CheckCircle2,
    ChevronRight,
    CircleUserRound,
    FileText,
    Landmark,
    MapPin,
    Network,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageOfficialCard } from '@/components/village-official-card';
import { VillageOfficialData, VillageOfficialDetailModal } from '@/components/village-official-detail-modal';
import { InstitutionMember, VillageInstitutionData, VillageInstitutionDetailModal } from '@/components/village-institution-detail-modal';
import { OfficialProp, VillageOrganizationChart } from '@/components/village-organization-chart';
import { home } from '@/routes';

type InstitutionProp = {
    id: number;
    acronym: string;
    logo_url?: string | null;
    name: string;
    leader: string | null;
    member_count: number;
    focus: string;
    description?: string | null;
    responsibilities: string[];
    members?: InstitutionMember[] | null;
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
    BPD: 'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
    LPMD: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    PKK: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
    KARTAR: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-300',
};

function getInstitutionBadgeStyle(acronym: string) {
    return institutionBadgeColors[acronym] || 'border-slate-200 bg-slate-100 text-slate-800';
}

export default function VillageGovernmentIndex({
    canonicalUrl,
    officials,
    institutions,
}: VillageGovernmentPageProps) {
    const [activeOfficialFilter, setActiveOfficialFilter] =
        useState<OfficialFilter>('all');
    const [selectedOfficial, setSelectedOfficial] =
        useState<VillageOfficialData | null>(null);
    const [selectedInstitution, setSelectedInstitution] =
        useState<VillageInstitutionData | null>(null);

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

            {/* HERO SECTION */}
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
                    {/* SECTION 1: PROFIL & CARD KEPALA DESA */}
                    {villageHead && (
                        <section id="kepala-desa" className="scroll-mt-24">
                            <div className="mb-6 flex flex-col gap-1">
                                <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                                    Kepala Desa Ngampungan
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">
                                    Pemimpin penyelenggaraan pemerintahan, pembangunan, dan pembinaan kemasyarakatan Desa Ngampungan.
                                </p>
                            </div>

                            <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
                                {/* Left Column: Sambutan Photo Card */}
                                <div className="lg:col-span-5 flex justify-center">
                                    <div className="group relative h-[480px] sm:h-[500px] w-full max-w-[380px] overflow-hidden rounded-[36px] border border-slate-800 bg-slate-900 shadow-2xl shrink-0 flex flex-col justify-end">
                                        <img
                                            src={villageHead.photo_url || '/assets/simulasi_profl.png'}
                                            alt={villageHead.name}
                                            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src =
                                                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800';
                                            }}
                                        />

                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/25 via-40% to-slate-950/95" />

                                        <div className="relative z-10 flex flex-col justify-end space-y-3 p-6 sm:p-7 text-white">
                                            <div className="space-y-1 text-left">
                                                <h3 className="text-2xl font-black tracking-tight text-white leading-snug drop-shadow-sm sm:text-3xl">
                                                    {villageHead.name}
                                                </h3>

                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                                                    <MapPin className="size-4 shrink-0 text-emerald-400" />
                                                    <span>{villageHead.position}</span>
                                                </div>

                                                <p className="pl-6 text-xs font-medium text-slate-300">
                                                    Masa Jabatan {villageHead.term || '2022–2028'}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setSelectedOfficial(villageHead as any)}
                                                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 shadow-lg cursor-pointer"
                                            >
                                                <span>Detail Profil Lengkap</span>
                                                <ArrowRight className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Detailed Visi & Komitmen Card */}
                                <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/40">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                            <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                                                <FileText className="size-5 text-emerald-700" />
                                            </span>
                                            <div>
                                                <h4 className="text-base font-bold text-gray-900">Visi & Komitmen Pelayanan</h4>
                                                <p className="text-xs text-gray-500">Mewujudkan Desa Ngampungan yang Sejahtera & Mandiri</p>
                                            </div>
                                        </div>

                                        <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                                            {villageHead.about || 'Pemerintah Desa Ngampungan berkomitmen tinggi untuk menghadirkan tata kelola pemerintahan yang terbuka, akuntabel, dan berorientasi penuh pada pelayanan masyarakat.'}
                                        </p>

                                        {villageHead.responsibilities && villageHead.responsibilities.length > 0 && (
                                            <div className="space-y-2.5 pt-2 border-t border-gray-100">
                                                <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">Tugas & Fungsi Kebijakan Utama</p>
                                                <div className="space-y-2">
                                                    {villageHead.responsibilities.slice(0, 3).map((item, index) => (
                                                        <div key={index} className="flex items-start gap-2.5 text-xs font-medium text-gray-700">
                                                            <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {villageHead.service_focus && villageHead.service_focus.length > 0 && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-2">Fokus Utama Pelayanan</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {villageHead.service_focus.map((focus, idx) => (
                                                        <span key={idx} className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-gray-800">
                                                            {focus}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                                            <ShieldCheck className="size-4 text-emerald-700" />
                                            Pemerintah Desa Ngampungan
                                        </span>
                                        <span className="font-bold text-emerald-800">Periode Jabatan Aktif</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION 2: STRUKTUR ORGANISASI */}
                    <section id="struktur-organisasi" className="scroll-mt-24">
                        <div className="mb-6 flex flex-col gap-1">
                            <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                                Struktur Hirarki Organisasi Desa Ngampungan
                            </h2>
                            <p className="max-w-2xl text-xs text-gray-600">
                                Visualisasi bagan kerja dan koordinasi internal antar aparatur pemerintah desa.
                            </p>
                        </div>

                        <VillageOrganizationChart
                            allOfficials={officials.all}
                            onOpenDetail={(official) => setSelectedOfficial(official as any)}
                        />
                    </section>

                    {/* SECTION 3: PERANGKAT DESA */}
                    <section id="perangkat-desa" className="scroll-mt-24">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
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

                    {/* SECTION 4: LEMBAGA DESA */}
                    <section id="lembaga-desa" className="scroll-mt-24">
                        <div className="mb-6 flex flex-col gap-1">
                            <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                                Lembaga Kemasyarakatan Desa (LKD)
                            </h2>
                            <p className="max-w-2xl text-xs text-gray-600">
                                Wadah partisipasi warga dalam pembangunan, pemberdayaan, dan pengawasan tata kelola desa. Klik kartu untuk melihat susunan pengurus & anggota.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                            {institutions.map((institution) => (
                                <div
                                    key={institution.id}
                                    onClick={() => setSelectedInstitution(institution as any)}
                                    className="group flex flex-col justify-between rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/5 cursor-pointer"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                {institution.logo_url ? (
                                                    <>
                                                        <img
                                                            src={institution.logo_url}
                                                            alt={`Logo ${institution.name}`}
                                                            className="size-10 object-contain rounded-lg p-0.5 border border-slate-200"
                                                        />
                                                        <span className={`inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-bold tracking-wider ${getInstitutionBadgeStyle(institution.acronym)}`}>
                                                            {institution.acronym}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className={`inline-flex items-center justify-center rounded-xl border px-3.5 py-1.5 text-xs font-black tracking-wider shadow-2xs ${getInstitutionBadgeStyle(institution.acronym)}`}>
                                                        {institution.acronym}
                                                    </span>
                                                )}
                                            </div>

                                            {institution.member_count > 0 && (
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {institution.member_count} Anggota
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                                {institution.name}
                                            </h3>
                                            {institution.leader && (
                                                <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                    Ketua: <span className="font-semibold text-gray-800">{institution.leader}</span>
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-xs leading-relaxed text-gray-600 line-clamp-2">
                                            {institution.focus}
                                        </p>

                                        {institution.responsibilities && institution.responsibilities.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                                <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Tugas & Fungsi Utama</p>
                                                <div className="space-y-1.5">
                                                    {institution.responsibilities.slice(0, 3).map((resp, idx) => (
                                                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                                            <span className="size-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                                            <span className="line-clamp-1">{resp}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                                        <span className="font-medium text-gray-500">
                                            {institution.members && institution.members.length > 0
                                                ? `${institution.members.length} Pengurus Terdaftar`
                                                : 'Mitra Resmi Pemdes'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedInstitution(institution as any);
                                            }}
                                            className="inline-flex items-center gap-1 font-bold text-emerald-800 group-hover:text-emerald-600 transition"
                                        >
                                            <span>Detail & Anggota</span>
                                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                                        </button>
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
                    official={selectedOfficial}
                    onClose={() => setSelectedOfficial(null)}
                />
            )}

            {/* MODAL DETAIL LEMBAGA */}
            {selectedInstitution && (
                <VillageInstitutionDetailModal
                    institution={selectedInstitution}
                    onClose={() => setSelectedInstitution(null)}
                />
            )}
        </PublicPageShell>
    );
}
