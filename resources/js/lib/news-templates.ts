export type NewsTemplate = {
    id: string;
    label: string;
    icon: string;
    description: string;
    category: string;
    titlePlaceholder: string;
    excerptPlaceholder: string;
    content: string[];
};

export const newsContentTemplates: NewsTemplate[] = [
    {
        id: 'kegiatan-desa',
        label: 'Laporan Kegiatan Desa',
        icon: '🌾',
        description: 'Template untuk panen raya, kerja bakti, musyawarah, atau acara kemasyarakatan.',
        category: 'Pertanian',
        titlePlaceholder: 'Contoh: Kerja Bakti Gotong Royong Membersihkan Saluran Irigasi Dusun',
        excerptPlaceholder: 'Warga bersama tokoh masyarakat bergotong royong menjaga kebersihan lingkungan desa.',
        content: [
            'Pemerintah Desa Ngampungan bersama warga dan tokoh masyarakat sukses menyelenggarakan kegiatan kemasyarakatan di lingkungan desa.',
            'Kegiatan ini bertujuan untuk mempererat tali silaturahmi, menjaga sarana publik, serta memastikan kenyamanan seluruh warga Desa Ngampungan.',
            'Pemerintah desa mengapresiasi antusiasme dan partisipasi aktif seluruh elemen masyarakat yang senantiasa mendukung pembangunan serta budaya gotong royong.',
        ],
    },
    {
        id: 'pembangunan',
        label: 'Rilis Pembangunan & Infrastruktur',
        icon: '🏗️',
        description: 'Template untuk perbaikan jalan, saluran air, balai desa, atau fasilitas publik.',
        category: 'Pembangunan',
        titlePlaceholder: 'Contoh: Perbaikan Jalan Lingkungan Dusun Dimulai Secara Bertahap',
        excerptPlaceholder: 'Pekerjaan difokuskan pada titik jalan strategis untuk memperlancar mobilitas warga.',
        content: [
            'Pemerintah Desa Ngampungan resmi memulai pekerjaan pembangunan dan perbaikan fasilitas infrastruktur fisik sesuai hasil musyawarah rencana pembangunan desa.',
            'Proyek ini dibiayai melalui alokasi APBDes TA berjalan dengan mengutamakan kualitas pengerjaan dan asas manfaat bagi warga sekitar.',
            'Himbauan bagi seluruh pengguna jalan untuk memperhatikan panduan jalur alternatif sementara selama proses pekerjaan pengerjaan berlangsung.',
        ],
    },
    {
        id: 'kesehatan',
        label: 'Layanan Kesehatan & Posyandu',
        icon: '🏥',
        description: 'Template untuk posyandu lansia/balita, pencegahan stunting, atau pemeriksaan gratis.',
        category: 'Kesehatan',
        titlePlaceholder: 'Contoh: Program Posyandu Lansia & Balita Rutin Digelar di Balai Desa',
        excerptPlaceholder: 'Pemerintah desa dan kader kesehatan membuka pemeriksaan rutin bagi warga.',
        content: [
            'Kader Kesehatan Desa Ngampungan kembali menggelar pelayanan kesehatan rutin masyarakat di balai desa.',
            'Layanan meliputi pemeriksaan kesehatan dasar, konseling gizi, pemberian makanan tambahan (PMT), serta pemantauan tumbuh kembang balita.',
            'Warga diimbau untuk selalu hadir tepat waktu dan membawa dokumen kesehatan (Buku KIA/KMS) saat jadwal pelayanan berlangsung.',
        ],
    },
    {
        id: 'umkm',
        label: 'Sorotan UMKM & Potensi Desa',
        icon: '🛍️',
        description: 'Template untuk mempromosikan produk lokal, kerajinan, wisata, atau usaha warga.',
        category: 'UMKM & Budaya',
        titlePlaceholder: 'Contoh: Produk Kerajinan Bambu Ngampungan Mulai Diminati Pasar Luar Daerah',
        excerptPlaceholder: 'Inovasi produk lokal warga memadukan kualitas tinggi dan motif tradisional.',
        content: [
            'Pelaku usaha mikro kecil dan menengah (UMKM) Desa Ngampungan terus menunjukkan perkembangan positif melalui inovasi produk lokal unggulan.',
            'Dukungan pemerintah desa diberikan melalui fasilitasi pelatihan kemasan, foto produk, serta perluasan akses promosi digital.',
            'Mari dukung dan cintai produk lokal karya warga Desa Ngampungan untuk menggerakkan perekonomian desa secara mandiri.',
        ],
    },
];
