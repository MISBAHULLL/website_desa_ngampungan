import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronDown,
    Loader2,
    MapPin,
    Menu,
    PhoneCall,
    Search,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { home } from '@/routes';
import { index as agendasIndex } from '@/routes/agendas';
import { index as announcementsIndex } from '@/routes/announcements';
import { index as galleryIndex } from '@/routes/gallery';
import { index as governmentIndex } from '@/routes/government';
import { index as newsIndex } from '@/routes/news';
import { index as potentialsIndex } from '@/routes/potentials';
import { index as villageProfileIndex } from '@/routes/profile';
import { track as trackServiceApplication } from '@/routes/service-applications';
import { index as servicesIndex } from '@/routes/services';
import { index as transparencyIndex } from '@/routes/transparency';
import { PageTransition } from '@/components/animations/page-transition';

type PublicSection =
    | 'government'
    | 'profile'
    | 'news'
    | 'announcements'
    | 'agenda'
    | 'gallery'
    | 'services'
    | 'transparency'
    | 'potentials';

const profileLinks = [
    {
        label: 'Selayang Pandang',
        description: 'Identitas dan gambaran umum desa.',
        href: `${villageProfileIndex()}#selayang-pandang`,
    },
    {
        label: 'Visi dan Misi',
        description: 'Arah pembangunan Desa Ngampungan.',
        href: `${villageProfileIndex()}#visi-misi`,
    },
    {
        label: 'Sejarah Desa',
        description: 'Perjalanan dan rekam sejarah desa.',
        href: `${villageProfileIndex()}#sejarah-desa`,
    },
    {
        label: 'Data Wilayah',
        description: 'Demografi, dusun, lahan, dan peta desa.',
        href: `${villageProfileIndex()}#data-wilayah`,
    },
] as const;

function PublicProfileNavigation({
    activeSection,
}: {
    activeSection: PublicSection;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const isActive = activeSection === 'profile';

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsOpen(false);
                }
            }}
        >
            <Link
                href={villageProfileIndex()}
                aria-expanded={isOpen}
                aria-controls="public-profile-menu"
                onFocus={() => setIsOpen(true)}
                className={
                    isActive
                        ? 'flex min-h-10 items-center gap-1.5 rounded-xl bg-village-primary-light px-4 py-2.5 text-sm font-bold text-village-primary-dark'
                        : 'flex min-h-10 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:bg-village-surface-muted hover:text-village-ink'
                }
            >
                Profil
                <ChevronDown
                    aria-hidden="true"
                    className={`size-3.5 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </Link>

            {isOpen && (
                <div
                    id="public-profile-menu"
                    className="absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 pt-2"
                    onMouseEnter={() => setIsOpen(true)}
                >
                    <div className="rounded-2xl border border-village-border bg-white p-2 shadow-village-floating">
                        {profileLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="group block rounded-xl p-3 transition hover:bg-village-primary-light focus-visible:bg-village-primary-light focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                            >
                                <span className="block text-sm font-bold text-village-ink group-hover:text-village-primary-dark">
                                    {link.label}
                                </span>
                                <span className="mt-0.5 block text-xs leading-5 text-village-muted">
                                    {link.description}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const informationLinks = [
    {
        label: 'Berita',
        description: 'Kabar dan artikel terbaru desa.',
        href: newsIndex(),
        section: 'news',
    },
    {
        label: 'Pengumuman',
        description: 'Pemberitahuan resmi untuk warga.',
        href: announcementsIndex(),
        section: 'announcements',
    },
    {
        label: 'Agenda',
        description: 'Jadwal kegiatan dan pelayanan.',
        href: agendasIndex(),
        section: 'agenda',
    },
    {
        label: 'Galeri',
        description: 'Dokumentasi visual Desa Ngampungan.',
        href: galleryIndex(),
        section: 'gallery',
    },
] as const;

function PublicInformationNavigation({
    activeSection,
}: {
    activeSection: PublicSection;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const isActive = informationLinks.some(
        (link) => link.section === activeSection,
    );

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsOpen(false);
                }
            }}
        >
            <button
                type="button"
                aria-expanded={isOpen}
                aria-controls="public-information-menu"
                onFocus={() => setIsOpen(true)}
                onClick={() => setIsOpen((open) => !open)}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        setIsOpen(false);
                        event.currentTarget.focus();
                    }
                }}
                className={
                    isActive
                        ? 'flex min-h-10 items-center gap-1.5 rounded-xl bg-village-primary-light px-4 py-2.5 text-sm font-bold text-village-primary-dark'
                        : 'flex min-h-10 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:bg-village-surface-muted hover:text-village-ink'
                }
            >
                Informasi
                <ChevronDown
                    aria-hidden="true"
                    className={`size-3.5 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div
                    id="public-information-menu"
                    className="absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 pt-2"
                    onMouseEnter={() => setIsOpen(true)}
                >
                    <div className="rounded-2xl border border-village-border bg-white p-2 shadow-village-floating">
                        {informationLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="group block rounded-xl p-3 transition hover:bg-village-primary-light focus-visible:bg-village-primary-light focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                            >
                                <span className="block text-sm font-bold text-village-ink group-hover:text-village-primary-dark">
                                    {link.label}
                                </span>
                                <span className="mt-0.5 block text-xs leading-5 text-village-muted">
                                    {link.description}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function PublicPageShell({
    activeSection,
    children,
}: {
    activeSection: PublicSection;
    children: ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', () => setIsNavigating(true));
        const removeFinish = router.on('finish', () => setIsNavigating(false));
        const removeCancel = router.on('cancel', () => setIsNavigating(false));

        return () => {
            removeStart();
            removeFinish();
            removeCancel();
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-village-canvas text-village-ink">
            {/* Top Skeleton Progress Bar for Inertia Navigation / Network Lag */}
            <AnimatePresence>
                {isNavigating && (
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-0 right-0 left-0 z-[100] h-1 origin-left bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 shadow-md shadow-emerald-500/30"
                    />
                )}
            </AnimatePresence>

            {/* Skeleton Loading Indicator Toast overlay during navigation lag */}
            <AnimatePresence>
                {isNavigating && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-4 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-2 text-xs font-extrabold text-emerald-950 shadow-2xl backdrop-blur-md"
                    >
                        <Loader2 className="size-4 animate-spin text-emerald-600" />
                        <span>Memuat data halaman...</span>
                        <Skeleton className="h-2 w-12 rounded-full" />
                    </motion.div>
                )}
            </AnimatePresence>

            <a
                href="#main-content"
                className="sr-only z-[100] rounded-xl bg-white px-4 py-3 font-semibold text-village-primary shadow-lg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
            >
                Lewati ke konten utama
            </a>

            <div className="bg-village-primary-dark text-white">
                <div className="mx-auto flex min-h-10 max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-2 text-xs lg:px-12">
                    <span className="flex items-center gap-2">
                        <MapPin
                            aria-hidden="true"
                            className="size-3.5 text-village-accent"
                        />
                        Jl. JOBRANTI NO.01 DESA NGAMPUNGAN, Bareng, Jombang
                    </span>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <span className="flex items-center gap-2">
                            <PhoneCall
                                aria-hidden="true"
                                className="size-3.5 text-village-accent"
                            />
                            0815-5652-3279
                        </span>
                        <Link
                            href={trackServiceApplication()}
                            className="flex items-center gap-2 font-bold text-white transition hover:text-village-accent"
                        >
                            <Search
                                aria-hidden="true"
                                className="size-3.5 text-village-accent"
                            />
                            Lacak Pengajuan
                        </Link>
                    </div>
                </div>
            </div>

            <header className="sticky top-0 z-50 border-b border-village-border bg-white/95 shadow-sm backdrop-blur-xl">
                <div className="mx-auto flex min-h-20 max-w-[1280px] items-center justify-between gap-5 px-5 lg:px-12">
                    <Link
                        href={home()}
                        className="flex items-center gap-3 rounded-xl focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                    >
                        <img
                            src="/assets/logo_kabupaten_jombang.png"
                            alt="Logo Kabupaten Jombang"
                            className="h-11 w-9 object-contain"
                        />
                        <span className="text-base leading-tight font-bold sm:text-lg">
                            Desa <br /> Ngampungan
                        </span>
                    </Link>

                    <nav
                        aria-label="Navigasi halaman publik"
                        className="hidden items-center gap-2 lg:flex"
                    >
                        <PublicProfileNavigation
                            activeSection={activeSection}
                        />
                        <Link
                            href={governmentIndex()}
                            className={
                                activeSection === 'government'
                                    ? 'rounded-xl bg-village-primary-light px-4 py-2.5 text-sm font-bold text-village-primary-dark'
                                    : 'rounded-xl px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:bg-village-surface-muted hover:text-village-ink'
                            }
                        >
                            Pemerintahan
                        </Link>
                        <Link
                            href={servicesIndex()}
                            className={
                                activeSection === 'services'
                                    ? 'rounded-xl bg-village-primary-light px-4 py-2.5 text-sm font-bold text-village-primary-dark'
                                    : 'rounded-xl px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:bg-village-surface-muted hover:text-village-ink'
                            }
                        >
                            Layanan
                        </Link>
                        <PublicInformationNavigation
                            activeSection={activeSection}
                        />
                        <Link
                            href={transparencyIndex()}
                            className={
                                activeSection === 'transparency'
                                    ? 'rounded-xl bg-village-primary-light px-4 py-2.5 text-sm font-bold text-village-primary-dark'
                                    : 'rounded-xl px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:bg-village-surface-muted hover:text-village-ink'
                            }
                        >
                            Transparansi
                        </Link>
                        <Link
                            href={potentialsIndex()}
                            className={
                                activeSection === 'potentials'
                                    ? 'rounded-xl bg-village-primary-light px-4 py-2.5 text-sm font-bold text-village-primary-dark'
                                    : 'rounded-xl px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:bg-village-surface-muted hover:text-village-ink'
                            }
                        >
                            Potensi Desa
                        </Link>
                        <Link
                            href={home()}
                            className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-xl border border-village-border px-4 py-2.5 text-sm font-semibold transition hover:border-village-primary hover:text-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Kembali ke Beranda
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen((open) => !open)}
                            aria-label={
                                isMobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'
                            }
                            className="flex size-11 items-center justify-center rounded-xl border border-village-border text-village-ink transition hover:border-village-primary hover:bg-village-primary-light"
                        >
                            {isMobileMenuOpen ? (
                                <X className="size-5 text-village-primary" />
                            ) : (
                                <Menu className="size-5 text-village-primary" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer Navigation Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            aria-label="Navigasi Seluler"
                            className="overflow-hidden border-t border-village-border bg-white px-5 py-6 shadow-xl lg:hidden"
                        >
                            <div className="flex flex-col gap-2">
                                <Link
                                    href={villageProfileIndex()}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold ${
                                        activeSection === 'profile'
                                            ? 'bg-village-primary-light text-village-primary-dark'
                                            : 'text-village-ink hover:bg-village-surface-muted'
                                    }`}
                                >
                                    <span>Profil Desa</span>
                                </Link>

                                <Link
                                    href={governmentIndex()}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold ${
                                        activeSection === 'government'
                                            ? 'bg-village-primary-light text-village-primary-dark'
                                            : 'text-village-ink hover:bg-village-surface-muted'
                                    }`}
                                >
                                    <span>Pemerintahan</span>
                                </Link>

                                <Link
                                    href={servicesIndex()}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold ${
                                        activeSection === 'services'
                                            ? 'bg-village-primary-light text-village-primary-dark'
                                            : 'text-village-ink hover:bg-village-surface-muted'
                                    }`}
                                >
                                    <span>Layanan Publik</span>
                                </Link>

                                <Link
                                    href={newsIndex()}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold ${
                                        activeSection === 'news'
                                            ? 'bg-village-primary-light text-village-primary-dark'
                                            : 'text-village-ink hover:bg-village-surface-muted'
                                    }`}
                                >
                                    <span>Berita & Informasi</span>
                                </Link>

                                <Link
                                    href={transparencyIndex()}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold ${
                                        activeSection === 'transparency'
                                            ? 'bg-village-primary-light text-village-primary-dark'
                                            : 'text-village-ink hover:bg-village-surface-muted'
                                    }`}
                                >
                                    <span>Transparansi APBDes</span>
                                </Link>

                                <Link
                                    href={potentialsIndex()}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold ${
                                        activeSection === 'potentials'
                                            ? 'bg-village-primary-light text-village-primary-dark'
                                            : 'text-village-ink hover:bg-village-surface-muted'
                                    }`}
                                >
                                    <span>Potensi Desa</span>
                                </Link>

                                <div className="my-2 border-t border-village-border" />

                                <Link
                                    href={home()}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-village-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm"
                                >
                                    <ArrowLeft className="size-4" />
                                    <span>Kembali ke Beranda</span>
                                </Link>
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>

            <main id="main-content">
                <PageTransition>{children}</PageTransition>
            </main>

            <footer className="bg-village-primary-dark text-white/80">
                <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-5 py-8 text-xs sm:flex-row sm:items-center lg:px-12 2xl:max-w-[1536px]">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/logo_kabupaten_jombang.png"
                            alt="Logo Kabupaten Jombang"
                            className="h-9 w-7.5 shrink-0 object-contain"
                        />
                        <div>
                            <p className="text-sm font-extrabold text-white">
                                Pemerintah Desa Ngampungan
                            </p>
                            <p className="text-[11px] text-white/70">
                                Kecamatan Bareng, Kabupaten Jombang
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-white/90">
                        <Link
                            href={villageProfileIndex()}
                            className="transition-colors hover:text-village-accent"
                        >
                            Profil
                        </Link>
                        <Link
                            href={governmentIndex()}
                            className="transition-colors hover:text-village-accent"
                        >
                            Pemerintahan
                        </Link>
                        <Link
                            href={servicesIndex()}
                            className="transition-colors hover:text-village-accent"
                        >
                            Layanan
                        </Link>
                        <Link
                            href={transparencyIndex()}
                            className="transition-colors hover:text-village-accent"
                        >
                            Transparansi
                        </Link>
                        <Link
                            href={newsIndex()}
                            className="transition-colors hover:text-village-accent"
                        >
                            Berita
                        </Link>
                        <Link
                            href={potentialsIndex()}
                            className="transition-colors hover:text-village-accent"
                        >
                            Potensi Desa
                        </Link>
                    </div>
                </div>

                <div className="border-t border-white/10 py-3.5 text-center text-[11px] text-white/60">
                    © 2026 Pemerintah Desa Ngampungan. Seluruh Hak Cipta
                    Dilindungi.
                </div>
            </footer>
        </div>
    );
}
