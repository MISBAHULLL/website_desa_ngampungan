import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    BellRing,
    CalendarDays,
    CheckSquare,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    Clock3,
    Download,
    ExternalLink,
    Facebook,
    FileText,
    House,
    Info,
    Instagram,
    Landmark,
    Layers,
    LogIn,
    Mail,
    MailOpen,
    MapPin,
    Menu,
    Newspaper,
    PhoneCall,
    PieChart,
    Plus,
    Ruler,
    Search,
    Send,
    ShieldCheck,
    Sparkles,
    Sprout,
    Star,
    TrendingUp,
    Users,
    WalletCards,
    X,
    Youtube,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { store as storeContactMessage } from '@/actions/App/Http/Controllers/Public/ContactMessageController';
import InputError from '@/components/input-error';
import { PublicAnnouncementCard } from '@/components/public-announcement-card';
import { PublicNewsCard } from '@/components/public-news-card';
import { Spinner } from '@/components/ui/spinner';
import { VillagePotentialCarousel } from '@/components/village-potential-carousel';
import {
    activeDummyAnnouncements,
    featuredDummyNewsArticle,
    latestDummyNewsArticles,
} from '@/lib/dummy-public-content';
import { dummyApbdesSummary } from '@/lib/dummy-transparency';
import type { ApbdesMetricKey } from '@/lib/dummy-transparency';
import {
    findVillagePotentialCategory,
    getDummyVillagePotentialEntries,
    villagePotentialCategories,
} from '@/lib/dummy-village-potentials';
import type { VillagePotentialKey } from '@/lib/dummy-village-potentials';
import type { VillageServiceCategoryKey } from '@/lib/dummy-village-services';
import { dashboard, login } from '@/routes';
import { index as agendasIndex } from '@/routes/agendas';
import { index as announcementsIndex } from '@/routes/announcements';
import { index as galleryIndex } from '@/routes/gallery';
import { index as governmentIndex } from '@/routes/government';
import { index as newsIndex, show as newsShow } from '@/routes/news';
import { index as potentialsIndex } from '@/routes/potentials';
import { index as villageProfileIndex } from '@/routes/profile';
import { track as trackServiceApplication } from '@/routes/service-applications';
import { index as servicesIndex } from '@/routes/services';
import { index as transparencyIndex } from '@/routes/transparency';

type NavigationChild = {
    label: string;
    description: string;
    href: string;
};

type NavigationItem =
    | {
          type: 'link';
          label: string;
          href: string;
      }
    | {
          type: 'dropdown';
          label: string;
          children: NavigationChild[];
      };

const navigationItems: NavigationItem[] = [
    { type: 'link', label: 'Beranda', href: '#beranda' },
    {
        type: 'dropdown',
        label: 'Profil',
        children: [
            {
                label: 'Selayang Pandang',
                description: 'Gambaran umum Desa Ngampungan.',
                href: `${villageProfileIndex.url()}#selayang-pandang`,
            },
            {
                label: 'Visi dan Misi',
                description: 'Arah dan tujuan pembangunan desa.',
                href: `${villageProfileIndex.url()}#visi-misi`,
            },
            {
                label: 'Sejarah Desa',
                description: 'Perjalanan dan asal-usul desa.',
                href: `${villageProfileIndex.url()}#sejarah-desa`,
            },
            {
                label: 'Data Wilayah',
                description: 'Demografi dan karakter wilayah.',
                href: `${villageProfileIndex.url()}#data-wilayah`,
            },
        ],
    },
    {
        type: 'dropdown',
        label: 'Pemerintahan',
        children: [
            {
                label: 'Kepala Desa',
                description: 'Profil pimpinan Desa Ngampungan.',
                href: `${governmentIndex.url()}#kepala-desa`,
            },
            {
                label: 'Struktur Organisasi',
                description: 'Susunan pemerintahan desa.',
                href: `${governmentIndex.url()}#struktur-organisasi`,
            },
            {
                label: 'Perangkat Desa',
                description: 'Daftar aparatur pemerintah desa.',
                href: `${governmentIndex.url()}#perangkat-desa`,
            },
            {
                label: 'Lembaga Desa',
                description: 'Lembaga kemasyarakatan desa.',
                href: `${governmentIndex.url()}#lembaga-desa`,
            },
        ],
    },
    {
        type: 'dropdown',
        label: 'Informasi',
        children: [
            {
                label: 'Berita',
                description: 'Kabar terbaru dari lingkungan desa.',
                href: newsIndex.url(),
            },
            {
                label: 'Pengumuman',
                description: 'Informasi resmi untuk masyarakat.',
                href: announcementsIndex.url(),
            },
            {
                label: 'Agenda',
                description: 'Jadwal kegiatan desa mendatang.',
                href: agendasIndex.url(),
            },
            {
                label: 'Galeri',
                description: 'Dokumentasi kegiatan dan potensi desa.',
                href: galleryIndex.url(),
            },
        ],
    },
    {
        type: 'dropdown',
        label: 'Transparansi',
        children: [
            {
                label: 'APBDes',
                description: 'Ringkasan anggaran pendapatan dan belanja.',
                href: transparencyIndex.url(),
            },
            {
                label: 'Statistik Penduduk',
                description: 'Data kependudukan Desa Ngampungan.',
                href: '#profil',
            },
            {
                label: 'Produk Hukum',
                description: 'Peraturan dan keputusan desa.',
                href: '#layanan',
            },
            {
                label: 'Dokumen Publik',
                description: 'Dokumen desa yang dapat diakses warga.',
                href: '#layanan',
            },
        ],
    },
    {
        type: 'dropdown',
        label: 'Potensi Desa',
        children: [
            {
                label: 'UMKM',
                description: 'Produk dan usaha unggulan warga.',
                href: potentialsIndex.url({
                    query: { category: 'umkm' },
                }),
            },
            {
                label: 'Pertanian',
                description: 'Komoditas dan kegiatan pertanian desa.',
                href: potentialsIndex.url({
                    query: { category: 'agriculture' },
                }),
            },
            {
                label: 'Wisata',
                description: 'Destinasi dan daya tarik lokal.',
                href: potentialsIndex.url({
                    query: { category: 'tourism' },
                }),
            },
            {
                label: 'Budaya',
                description: 'Tradisi dan kesenian masyarakat desa.',
                href: potentialsIndex.url({
                    query: { category: 'culture' },
                }),
            },
            {
                label: 'Kuliner',
                description: 'Produk pangan dan cita rasa lokal.',
                href: potentialsIndex.url({
                    query: { category: 'culinary' },
                }),
            },
            {
                label: 'Jasa',
                description: 'Keterampilan dan layanan warga.',
                href: potentialsIndex.url({
                    query: { category: 'services' },
                }),
            },
        ],
    },
    {
        type: 'dropdown',
        label: 'Pelayanan',
        children: [
            {
                label: 'Informasi Pelayanan',
                description: 'Jam dan alur pelayanan kantor desa.',
                href: '#layanan',
            },
            {
                label: 'Persyaratan Surat',
                description: 'Dokumen yang perlu disiapkan warga.',
                href: '#layanan',
            },
            {
                label: 'Pengajuan Surat',
                description: 'Akses pengajuan administrasi desa.',
                href: '#layanan',
            },
            {
                label: 'Pengaduan',
                description: 'Sampaikan aspirasi atau laporan warga.',
                href: '#layanan',
            },
            {
                label: 'Pelacakan Status',
                description: 'Pantau proses layanan yang diajukan.',
                href: '#layanan',
            },
        ],
    },
    { type: 'link', label: 'Kontak', href: '#kontak' },
];

const dummyVillageStatistics = [
    {
        label: 'Total Penduduk',
        value: '3.420',
        suffix: 'jiwa',
        description: 'Penduduk yang tercatat dalam administrasi desa.',
        icon: Users,
        index: '01',
        accentClassName: 'bg-village-primary',
        iconClassName: 'bg-village-primary-light text-village-primary',
    },
    {
        label: 'Jumlah KK',
        value: '1.120',
        suffix: 'KK',
        description: 'Kepala keluarga yang terdata.',
        icon: House,
        index: '02',
        accentClassName: 'bg-village-accent',
        iconClassName: 'bg-[#fff2cf] text-[#94620d]',
    },
    {
        label: 'Jumlah Dusun',
        value: '4',
        suffix: 'dusun',
        description: 'Wilayah administratif tingkat dusun.',
        icon: MapPin,
        index: '03',
        accentClassName: 'bg-village-info',
        iconClassName: 'bg-[#e7f1fb] text-village-info',
    },
    {
        label: 'Luas Wilayah',
        value: '450',
        suffix: 'ha',
        description: 'Total luas wilayah administratif desa.',
        icon: Ruler,
        index: '04',
        accentClassName: 'bg-village-primary-dark',
        iconClassName: 'bg-village-primary-light text-village-primary-dark',
    },
] as const;

type Service = {
    title: string;
    description: string;
    category: VillageServiceCategoryKey;
    icon: LucideIcon;
    iconClassName: string;
};

const services: Service[] = [
    {
        title: 'Kependudukan',
        description: 'Informasi KK, KTP, dan mutasi penduduk.',
        category: 'population',
        icon: Users,
        iconClassName:
            'text-village-primary group-hover:bg-village-primary-light',
    },
    {
        title: 'Lapor Panen',
        description: 'Pelaporan komoditas dan jadwal distribusi tani.',
        category: 'agriculture',
        icon: Sprout,
        iconClassName: 'text-village-secondary group-hover:bg-orange-100',
    },
    {
        title: 'Lapor Darurat',
        description: 'Kanal pelaporan infrastruktur dan keamanan.',
        category: 'reports',
        icon: CircleAlert,
        iconClassName: 'text-village-error group-hover:bg-red-50',
    },
];

const apbdesMetricPresentation: Record<
    ApbdesMetricKey,
    {
        icon: LucideIcon;
        iconClassName: string;
        badgeClassName: string;
        accentGradient: string;
        barWidth: string;
    }
> = {
    income: {
        icon: TrendingUp,
        iconClassName: 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30',
        badgeClassName: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
        accentGradient: 'from-emerald-400 to-teal-300',
        barWidth: '100%',
    },
    expense: {
        icon: FileText,
        iconClassName: 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30',
        badgeClassName: 'text-amber-300 bg-amber-500/10 border-amber-400/20',
        accentGradient: 'from-amber-400 to-orange-300',
        barWidth: '94%',
    },
    netFinancing: {
        icon: WalletCards,
        iconClassName: 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/30',
        badgeClassName: 'text-cyan-300 bg-cyan-500/10 border-cyan-400/20',
        accentGradient: 'from-cyan-400 to-blue-300',
        barWidth: '25%',
    },
    estimatedSilpa: {
        icon: Landmark,
        iconClassName: 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30',
        badgeClassName: 'text-teal-300 bg-teal-500/10 border-teal-400/20',
        accentGradient: 'from-teal-300 to-emerald-400',
        barWidth: '40%',
    },
};

const primaryButtonClassName =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-village-primary px-5 py-3 font-semibold text-white shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-village-primary-dark hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2';

function SiteLogo({ compact = false }: { compact?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <img
                src="/assets/logo_kabupaten_jombang.png"
                alt="Logo Kabupaten Jombang"
                className={`${compact ? 'h-10 w-8' : 'h-12 w-10'} shrink-0 object-contain drop-shadow-sm`}
            />
            <span className="text-lg leading-tight font-bold">
                Desa <br /> Ngampungan
            </span>
        </div>
    );
}

function NavigationLink({
    href,
    label,
    onClick,
}: {
    href: string;
    label: string;
    onClick?: () => void;
}) {
    return (
        <a
            href={href}
            onClick={onClick}
            className="flex min-h-11 items-center py-3 transition-colors hover:text-village-primary focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
        >
            {label}
        </a>
    );
}

function DesktopNavigation() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    return (
        <div aria-label="Navigasi utama desktop" className="hidden xl:block">
            <ul className="flex list-none items-center">
                {navigationItems.map((item, index) => (
                    <li
                        key={item.label}
                        className="relative"
                        onMouseEnter={() =>
                            item.type === 'dropdown' && setOpenMenu(item.label)
                        }
                        onMouseLeave={() => setOpenMenu(null)}
                        onBlur={(event) => {
                            if (
                                !event.currentTarget.contains(
                                    event.relatedTarget,
                                )
                            ) {
                                setOpenMenu(null);
                            }
                        }}
                    >
                        {item.type === 'link' ? (
                            <a
                                href={item.href}
                                className="flex min-h-11 items-center justify-center rounded-lg px-2.5 py-2.5 text-sm font-medium text-current transition-colors hover:bg-current/10 focus-visible:bg-current/10 focus-visible:ring-2 focus-visible:ring-current focus-visible:outline-none"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    aria-expanded={openMenu === item.label}
                                    aria-controls={`desktop-submenu-${index}`}
                                    onFocus={() => setOpenMenu(item.label)}
                                    onClick={() =>
                                        setOpenMenu(
                                            openMenu === item.label
                                                ? null
                                                : item.label,
                                        )
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === 'Escape') {
                                            setOpenMenu(null);
                                            event.currentTarget.focus();
                                        }
                                    }}
                                    className="flex min-h-11 items-center justify-center gap-1 rounded-lg px-2.5 py-2.5 text-sm font-medium text-current transition-colors hover:bg-current/10 focus-visible:bg-current/10 focus-visible:ring-2 focus-visible:ring-current focus-visible:outline-none"
                                >
                                    {item.label}
                                    <ChevronDown
                                        aria-hidden="true"
                                        className={`size-3.5 transition-transform duration-200 ${
                                            openMenu === item.label
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                </button>

                                {openMenu === item.label && (
                                    <div
                                        id={`desktop-submenu-${index}`}
                                        aria-label={`Submenu ${item.label}`}
                                        onMouseEnter={() =>
                                            setOpenMenu(item.label)
                                        }
                                        className={`absolute top-full z-50 w-80 rounded-2xl border border-village-border bg-white p-2 text-village-ink shadow-village-floating ${
                                            index >= navigationItems.length - 3
                                                ? 'right-0'
                                                : 'left-0'
                                        }`}
                                    >
                                        <ul className="grid gap-1">
                                            {item.children.map((child) => (
                                                <li key={child.label}>
                                                    <a
                                                        href={child.href}
                                                        onClick={() =>
                                                            setOpenMenu(null)
                                                        }
                                                        className="group/link flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-village-primary-light hover:text-village-primary-dark focus-visible:bg-village-primary-light focus-visible:text-village-primary-dark focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-village-accent transition-transform group-hover/link:scale-125"
                                                        />
                                                        <span>
                                                            <span className="block font-semibold">
                                                                {child.label}
                                                            </span>
                                                            <span className="mt-0.5 block text-xs leading-relaxed text-village-muted">
                                                                {
                                                                    child.description
                                                                }
                                                            </span>
                                                        </span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function MobileNavigationItem({
    item,
    isExpanded,
    onToggle,
    onNavigate,
}: {
    item: NavigationItem;
    isExpanded: boolean;
    onToggle: () => void;
    onNavigate: () => void;
}) {
    if (item.type === 'link') {
        return (
            <div className="border-b border-village-border">
                <NavigationLink
                    href={item.href}
                    label={item.label}
                    onClick={onNavigate}
                />
            </div>
        );
    }

    const panelId = `mobile-submenu-${item.label
        .toLocaleLowerCase('id')
        .replace(/\s+/g, '-')}`;

    return (
        <div className="border-b border-village-border">
            <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={onToggle}
                className="flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:text-village-primary focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
            >
                <span>{item.label}</span>
                <ChevronDown
                    aria-hidden="true"
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isExpanded && (
                <div
                    id={panelId}
                    role="region"
                    aria-label={`Submenu ${item.label}`}
                    className="grid gap-1 pb-3"
                >
                    {item.children.map((child) => (
                        <a
                            key={child.label}
                            href={child.href}
                            onClick={onNavigate}
                            className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-village-muted transition-colors hover:bg-village-primary-light hover:text-village-primary-dark focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                        >
                            <span
                                aria-hidden="true"
                                className="size-1.5 shrink-0 rounded-full bg-village-accent"
                            />
                            {child.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

function UtilityBar({ isAuthenticated }: { isAuthenticated: boolean }) {
    const adminHref = isAuthenticated ? dashboard() : login();

    return (
        <aside
            aria-label="Informasi cepat Desa Ngampungan"
            className="bg-village-primary-dark text-village-primary-light"
        >
            <div className="mx-auto grid max-w-[1440px] 2xl:max-w-[1536px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 px-4 sm:px-6 lg:px-10 py-2 text-[0.6875rem] leading-4 font-medium sm:text-xs lg:flex lg:min-h-9 lg:gap-5 lg:py-1.5">
                <div className="col-start-1 row-start-1 flex min-w-0 items-start gap-1.5 lg:col-auto lg:row-auto lg:items-center">
                    <MapPin
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0 text-village-accent lg:mt-0"
                    />
                    <span>Jl. Raya Ngampungan No. 1, Bareng, Jombang</span>
                </div>

                <div className="col-start-1 row-start-2 flex items-center gap-1.5 whitespace-nowrap lg:col-auto lg:row-auto lg:border-l lg:border-white/15 lg:pl-5">
                    <Clock3
                        aria-hidden="true"
                        className="size-3.5 shrink-0 text-village-accent"
                    />
                    <span>Sen–Kam 08.00–15.00 · Jum 08.00–11.30</span>
                </div>

                <a
                    href="tel:+6281234567890"
                    className="col-start-2 row-start-1 flex items-center gap-1.5 justify-self-end whitespace-nowrap transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-village-accent focus-visible:outline-none lg:col-auto lg:row-auto lg:ml-auto"
                >
                    <PhoneCall
                        aria-hidden="true"
                        className="size-3.5 shrink-0 text-village-accent"
                    />
                    <span>0812-3456-7890</span>
                </a>

                <Link
                    href={adminHref}
                    className="col-start-2 row-start-2 inline-flex min-h-7 items-center gap-1.5 justify-self-end rounded-sm font-semibold text-white/90 underline-offset-4 transition-colors hover:text-village-accent hover:underline focus-visible:ring-2 focus-visible:ring-village-accent focus-visible:outline-none lg:col-auto lg:row-auto lg:border-l lg:border-white/15 lg:pl-5"
                >
                    <LogIn aria-hidden="true" className="size-3.5" />
                    Admin
                </Link>
            </div>
        </aside>
    );
}

function TransparansiBentoSection() {
    const [activeTab, setActiveTab] = useState<
        'semua' | 'pendapatan' | 'belanja' | 'silpa'
    >('semua');
    const [selectedAllocationIndex, setSelectedAllocationIndex] =
        useState<number>(0);

    const activeAllocation =
        dummyApbdesSummary.allocations[selectedAllocationIndex];

    return (
        <section
            id="transparansi"
            aria-labelledby="transparansi-heading"
            className="scroll-mt-48 relative overflow-hidden bg-village-primary-dark py-20 md:py-28 xl:scroll-mt-32"
        >
            {/* Ambient Background Blur Orbs */}
            <div className="pointer-events-none absolute -top-40 -left-40 size-[550px] rounded-full bg-emerald-500/15 blur-[140px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 size-[550px] rounded-full bg-teal-400/15 blur-[140px]" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-emerald-700/10 blur-[160px]" />

            <div className="relative z-10 mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-10">
                {/* Section Header */}
                <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
                                <Sparkles
                                    aria-hidden="true"
                                    className="size-3.5 text-emerald-400"
                                />
                                Keterbukaan Anggaran
                            </span>
                            <span className="text-xs font-semibold text-white/50">
                                •
                            </span>
                            <span className="text-xs font-bold text-white/70">
                                Real-time Visualizer
                            </span>
                        </div>
                        <h2
                            id="transparansi-heading"
                            className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                        >
                            Transparansi Anggaran APBDes{' '}
                            {dummyApbdesSummary.year}
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                            Visualisasi interaktif pengelolaan keuangan publik
                            Desa Ngampungan. Pantau proyeksi pendapatan,
                            prioritas belanja, dan serapan anggaran secara
                            transparan.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-end">
                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                            <span
                                aria-hidden="true"
                                className="size-2 rounded-full bg-emerald-400 animate-pulse"
                            />
                            Tahun Anggaran{' '}
                            <time dateTime={dummyApbdesSummary.year}>
                                {dummyApbdesSummary.year}
                            </time>
                        </div>
                        <Link
                            href={transparencyIndex()}
                            prefetch
                            className="group inline-flex min-h-11 items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-village-primary-dark shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-village-accent focus-visible:ring-offset-2 focus-visible:ring-offset-village-primary-dark focus-visible:outline-none"
                        >
                            <span>Portal Transparansi Lengkap</span>
                            <ArrowRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </div>

                {/* Asymmetric Bento Grid (12-Columns Responsive) */}
                <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Bento Tile 1: Hero Realisasi & Interactive Filter (Span 7, Row Span 2) */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/20 bg-gradient-to-br from-white/15 via-white/10 to-emerald-950/40 p-7 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-emerald-400/40 lg:col-span-7 sm:p-8">
                        <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-emerald-400/20 blur-[80px] transition-all duration-500 group-hover:bg-emerald-400/30" />

                        {/* Top Bar: Title & Filter Pills */}
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
                                        <PieChart
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                                            Serapan Anggaran
                                        </p>
                                        <h3 className="text-lg font-bold text-white">
                                            Realisasi Belanja Utama
                                        </h3>
                                    </div>
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/20 p-1 backdrop-blur-md">
                                    {(
                                        [
                                            'semua',
                                            'pendapatan',
                                            'belanja',
                                            'silpa',
                                        ] as const
                                    ).map((tab) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveTab(tab)}
                                            className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition-all duration-200 ${
                                                activeTab === tab
                                                    ? 'bg-emerald-400 text-village-primary-dark shadow-sm'
                                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Hero Stat & Realization Gauge */}
                            <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                                <div>
                                    <span className="text-xs font-semibold text-emerald-200/80">
                                        Total Realisasi Semester I
                                    </span>
                                    <div className="mt-1 flex items-baseline gap-2">
                                        <span className="text-6xl font-extrabold tracking-tight text-white sm:text-7xl">
                                            {
                                                dummyApbdesSummary.realizationPercentage
                                            }
                                        </span>
                                        <span className="text-3xl font-extrabold text-emerald-400">
                                            %
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                                        <strong className="font-bold text-white">
                                            {dummyApbdesSummary.realizedAmount}
                                        </strong>{' '}
                                        dari total pagu belanja{' '}
                                        <span className="font-semibold text-emerald-300">
                                            {dummyApbdesSummary.budgetAmount}
                                        </span>
                                        .
                                    </p>
                                </div>

                                {/* Quick Highlights Pill Badges */}
                                <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
                                    <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 backdrop-blur-md">
                                        <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                                        <span>
                                            Surplus Operasional: +Rp110 Juta
                                        </span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white/90 backdrop-blur-md">
                                        <CheckSquare
                                            aria-hidden="true"
                                            className="size-3.5 text-emerald-400"
                                        />
                                        <span>Audited BPD & Pemkab</span>
                                    </div>
                                </div>
                            </div>

                            {/* Animated Glowing Progress Bar */}
                            <div className="mt-8 space-y-2">
                                <div className="flex justify-between text-xs font-semibold text-white/80">
                                    <span>Kemajuan Serapan APBDes</span>
                                    <span className="font-bold text-emerald-300">
                                        {
                                            dummyApbdesSummary.realizationPercentage
                                        }
                                        % Terealisi
                                    </span>
                                </div>
                                <div className="h-4 overflow-hidden rounded-full border border-white/10 bg-black/30 p-1">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 shadow-[0_0_16px_rgba(52,211,153,0.6)] transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${dummyApbdesSummary.realizationPercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card Sub-Footer Info */}
                        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                            <span className="text-white/60">
                                Pembaruan Terakhir:{' '}
                                <strong className="text-white">
                                    {dummyApbdesSummary.updatedLabel}
                                </strong>
                            </span>
                            <span className="font-bold text-emerald-400 group-hover:underline">
                                Status: Aktif & Transparan
                            </span>
                        </div>
                    </div>

                    {/* Bento Tile 2: Dual Key Metrics Pendapatan & Belanja (Span 5) */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 lg:col-span-5">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <p className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                                    Arus Kas Utama
                                </p>
                                <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white">
                                    APBDes 2026
                                </span>
                            </div>

                            {/* Metric 1: Pendapatan */}
                            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 transition-all duration-300 hover:bg-emerald-500/15">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-emerald-200">
                                        Pendapatan Desa
                                    </span>
                                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
                                        <TrendingUp
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </div>
                                </div>
                                <p className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                    Rp2,14 miliar
                                </p>
                                <p className="mt-1 text-xs text-white/70">
                                    Target pendapatan tahun berjalan.
                                </p>
                            </div>

                            {/* Metric 2: Belanja */}
                            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 transition-all duration-300 hover:bg-amber-500/15">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-amber-200">
                                        Belanja Desa
                                    </span>
                                    <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30">
                                        <FileText
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </div>
                                </div>
                                <p className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                    Rp2,03 miliar
                                </p>
                                <p className="mt-1 text-xs text-white/70">
                                    Pagu belanja seluruh bidang.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs font-bold text-emerald-300">
                            <span>Estimasi Surplus Anggaran</span>
                            <span className="font-extrabold text-white">
                                +Rp110 Juta
                            </span>
                        </div>
                    </div>

                    {/* Bento Tile 3: Interactive Alokasi Bidang Sector Breakdown (Span 7) */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 lg:col-span-7 sm:p-8">
                        <div>
                            <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Layers
                                            aria-hidden="true"
                                            className="size-4 text-emerald-400"
                                        />
                                        <p className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                                            Distribusi Anggaran
                                        </p>
                                    </div>
                                    <h3 className="mt-1 text-xl font-bold text-white">
                                        Proporsi Alokasi Belanja per Bidang
                                    </h3>
                                </div>
                                <span className="text-xs font-semibold text-white/70">
                                    Klik bidang untuk detail
                                </span>
                            </div>

                            {/* Allocation List with Interactive Hover */}
                            <div className="mt-6 space-y-3.5">
                                {dummyApbdesSummary.allocations.map(
                                    (allocation, index) => {
                                        const isSelected =
                                            selectedAllocationIndex === index;
                                        return (
                                            <div
                                                key={allocation.label}
                                                onClick={() =>
                                                    setSelectedAllocationIndex(
                                                        index,
                                                    )
                                                }
                                                onMouseEnter={() =>
                                                    setSelectedAllocationIndex(
                                                        index,
                                                    )
                                                }
                                                className={`group/item cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 ${
                                                    isSelected
                                                        ? 'border-emerald-400/60 bg-white/15 shadow-lg shadow-emerald-950/20'
                                                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                                    <span
                                                        className={`font-bold transition-colors ${isSelected ? 'text-emerald-300' : 'text-white/90'}`}
                                                    >
                                                        {allocation.label}
                                                    </span>
                                                    <div className="flex items-center gap-2 font-bold">
                                                        <span className="text-white">
                                                            {allocation.value}
                                                        </span>
                                                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300 ring-1 ring-emerald-400/30">
                                                            {
                                                                allocation.percentage
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            isSelected
                                                                ? 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                                                                : 'bg-emerald-400/60'
                                                        }`}
                                                        style={{
                                                            width: `${allocation.percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>

                        {/* Detail Highlight Footer Callout */}
                        {activeAllocation && (
                            <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-950/50 p-4 backdrop-blur-md">
                                <p className="text-xs text-white/80">
                                    <strong className="font-bold text-emerald-300">
                                        {activeAllocation.label}
                                    </strong>{' '}
                                    dialokasikan sebesar{' '}
                                    <strong className="font-bold text-white">
                                        {activeAllocation.value}
                                    </strong>{' '}
                                    ({activeAllocation.percentage}% dari total
                                    APBDes Desa Ngampungan 2026).
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Bento Tile 4: Pembiayaan Neto & SILPA Mini Bento (Span 5) */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 lg:col-span-5 sm:p-8">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <p className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                                    Cadangan & Pembiayaan
                                </p>
                                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                                    Cadangan Sehat
                                </span>
                            </div>

                            {/* Pembiayaan Neto */}
                            <div className="flex items-start gap-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 transition-all duration-300 hover:bg-cyan-500/15">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/30">
                                    <WalletCards
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-cyan-200">
                                        Pembiayaan Neto
                                    </p>
                                    <p className="mt-1 text-2xl font-extrabold text-white">
                                        Rp30 juta
                                    </p>
                                    <p className="mt-0.5 text-xs text-white/70">
                                        Selisih penerimaan & pengeluaran
                                        pembiayaan.
                                    </p>
                                </div>
                            </div>

                            {/* Estimasi SiLPA */}
                            <div className="flex items-start gap-4 rounded-2xl border border-teal-400/20 bg-teal-500/10 p-4 transition-all duration-300 hover:bg-teal-500/15">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30">
                                    <Landmark
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-teal-200">
                                        Perkiraan SILPA
                                    </p>
                                    <p className="mt-1 text-2xl font-extrabold text-white">
                                        Rp145 juta
                                    </p>
                                    <p className="mt-0.5 text-xs text-white/70">
                                        Sisa lebih pembiayaan anggaran berjalan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Direct Document Link */}
                        <div className="mt-6">
                            <Link
                                href={transparencyIndex()}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold text-white transition-all duration-200 hover:bg-white hover:text-village-primary-dark focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                            >
                                <Download
                                    aria-hidden="true"
                                    className="size-4 text-emerald-400"
                                />
                                <span>Unduh Rincian APBDes (PDF)</span>
                            </Link>
                        </div>
                    </div>

                    {/* Bento Tile 5: Public Document Download & Verification Strip (Span 12) */}
                    <div className="flex flex-col items-center justify-between gap-5 rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl md:flex-row lg:col-span-12 sm:p-7">
                        <div className="flex items-center gap-4 text-left">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
                                <ShieldCheck
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-base font-bold text-white">
                                        Keterbukaan Informasi Publik
                                        Terverifikasi
                                    </h4>
                                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                                        Resmi
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs leading-relaxed text-white/80">
                                    Seluruh laporan keuangan APBDes Desa
                                    Ngampungan diawasi oleh Badan
                                    Permusyawaratan Desa (BPD) dan terdaftar di
                                    Pemerintah Kabupaten Jombang.
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-3">
                            <Link
                                href={transparencyIndex()}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                            >
                                <FileText
                                    aria-hidden="true"
                                    className="size-4 text-emerald-400"
                                />
                                <span>Perdes APBDes.pdf</span>
                            </Link>
                            <Link
                                href={transparencyIndex()}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-extrabold text-village-primary-dark transition-all hover:bg-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                            >
                                <span>Lihat Semua Dokumen</span>
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-3.5"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Welcome() {
    const { auth } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
        null,
    );
    const [isFeaturedImageUnavailable, setIsFeaturedImageUnavailable] =
        useState(false);
    const [activePotentialCategory, setActivePotentialCategory] =
        useState<VillagePotentialKey>('umkm');
    const featuredImageRef = useRef<HTMLImageElement>(null);
    const activePotentialMetadata = findVillagePotentialCategory(
        activePotentialCategory,
    );
    const activePotentialEntries = getDummyVillagePotentialEntries(
        activePotentialCategory,
    ).slice(0, 3);

    const closeMobileNavigation = () => {
        setIsMobileMenuOpen(false);
        setExpandedMobileMenu(null);
    };

    useEffect(() => {
        const updateNavbar = () => setIsScrolled(window.scrollY > 50);

        updateNavbar();
        window.addEventListener('scroll', updateNavbar, { passive: true });

        return () => window.removeEventListener('scroll', updateNavbar);
    }, []);

    useEffect(() => {
        const featuredImage = featuredImageRef.current;

        if (featuredImage?.complete && featuredImage.naturalWidth === 0) {
            setIsFeaturedImageUnavailable(true);
        }
    }, []);

    useEffect(() => {
        if (!isMobileMenuOpen) {
            return;
        }

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
                setExpandedMobileMenu(null);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [isMobileMenuOpen]);

    const hasSolidNavbar = isScrolled || isMobileMenuOpen;

    return (
        <>
            <Head title="Website Resmi Desa Ngampungan">
                <meta
                    name="description"
                    content="Pusat informasi dan layanan digital resmi Desa Ngampungan, Kecamatan Bareng, Kabupaten Jombang."
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="village-landing min-h-screen bg-village-canvas text-village-ink selection:bg-village-primary-light selection:text-village-primary-dark">
                <a
                    href="#main-content"
                    className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-village-primary-dark shadow-lg transition-transform focus:translate-y-0 focus-visible:ring-2 focus-visible:ring-village-accent focus-visible:outline-none"
                >
                    Lewati ke konten utama
                </a>

                <div className="fixed inset-x-0 top-0 z-50">
                    <UtilityBar isAuthenticated={Boolean(auth.user)} />

                    <nav
                        aria-label="Navigasi utama"
                        className={`border-b py-3 transition-all duration-300 ${
                            hasSolidNavbar
                                ? 'border-village-border bg-white/95 text-village-ink shadow-sm backdrop-blur-xl'
                                : 'border-village-border/60 bg-white/90 text-village-ink shadow-sm backdrop-blur-md'
                        }`}
                    >
                        <div className="mx-auto flex max-w-[1440px] 2xl:max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-10">
                            <a
                                href="#beranda"
                                aria-label="Kembali ke beranda Desa Ngampungan"
                                className="rounded-md focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                <SiteLogo />
                            </a>

                            <DesktopNavigation />

                            <a
                                href="#layanan"
                                className={`${primaryButtonClassName} hidden xl:inline-flex`}
                            >
                                Akses Layanan
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </a>

                            <button
                                type="button"
                                aria-label={
                                    isMobileMenuOpen
                                        ? 'Tutup menu navigasi'
                                        : 'Buka menu navigasi'
                                }
                                aria-controls="mobile-navigation"
                                aria-expanded={isMobileMenuOpen}
                                onClick={() =>
                                    isMobileMenuOpen
                                        ? closeMobileNavigation()
                                        : setIsMobileMenuOpen(true)
                                }
                                className="flex size-11 items-center justify-center rounded-xl transition hover:bg-gray-100 text-village-ink focus-visible:ring-2 focus-visible:ring-current focus-visible:outline-none xl:hidden"
                            >
                                {isMobileMenuOpen ? (
                                    <X aria-hidden="true" />
                                ) : (
                                    <Menu aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </nav>
                </div>

                {isMobileMenuOpen && (
                    <div
                        id="mobile-navigation"
                        className="fixed inset-0 z-40 xl:hidden"
                    >
                        <button
                            type="button"
                            aria-label="Tutup menu navigasi"
                            className="absolute inset-0 bg-village-primary-dark/35 backdrop-blur-sm"
                            onClick={closeMobileNavigation}
                        />
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Menu navigasi"
                            className="relative ml-auto flex h-full w-[min(90%,26rem)] flex-col gap-6 overflow-y-auto bg-white px-6 pt-40 pb-8 shadow-2xl sm:pt-36"
                        >
                            <div className="flex flex-col gap-1 text-lg font-semibold text-village-ink">
                                {navigationItems.map((item) => (
                                    <MobileNavigationItem
                                        key={item.label}
                                        item={item}
                                        isExpanded={
                                            expandedMobileMenu === item.label
                                        }
                                        onToggle={() =>
                                            setExpandedMobileMenu(
                                                expandedMobileMenu ===
                                                    item.label
                                                    ? null
                                                    : item.label,
                                            )
                                        }
                                        onNavigate={closeMobileNavigation}
                                    />
                                ))}
                            </div>
                            <a
                                href="#layanan"
                                onClick={closeMobileNavigation}
                                className={`${primaryButtonClassName} mt-auto w-full`}
                            >
                                Akses Layanan
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </a>
                        </div>
                    </div>
                )}

                <main id="main-content">
                    <header
                        id="beranda"
                        className="scroll-mt-44 pt-36 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-10 max-w-[1440px] 2xl:max-w-[1536px] mx-auto"
                    >
                        <div className="relative w-full rounded-[28px] sm:rounded-[36px] bg-[#0c1f16] overflow-hidden border border-white/10 text-white shadow-2xl min-h-[680px] sm:min-h-[760px] lg:min-h-[820px] flex flex-col justify-between p-6 sm:p-10 lg:p-12">
                            {/* Background Image: Sawah / Petani Desa Ngampungan (Proposional, tanpa ditarik) */}
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                <img
                                    src="https://images.unsplash.com/photo-1559884743-74a57598c6c7?q=80&w=2076&auto=format&fit=crop"
                                    alt="Pemandangan sawah dan lanskap Desa Ngampungan"
                                    className="size-full object-cover object-[center_35%] opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-[#0c1f16]/80 via-[#0c1f16]/65 to-[#0c1f16]/85" />
                            </div>

                            {/* Atmospheric Lighting Rays & Glows */}
                            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#39d353]/20 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute top-0 right-1/4 w-[500px] h-[600px] bg-gradient-to-br from-white/20 via-[#39d353]/15 to-transparent blur-[30px] opacity-60 pointer-events-none -rotate-12" />
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-950/40 rounded-full blur-[80px] pointer-events-none" />

                            {/* Hero Main Grid */}
                            <div className="relative z-10 pt-4 sm:pt-6">
                                <div className="max-w-3xl space-y-6 text-left">
                                    {/* Main Headline */}
                                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] text-balance">
                                        Harmoni Warga,<br />
                                        <span className="text-[#39d353]">Kemajuan Bersama.</span>
                                    </h1>

                                    {/* Subtitle */}
                                    <p className="text-sm sm:text-base text-gray-300 font-normal max-w-xl leading-relaxed text-balance">
                                        Website resmi Desa Ngampungan. Melayani kebutuhan administrasi warga dan menyajikan informasi terkini seputar potensi, budaya, dan pembangunan desa.
                                    </p>

                                    {/* Dual Action Buttons */}
                                    <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                                        {/* Primary Button: White Pill + Green Arrow Circle Icon */}
                                        <a
                                            href="#profil"
                                            className="bg-white hover:bg-gray-100 text-gray-900 font-semibold pl-6 pr-2 py-2 rounded-full transition-all duration-200 flex items-center justify-center gap-3 shadow-lg group focus:ring-2 focus:ring-[#39d353]"
                                        >
                                            <span className="text-sm">Kenali Desa</span>
                                            <div className="w-8 h-8 rounded-full bg-village-primary group-hover:bg-village-primary-dark flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                                                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                            </div>
                                        </a>

                                        {/* Secondary Glass Button */}
                                        <a
                                            href="#layanan"
                                            className="bg-white/15 hover:bg-white/25 border border-white/20 hover:border-white/35 backdrop-blur-md text-white text-sm font-medium px-6 py-3 rounded-full transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <ChevronDown className="w-4 h-4 text-[#39d353]" />
                                            <span>Lihat Layanan</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* HERO BOTTOM: Quick Highlights Banner */}
                            <div className="relative z-10 pt-10 sm:pt-14 border-t border-white/10 mt-10 sm:mt-14">
                                <p className="text-[0.6875rem] uppercase tracking-widest text-emerald-400 text-center mb-6 font-mono font-semibold">
                                    Layanan Digital & Informasi Terpadu Desa Ngampungan
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-center opacity-90 text-xs font-semibold tracking-wide">
                                    <a href="#layanan" className="flex items-center gap-2 text-white hover:text-[#39d353] transition-colors">
                                        <FileText className="w-4 h-4 text-[#39d353]" />
                                        <span>Surat Online</span>
                                    </a>
                                    <a href="#layanan" className="flex items-center gap-2 text-white hover:text-[#39d353] transition-colors">
                                        <Sprout className="w-4 h-4 text-[#39d353]" />
                                        <span>Lapor Panen</span>
                                    </a>
                                    <a href="#transparansi" className="flex items-center gap-2 text-white hover:text-[#39d353] transition-colors">
                                        <Landmark className="w-4 h-4 text-[#39d353]" />
                                        <span>APBDes Transparan</span>
                                    </a>
                                    <a href="#potensi" className="flex items-center gap-2 text-white hover:text-[#39d353] transition-colors">
                                        <TrendingUp className="w-4 h-4 text-[#39d353]" />
                                        <span>Potensi UMKM</span>
                                    </a>
                                    <a href="#kontak" className="flex items-center gap-2 text-white hover:text-[#39d353] transition-colors">
                                        <CircleAlert className="w-4 h-4 text-[#39d353]" />
                                        <span>Pengaduan Warga</span>
                                    </a>
                                    <div className="flex items-center gap-2 text-[#39d353]">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Layanan 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* REDESIGNED STATISTIK DESA SECTION (Referencing Image 2) */}
                    <section
                        id="profil"
                        aria-labelledby="profil-heading"
                        className="py-12 sm:py-16 bg-[#f8f9fa] border-b border-gray-200/60 scroll-mt-24"
                    >
                        <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                                
                                {/* Left Column: Heading */}
                                <div className="lg:col-span-5 space-y-4">
                                    <h2
                                        id="profil-heading"
                                        className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight leading-[1.12]"
                                    >
                                        Statistik Desa<br />
                                        Ngampungan
                                    </h2>
                                    <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                                        Data kependudukan, wilayah, dan tata kelola Desa Ngampungan disajikan secara transparan, akurat, dan terus diperbarui untuk melayani seluruh warga.
                                    </p>
                                </div>

                                {/* Right Column: KPI Metrics Grid with Vertical Dividers (Gambar Ke-2 Design) */}
                                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-gray-200 bg-white sm:bg-transparent p-6 sm:p-0 rounded-2xl border sm:border-0 border-gray-200">
                                    {dummyVillageStatistics.map((statistic) => (
                                        <div
                                            key={statistic.label}
                                            className="sm:px-5 first:pl-0 space-y-2 group cursor-pointer hover:opacity-90 transition-opacity"
                                        >
                                            <span className="text-xs font-medium text-gray-500 block">
                                                {statistic.label}
                                            </span>
                                            <div className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight font-sans">
                                                {statistic.value}
                                            </div>
                                            <p className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-emerald-700 transition-colors">
                                                <span>{statistic.suffix} terdaftar</span>
                                                <ChevronRight className="w-3 h-3" />
                                            </p>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </section>

                    <section
                        id="sambutan-kepala-desa"
                        aria-labelledby="sambutan-kepala-desa-heading"
                        className="scroll-mt-48 overflow-hidden bg-white py-16 md:py-24 xl:scroll-mt-32"
                    >
                        <div className="mx-auto grid max-w-[1440px] 2xl:max-w-[1536px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
                            <div className="lg:col-span-5 flex justify-center lg:justify-start">
                                {/* Profile Card Container (Exact replication of requested design) */}
                                <div className="group relative h-[550px] sm:h-[560px] w-full max-w-[390px] sm:max-w-[420px] overflow-hidden rounded-[36px] border border-slate-800 bg-slate-900 shadow-2xl">
                                    {/* Background Image */}
                                    <img
                                        src="/assets/simulasi_profl.png"
                                        alt="Bapak. Rohan - Kepala Desa Ngampungan"
                                        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800';
                                        }}
                                    />

                                    {/* Smoky Fog Overlay Layer */}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 via-35% to-slate-950/95" />

                                    {/* Content Area (Bottom Overlay) */}
                                    <div className="absolute bottom-0 inset-x-0 z-10 flex flex-col justify-end space-y-4 p-6 sm:p-7 text-white">
                                        {/* Main Info */}
                                        <div className="space-y-1 text-left">
                                            <h3 className="text-2xl font-extrabold tracking-tight text-white leading-snug drop-shadow-sm sm:text-3xl">
                                                Bapak. Rohan
                                            </h3>

                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-200 sm:text-sm">
                                                <MapPin className="size-4 shrink-0 text-emerald-400" />
                                                <span>Kepala Desa Ngampungan</span>
                                            </div>

                                            <p className="pl-6 text-xs font-medium text-slate-300">
                                                Periode 2020 – 2026
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-7">
                                <p className="text-xs font-bold tracking-[0.2em] text-village-primary uppercase">
                                    Sambutan Kepala Desa
                                </p>
                                <blockquote className="mt-4">
                                    <h2
                                        id="sambutan-kepala-desa-heading"
                                        className="max-w-3xl text-3xl leading-tight font-bold tracking-tight text-village-ink sm:text-4xl lg:text-5xl"
                                    >
                                        Melayani dengan Transparan dan Dekat
                                        dengan Warga
                                    </h2>
                                </blockquote>

                                <div className="mt-7 max-w-3xl space-y-5 text-base leading-8 text-village-muted">
                                    <p>
                                        Salam hangat bagi seluruh warga Desa
                                        Ngampungan. Kehadiran platform digital
                                        ini merupakan komitmen kami untuk
                                        menghadirkan tata kelola pemerintahan
                                        desa yang modern, terbuka, dan inklusif.
                                    </p>
                                    <p>
                                        Kami percaya bahwa dengan teknologi,
                                        jarak antara pemerintah desa dan warga
                                        akan semakin dekat. Visi kami adalah
                                        membangun Ngampungan menjadi desa yang
                                        mandiri secara ekonomi, namun tetap
                                        menjunjung tinggi nilai-nilai kearifan
                                        lokal dan gotong royong.
                                    </p>
                                </div>

                                <div className="mt-8 border-t border-village-border pt-6">
                                    <p className="text-base font-bold text-village-ink">
                                        Bapak. Rohan
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-village-primary">
                                        Kepala Desa Ngampungan
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <TransparansiBentoSection />


                    <section
                        id="potensi"
                        aria-labelledby="potensi-heading"
                        className="scroll-mt-48 overflow-hidden border-b border-village-border bg-white py-16 md:py-24 xl:scroll-mt-32"
                    >
                        <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-10">
                            <div className="flex flex-col justify-between gap-6 border-b border-village-border pb-8 md:flex-row md:items-end">
                                <div className="max-w-3xl">
                                    <p className="text-xs font-bold tracking-[0.2em] text-village-primary uppercase">
                                        Direktori Potensi Desa
                                    </p>
                                    <h2
                                        id="potensi-heading"
                                        className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                                    >
                                        Temukan usaha dan potensi warga
                                    </h2>
                                    <p className="mt-4 max-w-2xl text-base leading-7 text-village-muted md:text-lg">
                                        Pilih kategori untuk melihat profil,
                                        produk, pengelola, dan lokasi potensi
                                        yang tersedia.
                                    </p>
                                </div>

                                <Link
                                    href={potentialsIndex()}
                                    prefetch
                                    className="inline-flex min-h-11 w-fit items-center gap-2 border border-village-border bg-village-canvas px-5 py-3 text-sm font-bold text-village-primary transition hover:border-village-primary hover:bg-village-primary-light focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    Buka Direktori
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </Link>
                            </div>

                            <div
                                role="tablist"
                                aria-label="Filter kategori potensi desa"
                                className="mt-7 flex gap-2 overflow-x-auto pb-2"
                            >
                                {villagePotentialCategories.map((category) => (
                                    <button
                                        key={category.key}
                                        type="button"
                                        role="tab"
                                        id={`potential-tab-${category.key}`}
                                        aria-controls="homepage-potential-panel"
                                        aria-selected={
                                            activePotentialCategory ===
                                            category.key
                                        }
                                        onClick={() =>
                                            setActivePotentialCategory(
                                                category.key,
                                            )
                                        }
                                        className={
                                            activePotentialCategory ===
                                            category.key
                                                ? 'min-h-11 shrink-0 bg-village-primary px-4 py-2.5 text-sm font-bold text-white'
                                                : 'min-h-11 shrink-0 border border-village-border bg-village-canvas px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:border-village-primary hover:text-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none'
                                        }
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>

                            <div
                                id="homepage-potential-panel"
                                role="tabpanel"
                                aria-labelledby={`potential-tab-${activePotentialCategory}`}
                                className="mt-7"
                            >
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                    <div>
                                        <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                            {activePotentialMetadata.eyebrow}
                                        </p>
                                        <h3 className="mt-2 text-2xl font-bold tracking-tight">
                                            {activePotentialMetadata.label}
                                        </h3>
                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-village-muted">
                                            {
                                                activePotentialMetadata.description
                                            }
                                        </p>
                                    </div>
                                    <Link
                                        href={potentialsIndex({
                                            query: {
                                                category:
                                                    activePotentialCategory,
                                            },
                                        })}
                                        prefetch
                                        className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-village-primary transition hover:text-village-primary-dark focus-visible:underline focus-visible:outline-none"
                                    >
                                        Lihat semua{' '}
                                        {activePotentialMetadata.label}
                                        <ArrowRight
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </Link>
                                </div>

                                <VillagePotentialCarousel
                                    key={activePotentialCategory}
                                    entries={activePotentialEntries}
                                    label={`Potensi kategori ${activePotentialMetadata.label}`}
                                />
                            </div>

                            <div className="mt-7 flex items-start gap-3 border border-[#efdcae] bg-[#fff8ea] p-4 text-sm leading-6 text-[#755018]">
                                <Info
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0"
                                />
                                <p>
                                    <strong>Data simulasi frontend.</strong>{' '}
                                    Profil, produk, pengelola, kontak, dan
                                    lokasi akan diganti setelah data resmi
                                    diverifikasi.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section
                        id="berita"
                        aria-labelledby="berita-heading"
                        className="scroll-mt-20 bg-village-surface-muted py-16 md:py-24"
                    >
                        <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-10">
                            <div className="flex flex-col justify-between gap-6 border-b border-village-border pb-8 md:flex-row md:items-end">
                                <div className="max-w-2xl">
                                    <p className="text-xs font-bold tracking-[0.2em] text-village-primary uppercase">
                                        Kabar Desa
                                    </p>
                                    <h2
                                        id="berita-heading"
                                        className="village-heading-2 mt-3"
                                    >
                                        Berita Desa
                                    </h2>
                                    <p className="mt-4 text-lg text-village-muted">
                                        Ikuti kegiatan, pembangunan, dan cerita
                                        terbaru dari Desa Ngampungan.
                                    </p>
                                </div>
                                <Link
                                    href={newsIndex()}
                                    prefetch
                                    className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-village-border bg-white px-5 py-3 text-sm font-bold transition hover:border-village-primary hover:text-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    Lihat Semua Berita
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </Link>
                            </div>

                            <div className="mt-10">
                                <article className="group grid overflow-hidden rounded-3xl border border-village-border bg-white shadow-village-soft lg:grid-cols-12">
                                    <Link
                                        href={newsShow(
                                            featuredDummyNewsArticle.slug,
                                        )}
                                        prefetch
                                        className="relative block min-h-72 overflow-hidden bg-village-primary-dark focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none focus-visible:ring-inset lg:col-span-7"
                                    >
                                        {isFeaturedImageUnavailable ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_38%),linear-gradient(145deg,var(--color-village-primary-dark),var(--color-village-primary))] px-8 text-center text-white">
                                                <span className="flex size-16 items-center justify-center rounded-full border border-white/25 bg-white/10">
                                                    <Newspaper
                                                        aria-hidden="true"
                                                        className="size-7"
                                                    />
                                                </span>
                                                <span className="max-w-xs text-sm leading-6 font-semibold text-white/85">
                                                    Dokumentasi berita belum
                                                    tersedia
                                                </span>
                                            </div>
                                        ) : (
                                            <img
                                                ref={featuredImageRef}
                                                src={
                                                    featuredDummyNewsArticle.image
                                                }
                                                alt={
                                                    featuredDummyNewsArticle.alt
                                                }
                                                onError={() =>
                                                    setIsFeaturedImageUnavailable(
                                                        true,
                                                    )
                                                }
                                                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                                            />
                                        )}
                                        <span className="absolute top-5 left-5 rounded-full bg-village-accent px-3 py-1.5 text-xs font-bold text-village-ink shadow-sm">
                                            Berita Utama
                                        </span>
                                    </Link>

                                    <div className="flex flex-col justify-center p-6 md:p-8 lg:col-span-5 lg:p-10">
                                        <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                            {featuredDummyNewsArticle.category}
                                        </p>
                                        <h3 className="mt-4 text-2xl leading-tight font-bold md:text-3xl">
                                            <Link
                                                href={newsShow(
                                                    featuredDummyNewsArticle.slug,
                                                )}
                                                prefetch
                                                className="transition-colors hover:text-village-primary focus-visible:underline focus-visible:outline-none"
                                            >
                                                {featuredDummyNewsArticle.title}
                                            </Link>
                                        </h3>
                                        <div className="mt-5 flex items-center gap-2 text-xs text-village-muted">
                                            <CalendarDays
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                            <time
                                                dateTime={
                                                    featuredDummyNewsArticle.publishedAt
                                                }
                                            >
                                                {
                                                    featuredDummyNewsArticle.publishedLabel
                                                }
                                            </time>
                                        </div>
                                        <p className="mt-5 leading-7 text-village-muted">
                                            {featuredDummyNewsArticle.excerpt}
                                        </p>
                                        <Link
                                            href={newsShow(
                                                featuredDummyNewsArticle.slug,
                                            )}
                                            prefetch
                                            className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-bold text-village-primary hover:text-village-primary-dark"
                                        >
                                            Baca berita
                                            <ArrowRight
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                        </Link>
                                    </div>
                                </article>

                                <div className="mt-10 flex items-end justify-between gap-5">
                                    <div>
                                        <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                            Kabar lainnya
                                        </p>
                                        <h3 className="mt-2 text-2xl font-bold">
                                            Berita Lainnya
                                        </h3>
                                    </div>
                                    <span className="text-sm text-village-muted">
                                        {latestDummyNewsArticles.length} berita
                                    </span>
                                </div>

                                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {latestDummyNewsArticles.map((article) => (
                                        <PublicNewsCard
                                            key={article.slug}
                                            article={article}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="pengumuman"
                        aria-labelledby="pengumuman-heading"
                        className="scroll-mt-20 border-t border-village-border bg-white py-16 md:py-24"
                    >
                        <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-10">
                            <div className="flex flex-col justify-between gap-6 border-b border-village-border pb-8 md:flex-row md:items-end">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-10 items-center justify-center rounded-full bg-village-primary-light text-village-primary">
                                            <BellRing
                                                aria-hidden="true"
                                                className="size-5"
                                            />
                                        </span>
                                        <p className="text-xs font-bold tracking-[0.2em] text-village-primary uppercase">
                                            Pemberitahuan Resmi
                                        </p>
                                    </div>
                                    <h2
                                        id="pengumuman-heading"
                                        className="village-heading-2 mt-4"
                                    >
                                        Pengumuman Desa
                                    </h2>
                                    <p className="mt-4 text-lg text-village-muted">
                                        Periksa jadwal layanan dan informasi
                                        resmi yang sedang berlaku untuk warga.
                                    </p>
                                </div>

                                <Link
                                    href={announcementsIndex()}
                                    prefetch
                                    className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-village-border bg-white px-5 py-3 text-sm font-bold transition hover:border-village-primary hover:text-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    Lihat Semua Pengumuman
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </Link>
                            </div>

                            <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                        Masih berlaku
                                    </p>
                                    <h3 className="mt-2 text-2xl font-bold">
                                        Pengumuman Aktif
                                    </h3>
                                </div>
                                <p className="text-sm text-village-muted">
                                    Informasi kedaluwarsa dipindahkan ke arsip.
                                </p>
                            </div>

                            <div className="mt-6 grid gap-5 lg:grid-cols-3">
                                {activeDummyAnnouncements
                                    .slice(0, 3)
                                    .map((announcement) => (
                                        <PublicAnnouncementCard
                                            key={announcement.id}
                                            announcement={announcement}
                                            compact
                                        />
                                    ))}
                            </div>
                        </div>
                    </section>

                    <section
                        id="kontak"
                        aria-labelledby="kontak-heading"
                        className="scroll-mt-48 border-t border-village-border bg-village-canvas py-16 md:py-24 xl:scroll-mt-32"
                    >
                        <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-10">
                            <div className="grid gap-8 border-b border-village-border pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
                                <div className="max-w-3xl">
                                    <p className="text-xs font-bold tracking-[0.2em] text-village-primary uppercase">
                                        Lokasi dan Kontak
                                    </p>
                                    <h2
                                        id="kontak-heading"
                                        className="village-heading-2 mt-3"
                                    >
                                        Terhubung dengan Pemerintah Desa
                                    </h2>
                                    <p className="mt-4 max-w-2xl text-lg leading-relaxed text-village-muted">
                                        Temukan kantor desa atau kirimkan
                                        pertanyaan dan aspirasi secara langsung.
                                        Setiap pesan akan tercatat di sistem
                                        pengelola desa.
                                    </p>
                                </div>

                                <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
                                    <a
                                        href="tel:+6281234567890"
                                        className="flex min-h-12 items-center gap-3 border border-village-border bg-white px-4 font-semibold text-village-ink transition hover:border-village-primary hover:text-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                                    >
                                        <PhoneCall
                                            aria-hidden="true"
                                            className="size-5 text-village-primary"
                                        />
                                        0812-3456-7890
                                    </a>
                                    <a
                                        href="mailto:pemdes@ngampungan.desa.id"
                                        className="flex min-h-12 items-center gap-3 border border-village-border bg-white px-4 font-semibold text-village-ink transition hover:border-village-primary hover:text-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                                    >
                                        <Mail
                                            aria-hidden="true"
                                            className="size-5 text-village-primary"
                                        />
                                        pemdes@ngampungan.desa.id
                                    </a>
                                </div>
                            </div>

                            <div className="mt-9 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                                <div className="overflow-hidden border border-village-border bg-white shadow-village-soft">
                                    <div className="relative aspect-[4/3] min-h-[330px] bg-village-primary-light">
                                        <iframe
                                            title="Peta lokasi Kantor Desa Ngampungan"
                                            src="https://www.openstreetmap.org/export/embed.html?bbox=112.3256%2C-7.6410%2C112.3456%2C-7.6290&layer=mapnik&marker=-7.6350%2C112.3356"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="absolute inset-0 size-full border-0"
                                        />
                                        <p className="absolute top-4 left-4 border border-white/35 bg-village-primary-dark/90 px-3 py-2 text-[0.6875rem] font-bold tracking-[0.13em] text-white uppercase shadow-lg backdrop-blur-sm">
                                            Titik lokasi simulasi
                                        </p>
                                    </div>

                                    <div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-end">
                                        <div>
                                            <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                                Kantor Desa Ngampungan
                                            </p>
                                            <address className="mt-2 text-sm leading-6 text-village-muted not-italic">
                                                Jl. Raya Ngampungan No. 1, Kec.
                                                Bareng, Kab. Jombang, Jawa Timur
                                                61474
                                            </address>
                                            <p className="mt-2 text-xs leading-5 text-[#8a6218]">
                                                Koordinat masih berupa data
                                                simulasi dan perlu diverifikasi.
                                            </p>
                                        </div>
                                        <a
                                            href="https://www.openstreetmap.org/?mlat=-7.6350&mlon=112.3356#map=16/-7.6350/112.3356"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex min-h-11 items-center justify-center gap-2 border border-village-border px-4 text-sm font-bold text-village-primary transition hover:border-village-primary hover:bg-village-primary-light focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                                        >
                                            Buka Peta
                                            <ExternalLink
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                        </a>
                                    </div>
                                </div>

                                <div className="border border-village-border bg-white p-6 shadow-village-soft md:p-8">
                                    <div className="flex items-start gap-4 border-b border-village-border pb-6">
                                        <span className="flex size-11 shrink-0 items-center justify-center bg-village-primary-light text-village-primary">
                                            <MailOpen
                                                aria-hidden="true"
                                                className="size-5"
                                            />
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-bold text-village-ink">
                                                Kirim Pesan
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-village-muted">
                                                Isi data dengan benar agar
                                                petugas dapat menindaklanjuti.
                                            </p>
                                        </div>
                                    </div>

                                    <Form
                                        action={storeContactMessage()}
                                        resetOnSuccess
                                        options={{ preserveScroll: true }}
                                        className="mt-6 flex flex-col gap-5"
                                    >
                                        {({
                                            errors,
                                            processing,
                                            recentlySuccessful,
                                        }) => (
                                            <>
                                                <div
                                                    aria-hidden="true"
                                                    className="absolute -left-[9999px]"
                                                >
                                                    <label htmlFor="contact-website">
                                                        Website
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="contact-website"
                                                        name="website"
                                                        tabIndex={-1}
                                                        autoComplete="off"
                                                    />
                                                </div>

                                                <div className="grid gap-5 sm:grid-cols-2">
                                                    <div>
                                                        <label
                                                            htmlFor="contact-name"
                                                            className="text-sm font-semibold tracking-wide"
                                                        >
                                                            Nama Lengkap
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="contact-name"
                                                            name="name"
                                                            required
                                                            minLength={3}
                                                            maxLength={100}
                                                            autoComplete="name"
                                                            aria-invalid={
                                                                errors.name
                                                                    ? true
                                                                    : undefined
                                                            }
                                                            className="mt-2 w-full border border-village-border bg-white px-3.5 py-3 transition outline-none focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                                            placeholder="Nama Anda"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.name
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor="contact-channel"
                                                            className="text-sm font-semibold tracking-wide"
                                                        >
                                                            WhatsApp atau Email
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="contact-channel"
                                                            name="contact"
                                                            required
                                                            minLength={6}
                                                            maxLength={150}
                                                            autoComplete="email"
                                                            aria-invalid={
                                                                errors.contact
                                                                    ? true
                                                                    : undefined
                                                            }
                                                            className="mt-2 w-full border border-village-border bg-white px-3.5 py-3 transition outline-none focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                                            placeholder="0812... / nama@email.com"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.contact
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="contact-category"
                                                        className="text-sm font-semibold tracking-wide"
                                                    >
                                                        Kategori Pesan
                                                    </label>
                                                    <select
                                                        id="contact-category"
                                                        name="category"
                                                        required
                                                        defaultValue="general"
                                                        aria-invalid={
                                                            errors.category
                                                                ? true
                                                                : undefined
                                                        }
                                                        className="mt-2 w-full border border-village-border bg-white px-3.5 py-3 transition outline-none focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                                    >
                                                        <option value="general">
                                                            Pertanyaan Umum
                                                        </option>
                                                        <option value="service_complaint">
                                                            Pengaduan Layanan
                                                        </option>
                                                        <option value="development_proposal">
                                                            Usulan Pembangunan
                                                        </option>
                                                    </select>
                                                    <InputError
                                                        message={
                                                            errors.category
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="contact-message"
                                                        className="text-sm font-semibold tracking-wide"
                                                    >
                                                        Isi Pesan
                                                    </label>
                                                    <textarea
                                                        id="contact-message"
                                                        name="message"
                                                        rows={5}
                                                        required
                                                        minLength={10}
                                                        maxLength={3000}
                                                        aria-invalid={
                                                            errors.message
                                                                ? true
                                                                : undefined
                                                        }
                                                        className="mt-2 w-full resize-none border border-village-border bg-white px-3.5 py-3 transition outline-none focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                                        placeholder="Tuliskan pesan secara jelas..."
                                                    />
                                                    <div className="mt-2 flex items-start justify-between gap-4">
                                                        <InputError
                                                            message={
                                                                errors.message
                                                            }
                                                        />
                                                        <span className="ml-auto text-xs text-village-muted">
                                                            Maks. 3.000 karakter
                                                        </span>
                                                    </div>
                                                </div>

                                                <label className="flex items-start gap-3 text-sm leading-6 text-village-muted">
                                                    <input
                                                        type="checkbox"
                                                        name="consent"
                                                        value="1"
                                                        required
                                                        className="mt-1 size-4 shrink-0 accent-village-primary"
                                                    />
                                                    <span>
                                                        Saya menyetujui
                                                        penyimpanan data ini
                                                        untuk keperluan tindak
                                                        lanjut pesan.
                                                    </span>
                                                </label>
                                                <InputError
                                                    message={errors.consent}
                                                />
                                                <InputError
                                                    message={errors.website}
                                                />

                                                {recentlySuccessful && (
                                                    <p
                                                        role="status"
                                                        className="border border-village-primary/20 bg-village-primary-light px-4 py-3 text-sm leading-6 font-medium text-village-primary-dark"
                                                    >
                                                        Pesan berhasil disimpan.
                                                        Petugas desa dapat
                                                        melihatnya dari
                                                        dashboard.
                                                    </p>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className={`${primaryButtonClassName} w-full disabled:cursor-not-allowed disabled:opacity-65`}
                                                >
                                                    {processing ? (
                                                        <>
                                                            <Spinner className="size-4" />
                                                            Menyimpan Pesan
                                                        </>
                                                    ) : (
                                                        <>
                                                            Kirim Pesan
                                                            <Send
                                                                aria-hidden="true"
                                                                className="size-4"
                                                            />
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-village-primary-dark pt-16 pb-8 text-white/80">
                    <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-10">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col gap-4">
                                <div className="text-white">
                                    <SiteLogo compact />
                                </div>
                                <p className="text-sm leading-relaxed text-village-primary-light/70">
                                    Pusat informasi dan layanan digital resmi
                                    Desa Ngampungan. Mewujudkan tata kelola desa
                                    yang transparan, inovatif, dan berbudaya.
                                </p>
                            </div>

                            <FooterLinks
                                title="Pemerintahan"
                                links={[
                                    'Visi & Misi',
                                    'Struktur Organisasi',
                                    'Lembaga Desa',
                                    'Transparansi Dana',
                                ]}
                            />
                            <FooterLinks
                                title="Layanan Warga"
                                links={[
                                    'Administrasi Kependudukan',
                                    'Layanan Pertanahan',
                                    'Perizinan Usaha (SKU)',
                                    'Pengaduan Masyarakat',
                                ]}
                            />

                            <div>
                                <h2 className="text-sm font-bold tracking-widest text-white uppercase">
                                    Kontak & Lokasi
                                </h2>
                                <ul className="mt-4 flex flex-col gap-3 text-sm">
                                    <li className="flex items-start gap-2">
                                        <MapPin
                                            aria-hidden="true"
                                            className="mt-0.5 size-4 shrink-0 text-village-accent"
                                        />
                                        <span>
                                            Jl. Raya Ngampungan No. 1, Kec.
                                            Bareng, Kab. Jombang, Jawa Timur
                                            61474
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Mail
                                            aria-hidden="true"
                                            className="size-4 shrink-0 text-village-accent"
                                        />
                                        <span>pemdes@ngampungan.desa.id</span>
                                    </li>
                                </ul>
                                <div className="mt-6 flex gap-4">
                                    <SocialLink
                                        label="Facebook"
                                        icon={Facebook}
                                    />
                                    <SocialLink
                                        label="Instagram"
                                        icon={Instagram}
                                    />
                                    <SocialLink
                                        label="YouTube"
                                        icon={Youtube}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-village-primary-light/50 md:flex-row">
                            <p>
                                © 2026 Pemerintah Desa Ngampungan. Hak cipta
                                dilindungi.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="#kontak"
                                    className="transition-colors hover:text-white"
                                >
                                    Kebijakan Privasi
                                </a>
                                <a
                                    href="#kontak"
                                    className="transition-colors hover:text-white"
                                >
                                    Syarat Ketentuan
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
    return (
        <div>
            <h2 className="text-sm font-bold tracking-widest text-white uppercase">
                {title}
            </h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
                {links.map((link) => (
                    <li key={link}>
                        <a
                            href="#layanan"
                            className="transition-colors hover:text-white"
                        >
                            {link}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SocialLink({
    label,
    icon: Icon,
}: {
    label: string;
    icon: LucideIcon;
}) {
    return (
        <a
            href="#kontak"
            aria-label={label}
            className="flex size-11 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-village-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
            <Icon aria-hidden="true" className="size-5" />
        </a>
    );
}
