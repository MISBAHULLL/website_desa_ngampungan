import { Link } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Clock3,
    ExternalLink,
    MapPin,
    Navigation,
    PackageOpen,
    PhoneCall,
    Sparkles,
    UserRound,
    X,
} from 'lucide-react';
import { useEffect } from 'react';
import { PotentialCategoryIcon } from '@/components/potential-category-icon';
import { findVillagePotentialCategory } from '@/lib/dummy-village-potentials';
import type { VillagePotentialEntry } from '@/lib/dummy-village-potentials';
import { show as potentialShow } from '@/routes/potentials';

type VillagePotentialDetailModalProps = {
    entry: VillagePotentialEntry | null;
    onClose: () => void;
};

export function VillagePotentialDetailModal({
    entry,
    onClose,
}: VillagePotentialDetailModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (entry) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [entry, onClose]);

    if (!entry) return null;

    const category = findVillagePotentialCategory(entry.category);

    // OpenStreetMap Embed URL using exact entry coordinates
    const lat = entry.map.latitude;
    const lon = entry.map.longitude;
    const bboxDelta = 0.006;
    const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - bboxDelta}%2C${lat - bboxDelta}%2C${lon + bboxDelta}%2C${lat + bboxDelta}&layer=mapnik&marker=${lat}%2C${lon}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="potential-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Wide Rectangular Modal Container */}
            <div
                className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] border border-white/50 bg-white shadow-2xl transition-all duration-300 transform flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button (Floating Top-Right over entire modal) */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup modal"
                    className="absolute top-4 right-4 z-30 flex size-10 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-md transition hover:bg-black/70 hover:scale-105 active:scale-95"
                >
                    <X className="size-5" />
                </button>

                {/* Main Scrollable Area */}
                <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                    
                    {/* Top Section: Natural Proportion Banner Image */}
                    <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden bg-gray-100 shrink-0">
                        <img
                            src={entry.image}
                            alt={entry.imageAlt}
                            className="size-full object-cover object-center transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/25" />

                        {/* Floating Category Badge Pill (Top-Left) */}
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 rounded-full border border-white/40 bg-white/95 px-4 py-2 text-xs font-bold text-gray-900 shadow-md backdrop-blur-md">
                            <PotentialCategoryIcon
                                category={entry.category}
                                className="size-4 shrink-0 object-contain"
                            />
                            <span>{category.label}</span>
                        </div>

                        {/* Title Overlay inside Banner Bottom */}
                        <div className="absolute bottom-5 left-5 right-5 z-10 text-white space-y-1.5">
                            <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles className="size-3.5" />
                                {category.eyebrow}
                            </p>
                            <h2
                                id="potential-modal-title"
                                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-sm"
                            >
                                {entry.name}
                            </h2>
                        </div>
                    </div>

                    {/* Content Body with Generous Section Padding & Spacing */}
                    <div className="p-6 sm:p-8 space-y-8">

                        {/* Section 1: Header Meta Bar (Aligned Owner & Location) */}
                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-gray-700 border-b border-gray-100 pb-5">
                            <div className="flex items-center gap-2 rounded-xl bg-gray-50/90 px-4 py-2.5 border border-gray-200/80 shadow-2xs">
                                <UserRound className="size-4 text-village-primary shrink-0" />
                                <span className="text-gray-500">{entry.managerLabel}:</span>
                                <strong className="text-gray-900 font-bold">{entry.managerName}</strong>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl bg-gray-50/90 px-4 py-2.5 border border-gray-200/80 shadow-2xs">
                                <MapPin className="size-4 text-village-primary shrink-0" />
                                <span className="text-gray-500">Lokasi:</span>
                                <strong className="text-gray-900 font-bold">{entry.address}</strong>
                            </div>
                        </div>

                        {/* Section 2: Description Section */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Tentang Usaha / Potensi
                            </h3>
                            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-gray-700">
                                {entry.description.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: Pure Plain Stat Row (Thick Vertical Lines) */}
                        <div className="py-2 border-y border-gray-100">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0 py-2">
                                {/* Section 3.1: Pemilik Usaha */}
                                <div className="sm:flex-1 sm:pr-8 flex flex-col space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                                        <UserRound className="size-4" />
                                        {entry.managerLabel}
                                    </span>
                                    <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">
                                        {entry.managerName}
                                    </p>
                                </div>

                                {/* Thick Vertical Divider 1 */}
                                <div className="hidden sm:block h-12 w-0.5 bg-gray-300/80 shrink-0 self-center" />

                                {/* Section 3.2: Jam Operasional */}
                                <div className="sm:flex-1 sm:px-8 flex flex-col space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                                        <Clock3 className="size-4" />
                                        Jam Operasional
                                    </span>
                                    <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">
                                        {entry.openingHours}
                                    </p>
                                </div>

                                {/* Thick Vertical Divider 2 */}
                                <div className="hidden sm:block h-12 w-0.5 bg-gray-300/80 shrink-0 self-center" />

                                {/* Section 3.3: Total Pilihan */}
                                <div className="sm:flex-1 sm:pl-8 flex flex-col space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                                        <PackageOpen className="size-4" />
                                        Total Pilihan
                                    </span>
                                    <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">
                                        {entry.offerings.length} Produk / Layanan
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Products / Offerings (Clean Grid without Bullet Dots) */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900">
                                    <PackageOpen className="size-4 text-village-primary" />
                                    Produk & Layanan Unggulan
                                </h3>
                                <span className="text-xs font-semibold text-gray-400">
                                    {entry.offerings.length} Tersedia
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {entry.offerings.map((offering) => (
                                    <div
                                        key={offering.name}
                                        className="group rounded-2xl border border-gray-100 bg-gray-50/80 p-4 transition-all hover:border-village-primary/30 hover:bg-white hover:shadow-md"
                                    >
                                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-village-primary transition-colors">
                                            {offering.name}
                                        </h4>
                                        <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
                                            {offering.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 5: Tags */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            {entry.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Section 6: Real Interactive Map (Zoom in/out, Pan, Google Maps Link) */}
                        <div className="rounded-3xl border border-gray-200/80 bg-gray-50/60 p-5 sm:p-6 space-y-4 shadow-2xs">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900">
                                        <Navigation className="size-4 text-village-primary" />
                                        Peta Lokasi Real Usaha
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {entry.address} (Geser & Zoom untuk navigasi peta)
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 border border-gray-200 shadow-2xs hover:bg-emerald-50 transition"
                                    >
                                        <span>Buka Google Maps</span>
                                        <ExternalLink className="size-3.5" />
                                    </a>
                                </div>
                            </div>

                            {/* Real OpenStreetMap Interactive iFrame */}
                            <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-inner">
                                <iframe
                                    title={`Peta Lokasi ${entry.name}`}
                                    src={osmEmbedUrl}
                                    className="size-full border-0"
                                    loading="lazy"
                                    allowFullScreen
                                />
                            </div>
                        </div>

                        {/* Section 7: Footer Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-2xs">
                                    <PhoneCall className="size-5" />
                                </span>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Kontak Pengelola
                                    </p>
                                    <p className="text-xs sm:text-sm font-bold text-gray-900">
                                        {entry.phoneLabel}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Link
                                    href={potentialShow(entry.slug)}
                                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
                                >
                                    <span>Buka Halaman Penuh</span>
                                    <ExternalLink className="size-4 text-gray-400" />
                                </Link>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-full bg-village-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-village-primary-dark transition hover:shadow-lg active:scale-95"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
