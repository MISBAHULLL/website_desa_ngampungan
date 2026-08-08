export type NewsArticle = {
    slug: string;
    title: string;
    excerpt: string;
    content: readonly string[];
    category: string;
    author: string;
    publishedAt: string;
    publishedLabel: string;
    image: string;
    alt: string;
    video?: string | null;
    videoUrl?: string | null;
    featured: boolean;
};

export type AnnouncementPriority = 'normal' | 'important' | 'emergency';
export type AnnouncementStatus = 'active' | 'archived';

export type Announcement = {
    id: number;
    title: string;
    summary: string;
    priority: AnnouncementPriority;
    status: AnnouncementStatus;
    pinned: boolean;
    startsAt: string;
    endsAt?: string | null;
    periodLabel: string;
};

export const dummyNewsArticles = [
    {
        slug: 'panen-raya-padi-organik-capai-target',
        title: 'Panen Raya Padi Organik Kelompok Tani Maju Makmur Capai Target',
        excerpt:
            'Penerapan pupuk organik mandiri membantu petani meningkatkan hasil panen sekaligus menjaga kualitas tanah.',
        content: [
            'Kelompok Tani Maju Makmur melaksanakan panen raya padi organik bersama Pemerintah Desa Ngampungan. Hasil ubinan sementara menunjukkan peningkatan dibandingkan musim tanam sebelumnya.',
            'Program ini akan dilanjutkan dengan evaluasi biaya produksi, penguatan lumbung pangan, dan pendampingan pemasaran agar manfaatnya dapat dirasakan lebih banyak keluarga petani.',
            'Pemerintah desa mengapresiasi kerja sama petani, penyuluh, dan seluruh warga yang menjaga saluran irigasi serta mendukung penggunaan bahan pertanian yang lebih ramah lingkungan.',
        ],
        category: 'Pertanian',
        author: 'Admin Desa',
        publishedAt: '2026-07-24',
        publishedLabel: '24 Juli 2026',
        image: 'https://images.unsplash.com/photo-1590059346282-3f136e053912?q=80&w=1400&auto=format&fit=crop',
        alt: 'Petani saat panen raya di area persawahan',
        featured: true,
    },
    {
        slug: 'posyandu-lansia-rutin-digelar',
        title: 'Program Posyandu Lansia Rutin Digelar untuk Memantau Kesehatan',
        excerpt:
            'Pemerintah desa dan puskesmas kembali membuka pemeriksaan kesehatan dasar bagi warga lanjut usia.',
        content: [
            'Kegiatan Posyandu Lansia dilaksanakan di balai desa dengan layanan pemeriksaan tekanan darah, gula darah, konsultasi gizi, dan edukasi penggunaan obat.',
            'Warga lanjut usia dan pendamping keluarga diimbau membawa buku kesehatan agar petugas dapat memantau perubahan kondisi pada setiap kunjungan.',
        ],
        category: 'Kesehatan',
        author: 'Kader Kesehatan Desa',
        publishedAt: '2026-07-20',
        publishedLabel: '20 Juli 2026',
        image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=1400&auto=format&fit=crop',
        alt: 'Kegiatan pelayanan kesehatan masyarakat desa',
        featured: false,
    },
    {
        slug: 'pengrajin-bambu-tembus-pasar-luar-daerah',
        title: 'Pengrajin Bambu Ngampungan Tembus Pasar Luar Daerah',
        excerpt:
            'Inovasi desain yang memadukan motif tradisional dan kebutuhan modern memperluas pasar kerajinan warga.',
        content: [
            'Pelaku UMKM kerajinan bambu Desa Ngampungan mulai menerima pesanan rutin dari beberapa kota di Jawa Timur. Produk yang diminati antara lain keranjang penyimpanan, kap lampu, dan perlengkapan dekorasi.',
            'Pemerintah desa menyiapkan pelatihan foto produk dan pencatatan keuangan sederhana agar usaha warga dapat berkembang secara berkelanjutan.',
        ],
        category: 'UMKM & Budaya',
        author: 'Tim Informasi Desa',
        publishedAt: '2026-07-16',
        publishedLabel: '16 Juli 2026',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1400&auto=format&fit=crop',
        alt: 'Produk kerajinan lokal berbahan alami',
        featured: false,
    },
    {
        slug: 'perbaikan-jalan-lingkungan-dusun-baru',
        title: 'Perbaikan Jalan Lingkungan Dusun Dimulai Secara Bertahap',
        excerpt:
            'Pekerjaan difokuskan pada titik jalan yang rusak dan saluran air yang sering meluap saat hujan.',
        content: [
            'Pemerintah Desa Ngampungan memulai perbaikan jalan lingkungan berdasarkan hasil musyawarah desa dan pemetaan kondisi lapangan.',
            'Warga diminta memperhatikan rambu sementara serta menggunakan jalur alternatif pada jam pekerjaan berlangsung.',
        ],
        category: 'Pembangunan',
        author: 'Pemerintah Desa',
        publishedAt: '2026-07-11',
        publishedLabel: '11 Juli 2026',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop',
        alt: 'Pekerjaan perbaikan infrastruktur jalan',
        featured: false,
    },
    {
        slug: 'pelatihan-pemasaran-digital-umkm',
        title: 'Pelatihan Pemasaran Digital untuk Pelaku UMKM Desa',
        excerpt:
            'Pelaku usaha belajar menyusun katalog, memotret produk, dan melayani pelanggan melalui kanal digital.',
        content: [
            'Pelatihan pemasaran digital diikuti oleh pelaku usaha makanan, kerajinan, dan jasa dari beberapa dusun di Desa Ngampungan.',
            'Materi difokuskan pada praktik sederhana yang dapat langsung diterapkan dengan telepon seluler dan koneksi internet yang tersedia.',
        ],
        category: 'UMKM & Budaya',
        author: 'Tim Pemberdayaan Desa',
        publishedAt: '2026-07-06',
        publishedLabel: '6 Juli 2026',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1400&auto=format&fit=crop',
        alt: 'Pelatihan kelompok usaha menggunakan perangkat digital',
        featured: false,
    },
    {
        slug: 'kerja-bakti-bersihkan-saluran-irigasi',
        title: 'Warga Bergotong Royong Membersihkan Saluran Irigasi',
        excerpt:
            'Kerja bakti dilakukan untuk menjaga aliran air menuju sawah menjelang musim tanam berikutnya.',
        content: [
            'Warga bersama kelompok tani membersihkan sampah, rumput liar, dan endapan tanah pada saluran irigasi utama.',
            'Kegiatan gotong royong ini juga menjadi ruang koordinasi untuk menentukan jadwal pembagian air selama musim tanam.',
        ],
        category: 'Pertanian',
        author: 'Tim Informasi Desa',
        publishedAt: '2026-06-29',
        publishedLabel: '29 Juni 2026',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1400&auto=format&fit=crop',
        alt: 'Area persawahan dan saluran irigasi desa',
        featured: false,
    },
    {
        slug: 'kelas-ibu-balita-cegah-stunting',
        title: 'Kelas Ibu Balita Perkuat Edukasi Pencegahan Stunting',
        excerpt:
            'Kader membagikan panduan gizi, pola asuh, dan pemantauan pertumbuhan yang mudah diterapkan di rumah.',
        content: [
            'Kelas Ibu Balita membahas pemenuhan gizi sesuai usia, kebersihan makanan, dan pentingnya pemeriksaan pertumbuhan secara rutin.',
            'Keluarga yang membutuhkan pendampingan lanjutan akan dihubungkan dengan kader kesehatan dan tenaga puskesmas.',
        ],
        category: 'Kesehatan',
        author: 'Kader Kesehatan Desa',
        publishedAt: '2026-06-22',
        publishedLabel: '22 Juni 2026',
        image: 'https://images.unsplash.com/photo-1576765608622-067973a79f53?q=80&w=1400&auto=format&fit=crop',
        alt: 'Ibu dan anak mengikuti kegiatan kesehatan',
        featured: false,
    },
    {
        slug: 'musyawarah-rencana-pembangunan-desa',
        title: 'Musyawarah Desa Menetapkan Prioritas Pembangunan Tahun Depan',
        excerpt:
            'Usulan warga dipetakan berdasarkan urgensi, penerima manfaat, dan kemampuan anggaran desa.',
        content: [
            'Musyawarah desa dihadiri oleh pemerintah desa, BPD, perwakilan lembaga, tokoh masyarakat, kelompok perempuan, dan pemuda.',
            'Daftar prioritas yang disepakati akan menjadi bahan penyusunan rencana kerja pemerintah desa dan dibuka kembali saat tahap finalisasi anggaran.',
        ],
        category: 'Pembangunan',
        author: 'Pemerintah Desa',
        publishedAt: '2026-06-15',
        publishedLabel: '15 Juni 2026',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&auto=format&fit=crop',
        alt: 'Warga mengikuti pertemuan dan musyawarah',
        featured: false,
    },
    {
        slug: 'pemberdayaan-kelompok-wanita-tani',
        title: 'Kelompok Wanita Tani Desa Kembangkan Kebun Gizi Mandiri',
        excerpt:
            'Pemanfaatan pekarangan rumah untuk budidaya sayuran organik dan tanaman obat keluarga.',
        content: [
            'Kelompok Wanita Tani (KWT) Desa Ngampungan menginisiasi kebun gizi mandiri yang memanfaatkan lahan pekarangan kosong.',
            'Hasil panen sayuran segar digunakan untuk memenuhi kebutuhan pangan keluarga serta dijual di pasar lokal desa.',
        ],
        category: 'Pertanian',
        author: 'Tim Pemberdayaan Desa',
        publishedAt: '2026-06-08',
        publishedLabel: '8 Juni 2026',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?q=80&w=1400&auto=format&fit=crop',
        alt: 'Aktivitas bercocok tanam sayur di pekarangan',
        featured: false,
    },
    {
        slug: 'pentas-seni-dan-bazar-budaya-desa',
        title: 'Pentas Seni Tradisional dan Bazar UMKM Sambut Hari Desa',
        excerpt:
            'Ajang apresiasi budaya lokal sekaligus penguatan ekonomi warga melalui stan produk kreatif.',
        content: [
            'Pemerintah desa menyelenggarakan pentas seni tradisional jawa dan bazar UMKM yang melibatkan perwakilan dari seluruh dusun.',
            'Acara ini berhasil menarik antusiasme ratusan warga dan pengunjung dari daerah sekitar.',
        ],
        category: 'UMKM & Budaya',
        author: 'Panitia Hari Desa',
        publishedAt: '2026-06-01',
        publishedLabel: '1 Juni 2026',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1400&auto=format&fit=crop',
        alt: 'Kegiatan bazar dan festival budaya pedesaan',
        featured: false,
    },
] satisfies readonly NewsArticle[];

export const dummyAnnouncements = [
    {
        id: 1,
        title: 'Perubahan Jadwal Pelayanan Administrasi Kependudukan',
        summary:
            'Pelayanan administrasi pada hari Jumat dibuka pukul 08.00–10.30 WIB karena agenda koordinasi kecamatan.',
        priority: 'important',
        status: 'active',
        pinned: true,
        startsAt: '2026-07-22',
        endsAt: '2026-08-02',
        periodLabel: '22 Juli–2 Agustus 2026',
    },
    {
        id: 2,
        title: 'Penutupan Sementara Jembatan Penghubung Dusun',
        summary:
            'Jembatan ditutup sementara selama pemeriksaan struktur. Warga diminta mengikuti jalur alternatif yang telah ditandai.',
        priority: 'emergency',
        status: 'active',
        pinned: true,
        startsAt: '2026-07-25',
        endsAt: '2026-07-30',
        periodLabel: '25–30 Juli 2026',
    },
    {
        id: 3,
        title: 'Pendaftaran Peserta Pelatihan UMKM',
        summary:
            'Pendaftaran dibuka untuk pelaku usaha makanan, kerajinan, pertanian olahan, dan jasa di Desa Ngampungan.',
        priority: 'normal',
        status: 'active',
        pinned: false,
        startsAt: '2026-07-18',
        endsAt: '2026-08-10',
        periodLabel: '18 Juli–10 Agustus 2026',
    },
    {
        id: 4,
        title: 'Jadwal Posyandu Balita Bulan Agustus',
        summary:
            'Orang tua diminta membawa buku KIA dan hadir sesuai jadwal masing-masing dusun.',
        priority: 'normal',
        status: 'active',
        pinned: false,
        startsAt: '2026-07-20',
        endsAt: '2026-08-20',
        periodLabel: '20 Juli–20 Agustus 2026',
    },
    {
        id: 5,
        title: 'Distribusi Bantuan Benih Padi',
        summary:
            'Pengambilan bantuan benih telah selesai dilaksanakan melalui kelompok tani penerima.',
        priority: 'important',
        status: 'archived',
        pinned: false,
        startsAt: '2026-05-10',
        endsAt: '2026-05-18',
        periodLabel: '10–18 Mei 2026',
    },
    {
        id: 6,
        title: 'Pemutakhiran Data Keluarga Tahun 2026',
        summary:
            'Tahap pemutakhiran data keluarga telah ditutup dan hasilnya sedang diverifikasi oleh petugas desa.',
        priority: 'normal',
        status: 'archived',
        pinned: false,
        startsAt: '2026-04-01',
        endsAt: '2026-04-30',
        periodLabel: '1–30 April 2026',
    },
] satisfies readonly Announcement[];

export const featuredDummyNewsArticle = dummyNewsArticles[0];
export const latestDummyNewsArticles = dummyNewsArticles.slice(1);
export const activeDummyAnnouncements = dummyAnnouncements.filter(
    (announcement) => announcement.status === 'active',
);
export const archivedDummyAnnouncements = dummyAnnouncements.filter(
    (announcement) => announcement.status === 'archived',
);

export function findDummyNewsArticle(slug: string): NewsArticle | undefined {
    return dummyNewsArticles.find((article) => article.slug === slug);
}

export function getRelatedDummyNewsArticles(
    article: NewsArticle,
    limit = 3,
): NewsArticle[] {
    return dummyNewsArticles
        .filter(
            (candidate) =>
                candidate.slug !== article.slug &&
                candidate.category === article.category,
        )
        .slice(0, limit);
}
