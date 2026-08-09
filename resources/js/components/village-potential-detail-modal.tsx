import { AnimatePresence, motion } from 'framer-motion';
import {
    Clock3,
    ExternalLink,
    Eye,
    MapPin,
    Navigation,
    PackageOpen,
    PhoneCall,
    Sparkles,
    UserRound,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { PotentialCategoryIcon } from '@/components/potential-category-icon';
import { findVillagePotentialCategory } from '@/lib/dummy-village-potentials';
import type {
    VillagePotentialEntry,
    VillagePotentialOffering,
} from '@/lib/dummy-village-potentials';

type VillagePotentialDetailModalProps = {
    entry: VillagePotentialEntry | null;
    onClose: () => void;
};

export function VillagePotentialDetailModal({
    entry,
    onClose,
}: VillagePotentialDetailModalProps) {
    const [selectedProduct, setSelectedProduct] =
        useState<VillagePotentialOffering | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedProduct) {
                    setSelectedProduct(null);
                } else {
                    onClose();
                }
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
    }, [entry, onClose, selectedProduct]);

    const category = entry
        ? findVillagePotentialCategory(entry.category)
        : null;

    // OpenStreetMap Embed URL using exact entry coordinates
    const lat = entry?.map.latitude ?? 0;
    const lon = entry?.map.longitude ?? 0;
    const bboxDelta = 0.006;
    const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - bboxDelta}%2C${lat - bboxDelta}%2C${lon + bboxDelta}%2C${lat + bboxDelta}&layer=mapnik&marker=${lat}%2C${lon}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

    return (
        <AnimatePresence>
            {entry && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="potential-modal-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-md sm:p-6"
                    onClick={onClose}
                >
                    {/* Wide Rectangular Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 12 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-white/50 bg-white shadow-2xl transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button (Floating Top-Right over entire modal) */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Tutup modal"
                            className="absolute top-4 right-4 z-30 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/70 active:scale-95"
                        >
                            <X className="size-5" />
                        </button>

                        {/* Main Scrollable Area */}
                        <div className="flex-1 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
                            {/* Top Section: Banner Image */}
                            <div className="relative h-64 w-full shrink-0 overflow-hidden bg-gray-100 sm:h-72 md:h-80">
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
                                    <span>{category?.label}</span>
                                </div>

                                {/* Title Overlay inside Banner Bottom */}
                                <div className="absolute right-5 bottom-5 left-5 z-10 space-y-1.5 text-white">
                                    <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-emerald-300 uppercase">
                                        <Sparkles className="size-3.5" />
                                        {category?.eyebrow}
                                    </p>
                                    <h2
                                        id="potential-modal-title"
                                        className="text-2xl leading-tight font-extrabold text-white drop-shadow-sm sm:text-3xl md:text-4xl"
                                    >
                                        {entry.name}
                                    </h2>
                                </div>
                            </div>

                            {/* Content Body with Generous Section Padding & Spacing */}
                            <div className="space-y-8 p-6 sm:p-8">
                                {/* Section 1: Header Meta Bar (Aligned Owner & Location) */}
                                <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 pb-5 text-xs font-medium text-gray-700 sm:text-sm">
                                    <div className="flex items-center gap-2 rounded-xl border border-gray-200/80 bg-gray-50/90 px-4 py-2.5 shadow-2xs">
                                        <UserRound className="size-4 shrink-0 text-village-primary" />
                                        <span className="text-gray-500">
                                            {entry.managerLabel}:
                                        </span>
                                        <strong className="font-bold text-gray-900">
                                            {entry.managerName}
                                        </strong>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-xl border border-gray-200/80 bg-gray-50/90 px-4 py-2.5 shadow-2xs">
                                        <MapPin className="size-4 shrink-0 text-village-primary" />
                                        <span className="text-gray-500">
                                            Lokasi:
                                        </span>
                                        <strong className="font-bold text-gray-900">
                                            {entry.address}
                                        </strong>
                                    </div>
                                </div>

                                {/* Section 2: Description Section */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                                        Tentang Usaha / Potensi
                                    </h3>
                                    <div className="space-y-3 text-xs leading-relaxed text-gray-700 sm:text-sm">
                                        {entry.description.map(
                                            (paragraph, index) => (
                                                <p key={index}>{paragraph}</p>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Section 3: Pure Plain Stat Row (Thick Vertical Lines) */}
                                <div className="border-y border-gray-100 py-2">
                                    <div className="flex flex-col items-start justify-between gap-6 py-2 sm:flex-row sm:items-center sm:gap-0">
                                        {/* Section 3.1: Pemilik Usaha */}
                                        <div className="flex flex-col space-y-1 sm:flex-1 sm:pr-8">
                                            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                                <UserRound className="size-4" />
                                                {entry.managerLabel}
                                            </span>
                                            <p className="text-base leading-tight font-extrabold text-gray-900 sm:text-lg">
                                                {entry.managerName}
                                            </p>
                                        </div>

                                        {/* Thick Vertical Divider 1 */}
                                        <div className="hidden h-12 w-0.5 shrink-0 self-center bg-gray-300/80 sm:block" />

                                        {/* Section 3.2: Jam Operasional */}
                                        <div className="flex flex-col space-y-1 sm:flex-1 sm:px-8">
                                            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-700 uppercase">
                                                <Clock3 className="size-4" />
                                                Jam Operasional
                                            </span>
                                            <p className="text-base leading-tight font-extrabold text-gray-900 sm:text-lg">
                                                {entry.openingHours}
                                            </p>
                                        </div>

                                        {/* Thick Vertical Divider 2 */}
                                        <div className="hidden h-12 w-0.5 shrink-0 self-center bg-gray-300/80 sm:block" />

                                        {/* Section 3.3: Total Pilihan */}
                                        <div className="flex flex-col space-y-1 sm:flex-1 sm:pl-8">
                                            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-amber-700 uppercase">
                                                <PackageOpen className="size-4" />
                                                Total Pilihan
                                            </span>
                                            <p className="text-base leading-tight font-extrabold text-gray-900 sm:text-lg">
                                                {entry.offerings.length} Produk
                                                / Layanan
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Products & Offerings (Interactive Cards with Photo Zoom) */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-gray-900 uppercase">
                                                <PackageOpen className="size-4 text-village-primary" />
                                                Produk & Layanan Unggulan
                                            </h3>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Klik pada produk untuk melihat
                                                pratinjau foto
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-400">
                                            {entry.offerings.length} Pilihan
                                        </span>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {entry.offerings.map((offering) => {
                                            const productImg =
                                                offering.image || entry.image;

                                            return (
                                                <button
                                                    type="button"
                                                    key={offering.name}
                                                    onClick={() =>
                                                        setSelectedProduct(
                                                            offering,
                                                        )
                                                    }
                                                    className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-3.5 text-left transition-all hover:border-village-primary/40 hover:bg-white hover:shadow-md"
                                                >
                                                    {/* Thumbnail Image */}
                                                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                                                        <img
                                                            src={productImg}
                                                            alt={offering.name}
                                                            className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                            <Eye className="size-5" />
                                                        </div>
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <h4 className="truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-village-primary">
                                                                {offering.name}
                                                            </h4>
                                                            <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                                                Foto
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-600">
                                                            {
                                                                offering.description
                                                            }
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
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
                                <div className="space-y-4 rounded-3xl border border-gray-200/80 bg-gray-50/60 p-5 shadow-2xs sm:p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-gray-900 uppercase">
                                                <Navigation className="size-4 text-village-primary" />
                                                Peta Lokasi Real Usaha
                                            </h3>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {entry.address} (Geser & Zoom
                                                untuk navigasi peta)
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={googleMapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-2xs transition hover:bg-emerald-50"
                                            >
                                                <span>Buka Google Maps</span>
                                                <ExternalLink className="size-3.5" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Real OpenStreetMap Interactive iFrame */}
                                    <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-inner sm:h-80">
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
                                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                                Kontak Pengelola
                                            </p>
                                            <p className="text-xs font-bold text-gray-900 sm:text-sm">
                                                {entry.phoneLabel}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="cursor-pointer rounded-full bg-village-primary px-7 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-village-primary-dark hover:shadow-lg active:scale-95"
                                    >
                                        Tutup Modal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Nested Product Image Lightbox Modal */}
            {selectedProduct && entry && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    onClick={() => setSelectedProduct(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/40 bg-white p-5 shadow-2xl sm:p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Lightbox Button */}
                        <button
                            type="button"
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                        >
                            <X className="size-5" />
                        </button>

                        {/* Product Large Image */}
                        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-gray-100">
                            <img
                                src={selectedProduct.image || entry.image}
                                alt={selectedProduct.name}
                                className="size-full object-cover"
                            />
                        </div>

                        {/* Product Detail Info */}
                        <div className="mt-4 space-y-1.5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {selectedProduct.name}
                                </h3>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                                    {entry.name}
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                                {selectedProduct.description}
                            </p>
                        </div>

                        {/* Close Action */}
                        <div className="mt-5 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                className="cursor-pointer rounded-full bg-gray-900 px-6 py-2 text-xs font-bold text-white transition hover:bg-gray-800"
                            >
                                Tutup Pratinjau
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
