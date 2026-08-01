import React, { useEffect, useRef, useState } from 'react';
import {
    Compass,
    ExternalLink,
    Download,
    MapPin,
    Building2,
    Home,
    Landmark,
    Sparkles,
    Layers,
    RotateCcw,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface MapPOI {
    id: string;
    title: string;
    category: 'pemerintahan' | 'dusun' | 'fasum' | 'potensi';
    categoryLabel: string;
    lat: number;
    lng: number;
    address: string;
    description: string;
    color: string;
}

interface VillageGeospatialMapProps {
    latitude?: number | null;
    longitude?: number | null;
    zoom?: number | null;
    googleUrl?: string | null;
    hdFileUrl?: string | null;
}

const DEFAULT_LAT = -7.6749;
const DEFAULT_LNG = 112.3385;
const DEFAULT_ZOOM = 15;

const villagePOIs: MapPOI[] = [
    {
        id: 'kantor-desa',
        title: 'Kantor Desa Ngampungan',
        category: 'pemerintahan',
        categoryLabel: 'Pusat Pemerintahan',
        lat: -7.6749,
        lng: 112.3385,
        address: 'Jl. Raya Desa Ngampungan No. 01, Bareng, Jombang',
        description:
            'Pusat administrasi, pelayanan publik, dan aula musyawarah warga Desa Ngampungan.',
        color: '#1f7350', // village-primary
    },
    {
        id: 'dusun-ngampungan',
        title: 'Wilayah Dusun Ngampungan',
        category: 'dusun',
        categoryLabel: 'Dusun (4 RW · 12 RT)',
        lat: -7.673,
        lng: 112.335,
        address: 'Dusun Ngampungan, Desa Ngampungan',
        description:
            'Pusat pemukiman utama, pertanian produktif, dan layanan administratif terpadu.',
        color: '#059669', // emerald
    },
    {
        id: 'dusun-sumberdadi',
        title: 'Wilayah Dusun Sumberdadi',
        category: 'dusun',
        categoryLabel: 'Dusun (3 RW · 10 RT)',
        lat: -7.671,
        lng: 112.342,
        address: 'Dusun Sumberdadi, Desa Ngampungan',
        description:
            'Kawasan lahan pertanian hortikultura, perkebunan, dan peternakan warga.',
        color: '#d97706', // amber
    },
    {
        id: 'dusun-wungurejo',
        title: 'Wilayah Dusun Wungurejo',
        category: 'dusun',
        categoryLabel: 'Dusun (3 RW · 8 RT)',
        lat: -7.678,
        lng: 112.341,
        address: 'Dusun Wungurejo, Desa Ngampungan',
        description:
            'Sentra UMKM lokal, perikanan darat, dan area hijau pemukiman.',
        color: '#2563eb', // blue
    },
    {
        id: 'poskesdes',
        title: 'Poskesdes & Puskesmas Pembantu',
        category: 'fasum',
        categoryLabel: 'Fasilitas Kesehatan',
        lat: -7.6742,
        lng: 112.3392,
        address: 'Kompleks Balai Desa Ngampungan',
        description:
            'Layanan kesehatan masyarakat dasar, Posyandu balita & lansia berkala.',
        color: '#0d9488', // teal
    },
    {
        id: 'sentra-umkm',
        title: 'Sentra Olahan & Potensi Desa',
        category: 'potensi',
        categoryLabel: 'Potensi & Ekonomi',
        lat: -7.6765,
        lng: 112.3365,
        address: 'Dusun Ngampungan RT 04 / RW 02',
        description:
            'Pusat produksi dan galeri kerajinan serta produk olahan pangan lokal warga.',
        color: '#7c3aed', // purple
    },
];

type CategoryFilter = 'all' | 'pemerintahan' | 'dusun' | 'fasum' | 'potensi';

export function VillageGeospatialMap({
    latitude,
    longitude,
    zoom,
    googleUrl,
    hdFileUrl,
}: VillageGeospatialMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
    const [selectedPoi, setSelectedPoi] = useState<MapPOI | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    const centerLat = latitude ?? DEFAULT_LAT;
    const centerLng = longitude ?? DEFAULT_LNG;
    const initialZoom = zoom ?? DEFAULT_ZOOM;
    const directGoogleUrl =
        googleUrl || `https://maps.google.com/?q=${centerLat},${centerLng}`;

    // Dynamic Leaflet Map Initialization
    useEffect(() => {
        if (!mapContainerRef.current) return;

        let isMounted = true;

        // Dynamically import Leaflet to avoid SSR window errors
        import('leaflet').then((L) => {
            if (!isMounted || !mapContainerRef.current) return;

            // Fix default marker icon issues in Webpack/Vite
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl:
                    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl:
                    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl:
                    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Initialize Map Instance if not already created
            if (!mapInstanceRef.current) {
                const map = L.map(mapContainerRef.current, {
                    center: [centerLat, centerLng],
                    zoom: initialZoom,
                    scrollWheelZoom: false,
                    zoomControl: false,
                });

                // OpenStreetMap Tile Layer
                L.tileLayer(
                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        maxZoom: 19,
                        attribution:
                            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    },
                ).addTo(map);

                // Add zoom control to top right
                L.control.zoom({ position: 'topright' }).addTo(map);

                mapInstanceRef.current = map;
                setIsMapReady(true);
            }
        });

        return () => {
            isMounted = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [centerLat, centerLng, initialZoom]);

    // Update Markers when Filter or Map Ready changes
    useEffect(() => {
        if (!mapInstanceRef.current || !isMapReady) return;

        import('leaflet').then((L) => {
            const map = mapInstanceRef.current;

            // Clear previous markers
            markersRef.current.forEach((m) => m.remove());
            markersRef.current = [];

            const filteredPois =
                activeFilter === 'all'
                    ? villagePOIs
                    : villagePOIs.filter((p) => p.category === activeFilter);

            filteredPois.forEach((poi) => {
                // Custom Colored SVG Marker Pin
                const customIcon = L.divIcon({
                    className: 'custom-leaflet-marker',
                    html: `
                        <div style="background-color: ${poi.color};" class="relative flex size-9 items-center justify-center rounded-full text-white shadow-xl ring-4 ring-white transition-transform duration-300 hover:scale-125">
                            <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                    `,
                    iconSize: [36, 36],
                    iconAnchor: [18, 36],
                    popupAnchor: [0, -32],
                });

                const popupContent = `
                    <div class="p-1 max-w-[240px]">
                        <span class="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-md" style="background-color: ${poi.color};">
                            ${poi.categoryLabel}
                        </span>
                        <h4 class="mt-1.5 text-sm font-extrabold text-slate-900 leading-snug">${poi.title}</h4>
                        <p class="mt-1 text-xs text-slate-600 leading-relaxed">${poi.description}</p>
                        <p class="mt-2 text-[11px] font-semibold text-slate-400 border-t border-slate-100 pt-1.5">${poi.address}</p>
                        <a href="https://maps.google.com/?q=${poi.lat},${poi.lng}" target="_blank" rel="noopener noreferrer" class="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800">
                            Petunjuk Rute Google Maps &rarr;
                        </a>
                    </div>
                `;

                const marker = L.marker([poi.lat, poi.lng], {
                    icon: customIcon,
                })
                    .addTo(map)
                    .bindPopup(popupContent);

                marker.on('click', () => {
                    setSelectedPoi(poi);
                });

                markersRef.current.push(marker);
            });
        });
    }, [activeFilter, isMapReady]);

    const handleFocusPoi = (poi: MapPOI) => {
        setSelectedPoi(poi);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([poi.lat, poi.lng], 17, {
                duration: 1.2,
            });
            // Open popup for corresponding marker
            const targetMarker = markersRef.current.find(
                (m) =>
                    m.getLatLng().lat === poi.lat &&
                    m.getLatLng().lng === poi.lng,
            );
            if (targetMarker) {
                targetMarker.openPopup();
            }
        }
    };

    const handleResetView = () => {
        setSelectedPoi(null);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([centerLat, centerLng], initialZoom, {
                duration: 1,
            });
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Main Interactive Map Card */}
            <div className="flex flex-col rounded-3xl border border-village-border/80 bg-white p-5 shadow-sm sm:p-6 lg:col-span-8">
                {/* Header Controls & Category Filters */}
                <div className="flex flex-col gap-4 border-b border-village-border/60 pb-5">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="flex size-2 animate-pulse rounded-full bg-emerald-500" />
                                <p className="text-xs font-bold tracking-wider text-village-primary uppercase">
                                    Sistem Informasi Geospasial Live
                                </p>
                            </div>
                            <h4 className="mt-0.5 text-xl font-extrabold text-village-ink">
                                Peta Interaktif Desa Ngampungan
                            </h4>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleResetView}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-village-border/80 bg-village-surface-muted/60 px-3 py-1.5 text-xs font-bold text-village-ink transition-all hover:bg-village-primary hover:text-white"
                                title="Reset Tampilan Peta"
                            >
                                <RotateCcw className="size-3.5" />
                                Reset
                            </button>

                            <a
                                href={directGoogleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-village-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-village-primary-dark"
                            >
                                <ExternalLink className="size-3.5" />
                                Google Maps
                            </a>
                        </div>
                    </div>

                    {/* Filter Category Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="mr-1 flex items-center gap-1 text-xs font-bold text-village-muted">
                            <Layers className="size-3.5 text-village-primary" />{' '}
                            Filter:
                        </span>
                        {[
                            { key: 'all', label: 'Semua Titik' },
                            { key: 'pemerintahan', label: 'Pemerintahan' },
                            { key: 'dusun', label: 'Dusun' },
                            { key: 'fasum', label: 'Fasilitas Umum' },
                            { key: 'potensi', label: 'Potensi & UMKM' },
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                type="button"
                                onClick={() =>
                                    setActiveFilter(
                                        filter.key as CategoryFilter,
                                    )
                                }
                                className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                                    activeFilter === filter.key
                                        ? 'bg-village-primary-dark text-white shadow-xs'
                                        : 'bg-village-surface-muted/80 text-village-ink hover:bg-village-primary-light/60 hover:text-village-primary-dark'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leaflet Map Canvas Container */}
                <div className="relative mt-4 h-[420px] w-full overflow-hidden rounded-2xl border border-village-border/60 bg-slate-100 shadow-inner">
                    <div ref={mapContainerRef} className="z-10 h-full w-full" />

                    {/* North Compass Badge Overlay */}
                    <div className="pointer-events-none absolute right-4 bottom-4 z-20 flex flex-col items-center rounded-2xl bg-white/90 p-2.5 shadow-lg ring-1 ring-black/5 backdrop-blur-md">
                        <Compass className="animate-spin-slow size-6 text-village-primary" />
                        <span className="mt-1 text-[10px] font-extrabold text-village-primary-dark uppercase">
                            U
                        </span>
                    </div>

                    {/* Active Selected POI Banner Overlay */}
                    {selectedPoi && (
                        <div className="absolute top-4 right-14 left-4 z-20 animate-in rounded-2xl border border-village-border/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-md fade-in slide-in-from-top-2">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span
                                        className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
                                        style={{
                                            backgroundColor: selectedPoi.color,
                                        }}
                                    >
                                        {selectedPoi.categoryLabel}
                                    </span>
                                    <h5 className="mt-1 text-sm font-extrabold text-village-ink">
                                        {selectedPoi.title}
                                    </h5>
                                    <p className="mt-0.5 text-xs text-village-muted">
                                        {selectedPoi.address}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPoi(null)}
                                    className="text-xs font-extrabold text-village-muted hover:text-village-ink"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Helper Info & HD Download */}
                <div className="mt-4 flex flex-col justify-between gap-3 border-t border-village-border/60 pt-4 sm:flex-row sm:items-center">
                    <p className="text-xs font-semibold text-village-muted">
                        * Peta dapat digeser dan diperbesar untuk melihat detail
                        fasilitas desa.
                    </p>

                    {hdFileUrl ? (
                        <a
                            href={hdFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-village-primary hover:underline"
                        >
                            <Download className="size-3.5" />
                            Unduh Peta Resmi HD (PDF/Gambar)
                        </a>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-village-muted">
                            <Download className="size-3.5 text-village-primary" />
                            Peta HD Geospasial Resmi (Tersedia di CMS)
                        </span>
                    )}
                </div>
            </div>

            {/* Right Side POI Directory & Legend - Soft Green Styling */}
            <aside className="flex flex-col justify-between rounded-3xl border border-emerald-200/80 bg-[#ecf6f0] p-6 text-village-ink shadow-sm lg:col-span-4 lg:p-7">
                <div>
                    <div className="flex items-center gap-3 border-b border-emerald-200/60 pb-4">
                        <span className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-xs">
                            <Compass className="size-5" />
                        </span>
                        <div>
                            <h4 className="text-lg font-extrabold text-emerald-950">
                                Titik Lokasi
                            </h4>
                            <p className="text-xs font-medium text-emerald-800/80">
                                Klik lokasi untuk melihat di peta
                            </p>
                        </div>
                    </div>

                    {/* POIs List with Ultra-Thin Soft Animated Scrollbar */}
                    <div className="mt-5 max-h-[380px] space-y-2.5 overflow-y-auto pr-1.5 transition-all duration-300 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-400/50 hover:[&::-webkit-scrollbar-thumb]:bg-emerald-600/70 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-emerald-100/60">
                        {villagePOIs.map((poi) => {
                            const isSelected = selectedPoi?.id === poi.id;

                            return (
                                <button
                                    key={poi.id}
                                    type="button"
                                    onClick={() => handleFocusPoi(poi)}
                                    className={`w-full rounded-2xl px-4 py-3.5 text-left transition-all duration-300 ${
                                        isSelected
                                            ? 'scale-[1.01] bg-emerald-800 text-white shadow-md ring-2 ring-emerald-600/30'
                                            : 'border border-emerald-100 bg-white/80 text-slate-800 hover:border-emerald-300 hover:bg-white hover:shadow-xs'
                                    }`}
                                >
                                    <div>
                                        <p
                                            className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-emerald-950'}`}
                                        >
                                            {poi.title}
                                        </p>
                                        <p
                                            className={`mt-0.5 text-[11px] leading-relaxed ${isSelected ? 'text-emerald-100' : 'font-medium text-emerald-700/80'}`}
                                        >
                                            {poi.categoryLabel}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 border-t border-emerald-200/60 pt-4 text-xs leading-relaxed font-medium text-emerald-900/80">
                    <p className="mb-0.5 font-extrabold text-emerald-950">
                        Tips Navigasi
                    </p>
                    Gunakan kursor atau sentuhan jari pada layar ponsel untuk
                    menggeser wilayah dan melihat titik batas administratif Desa
                    Ngampungan.
                </div>
            </aside>
        </div>
    );
}
