import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    ChevronDown,
    CircleAlert,
    Clock3,
    Facebook,
    FileText,
    FolderOpen,
    Instagram,
    LogIn,
    Mail,
    MailOpen,
    MapPin,
    Menu,
    PhoneCall,
    PlayCircle,
    Send,
    Sprout,
    Users,
    X,
    Youtube,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { dashboard, login } from '@/routes';

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
                href: '#profil',
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
                href: '#berita',
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
                href: '#layanan',
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
                href: '#profil',
            },
            {
                label: 'Pertanian',
                description: 'Komoditas dan kegiatan pertanian desa.',
                href: '#profil',
            },
            {
                label: 'Wisata',
                description: 'Destinasi dan daya tarik lokal.',
                href: '#profil',
            },
            {
                label: 'Potensi Lainnya',
                description: 'Sumber daya unggulan lainnya.',
                href: '#profil',
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

const villageStatistics = [
    {
        label: 'Populasi',
        value: '3.420',
        suffix: '+',
        description: 'Jiwa terdaftar',
    },
    {
        label: 'Luas Wilayah',
        value: '450',
        suffix: 'ha',
        description: 'Sebagian besar persawahan',
    },
    {
        label: 'Prestasi',
        value: '12',
        description: 'Penghargaan tingkat kabupaten',
    },
    {
        label: 'UMKM',
        value: '85',
        suffix: '+',
        description: 'Usaha warga aktif',
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

const newsItems = [
    {
        category: 'Pertanian',
        categoryClassName: 'text-village-primary',
        date: '12 Agustus 2026',
        title: 'Panen Raya Padi Organik Kelompok Tani “Maju Makmur” Capai Target',
        excerpt:
            'Keberhasilan implementasi pupuk organik mandiri tahun ini terbukti meningkatkan hasil panen gabah kering hingga 20% dibandingkan musim sebelumnya.',
        image: 'https://images.unsplash.com/photo-1590059346282-3f136e053912?q=80&w=1000&auto=format&fit=crop',
        alt: 'Petani saat panen raya di area persawahan',
    },
    {
        category: 'Kesehatan',
        categoryClassName: 'text-village-info',
        date: '05 Agustus 2026',
        title: 'Program Posyandu Lansia Rutin Digelar, Pantau Kesehatan Mandiri',
        excerpt:
            'Pemerintah desa bekerja sama dengan Puskesmas setempat kembali mengadakan cek kesehatan gratis khusus untuk warga lansia di balai desa.',
        image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=1000&auto=format&fit=crop',
        alt: 'Kegiatan pelayanan kesehatan masyarakat desa',
    },
    {
        category: 'UMKM & Budaya',
        categoryClassName: 'text-village-secondary',
        date: '28 Juli 2026',
        title: 'Pengrajin Bambu Ngampungan Tembus Pasar Ekspor Kerajinan',
        excerpt:
            'Inovasi desain yang menggabungkan motif tradisional dan kebutuhan modern membuat kerajinan lokal ini diminati konsumen luar daerah.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
        alt: 'Produk kerajinan lokal untuk pasar ekspor',
    },
] as const;

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
    const portalHref = auth.user ? dashboard() : login();

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
                                        href="#layanan"
                                        className={`${primaryButtonClassName} shadow-village-floating`}
                                    >
                                        Akses Layanan
                                        <ChevronDown
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </a>
                                    <button
                                        type="button"
                                        disabled
                                        title="Video profil akan segera tersedia"
                                        className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white/80 backdrop-blur-md"
                                    >
                                        <PlayCircle
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                        Video Profil
                                    </button>
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
                            <h2 id="profil-heading" className="sr-only">
                                Profil singkat Desa Ngampungan
                            </h2>
                            <div className="grid grid-cols-2 gap-6 rounded-3xl border border-village-border bg-white p-6 shadow-village-soft md:grid-cols-4 md:gap-0 md:p-10">
                                {villageStatistics.map((statistic, index) => (
                                    <div
                                        key={statistic.label}
                                        className={`${index >= 2 ? 'border-t pt-6 md:border-t-0 md:pt-0' : ''} ${index > 0 ? 'md:border-l md:pl-8' : ''} border-village-border text-center md:text-left`}
                                    >
                                        <p className="text-xs font-semibold tracking-wide text-village-muted uppercase sm:text-sm">
                                            {statistic.label}
                                        </p>
                                        <p className="mt-1 text-3xl font-bold text-village-primary-dark md:text-4xl">
                                            {statistic.value}
                                            {'suffix' in statistic &&
                                                statistic.suffix && (
                                                    <span className="text-xl text-village-accent md:text-2xl">
                                                        {statistic.suffix}
                                                    </span>
                                                )}
                                        </p>
                                        <p className="mt-1 text-xs text-village-muted">
                                            {statistic.description}
                                        </p>
                                    </div>
                                ))}
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
                                    className="group flex min-h-80 flex-col justify-between rounded-3xl bg-village-primary-light p-6 transition hover:-translate-y-1 hover:bg-[#c9ebd8] focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none md:col-span-2 md:p-8 lg:col-span-2"
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

                                {services.map((service) => {
                                    const Icon = service.icon;

                                    return (
                                        <Link
                                            key={service.title}
                                            href={portalHref}
                                            className="group flex min-h-64 flex-col justify-between rounded-3xl border border-village-border bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-village-primary hover:shadow-village-soft focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none"
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

                                <Link
                                    href={portalHref}
                                    className="group flex items-center justify-between gap-6 rounded-3xl border border-village-border bg-white p-6 transition-colors hover:border-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none md:col-span-2 md:p-8 lg:col-span-3"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-village-surface-muted">
                                            <FolderOpen
                                                aria-hidden="true"
                                                className="size-7 text-village-primary"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">
                                                Transparansi Dana Desa
                                            </h3>
                                            <p className="mt-1 text-sm text-village-muted md:text-base">
                                                Akses laporan realisasi APBDes
                                                tahun berjalan secara terbuka.
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="hidden size-6 shrink-0 text-village-primary transition-transform group-hover:translate-x-2 sm:block"
                                    />
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section
                        id="berita"
                        aria-labelledby="berita-heading"
                        className="scroll-mt-20 bg-village-surface-muted py-16 md:py-24"
                    >
                        <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                <div className="max-w-xl">
                                    <h2
                                        id="berita-heading"
                                        className="village-heading-2"
                                    >
                                        Kabar & Potensi Desa
                                    </h2>
                                    <p className="mt-4 text-lg text-village-muted">
                                        Berita terkini, agenda warga, dan cerita
                                        lokal dari Ngampungan.
                                    </p>
                                </div>
                                <a
                                    href="#berita"
                                    className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center rounded-xl border border-village-border px-5 py-3 font-semibold transition hover:border-village-ink hover:bg-white focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    Lihat Semua Kabar
                                </a>
                            </div>

                            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                                {newsItems.map((newsItem) => (
                                    <article
                                        key={newsItem.title}
                                        className="group overflow-hidden rounded-3xl border border-village-border bg-white transition-shadow hover:shadow-village-soft"
                                    >
                                        <div className="relative aspect-4/3 overflow-hidden">
                                            <img
                                                src={newsItem.image}
                                                alt={newsItem.alt}
                                                loading="lazy"
                                                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div
                                                className={`absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur ${newsItem.categoryClassName}`}
                                            >
                                                {newsItem.category}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-xs text-village-muted">
                                                <CalendarDays
                                                    aria-hidden="true"
                                                    className="size-4"
                                                />
                                                <time>{newsItem.date}</time>
                                            </div>
                                            <h3 className="mt-3 text-xl leading-snug font-bold transition-colors group-hover:text-village-primary">
                                                <a
                                                    href="#berita"
                                                    className="focus-visible:underline focus-visible:outline-none"
                                                >
                                                    {newsItem.title}
                                                </a>
                                            </h3>
                                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-village-muted">
                                                {newsItem.excerpt}
                                            </p>
                                        </div>
                                    </article>
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
