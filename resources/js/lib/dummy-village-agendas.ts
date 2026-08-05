export type VillageAgendaStatus = 'upcoming' | 'completed';

export type VillageAgenda = {
    slug: string;
    title: string;
    summary: string;
    image?: string | null;
    imageAlt?: string | null;
    details: readonly string[];
    category: string;
    date: string;
    dayLabel: string;
    dateLabel: string;
    timeLabel: string;
    location: string;
    organizer: string;
    contact: string;
    status: VillageAgendaStatus;
    featured: boolean;
    registrationRequired: boolean;
};

export const dummyVillageAgendas: readonly VillageAgenda[] = [
    {
        slug: 'musyawarah-perencanaan-pembangunan-desa-2027',
        title: 'Musyawarah Perencanaan Pembangunan Desa 2027',
        summary:
            'Forum terbuka untuk menyepakati prioritas pembangunan dan pelayanan desa tahun berikutnya.',
        details: [
            'Warga dapat menyampaikan usulan melalui ketua RT atau langsung pada sesi penjaringan aspirasi.',
            'Peserta diharapkan hadir 30 menit sebelum acara untuk melakukan registrasi.',
        ],
        category: 'Pemerintahan',
        date: '2026-08-03',
        dayLabel: 'Senin',
        dateLabel: '3 Agustus 2026',
        timeLabel: '08.30–12.00 WIB',
        location: 'Balai Desa Ngampungan',
        organizer: 'Pemerintah Desa dan BPD',
        contact: 'Sekretariat Desa · 0812-3456-7890',
        status: 'upcoming',
        featured: true,
        registrationRequired: true,
    },
    {
        slug: 'posyandu-balita-dusun-ngampungan',
        title: 'Posyandu Balita Dusun Ngampungan',
        summary:
            'Penimbangan, pengukuran tumbuh kembang, imunisasi, dan konsultasi gizi bagi balita.',
        details: [
            'Orang tua diminta membawa buku KIA dan kartu identitas anak.',
            'Pelayanan dilakukan berdasarkan urutan kedatangan.',
        ],
        category: 'Kesehatan',
        date: '2026-08-07',
        dayLabel: 'Jumat',
        dateLabel: '7 Agustus 2026',
        timeLabel: '08.00–11.00 WIB',
        location: 'Posyandu Melati',
        organizer: 'Kader Posyandu dan Puskesmas Bareng',
        contact: 'Kader Dusun · 0813-1111-2201',
        status: 'upcoming',
        featured: false,
        registrationRequired: false,
    },
    {
        slug: 'pelatihan-foto-produk-umkm',
        title: 'Pelatihan Foto Produk dan Katalog Digital UMKM',
        summary:
            'Pelatihan praktis membuat foto produk dan katalog sederhana menggunakan telepon seluler.',
        details: [
            'Peserta membawa maksimal tiga produk, telepon seluler, dan pengisi daya.',
            'Kuota simulasi dibatasi untuk 25 pelaku usaha Desa Ngampungan.',
        ],
        category: 'Pemberdayaan',
        date: '2026-08-12',
        dayLabel: 'Rabu',
        dateLabel: '12 Agustus 2026',
        timeLabel: '09.00–14.00 WIB',
        location: 'Aula Kantor Desa',
        organizer: 'Tim Pemberdayaan dan Karang Taruna',
        contact: 'Panitia UMKM · 0813-1111-2202',
        status: 'upcoming',
        featured: false,
        registrationRequired: true,
    },
    {
        slug: 'kerja-bakti-saluran-irigasi',
        title: 'Kerja Bakti Saluran Irigasi dan Lingkungan',
        summary:
            'Gotong royong membersihkan saluran air dan area publik menjelang musim tanam.',
        details: [
            'Warga membawa alat kerja ringan sesuai kemampuan masing-masing.',
            'Titik kumpul dibagi per RT dan dikoordinasikan oleh kepala dusun.',
        ],
        category: 'Lingkungan',
        date: '2026-08-16',
        dayLabel: 'Minggu',
        dateLabel: '16 Agustus 2026',
        timeLabel: '06.30–09.30 WIB',
        location: 'Titik kumpul masing-masing RT',
        organizer: 'Pemerintah Dusun dan Kelompok Tani',
        contact: 'Kepala Dusun · 0813-1111-2203',
        status: 'upcoming',
        featured: false,
        registrationRequired: false,
    },
    {
        slug: 'malam-tirakatan-kemerdekaan',
        title: 'Malam Tirakatan dan Doa Bersama Kemerdekaan',
        summary:
            'Doa bersama, refleksi perjuangan, dan ramah tamah warga dalam rangka Hari Kemerdekaan.',
        details: [
            'Acara terbuka untuk seluruh warga dan dimulai setelah salat Isya.',
            'Susunan acara dapat berubah mengikuti koordinasi panitia desa.',
        ],
        category: 'Sosial Budaya',
        date: '2026-08-16',
        dayLabel: 'Minggu',
        dateLabel: '16 Agustus 2026',
        timeLabel: '19.30–22.00 WIB',
        location: 'Halaman Balai Desa',
        organizer: 'Karang Taruna dan Lembaga Desa',
        contact: 'Panitia HUT RI · 0813-1111-2204',
        status: 'upcoming',
        featured: false,
        registrationRequired: false,
    },
    {
        slug: 'penyaluran-bantuan-pangan-juli',
        title: 'Penyaluran Bantuan Pangan Periode Juli',
        summary:
            'Penyaluran bantuan kepada keluarga penerima manfaat sesuai daftar verifikasi.',
        details: [
            'Penerima membawa undangan, KTP, dan kartu keluarga.',
            'Bantuan yang tidak diambil pada jadwal utama dilayani melalui koordinasi petugas.',
        ],
        category: 'Pelayanan',
        date: '2026-07-21',
        dayLabel: 'Selasa',
        dateLabel: '21 Juli 2026',
        timeLabel: '08.00–13.00 WIB',
        location: 'Balai Desa Ngampungan',
        organizer: 'Pemerintah Desa',
        contact: 'Petugas Pelayanan · 0813-1111-2205',
        status: 'completed',
        featured: false,
        registrationRequired: false,
    },
    {
        slug: 'kelas-ibu-hamil-juli',
        title: 'Kelas Ibu Hamil dan Konsultasi Gizi',
        summary:
            'Edukasi kesehatan kehamilan, persiapan persalinan, dan konsultasi gizi keluarga.',
        details: [
            'Peserta membawa buku KIA dan hasil pemeriksaan terakhir.',
            'Kegiatan didampingi bidan desa dan kader kesehatan.',
        ],
        category: 'Kesehatan',
        date: '2026-07-17',
        dayLabel: 'Jumat',
        dateLabel: '17 Juli 2026',
        timeLabel: '09.00–11.30 WIB',
        location: 'Polindes Ngampungan',
        organizer: 'Bidan Desa dan Kader Kesehatan',
        contact: 'Kader Kesehatan · 0813-1111-2206',
        status: 'completed',
        featured: false,
        registrationRequired: true,
    },
    {
        slug: 'rembug-tani-musim-tanam',
        title: 'Rembug Tani Persiapan Musim Tanam',
        summary:
            'Koordinasi jadwal tanam, pembagian air, dan kebutuhan sarana produksi kelompok tani.',
        details: [
            'Perwakilan kelompok membawa catatan luas lahan dan kebutuhan air.',
            'Hasil pertemuan menjadi acuan jadwal bersama tingkat desa.',
        ],
        category: 'Pertanian',
        date: '2026-07-12',
        dayLabel: 'Minggu',
        dateLabel: '12 Juli 2026',
        timeLabel: '19.00–21.00 WIB',
        location: 'Sekretariat Kelompok Tani',
        organizer: 'Gapoktan Maju Makmur',
        contact: 'Ketua Gapoktan · 0813-1111-2207',
        status: 'completed',
        featured: false,
        registrationRequired: false,
    },
];

export const upcomingDummyVillageAgendas = dummyVillageAgendas.filter(
    (agenda) => agenda.status === 'upcoming',
);

export const completedDummyVillageAgendas = dummyVillageAgendas.filter(
    (agenda) => agenda.status === 'completed',
);

export const featuredDummyVillageAgenda =
    upcomingDummyVillageAgendas.find((agenda) => agenda.featured) ??
    upcomingDummyVillageAgendas[0];
