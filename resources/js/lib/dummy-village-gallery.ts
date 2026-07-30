export type VillageGalleryCategory =
    | 'Kegiatan Desa'
    | 'Pembangunan'
    | 'UMKM'
    | 'Alam & Pertanian';

export type VillageGalleryPhoto = {
    id: number;
    title: string;
    caption: string;
    category: VillageGalleryCategory;
    album: string;
    capturedAt: string;
    capturedLabel: string;
    image: string;
    alt: string;
    featured: boolean;
};

export const dummyVillageGalleryPhotos = [
    {
        id: 1,
        title: 'Panen Raya Padi Organik',
        caption:
            'Kebersamaan petani saat panen raya sekaligus evaluasi musim tanam.',
        category: 'Alam & Pertanian',
        album: 'Panen Raya 2026',
        capturedAt: '2026-07-24',
        capturedLabel: '24 Juli 2026',
        image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=1200&q=80',
        alt: 'Petani bekerja di area persawahan saat panen',
        featured: true,
    },
    {
        id: 2,
        title: 'Musyawarah Warga',
        caption:
            'Warga dan pemerintah desa berdiskusi menentukan prioritas pembangunan.',
        category: 'Kegiatan Desa',
        album: 'Musyawarah Desa',
        capturedAt: '2026-07-19',
        capturedLabel: '19 Juli 2026',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        alt: 'Peserta mengikuti pertemuan dan diskusi bersama',
        featured: true,
    },
    {
        id: 3,
        title: 'Perbaikan Jalan Lingkungan',
        caption:
            'Pengerjaan jalan dan saluran air dilakukan bertahap pada titik prioritas.',
        category: 'Pembangunan',
        album: 'Infrastruktur Desa',
        capturedAt: '2026-07-11',
        capturedLabel: '11 Juli 2026',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
        alt: 'Pekerja menyelesaikan proyek infrastruktur',
        featured: true,
    },
    {
        id: 4,
        title: 'Produk Anyaman Bambu',
        caption:
            'Koleksi produk kerajinan warga yang dipasarkan ke luar daerah.',
        category: 'UMKM',
        album: 'Produk Warga',
        capturedAt: '2026-07-08',
        capturedLabel: '8 Juli 2026',
        image: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=1200&q=80',
        alt: 'Kerajinan anyaman berbahan alami',
        featured: false,
    },
    {
        id: 5,
        title: 'Pelayanan Posyandu',
        caption:
            'Pemeriksaan rutin tumbuh kembang dan konsultasi kesehatan keluarga.',
        category: 'Kegiatan Desa',
        album: 'Pelayanan Kesehatan',
        capturedAt: '2026-07-05',
        capturedLabel: '5 Juli 2026',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        alt: 'Tenaga kesehatan memberikan pelayanan kepada warga',
        featured: false,
    },
    {
        id: 6,
        title: 'Lahan Pertanian Desa',
        caption:
            'Hamparan lahan produktif yang menjadi salah satu penopang ekonomi warga.',
        category: 'Alam & Pertanian',
        album: 'Bentang Ngampungan',
        capturedAt: '2026-06-29',
        capturedLabel: '29 Juni 2026',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
        alt: 'Hamparan lahan pertanian hijau',
        featured: false,
    },
    {
        id: 7,
        title: 'Pelatihan Pemasaran Digital',
        caption:
            'Pelaku UMKM belajar memotret produk dan menyusun katalog digital.',
        category: 'UMKM',
        album: 'Pemberdayaan UMKM',
        capturedAt: '2026-06-25',
        capturedLabel: '25 Juni 2026',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
        alt: 'Kelompok usaha mengikuti pelatihan digital',
        featured: false,
    },
    {
        id: 8,
        title: 'Kerja Bakti Saluran Air',
        caption:
            'Gotong royong warga membersihkan saluran untuk menjaga aliran air.',
        category: 'Kegiatan Desa',
        album: 'Gotong Royong',
        capturedAt: '2026-06-20',
        capturedLabel: '20 Juni 2026',
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
        alt: 'Warga bekerja bersama dalam kegiatan sosial',
        featured: false,
    },
    {
        id: 9,
        title: 'Pembangunan Drainase',
        caption:
            'Peningkatan drainase lingkungan untuk mengurangi genangan saat hujan.',
        category: 'Pembangunan',
        album: 'Infrastruktur Desa',
        capturedAt: '2026-06-14',
        capturedLabel: '14 Juni 2026',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        alt: 'Pekerjaan konstruksi infrastruktur',
        featured: false,
    },
    {
        id: 10,
        title: 'Olahan Pangan Lokal',
        caption:
            'Produk pangan rumahan warga dikemas untuk memperluas jangkauan pasar.',
        category: 'UMKM',
        album: 'Produk Warga',
        capturedAt: '2026-06-08',
        capturedLabel: '8 Juni 2026',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
        alt: 'Beragam produk makanan tersaji di atas meja',
        featured: false,
    },
    {
        id: 11,
        title: 'Irigasi Menjelang Musim Tanam',
        caption:
            'Pengecekan aliran irigasi bersama kelompok tani sebelum masa tanam.',
        category: 'Alam & Pertanian',
        album: 'Pertanian Desa',
        capturedAt: '2026-05-30',
        capturedLabel: '30 Mei 2026',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        alt: 'Lanskap pertanian dengan cahaya pagi',
        featured: false,
    },
    {
        id: 12,
        title: 'Pentas Seni Pemuda',
        caption:
            'Ruang kreativitas pemuda desa melalui pertunjukan musik dan seni.',
        category: 'Kegiatan Desa',
        album: 'Kegiatan Pemuda',
        capturedAt: '2026-05-21',
        capturedLabel: '21 Mei 2026',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        alt: 'Pertunjukan seni dan musik di ruang terbuka',
        featured: false,
    },
] satisfies readonly VillageGalleryPhoto[];

export const featuredDummyVillageGalleryPhotos =
    dummyVillageGalleryPhotos.filter((photo) => photo.featured);

export const dummyVillageGalleryCategories = [
    'Semua',
    'Kegiatan Desa',
    'Pembangunan',
    'UMKM',
    'Alam & Pertanian',
] as const;
