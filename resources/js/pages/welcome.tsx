import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BellRing,
    CalendarDays,
    ChevronDown,
    CircleAlert,
    Clock3,
    Facebook,
    FileText,
    House,
    Info,
    Instagram,
    Landmark,
    LogIn,
    Mail,
    MailOpen,
    MapPin,
    Menu,
    Newspaper,
    PhoneCall,
    Ruler,
    Send,
    Sprout,
    TrendingUp,
    Users,
    WalletCards,
    X,
    Youtube,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { PublicAnnouncementCard } from '@/components/public-announcement-card';
import { PublicNewsCard } from '@/components/public-news-card';
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
import { dashboard, login } from '@/routes';
import { index as announcementsIndex } from '@/routes/announcements';
import { index as newsIndex, show as newsShow } from '@/routes/news';
import { index as potentialsIndex } from '@/routes/potentials';
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
                href: '#profil',
            },
            {
                label: 'Visi dan Misi',
                description: 'Arah dan tujuan pembangunan desa.',
                href: '#profil',
            },
            {
                label: 'Sejarah Desa',
                description: 'Perjalanan dan asal-usul desa.',
                href: '#profil',
            },
            {
                label: 'Data Wilayah',
                description: 'Demografi dan karakter wilayah.',
                href: '#profil',
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
                href: '#sambutan-kepala-desa',
            },
            {
                label: 'Struktur Organisasi',
                description: 'Susunan pemerintahan desa.',
                href: '#profil',
            },
            {
                label: 'Perangkat Desa',
                description: 'Daftar aparatur pemerintah desa.',
                href: '#profil',
            },
            {
                label: 'Lembaga Desa',
                description: 'Lembaga kemasyarakatan desa.',
                href: '#profil',
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
                href: '#berita',
            },
            {
                label: 'Pengumuman',
                description: 'Informasi resmi untuk masyarakat.',
                href: '#pengumuman',
            },
            {
                label: 'Agenda',
                description: 'Jadwal kegiatan desa mendatang.',
                href: '#berita',
            },
            {
                label: 'Galeri',
                description: 'Dokumentasi kegiatan dan potensi desa.',
                href: '#berita',
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
    icon: LucideIcon;
    iconClassName: string;
};

const services: Service[] = [
    {
        title: 'Kependudukan',
        description: 'Informasi KK, KTP, dan mutasi penduduk.',
        icon: Users,
        iconClassName:
            'text-village-primary group-hover:bg-village-primary-light',
    },
    {
        title: 'Lapor Panen',
        description: 'Pelaporan komoditas dan jadwal distribusi tani.',
        icon: Sprout,
        iconClassName: 'text-village-secondary group-hover:bg-orange-100',
    },
    {
        title: 'Lapor Darurat',
        description: 'Kanal pelaporan infrastruktur dan keamanan.',
        icon: CircleAlert,
        iconClassName: 'text-village-error group-hover:bg-red-50',
    },
];

const apbdesMetricPresentation: Record<
    ApbdesMetricKey,
    {
        icon: LucideIcon;
        iconClassName: string;
    }
> = {
    income: {
        icon: TrendingUp,
        iconClassName: 'bg-village-primary-light text-village-primary',
    },
    expense: {
        icon: FileText,
        iconClassName: 'bg-[#fff2cf] text-[#94620d]',
    },
    netFinancing: {
        icon: WalletCards,
        iconClassName: 'bg-[#e7f1fb] text-village-info',
    },
    estimatedSilpa: {
        icon: Landmark,
        iconClassName: 'bg-village-surface-muted text-village-primary-dark',
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
            <div className="mx-auto grid max-w-[1280px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 px-5 py-2 text-[0.6875rem] leading-4 font-medium sm:text-xs lg:flex lg:min-h-9 lg:gap-5 lg:px-12 lg:py-1.5">
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

export default function Welcome() {
    const { auth } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
        null,
    );
    const [isMessageSent, setIsMessageSent] = useState(false);
    const [isFeaturedImageUnavailable, setIsFeaturedImageUnavailable] =
        useState(false);
    const [activePotentialCategory, setActivePotentialCategory] =
        useState<VillagePotentialKey>('umkm');
    const featuredImageRef = useRef<HTMLImageElement>(null);
    const portalHref = auth.user ? dashboard() : login();
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

    const submitMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsMessageSent(true);
        event.currentTarget.reset();
    };

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
                                : 'border-transparent bg-transparent text-white'
                        }`}
                    >
                        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 lg:px-12">
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
                                className="flex size-11 items-center justify-center rounded-xl transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-current focus-visible:outline-none xl:hidden"
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
                        className="relative flex min-h-[90vh] scroll-mt-44 items-center overflow-hidden pt-44 pb-16 sm:scroll-mt-40 sm:pt-40"
                    >
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1559884743-74a57598c6c7?q=80&w=2076&auto=format&fit=crop"
                                alt="Pemandangan sawah yang mewakili lanskap Desa Ngampungan"
                                className="size-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-village-primary-dark/75 mix-blend-multiply" />
                            <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-village-canvas to-transparent" />
                        </div>

                        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 px-5 lg:grid-cols-12 lg:px-12">
                            <div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-8">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md">
                                    <span className="size-2 animate-pulse rounded-full bg-village-accent" />
                                    Sistem Informasi Desa Terpadu
                                </div>
                                <h1 className="village-heading-1 text-white">
                                    Harmoni Warga,
                                    <br />
                                    <span className="text-village-primary-light">
                                        Kemajuan Bersama.
                                    </span>
                                </h1>
                                <p className="max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
                                    Website resmi Desa Ngampungan. Melayani
                                    kebutuhan administrasi warga dan menyajikan
                                    informasi terkini seputar potensi, budaya,
                                    dan pembangunan desa.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <a
                                        href="#profil"
                                        className={`${primaryButtonClassName} shadow-village-floating`}
                                    >
                                        Kenali Desa
                                        <ArrowRight
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </a>
                                    <a
                                        href="#layanan"
                                        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white hover:text-village-primary-dark focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-village-primary-dark focus-visible:outline-none"
                                    >
                                        Lihat Layanan
                                        <ChevronDown
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </a>
                                </div>
                            </div>

                            <div className="lg:col-span-5 xl:col-span-4">
                                <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-village-floating backdrop-blur-2xl transition duration-300 hover:-translate-y-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-village-ink">
                                                Jam Pelayanan
                                            </h2>
                                            <p className="mt-1 text-sm text-village-muted">
                                                Kantor Kepala Desa Ngampungan
                                            </p>
                                        </div>
                                        <div className="flex size-10 items-center justify-center rounded-full bg-village-primary-light text-village-primary">
                                            <Clock3
                                                aria-hidden="true"
                                                className="size-5"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col text-sm">
                                        <div className="flex items-center justify-between gap-4 border-b border-village-border/60 py-3">
                                            <span className="font-medium">
                                                Senin–Kamis
                                            </span>
                                            <span className="text-right text-village-muted">
                                                08.00–15.00 WIB
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 border-b border-village-border/60 py-3">
                                            <span className="font-medium">
                                                Jumat
                                            </span>
                                            <span className="text-right text-village-muted">
                                                08.00–11.30 WIB
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 py-3 text-village-muted">
                                            <span className="font-medium">
                                                Sabtu–Minggu
                                            </span>
                                            <span className="text-right">
                                                Tutup (layanan online)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 border-t border-village-border/60 pt-5">
                                        <div className="flex items-center gap-3">
                                            <span className="relative flex size-3">
                                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-village-success opacity-75" />
                                                <span className="relative inline-flex size-3 rounded-full bg-village-success" />
                                            </span>
                                            <span className="text-sm font-semibold">
                                                Layanan darurat 24/7 aktif
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <section
                        id="profil"
                        aria-labelledby="profil-heading"
                        className="relative z-20 -mt-8 scroll-mt-24 bg-village-canvas py-12"
                    >
                        <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.2em] text-village-primary uppercase">
                                        Desa dalam Angka
                                    </p>
                                    <h2
                                        id="profil-heading"
                                        className="mt-3 text-3xl font-bold tracking-tight text-village-ink md:text-4xl"
                                    >
                                        Statistik Desa Ngampungan
                                    </h2>
                                </div>
                                <p className="w-fit rounded-full border border-village-border bg-white px-4 py-2 text-xs font-semibold text-village-muted shadow-sm">
                                    Data sementara ·{' '}
                                    <time dateTime="2026">2026</time>
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
                                {dummyVillageStatistics.map((statistic) => {
                                    const StatisticIcon = statistic.icon;

                                    return (
                                        <article
                                            key={statistic.label}
                                            className="group relative isolate flex min-h-60 flex-col justify-between overflow-hidden rounded-3xl border border-village-border bg-white p-5 shadow-village-soft ring-1 ring-village-ink/[0.02] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-village-primary/35 hover:shadow-village-floating active:scale-[0.985] motion-reduce:transform-none motion-reduce:transition-none sm:p-6"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`absolute inset-x-6 top-0 h-1 rounded-b-full ${statistic.accentClassName}`}
                                            />
                                            <span
                                                aria-hidden="true"
                                                className="absolute top-4 right-5 -z-10 text-4xl font-black tracking-tighter text-village-primary/[0.06]"
                                            >
                                                {statistic.index}
                                            </span>

                                            <div>
                                                <div
                                                    className={`flex size-11 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:-translate-y-1 group-active:scale-90 motion-reduce:transform-none motion-reduce:transition-none sm:size-12 ${statistic.iconClassName}`}
                                                >
                                                    <StatisticIcon
                                                        aria-hidden="true"
                                                        className="size-5"
                                                    />
                                                </div>
                                                <p className="mt-6 text-[0.6875rem] font-bold tracking-[0.14em] text-village-muted uppercase sm:text-xs">
                                                    {statistic.label}
                                                </p>
                                            </div>

                                            <div className="mt-8">
                                                <p className="flex origin-bottom-left flex-wrap items-baseline gap-x-2 gap-y-1 transition-transform duration-300 ease-out group-hover:scale-[1.06] group-active:scale-[1.1] motion-reduce:transform-none motion-reduce:transition-none">
                                                    <span className="text-3xl font-bold tracking-tight text-village-primary-dark sm:text-4xl">
                                                        {statistic.value}
                                                    </span>
                                                    <span className="text-xs font-semibold text-village-primary sm:text-sm">
                                                        {statistic.suffix}
                                                    </span>
                                                </p>
                                                <p className="mt-3 text-xs leading-5 text-village-muted sm:text-sm sm:leading-6">
                                                    {statistic.description}
                                                </p>
                                            </div>

                                            <span
                                                aria-hidden="true"
                                                className="absolute right-4 bottom-4 size-5 rounded-br-lg border-r-2 border-b-2 border-village-primary/15 transition-all duration-300 group-hover:size-7 group-hover:border-village-primary/35 motion-reduce:transition-none"
                                            />
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <section
                        id="sambutan-kepala-desa"
                        aria-labelledby="sambutan-kepala-desa-heading"
                        className="scroll-mt-48 overflow-hidden bg-white py-16 md:py-24 xl:scroll-mt-32"
                    >
                        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 lg:grid-cols-12 lg:gap-16 lg:px-12">
                            <div className="lg:col-span-5">
                                <div className="group relative isolate mx-auto max-w-sm lg:mx-0">
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-y-5 -right-3 -z-10 w-full rounded-[2rem] rounded-tr-[5rem] border border-village-primary/20 bg-village-primary-light/70 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
                                    />
                                    <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] rounded-tr-[5rem] border border-village-border bg-village-canvas shadow-village-soft transition-[transform,box-shadow,border-color] duration-300 ease-out group-hover:-translate-y-1 group-hover:border-village-primary/45 group-hover:shadow-village-floating motion-reduce:transform-none motion-reduce:transition-none">
                                        <img
                                            src="/assets/Kepala_desa.png"
                                            alt="Ilustrasi Kepala Desa Ngampungan"
                                            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
                                        />
                                        <div
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-3 rounded-[1.4rem] rounded-tr-[4.25rem] border border-white/75 shadow-[inset_0_0_0_1px_rgb(21_73_51/0.08)]"
                                        />
                                        <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full border border-village-border/80 bg-white/90 px-3 py-2 text-[0.625rem] font-bold tracking-[0.16em] text-village-primary-dark uppercase shadow-sm backdrop-blur-sm">
                                            <span
                                                aria-hidden="true"
                                                className="size-1.5 rounded-full bg-village-accent"
                                            />
                                            Pemerintah Desa
                                        </div>
                                        <div
                                            aria-hidden="true"
                                            className="absolute bottom-6 left-0 h-16 w-1.5 rounded-r-full bg-village-accent shadow-sm"
                                        />
                                        <div className="absolute right-5 bottom-5 flex size-12 items-center justify-center rounded-2xl border border-village-border/80 bg-white/90 p-2.5 shadow-md backdrop-blur-sm">
                                            <img
                                                src="/assets/logo_kabupaten_jombang.png"
                                                alt=""
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    </figure>
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
                                        Kusnadi, S.Sos
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-village-primary">
                                        Kepala Desa Ngampungan
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="layanan"
                        aria-labelledby="layanan-heading"
                        className="scroll-mt-20 bg-village-canvas py-16 md:py-24"
                    >
                        <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                            <div className="max-w-2xl">
                                <h2
                                    id="layanan-heading"
                                    className="village-heading-2"
                                >
                                    Akses Layanan Cepat
                                </h2>
                                <p className="mt-4 text-lg leading-relaxed text-village-muted">
                                    Pusat layanan mandiri warga Desa Ngampungan.
                                    Ajukan surat, laporkan masalah, dan cek
                                    status kependudukan dari rumah.
                                </p>
                            </div>

                            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
                                <Link
                                    href={portalHref}
                                    className="group flex min-h-80 flex-col justify-between rounded-3xl bg-village-primary-light p-6 transition hover:-translate-y-1 hover:bg-[#c9ebd8] focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none md:col-span-2 md:p-8 lg:col-span-2 lg:row-span-2"
                                >
                                    <div className="flex size-14 items-center justify-center rounded-2xl bg-village-primary text-white shadow-lg transition-transform group-hover:scale-105">
                                        <FileText
                                            aria-hidden="true"
                                            className="size-6"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-village-primary-dark">
                                            Administrasi & Surat
                                        </h3>
                                        <p className="mt-2 text-village-primary-dark/80">
                                            Pengajuan Surat Keterangan Usaha,
                                            Surat Domisili, dan Pengantar RT/RW.
                                        </p>
                                    </div>
                                </Link>

                                {services.map((service, index) => {
                                    const Icon = service.icon;

                                    return (
                                        <Link
                                            key={service.title}
                                            href={portalHref}
                                            className={`group flex min-h-52 flex-col justify-between rounded-3xl border border-village-border bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-village-primary hover:shadow-village-soft focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none ${index === services.length - 1 ? 'md:col-span-2 lg:col-span-2' : ''}`}
                                        >
                                            <div
                                                className={`flex size-12 items-center justify-center rounded-xl bg-village-surface-muted transition-colors ${service.iconClassName}`}
                                            >
                                                <Icon
                                                    aria-hidden="true"
                                                    className="size-5"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">
                                                    {service.title}
                                                </h3>
                                                <p className="mt-2 text-sm leading-relaxed text-village-muted">
                                                    {service.description}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <section
                        id="transparansi"
                        aria-labelledby="transparansi-heading"
                        className="scroll-mt-48 bg-village-primary-dark py-16 md:py-24 xl:scroll-mt-32"
                    >
                        <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                            <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end">
                                <div className="max-w-3xl">
                                    <p className="text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                                        Transparansi Anggaran
                                    </p>
                                    <h2
                                        id="transparansi-heading"
                                        className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                                    >
                                        Ringkasan APBDes{' '}
                                        {dummyApbdesSummary.year}
                                    </h2>
                                    <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                                        Gambaran singkat rencana pendapatan,
                                        belanja, dan pembiayaan Desa Ngampungan
                                        pada tahun anggaran berjalan.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 md:items-end">
                                    <div className="flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                                        <span
                                            aria-hidden="true"
                                            className="size-2 rounded-full bg-village-accent"
                                        />
                                        Tahun Anggaran{' '}
                                        <time
                                            dateTime={dummyApbdesSummary.year}
                                        >
                                            {dummyApbdesSummary.year}
                                        </time>
                                    </div>
                                    <Link
                                        href={transparencyIndex()}
                                        prefetch
                                        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-village-primary-dark transition hover:bg-village-primary-light focus-visible:ring-2 focus-visible:ring-village-accent focus-visible:ring-offset-2 focus-visible:ring-offset-village-primary-dark focus-visible:outline-none"
                                    >
                                        Lihat Transparansi Lengkap
                                        <ArrowRight
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-10 grid gap-5 lg:grid-cols-12">
                                <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                                    {dummyApbdesSummary.metrics.map(
                                        (metric) => {
                                            const presentation =
                                                apbdesMetricPresentation[
                                                    metric.key
                                                ];
                                            const MetricIcon =
                                                presentation.icon;

                                            return (
                                                <div
                                                    key={metric.label}
                                                    className="border-t-4 border-village-accent bg-white p-6 shadow-sm sm:p-7"
                                                >
                                                    <div className="flex items-start justify-between gap-5">
                                                        <dt className="text-sm font-bold tracking-wide text-village-muted uppercase">
                                                            {metric.label}
                                                        </dt>
                                                        <span
                                                            className={`flex size-11 shrink-0 items-center justify-center rounded-full ${presentation.iconClassName}`}
                                                        >
                                                            <MetricIcon
                                                                aria-hidden="true"
                                                                className="size-5"
                                                            />
                                                        </span>
                                                    </div>
                                                    <dd className="mt-6 text-3xl font-bold tracking-tight text-village-ink sm:text-4xl">
                                                        {metric.value}
                                                    </dd>
                                                    <p className="mt-3 text-sm leading-6 text-village-muted">
                                                        {metric.description}
                                                    </p>
                                                </div>
                                            );
                                        },
                                    )}
                                </dl>

                                <aside className="flex flex-col justify-between bg-village-primary-light p-6 sm:p-8 lg:col-span-4">
                                    <div>
                                        <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                            Realisasi Belanja
                                        </p>
                                        <p className="mt-4 text-5xl font-bold tracking-tight text-village-primary-dark">
                                            {
                                                dummyApbdesSummary.realizationPercentage
                                            }
                                            <span className="text-2xl">%</span>
                                        </p>
                                        <p className="mt-4 leading-7 text-village-primary-dark/75">
                                            {dummyApbdesSummary.realizedAmount}{' '}
                                            telah terealisasi dari pagu{' '}
                                            {dummyApbdesSummary.budgetAmount}.
                                        </p>

                                        <div
                                            role="progressbar"
                                            aria-label={`Realisasi belanja ${dummyApbdesSummary.realizationPercentage} persen`}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={
                                                dummyApbdesSummary.realizationPercentage
                                            }
                                            className="mt-7 h-3 overflow-hidden rounded-full bg-white/80"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="block h-full rounded-full bg-village-primary"
                                                style={{
                                                    width: `${dummyApbdesSummary.realizationPercentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-10 border-t border-village-primary/20 pt-5">
                                        <p className="text-xs font-semibold tracking-wide text-village-primary-dark/60 uppercase">
                                            Pembaruan terakhir
                                        </p>
                                        <p className="mt-1 font-bold text-village-primary-dark">
                                            <time
                                                dateTime={
                                                    dummyApbdesSummary.updatedAt
                                                }
                                            >
                                                {
                                                    dummyApbdesSummary.updatedLabel
                                                }
                                            </time>
                                        </p>
                                    </div>
                                </aside>
                            </div>

                            <div className="mt-5 flex items-start gap-3 border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/75">
                                <Info
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0 text-village-accent"
                                />
                                <p>
                                    <strong className="text-white">
                                        Data simulasi tampilan.
                                    </strong>{' '}
                                    Angka akan diganti setelah data APBDes
                                    diverifikasi oleh Pemerintah Desa
                                    Ngampungan.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section
                        id="potensi"
                        aria-labelledby="potensi-heading"
                        className="scroll-mt-48 overflow-hidden border-b border-village-border bg-white py-16 md:py-24 xl:scroll-mt-32"
                    >
                        <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
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
                        <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
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
                        <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
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
                        className="scroll-mt-20 border-t border-village-border bg-white py-16 md:py-24"
                    >
                        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:px-12">
                            <div>
                                <div className="flex size-12 items-center justify-center rounded-xl bg-village-primary-light text-village-primary">
                                    <MailOpen
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </div>
                                <h2
                                    id="kontak-heading"
                                    className="village-heading-2 mt-6"
                                >
                                    Punya Saran atau Pertanyaan?
                                </h2>
                                <p className="mt-4 text-lg leading-relaxed text-village-muted">
                                    Tinggalkan pesan Anda. Kami senantiasa
                                    berupaya meningkatkan pelayanan untuk
                                    kesejahteraan masyarakat Desa Ngampungan.
                                </p>
                                <div className="mt-8 flex items-center gap-4 font-medium">
                                    <PhoneCall
                                        aria-hidden="true"
                                        className="size-5 text-village-primary"
                                    />
                                    <span>
                                        Call Center: 0812-3456-7890 (WA/Telp)
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-village-border bg-white p-6 shadow-village-soft md:p-8">
                                <form
                                    onSubmit={submitMessage}
                                    className="flex flex-col gap-5"
                                >
                                    <div>
                                        <label
                                            htmlFor="nama"
                                            className="text-sm font-semibold tracking-wide"
                                        >
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            id="nama"
                                            name="nama"
                                            required
                                            className="mt-2 w-full rounded-xl border border-village-border bg-white px-3.5 py-3 transition outline-none focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                            placeholder="Masukkan nama Anda"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="kategori"
                                            className="text-sm font-semibold tracking-wide"
                                        >
                                            Kategori Pesan
                                        </label>
                                        <select
                                            id="kategori"
                                            name="kategori"
                                            className="mt-2 w-full rounded-xl border border-village-border bg-white px-3.5 py-3 transition outline-none focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                        >
                                            <option>Pertanyaan Umum</option>
                                            <option>Pengaduan Layanan</option>
                                            <option>Usulan Pembangunan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="pesan"
                                            className="text-sm font-semibold tracking-wide"
                                        >
                                            Isi Pesan
                                        </label>
                                        <textarea
                                            id="pesan"
                                            name="pesan"
                                            rows={4}
                                            required
                                            className="mt-2 w-full resize-none rounded-xl border border-village-border bg-white px-3.5 py-3 transition outline-none focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                            placeholder="Tuliskan pesan Anda di sini..."
                                        />
                                    </div>
                                    {isMessageSent && (
                                        <p
                                            role="status"
                                            className="rounded-xl bg-village-primary-light px-4 py-3 text-sm text-village-primary-dark"
                                        >
                                            Simulasi berhasil. Pesan belum
                                            dikirim ke server karena endpoint
                                            kontak belum tersedia.
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        className={`${primaryButtonClassName} w-full`}
                                    >
                                        Kirim Pesan
                                        <Send
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-village-primary-dark pt-16 pb-8 text-white/80">
                    <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
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
