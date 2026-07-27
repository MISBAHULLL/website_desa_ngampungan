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
    featuredDummyVillageGalleryPhotos,
} from '@/lib/dummy-village-gallery';
import type { VillageGalleryPhoto } from '@/lib/dummy-village-gallery';
import { home } from '@/routes';

type GalleryIndexPageProps = {
    canonicalUrl: string;
};

export default function GalleryIndex({ canonicalUrl }: GalleryIndexPageProps) {
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedPhoto, setSelectedPhoto] =
        useState<VillageGalleryPhoto | null>(null);

    const visiblePhotos = useMemo(
        () =>
            selectedCategory === 'Semua'
                ? dummyVillageGalleryPhotos
                : dummyVillageGalleryPhotos.filter(
                      (photo) => photo.category === selectedCategory,
                  ),
        [selectedCategory],
    );

    const albumCount = new Set(
        dummyVillageGalleryPhotos.map((photo) => photo.album),
    ).size;
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

            <section className="border-b border-village-border bg-white">
                <div className="mx-auto max-w-[1280px] px-5 py-12 md:py-18 lg:px-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-2 text-sm text-village-muted"
                    >
                        <Link
                            href={home()}
                            className="transition hover:text-village-primary"
                        >
                            Beranda
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-4 text-village-border"
                        />
                        <span className="font-semibold text-village-ink">
                            Galeri Desa
                        </span>
                    </nav>

                    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold tracking-[0.2em] text-village-primary uppercase">
                                Dokumentasi Desa
                            </p>
                            <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
                                Cerita Ngampungan dalam Gambar
                            </h1>
                            <p className="mt-5 text-base leading-7 text-village-muted md:text-lg">
                                Rekam kegiatan warga, pembangunan, potensi
                                usaha, serta bentang alam desa yang tersusun
                                dalam koleksi visual.
                            </p>
                        </div>
                        <dl className="grid grid-cols-2 border border-village-border">
                            <div className="border-r border-village-border p-5">
                                <dt className="text-xs tracking-[0.12em] text-village-muted uppercase">
                                    Foto
                                </dt>
                                <dd className="mt-2 text-3xl font-bold">
                                    {dummyVillageGalleryPhotos.length}
                                </dd>
                            </div>
                            <div className="p-5">
                                <dt className="text-xs tracking-[0.12em] text-village-muted uppercase">
                                    Album
                                </dt>
                                <dd className="mt-2 text-3xl font-bold">
                                    {albumCount}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="sorotan-galeri-heading"
                className="bg-village-primary-dark py-12 text-white md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="flex items-end justify-between gap-5">
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-village-accent uppercase">
                                Sorotan Dokumentasi
                            </p>
                            <h2
                                id="sorotan-galeri-heading"
                                className="mt-2 text-3xl font-bold tracking-tight"
                            >
                                Pilihan Terbaru
                            </h2>
                        </div>
                        <p className="hidden max-w-md text-right text-sm leading-6 text-white/60 md:block">
                            Klik gambar untuk melihat ukuran besar dan
                            keterangan dokumentasi.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-3 md:h-[32rem] md:grid-cols-[1.6fr_1fr] md:grid-rows-2">
                        {featuredDummyVillageGalleryPhotos.map(
                            (photo, index) => (
                                <button
                                    key={photo.id}
                                    type="button"
                                    onClick={() => setSelectedPhoto(photo)}
                                    className={`group relative min-h-64 overflow-hidden text-left focus-visible:ring-2 focus-visible:ring-village-accent focus-visible:ring-offset-4 focus-visible:ring-offset-village-primary-dark focus-visible:outline-none ${
                                        index === 0 ? 'md:row-span-2' : ''
                                    }`}
                                >
                                    <img
                                        src={photo.image}
                                        alt={photo.alt}
                                        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent"
                                    />
                                    <span className="absolute top-4 right-4 flex size-10 items-center justify-center bg-white/90 text-village-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                        <Expand
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </span>
                                    <span className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                                        <span className="text-[0.68rem] font-bold tracking-[0.13em] text-village-accent uppercase">
                                            {photo.category}
                                        </span>
                                        <span className="mt-2 block text-xl font-bold md:text-2xl">
                                            {photo.title}
                                        </span>
                                    </span>
                                </button>
                            ),
                        )}
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="koleksi-galeri-heading"
                className="py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                Koleksi Foto
                            </p>
                            <h2
                                id="koleksi-galeri-heading"
                                className="mt-2 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Jelajahi Dokumentasi
                            </h2>
                        </div>

                        <div
                            role="group"
                            aria-label="Filter kategori galeri"
                            className="flex flex-wrap gap-2"
                        >
                            {dummyVillageGalleryCategories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    aria-pressed={selectedCategory === category}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className={
                                        selectedCategory === category
                                            ? 'min-h-11 bg-village-primary px-4 py-2.5 text-sm font-bold text-white'
                                            : 'min-h-11 border border-village-border bg-white px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:border-village-primary hover:text-village-primary'
                                    }
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-5 border-y border-village-border py-4 text-sm text-village-muted">
                        <p aria-live="polite">
                            {visiblePhotos.length} foto ditampilkan
                        </p>
                        <span className="hidden items-center gap-2 sm:flex">
                            <Images aria-hidden="true" className="size-4" />
                            Data simulasi frontend
                        </span>
                    </div>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {visiblePhotos.map((photo, index) => (
                            <button
                                key={photo.id}
                                type="button"
                                onClick={() => setSelectedPhoto(photo)}
                                className="group overflow-hidden border border-village-border bg-white text-left transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-village-primary/35 hover:shadow-village-soft focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-4 focus-visible:outline-none motion-reduce:transform-none motion-reduce:transition-none"
                            >
                                <span
                                    className={`relative block overflow-hidden ${
                                        index % 5 === 0
                                            ? 'aspect-[4/3]'
                                            : 'aspect-[16/11]'
                                    }`}
                                >
                                    <img
                                        src={photo.image}
                                        alt={photo.alt}
                                        loading="lazy"
                                        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                                    />
                                    <span className="absolute top-3 right-3 flex size-10 items-center justify-center bg-white/90 text-village-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                        <Expand
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </span>
                                </span>
                                <span className="block p-5">
                                    <span className="text-[0.68rem] font-bold tracking-[0.12em] text-village-primary uppercase">
                                        {photo.album}
                                    </span>
                                    <span className="mt-2 block text-lg leading-tight font-bold text-village-ink">
                                        {photo.title}
                                    </span>
                                    <span className="mt-3 flex items-center gap-2 text-xs text-village-muted">
                                        <CalendarDays
                                            aria-hidden="true"
                                            className="size-3.5"
                                        />
                                        {photo.capturedLabel}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-village-accent-light mt-12 border border-village-accent/40 px-5 py-4 text-sm leading-6 text-village-muted">
                        <p className="flex items-start gap-3">
                            <Camera
                                aria-hidden="true"
                                className="mt-0.5 size-5 shrink-0 text-village-secondary"
                            />
                            <span>
                                <strong className="text-village-ink">
                                    Seluruh foto masih berupa simulasi tampilan.
                                </strong>{' '}
                                Dokumentasi resmi nantinya perlu dilengkapi
                                sumber, izin publikasi, dan teks alternatif yang
                                sesuai isi foto.
                            </span>
                        </p>
                    </div>
                </div>
            </section>

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
