import { Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    Camera,
    ChevronRight,
    Expand,
    Images,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageGalleryLightbox } from '@/components/village-gallery-lightbox';
import {
    dummyVillageGalleryCategories,
    dummyVillageGalleryPhotos,
} from '@/lib/dummy-village-gallery';
import type { VillageGalleryPhoto } from '@/lib/dummy-village-gallery';
import { home } from '@/routes';

type GalleryIndexPageProps = {
    canonicalUrl: string;
    dbPhotos?: VillageGalleryPhoto[];
};

export default function GalleryIndex({
    canonicalUrl,
    dbPhotos,
}: GalleryIndexPageProps) {
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedPhoto, setSelectedPhoto] =
        useState<VillageGalleryPhoto | null>(null);

    const photosList = useMemo(() => {
        if (dbPhotos && dbPhotos.length > 0) {
            return dbPhotos;
        }
        return dummyVillageGalleryPhotos;
    }, [dbPhotos]);

    const categoriesList = useMemo(() => {
        const cats = Array.from(new Set(photosList.map((p) => p.category)));
        return ['Semua', ...cats];
    }, [photosList]);

    const featuredPhotos = useMemo(() => {
        const featured = photosList.filter((p) => p.featured);
        return featured.length > 0
            ? featured.slice(0, 3)
            : photosList.slice(0, 3);
    }, [photosList]);

    const visiblePhotos = useMemo(
        () =>
            selectedCategory === 'Semua'
                ? photosList
                : photosList.filter(
                      (photo) => photo.category === selectedCategory,
                  ),
        [selectedCategory, photosList],
    );

    const albumCount = useMemo(
        () => new Set(photosList.map((photo) => photo.album)).size,
        [photosList],
    );
    const pageDescription =
        'Dokumentasi kegiatan, pembangunan, UMKM, alam, dan pertanian Desa Ngampungan.';

    return (
        <PublicPageShell activeSection="gallery">
            <Head>
                <title>Galeri Desa</title>
                <meta
                    head-key="description"
                    name="description"
                    content={pageDescription}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content="Galeri Desa Ngampungan"
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={pageDescription}
                />
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

            {/* LIGHT THEME HERO HEADER */}
            <section className="border-b border-slate-200 bg-white py-12 md:py-18">
                <div className="mx-auto grid max-w-[1280px] gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-12">
                    <div className="max-w-3xl">
                        <nav
                            aria-label="Breadcrumb"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-600"
                        >
                            <Link
                                href={home()}
                                className="transition hover:text-emerald-700"
                            >
                                Beranda
                            </Link>
                            <ChevronRight
                                aria-hidden="true"
                                className="size-3.5 text-slate-400"
                            />
                            <span className="font-bold text-emerald-800">
                                Galeri Desa
                            </span>
                        </nav>

                        <h1 className="mt-6 text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                            Cerita Ngampungan dalam Gambar
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                            Rekam kegiatan warga, hasil pembangunan, potensi
                            UMKM, serta keindahan bentang alam desa yang
                            tersusun dalam koleksi arsip visual resmi.
                        </p>
                    </div>

                    {/* Stats Counter Light Cards */}
                    <dl className="grid min-w-[18rem] grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-xs">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                            <dt className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
                                Koleksi Foto
                            </dt>
                            <dd className="mt-2 text-4xl font-black text-slate-900">
                                {photosList.length}
                            </dd>
                            <span className="mt-1 block text-[11px] text-slate-500">
                                dokumentasi
                            </span>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                            <dt className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
                                Album Desa
                            </dt>
                            <dd className="mt-2 text-4xl font-black text-slate-900">
                                {albumCount}
                            </dd>
                            <span className="mt-1 block text-[11px] text-slate-500">
                                kategori album
                            </span>
                        </div>
                    </dl>
                </div>
            </section>

            {/* FEATURED PHOTO HIGHLIGHTS - LIGHT THEME */}
            <section
                aria-labelledby="sorotan-galeri-heading"
                className="border-b border-slate-200 bg-slate-50/70 py-12 md:py-18"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="flex items-end justify-between gap-5">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-bold tracking-wider text-emerald-900 uppercase">
                                <Camera className="size-3 text-emerald-700" />
                                Sorotan Terbaru
                            </span>
                            <h2
                                id="sorotan-galeri-heading"
                                className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl"
                            >
                                Pilihan Dokumentasi Terbaru
                            </h2>
                        </div>
                        <p className="hidden max-w-md text-right text-xs leading-relaxed text-slate-500 md:block">
                            Klik pada salah satu foto untuk membuka mode
                            tampilan penuh (*lightbox*) dan membaca rincian
                            lengkap dokumentasi.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 md:h-[34rem] md:grid-cols-[1.6fr_1fr] md:grid-rows-2">
                        {featuredPhotos.map((photo, index) => (
                            <button
                                key={photo.id}
                                type="button"
                                onClick={() => setSelectedPhoto(photo)}
                                className={`group relative min-h-64 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-left transition-all duration-300 hover:border-emerald-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
                                    index === 0 ? 'md:row-span-2' : ''
                                }`}
                            >
                                <img
                                    src={photo.image}
                                    alt={photo.alt}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent transition-opacity duration-300"
                                />
                                <span className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-xl bg-white text-slate-800 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100">
                                    <Expand
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </span>
                                <span className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                                    <span className="inline-block rounded-full bg-emerald-700 px-3 py-1 text-[11px] font-bold text-white uppercase shadow-xs">
                                        {photo.category}
                                    </span>
                                    <span className="mt-3 block text-xl font-bold text-white drop-shadow-sm md:text-2xl">
                                        {photo.title}
                                    </span>
                                    <span className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-200">
                                        <CalendarDays className="size-3.5 text-emerald-300" />
                                        {photo.capturedLabel}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FULL PHOTO GALLERY EXPLORER - LIGHT THEME */}
            <section
                aria-labelledby="koleksi-galeri-heading"
                className="bg-white py-12 md:py-18"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <div>
                            <p className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
                                Koleksi Foto
                            </p>
                            <h2
                                id="koleksi-galeri-heading"
                                className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl"
                            >
                                Jelajahi Dokumentasi Desa
                            </h2>
                        </div>

                        {/* Category Selector Pills */}
                        <div
                            role="group"
                            aria-label="Filter kategori galeri"
                            className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2"
                        >
                            {categoriesList.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    aria-pressed={selectedCategory === category}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className={
                                        selectedCategory === category
                                            ? 'rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition'
                                            : 'rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200/60 hover:text-emerald-800'
                                    }
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-5 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-500">
                        <p aria-live="polite">
                            Menampilkan {visiblePhotos.length} dokumentasi foto
                        </p>
                        <span className="hidden items-center gap-2 font-bold text-emerald-800 sm:flex">
                            <Images aria-hidden="true" className="size-4" />
                            <span>Koleksi Terverifikasi</span>
                        </span>
                    </div>

                    {/* Photos Grid */}
                    <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {visiblePhotos.map((photo, index) => (
                            <button
                                key={photo.id}
                                type="button"
                                onClick={() => setSelectedPhoto(photo)}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                            >
                                <span
                                    className={`relative block overflow-hidden bg-slate-100 ${
                                        index % 5 === 0
                                            ? 'aspect-[4/3]'
                                            : 'aspect-[16/11]'
                                    }`}
                                >
                                    <img
                                        src={photo.image}
                                        alt={photo.alt}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-lg bg-white/90 text-emerald-800 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100">
                                        <Expand
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </span>
                                </span>
                                <span className="block p-6">
                                    <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-900 uppercase">
                                        {photo.album}
                                    </span>
                                    <span className="mt-3 block text-lg leading-snug font-bold text-slate-900 transition-colors group-hover:text-emerald-800">
                                        {photo.title}
                                    </span>
                                    <span className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                                        <CalendarDays
                                            aria-hidden="true"
                                            className="size-3.5 text-emerald-700"
                                        />
                                        {photo.capturedLabel}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Bottom Helper Box */}
                    <div className="mt-14 rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-xs leading-relaxed text-amber-900">
                        <p className="flex items-start gap-3">
                            <Camera
                                aria-hidden="true"
                                className="mt-0.5 size-5 shrink-0 text-amber-700"
                            />
                            <span>
                                <strong className="font-bold text-amber-950">
                                    Informasi Dokumentasi Visual Desa
                                    Ngampungan:
                                </strong>{' '}
                                Seluruh dokumentasi foto yang dipublikasikan
                                dalam galeri ini dikelola oleh Pemerintah Desa
                                Ngampungan untuk memberikan gambaran transparan
                                mengenai setiap kegiatan desa dan potensi
                                wilayah.
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <VillageGalleryLightbox
                    photo={selectedPhoto}
                    photos={visiblePhotos}
                    onClose={() => setSelectedPhoto(null)}
                    onNavigate={setSelectedPhoto}
                />
            )}
        </PublicPageShell>
    );
}
