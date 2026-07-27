import { Link } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, MapPin, PhoneCall } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { home } from '@/routes';
import { index as agendasIndex } from '@/routes/agendas';
import { index as announcementsIndex } from '@/routes/announcements';
import { index as galleryIndex } from '@/routes/gallery';
import { index as governmentIndex } from '@/routes/government';
import { index as newsIndex } from '@/routes/news';
import { index as potentialsIndex } from '@/routes/potentials';
import { index as villageProfileIndex } from '@/routes/profile';
import { index as servicesIndex } from '@/routes/services';
import { index as transparencyIndex } from '@/routes/transparency';

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
                    <div className="border border-village-border bg-white p-2 shadow-village-floating">
                        {informationLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="group flex items-start gap-3 p-3 transition hover:bg-village-primary-light focus-visible:bg-village-primary-light focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                            >
                                <span
                                    aria-hidden="true"
                                    className="mt-2 size-1.5 shrink-0 rounded-full bg-village-accent transition-transform group-hover:scale-125"
                                />
                                <span>
                                    <span className="block text-sm font-bold text-village-ink">
                                        {link.label}
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-5 text-village-muted">
                                        {link.description}
                                    </span>
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
    return (
        <div className="min-h-screen bg-village-canvas text-village-ink">
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
                        Jl. Raya Ngampungan No. 1, Bareng, Jombang
                    </span>
                    <span className="flex items-center gap-2">
                        <PhoneCall
                            aria-hidden="true"
                            className="size-3.5 text-village-accent"
                        />
                        0812-3456-7890
                    </span>
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
                        <Link
                            href={villageProfileIndex()}
                            className={
                                activeSection === 'profile'
                                    ? 'rounded-xl bg-village-primary-light px-4 py-2.5 text-sm font-bold text-village-primary-dark'
                                    : 'rounded-xl px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:bg-village-surface-muted hover:text-village-ink'
                            }
                        >
                            Profil
                        </Link>
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

                    <Link
                        href={home()}
                        aria-label="Kembali ke Beranda"
                        className="flex size-11 items-center justify-center rounded-xl border border-village-border text-village-primary transition hover:border-village-primary hover:bg-village-primary-light focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none lg:hidden"
                    >
                        <ArrowLeft aria-hidden="true" className="size-4" />
                    </Link>
                </div>
            </header>

            <main id="main-content">{children}</main>

            <footer className="border-t border-village-border bg-white">
                <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-4 px-5 py-8 text-sm text-village-muted sm:flex-row sm:items-center lg:px-12">
                    <p>
                        © 2026 Pemerintah Desa Ngampungan. Data konten masih
                        berupa dummy frontend.
                    </p>
                    <div className="flex flex-wrap items-center gap-5">
                        <Link
                            href={villageProfileIndex()}
                            className="hover:text-village-primary"
                        >
                            Profil
                        </Link>
                        <Link
                            href={governmentIndex()}
                            className="hover:text-village-primary"
                        >
                            Pemerintahan
                        </Link>
                        <Link
                            href={servicesIndex()}
                            className="hover:text-village-primary"
                        >
                            Layanan
                        </Link>
                        <Link
                            href={newsIndex()}
                            className="hover:text-village-primary"
                        >
                            Berita
                        </Link>
                        <Link
                            href={announcementsIndex()}
                            className="hover:text-village-primary"
                        >
                            Pengumuman
                        </Link>
                        <Link
                            href={agendasIndex()}
                            className="hover:text-village-primary"
                        >
                            Agenda
                        </Link>
                        <Link
                            href={galleryIndex()}
                            className="hover:text-village-primary"
                        >
                            Galeri
                        </Link>
                        <Link
                            href={transparencyIndex()}
                            className="hover:text-village-primary"
                        >
                            Transparansi
                        </Link>
                        <Link
                            href={potentialsIndex()}
                            className="hover:text-village-primary"
                        >
                            Potensi Desa
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
