export type VillagePotentialKey =
    'umkm' | 'agriculture' | 'tourism' | 'culture' | 'culinary' | 'services';

export type VillagePotentialFilter = 'all' | VillagePotentialKey;

export type VillagePotentialCategory = {
    key: VillagePotentialKey;
    label: string;
    eyebrow: string;
    description: string;
};

export type VillagePotentialOffering = {
    name: string;
    description: string;
};

export type VillagePotentialEntry = {
    slug: string;
    category: VillagePotentialKey;
    name: string;
    image: string;
    imageAlt: string;
    shortDescription: string;
    description: readonly string[];
    managerLabel: string;
    managerName: string;
    address: string;
    phone: string;
    phoneLabel: string;
    openingHours: string;
    tags: readonly string[];
    offerings: readonly VillagePotentialOffering[];
    map: {
        latitude: number;
        longitude: number;
        locationLabel: string;
    };
};

export const villagePotentialCategories = [
    {
        key: 'umkm',
        label: 'UMKM',
        eyebrow: 'Usaha Warga',
        description: 'Produk dan usaha produktif yang dikembangkan warga.',
    },
    {
        key: 'agriculture',
        label: 'Pertanian',
        eyebrow: 'Hasil Bumi',
        description: 'Komoditas, kelompok tani, dan kegiatan budidaya.',
    },
    {
        key: 'tourism',
        label: 'Wisata',
        eyebrow: 'Jelajah Desa',
        description: 'Ruang dan pengalaman lokal yang dapat dikembangkan.',
    },
    {
        key: 'culture',
        label: 'Budaya',
        eyebrow: 'Identitas Lokal',
        description: 'Tradisi, kesenian, dan kegiatan budaya masyarakat.',
    },
    {
        key: 'culinary',
        label: 'Kuliner',
        eyebrow: 'Cita Rasa',
        description: 'Olahan pangan dan jajanan yang dibuat warga.',
    },
    {
        key: 'services',
        label: 'Jasa',
        eyebrow: 'Keterampilan',
        description: 'Layanan dan keahlian yang tersedia di lingkungan desa.',
    },
] satisfies readonly VillagePotentialCategory[];

export const dummyVillagePotentialEntries = [
    {
        slug: 'anyaman-bambu-maju-karya',
        category: 'umkm',
        name: 'Anyaman Bambu Maju Karya',
        image: 'https://images.unsplash.com/photo-1737606993105-84533d6823d0?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Pengrajin memegang hasil kerajinan anyaman bambu',
        shortDescription:
            'Kerajinan bambu rumah tangga dengan desain fungsional dan pengerjaan manual.',
        description: [
            'Maju Karya merupakan contoh usaha warga yang memproduksi beragam kerajinan bambu untuk kebutuhan rumah tangga dan dekorasi.',
            'Proses produksi dilakukan dalam skala rumahan dengan melibatkan keterampilan pengrajin lokal. Informasi ini masih berupa simulasi untuk kebutuhan pengembangan frontend.',
        ],
        managerLabel: 'Pemilik usaha',
        managerName: 'Siti Aminah',
        address: 'Dusun Ngampungan, Desa Ngampungan',
        phone: '+6281200000001',
        phoneLabel: '0812-0000-0001',
        openingHours: 'Senin–Sabtu, 08.00–16.00 WIB',
        tags: ['Kerajinan', 'Produk rumah tangga', 'Pesanan'],
        offerings: [
            {
                name: 'Keranjang Anyaman',
                description:
                    'Keranjang serbaguna dalam beberapa pilihan ukuran.',
            },
            {
                name: 'Kap Lampu Bambu',
                description:
                    'Dekorasi pencahayaan dengan pola anyaman sederhana.',
            },
            {
                name: 'Pesanan Khusus',
                description:
                    'Pembuatan produk berdasarkan ukuran dan kebutuhan pelanggan.',
            },
        ],
        map: {
            latitude: -7.6351,
            longitude: 112.3328,
            locationLabel: 'Lokasi usaha simulasi di Dusun Ngampungan',
        },
    },
    {
        slug: 'jahit-berkah-collection',
        category: 'umkm',
        name: 'Jahit Berkah Collection',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Ruang kerja kreatif dengan hasil kerajinan dan dekorasi',
        shortDescription:
            'Usaha jahit rumahan untuk pakaian harian, seragam, dan perbaikan busana.',
        description: [
            'Berkah Collection melayani kebutuhan jahit warga mulai dari pembuatan pakaian sederhana hingga penyesuaian ukuran.',
            'Profil ini disiapkan sebagai contoh struktur informasi usaha yang nantinya dapat dikelola dari dashboard desa.',
        ],
        managerLabel: 'Pemilik usaha',
        managerName: 'Rina Wulandari',
        address: 'Dusun Bareng, Desa Ngampungan',
        phone: '+6281200000002',
        phoneLabel: '0812-0000-0002',
        openingHours: 'Senin–Jumat, 09.00–17.00 WIB',
        tags: ['Jahit', 'Seragam', 'Perbaikan busana'],
        offerings: [
            {
                name: 'Jahit Pakaian',
                description: 'Pembuatan pakaian harian berdasarkan ukuran.',
            },
            {
                name: 'Seragam',
                description: 'Pesanan seragam kelompok dan kegiatan warga.',
            },
            {
                name: 'Permak Busana',
                description: 'Penyesuaian ukuran dan perbaikan pakaian.',
            },
        ],
        map: {
            latitude: -7.636,
            longitude: 112.3342,
            locationLabel: 'Lokasi usaha simulasi di Dusun Bareng',
        },
    },
    {
        slug: 'kelompok-tani-maju-makmur',
        category: 'agriculture',
        name: 'Kelompok Tani Maju Makmur',
        image: 'https://images.unsplash.com/photo-1673746759528-e48f0dce5896?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Petani menanam padi di area persawahan hijau',
        shortDescription:
            'Kelompok budidaya padi yang mengembangkan praktik pertanian dan pengelolaan irigasi bersama.',
        description: [
            'Kelompok Tani Maju Makmur menjadi contoh wadah koordinasi petani dalam mengatur musim tanam, kebutuhan produksi, dan pemeliharaan saluran air.',
            'Data luas lahan dan hasil panen pada profil ini belum merupakan data resmi dan akan diganti setelah proses verifikasi desa.',
        ],
        managerLabel: 'Ketua kelompok',
        managerName: 'Suyanto',
        address: 'Area Persawahan Utara, Desa Ngampungan',
        phone: '+6281200000003',
        phoneLabel: '0812-0000-0003',
        openingHours: 'Pertemuan kelompok setiap Jumat, 19.00 WIB',
        tags: ['Padi', 'Kelompok tani', 'Irigasi'],
        offerings: [
            {
                name: 'Budidaya Padi',
                description:
                    'Pengelolaan musim tanam dan praktik budidaya bersama.',
            },
            {
                name: 'Benih dan Sarana',
                description:
                    'Koordinasi kebutuhan benih serta sarana produksi.',
            },
            {
                name: 'Edukasi Lapangan',
                description:
                    'Pertemuan berbagi praktik pertanian antaranggota.',
            },
        ],
        map: {
            latitude: -7.6319,
            longitude: 112.3296,
            locationLabel: 'Titik pertemuan kelompok tani simulasi',
        },
    },
    {
        slug: 'kebun-hortikultura-sumber-rejeki',
        category: 'agriculture',
        name: 'Kebun Hortikultura Sumber Rejeki',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Lahan pertanian hijau dengan tanaman yang tertata',
        shortDescription:
            'Budidaya sayuran musiman dan tanaman pekarangan untuk pasar sekitar desa.',
        description: [
            'Sumber Rejeki menampilkan contoh potensi hortikultura skala keluarga dengan komoditas yang mengikuti kondisi musim.',
            'Informasi hasil produksi dan ketersediaan komoditas masih berupa data simulasi frontend.',
        ],
        managerLabel: 'Pengelola',
        managerName: 'Hari Prasetyo',
        address: 'Lahan Pekarangan Selatan, Desa Ngampungan',
        phone: '+6281200000004',
        phoneLabel: '0812-0000-0004',
        openingHours: 'Kunjungan dengan janji, 07.00–15.00 WIB',
        tags: ['Sayuran', 'Pekarangan', 'Musiman'],
        offerings: [
            {
                name: 'Sayuran Segar',
                description: 'Komoditas sayur yang tersedia mengikuti musim.',
            },
            {
                name: 'Bibit Pekarangan',
                description: 'Bibit tanaman untuk budidaya rumah tangga.',
            },
            {
                name: 'Kunjungan Kebun',
                description: 'Pengenalan budidaya sederhana dengan janji.',
            },
        ],
        map: {
            latitude: -7.6383,
            longitude: 112.3314,
            locationLabel: 'Lokasi kebun simulasi di sisi selatan desa',
        },
    },
    {
        slug: 'jalur-persawahan-ngampungan',
        category: 'tourism',
        name: 'Jalur Persawahan Ngampungan',
        image: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Pemandangan alam terbuka dengan jalur dan perbukitan',
        shortDescription:
            'Rute jalan desa dengan lanskap persawahan yang berpotensi menjadi jalur jelajah warga.',
        description: [
            'Jalur Persawahan Ngampungan merupakan contoh potensi ruang terbuka yang dapat dikenalkan sebagai bagian dari pengalaman melihat aktivitas pertanian desa.',
            'Rute, fasilitas, dan standar kunjungan masih bersifat simulasi dan belum dibuka sebagai destinasi resmi.',
        ],
        managerLabel: 'Pengelola informasi',
        managerName: 'Pemerintah Desa Ngampungan',
        address: 'Jalur Persawahan Utara, Desa Ngampungan',
        phone: '+6281200000005',
        phoneLabel: '0812-0000-0005',
        openingHours: 'Belum dibuka untuk kunjungan resmi',
        tags: ['Lanskap', 'Jalur desa', 'Pertanian'],
        offerings: [
            {
                name: 'Jelajah Persawahan',
                description:
                    'Konsep rute berjalan dengan pemandangan lahan tani.',
            },
            {
                name: 'Cerita Pertanian',
                description: 'Pengenalan singkat aktivitas pertanian warga.',
            },
            {
                name: 'Titik Foto',
                description: 'Rencana titik dokumentasi lanskap desa.',
            },
        ],
        map: {
            latitude: -7.6308,
            longitude: 112.3334,
            locationLabel: 'Titik awal jalur simulasi',
        },
    },
    {
        slug: 'kebun-edukasi-tani',
        category: 'tourism',
        name: 'Kebun Edukasi Tani',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Pengunjung menikmati lanskap alam dan perbukitan',
        shortDescription:
            'Konsep kunjungan belajar untuk mengenal tanaman pangan dan praktik budidaya dasar.',
        description: [
            'Kebun Edukasi Tani dirancang sebagai contoh potensi wisata berbasis pembelajaran pertanian untuk keluarga dan kelompok sekolah.',
            'Program kunjungan belum aktif. Seluruh jadwal dan fasilitas pada halaman ini masih menjadi simulasi antarmuka.',
        ],
        managerLabel: 'Calon pengelola',
        managerName: 'Kelompok Pemuda Tani',
        address: 'Area Kebun Timur, Desa Ngampungan',
        phone: '+6281200000006',
        phoneLabel: '0812-0000-0006',
        openingHours: 'Program belum aktif',
        tags: ['Edukasi', 'Keluarga', 'Pertanian'],
        offerings: [
            {
                name: 'Kenal Tanaman',
                description: 'Pengenalan jenis tanaman pangan dan sayuran.',
            },
            {
                name: 'Praktik Menanam',
                description: 'Simulasi kegiatan menanam untuk pengunjung.',
            },
            {
                name: 'Kelas Kelompok',
                description: 'Rancangan aktivitas belajar bagi rombongan.',
            },
        ],
        map: {
            latitude: -7.6345,
            longitude: 112.3381,
            locationLabel: 'Lokasi rencana kebun edukasi simulasi',
        },
    },
    {
        slug: 'sanggar-laras-ngampungan',
        category: 'culture',
        name: 'Sanggar Laras Ngampungan',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Sekelompok warga berkegiatan bersama dalam sebuah ruang',
        shortDescription:
            'Ruang latihan seni warga yang menjaga kegiatan musik dan pertunjukan lokal.',
        description: [
            'Sanggar Laras Ngampungan merupakan contoh profil kelompok budaya yang mewadahi latihan dan pengenalan kesenian kepada generasi muda.',
            'Jadwal latihan, pengelola, dan program yang tercantum masih berupa data simulasi.',
        ],
        managerLabel: 'Koordinator sanggar',
        managerName: 'Budi Santoso',
        address: 'Balai Warga Desa Ngampungan',
        phone: '+6281200000007',
        phoneLabel: '0812-0000-0007',
        openingHours: 'Latihan Sabtu, 19.00–21.00 WIB',
        tags: ['Seni', 'Pemuda', 'Pertunjukan'],
        offerings: [
            {
                name: 'Latihan Musik',
                description: 'Kegiatan latihan rutin untuk anggota sanggar.',
            },
            {
                name: 'Pentas Warga',
                description: 'Partisipasi kesenian dalam kegiatan desa.',
            },
            {
                name: 'Kelas Pengenalan',
                description: 'Pengenalan dasar kesenian bagi generasi muda.',
            },
        ],
        map: {
            latitude: -7.6356,
            longitude: 112.335,
            locationLabel: 'Lokasi balai warga simulasi',
        },
    },
    {
        slug: 'tradisi-bersih-desa',
        category: 'culture',
        name: 'Tradisi Bersih Desa',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Kebersamaan masyarakat dalam kegiatan komunitas',
        shortDescription:
            'Agenda kebersamaan warga yang memadukan gotong royong, doa, dan pertunjukan lokal.',
        description: [
            'Tradisi Bersih Desa dicatat sebagai contoh potensi budaya yang memperkuat kebersamaan dan identitas masyarakat.',
            'Tanggal pelaksanaan dan susunan kegiatan pada profil ini belum merupakan agenda resmi pemerintah desa.',
        ],
        managerLabel: 'Koordinator kegiatan',
        managerName: 'Panitia Warga',
        address: 'Lingkungan Desa Ngampungan',
        phone: '+6281200000008',
        phoneLabel: '0812-0000-0008',
        openingHours: 'Dilaksanakan mengikuti agenda desa',
        tags: ['Tradisi', 'Gotong royong', 'Agenda desa'],
        offerings: [
            {
                name: 'Kerja Bakti',
                description: 'Kegiatan kebersihan lingkungan bersama warga.',
            },
            {
                name: 'Doa Bersama',
                description: 'Rangkaian kegiatan kebersamaan masyarakat.',
            },
            {
                name: 'Pentas Lokal',
                description: 'Ruang penampilan kelompok seni desa.',
            },
        ],
        map: {
            latitude: -7.6353,
            longitude: 112.3347,
            locationLabel: 'Titik kegiatan utama simulasi',
        },
    },
    {
        slug: 'keripik-pisang-mbok-yati',
        category: 'culinary',
        name: 'Keripik Pisang Mbok Yati',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Beragam makanan tersaji di atas meja',
        shortDescription:
            'Olahan pisang rumahan dengan pilihan rasa untuk konsumsi keluarga dan oleh-oleh.',
        description: [
            'Keripik Pisang Mbok Yati menggambarkan usaha olahan pangan skala rumah tangga dengan bahan baku yang diperoleh dari lingkungan sekitar.',
            'Varian, kapasitas produksi, dan kontak yang ditampilkan masih merupakan data simulasi.',
        ],
        managerLabel: 'Produsen',
        managerName: 'Yati Rahayu',
        address: 'Dusun Tengah, Desa Ngampungan',
        phone: '+6281200000009',
        phoneLabel: '0812-0000-0009',
        openingHours: 'Senin–Sabtu, 08.00–16.00 WIB',
        tags: ['Camilan', 'Olahan pisang', 'Rumahan'],
        offerings: [
            {
                name: 'Rasa Original',
                description: 'Keripik pisang gurih dengan bumbu sederhana.',
            },
            {
                name: 'Rasa Manis',
                description: 'Varian keripik dengan lapisan rasa manis.',
            },
            {
                name: 'Paket Oleh-oleh',
                description: 'Kemasan beberapa produk untuk kebutuhan hadiah.',
            },
        ],
        map: {
            latitude: -7.6368,
            longitude: 112.3331,
            locationLabel: 'Lokasi produksi simulasi di Dusun Tengah',
        },
    },
    {
        slug: 'jajanan-pasar-sekar',
        category: 'culinary',
        name: 'Jajanan Pasar Sekar',
        image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Proses menyiapkan makanan di dapur usaha rumahan',
        shortDescription:
            'Produksi jajanan tradisional untuk kebutuhan rapat, hajatan, dan kegiatan warga.',
        description: [
            'Jajanan Pasar Sekar merupakan contoh produsen pangan lokal yang melayani pesanan kegiatan dalam skala rumah tangga.',
            'Daftar produk dan mekanisme pemesanan akan diverifikasi ketika data usaha asli telah tersedia.',
        ],
        managerLabel: 'Produsen',
        managerName: 'Sekar Lestari',
        address: 'Dusun Selatan, Desa Ngampungan',
        phone: '+6281200000010',
        phoneLabel: '0812-0000-0010',
        openingHours: 'Pesanan H-2, 07.00–15.00 WIB',
        tags: ['Jajanan pasar', 'Pesanan acara', 'Tradisional'],
        offerings: [
            {
                name: 'Kue Basah',
                description: 'Pilihan jajanan basah untuk kegiatan warga.',
            },
            {
                name: 'Paket Rapat',
                description: 'Paket makanan ringan untuk pertemuan.',
            },
            {
                name: 'Pesanan Hajatan',
                description: 'Produksi berdasarkan jumlah dan jadwal acara.',
            },
        ],
        map: {
            latitude: -7.638,
            longitude: 112.3345,
            locationLabel: 'Lokasi produksi simulasi di Dusun Selatan',
        },
    },
    {
        slug: 'bengkel-las-mandiri',
        category: 'services',
        name: 'Bengkel Las Mandiri',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Pekerja teknis mengerjakan konstruksi logam',
        shortDescription:
            'Layanan pengerjaan logam untuk kebutuhan rumah, pertanian, dan perbaikan ringan.',
        description: [
            'Bengkel Las Mandiri menggambarkan potensi jasa teknis warga yang melayani pembuatan dan perbaikan berbahan logam.',
            'Cakupan layanan, jadwal, dan kontak pada halaman ini masih berupa data simulasi frontend.',
        ],
        managerLabel: 'Pemilik jasa',
        managerName: 'Agus Setiawan',
        address: 'Jalan Desa Sisi Barat, Desa Ngampungan',
        phone: '+6281200000011',
        phoneLabel: '0812-0000-0011',
        openingHours: 'Senin–Sabtu, 08.00–17.00 WIB',
        tags: ['Las', 'Logam', 'Perbaikan'],
        offerings: [
            {
                name: 'Pagar dan Kanopi',
                description: 'Pembuatan konstruksi logam untuk rumah.',
            },
            {
                name: 'Perbaikan Alat',
                description: 'Perbaikan ringan peralatan berbahan logam.',
            },
            {
                name: 'Pesanan Ukuran',
                description:
                    'Pengerjaan berdasarkan ukuran kebutuhan pelanggan.',
            },
        ],
        map: {
            latitude: -7.6352,
            longitude: 112.3305,
            locationLabel: 'Lokasi bengkel simulasi di sisi barat desa',
        },
    },
    {
        slug: 'servis-elektronik-sahabat',
        category: 'services',
        name: 'Servis Elektronik Sahabat',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Teknisi bekerja dengan peralatan di ruang servis',
        shortDescription:
            'Jasa pemeriksaan dan perbaikan perangkat elektronik rumah tangga skala ringan.',
        description: [
            'Servis Elektronik Sahabat merupakan contoh direktori keterampilan teknis yang tersedia di lingkungan desa.',
            'Jenis perangkat yang dilayani dan estimasi pengerjaan akan diperbarui setelah data pelaku jasa diverifikasi.',
        ],
        managerLabel: 'Teknisi',
        managerName: 'Dedi Kurniawan',
        address: 'Dusun Timur, Desa Ngampungan',
        phone: '+6281200000012',
        phoneLabel: '0812-0000-0012',
        openingHours: 'Senin–Jumat, 09.00–16.00 WIB',
        tags: ['Elektronik', 'Perbaikan', 'Rumah tangga'],
        offerings: [
            {
                name: 'Pemeriksaan Perangkat',
                description:
                    'Pengecekan awal kerusakan perangkat rumah tangga.',
            },
            {
                name: 'Perbaikan Ringan',
                description: 'Penggantian komponen dan perbaikan skala ringan.',
            },
            {
                name: 'Konsultasi Teknis',
                description:
                    'Informasi kelayakan perbaikan sebelum pengerjaan.',
            },
        ],
        map: {
            latitude: -7.6348,
            longitude: 112.337,
            locationLabel: 'Lokasi teknisi simulasi di Dusun Timur',
        },
    },
    {
        slug: 'kriya-kayu-ngampungan',
        category: 'umkm',
        name: 'Kriya Kayu Ngampungan',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Pelaku usaha berdiskusi dan mengembangkan produk bersama',
        shortDescription:
            'Produksi aksesori dan perlengkapan rumah sederhana berbahan kayu.',
        description: [
            'Kriya Kayu Ngampungan merupakan contoh usaha kreatif warga yang mengolah bahan kayu menjadi produk fungsional.',
            'Kapasitas produksi, harga, dan kontak pada profil ini masih berupa data simulasi frontend.',
        ],
        managerLabel: 'Pemilik usaha',
        managerName: 'Arif Nugroho',
        address: 'Dusun Barat, Desa Ngampungan',
        phone: '+6281200000013',
        phoneLabel: '0812-0000-0013',
        openingHours: 'Senin–Sabtu, 08.00–16.00 WIB',
        tags: ['Kriya kayu', 'Dekorasi', 'Pesanan'],
        offerings: [
            {
                name: 'Rak Kayu',
                description: 'Rak sederhana untuk kebutuhan rumah tangga.',
            },
            {
                name: 'Dekorasi',
                description: 'Aksesori ruangan dengan desain minimal.',
            },
            {
                name: 'Pesanan Ukuran',
                description: 'Pengerjaan berdasarkan ukuran pelanggan.',
            },
        ],
        map: {
            latitude: -7.6357,
            longitude: 112.3301,
            locationLabel: 'Lokasi usaha kayu simulasi di Dusun Barat',
        },
    },
    {
        slug: 'pembibitan-tani-hijau',
        category: 'agriculture',
        name: 'Pembibitan Tani Hijau',
        image: 'https://images.unsplash.com/photo-1528649947101-d92ac7e200d1?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Petani berjalan menuju area persawahan hijau',
        shortDescription:
            'Pembibitan tanaman pangan dan pekarangan untuk kebutuhan petani sekitar.',
        description: [
            'Pembibitan Tani Hijau menjadi contoh usaha pertanian yang menyediakan bibit untuk lahan pangan dan pekarangan warga.',
            'Jenis bibit dan jadwal ketersediaan akan disesuaikan setelah data asli diverifikasi.',
        ],
        managerLabel: 'Pengelola',
        managerName: 'Wahyu Hidayat',
        address: 'Area Lahan Timur, Desa Ngampungan',
        phone: '+6281200000014',
        phoneLabel: '0812-0000-0014',
        openingHours: 'Senin–Sabtu, 07.00–15.00 WIB',
        tags: ['Bibit', 'Tanaman pangan', 'Pekarangan'],
        offerings: [
            {
                name: 'Bibit Padi',
                description: 'Contoh penyediaan bibit untuk musim tanam.',
            },
            {
                name: 'Bibit Sayuran',
                description: 'Bibit tanaman pekarangan sesuai musim.',
            },
            {
                name: 'Konsultasi Tanam',
                description: 'Informasi dasar penanaman dan perawatan.',
            },
        ],
        map: {
            latitude: -7.6338,
            longitude: 112.3385,
            locationLabel: 'Lokasi pembibitan simulasi di sisi timur desa',
        },
    },
    {
        slug: 'embung-panorama-desa',
        category: 'tourism',
        name: 'Embung Panorama Desa',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Pemandangan alam terbuka yang tenang saat matahari terbit',
        shortDescription:
            'Ruang terbuka sekitar tampungan air yang berpotensi menjadi titik rekreasi.',
        description: [
            'Embung Panorama Desa dicatat sebagai contoh potensi ruang terbuka untuk menikmati suasana pedesaan.',
            'Lokasi ini belum dibuka sebagai destinasi resmi dan seluruh fasilitas yang disebutkan masih bersifat simulasi.',
        ],
        managerLabel: 'Pengelola informasi',
        managerName: 'Pemerintah Desa Ngampungan',
        address: 'Area Embung Selatan, Desa Ngampungan',
        phone: '+6281200000015',
        phoneLabel: '0812-0000-0015',
        openingHours: 'Belum dibuka untuk kunjungan resmi',
        tags: ['Embung', 'Lanskap', 'Ruang terbuka'],
        offerings: [
            {
                name: 'Titik Pandang',
                description: 'Konsep area menikmati lanskap desa.',
            },
            {
                name: 'Jalur Santai',
                description: 'Rencana jalur pendek di sekitar embung.',
            },
            {
                name: 'Edukasi Air',
                description: 'Pengenalan fungsi tampungan air bagi pertanian.',
            },
        ],
        map: {
            latitude: -7.6391,
            longitude: 112.3337,
            locationLabel: 'Titik embung simulasi di sisi selatan desa',
        },
    },
    {
        slug: 'kelompok-karawitan-sekar-laras',
        category: 'culture',
        name: 'Kelompok Karawitan Sekar Laras',
        image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Karya seni penuh warna sebagai ilustrasi kegiatan budaya',
        shortDescription:
            'Kelompok seni warga yang berlatih musik tradisional untuk kegiatan desa.',
        description: [
            'Sekar Laras menjadi contoh kelompok budaya yang menjaga ruang belajar dan latihan musik tradisional.',
            'Susunan anggota dan jadwal pentas pada halaman ini masih berupa data simulasi.',
        ],
        managerLabel: 'Ketua kelompok',
        managerName: 'Sri Wahyuni',
        address: 'Pendopo Desa Ngampungan',
        phone: '+6281200000016',
        phoneLabel: '0812-0000-0016',
        openingHours: 'Latihan Minggu, 19.00–21.00 WIB',
        tags: ['Karawitan', 'Musik tradisional', 'Warga'],
        offerings: [
            {
                name: 'Latihan Rutin',
                description: 'Kegiatan latihan musik tradisional warga.',
            },
            {
                name: 'Pentas Desa',
                description: 'Penampilan pada agenda masyarakat.',
            },
            {
                name: 'Pengenalan Alat',
                description: 'Pengenalan dasar bagi peserta baru.',
            },
        ],
        map: {
            latitude: -7.6354,
            longitude: 112.3349,
            locationLabel: 'Lokasi latihan simulasi di pendopo desa',
        },
    },
    {
        slug: 'dapur-sambal-bu-ningsih',
        category: 'culinary',
        name: 'Dapur Sambal Bu Ningsih',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Bahan makanan segar dan hidangan yang siap disajikan',
        shortDescription:
            'Produksi sambal rumahan dalam kemasan untuk kebutuhan keluarga.',
        description: [
            'Dapur Sambal Bu Ningsih menggambarkan contoh usaha kuliner rumahan yang mengolah bahan segar menjadi produk kemasan.',
            'Pilihan rasa, masa simpan, dan kapasitas produksi masih merupakan data simulasi.',
        ],
        managerLabel: 'Produsen',
        managerName: 'Ningsih',
        address: 'Dusun Utara, Desa Ngampungan',
        phone: '+6281200000017',
        phoneLabel: '0812-0000-0017',
        openingHours: 'Senin–Sabtu, 08.00–15.00 WIB',
        tags: ['Sambal', 'Produk kemasan', 'Rumahan'],
        offerings: [
            {
                name: 'Sambal Original',
                description: 'Sambal rumahan dengan tingkat pedas sedang.',
            },
            {
                name: 'Sambal Pedas',
                description: 'Varian rasa untuk penyuka pedas.',
            },
            {
                name: 'Paket Campur',
                description: 'Paket beberapa varian dalam kemasan.',
            },
        ],
        map: {
            latitude: -7.6327,
            longitude: 112.334,
            locationLabel: 'Lokasi produksi simulasi di Dusun Utara',
        },
    },
    {
        slug: 'fotokopi-mitra-warga',
        category: 'services',
        name: 'Fotokopi Mitra Warga',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Ruang kerja layanan administrasi yang tertata',
        shortDescription:
            'Layanan fotokopi, pencetakan, dan alat tulis untuk kebutuhan warga.',
        description: [
            'Mitra Warga merupakan contoh jasa pendukung administrasi dan kebutuhan sekolah yang tersedia di lingkungan desa.',
            'Daftar layanan, harga, dan jam operasional akan diverifikasi ketika data usaha asli tersedia.',
        ],
        managerLabel: 'Pemilik jasa',
        managerName: 'Lina Handayani',
        address: 'Jalan Raya Ngampungan, Desa Ngampungan',
        phone: '+6281200000018',
        phoneLabel: '0812-0000-0018',
        openingHours: 'Senin–Sabtu, 07.30–17.00 WIB',
        tags: ['Fotokopi', 'Cetak dokumen', 'Alat tulis'],
        offerings: [
            {
                name: 'Fotokopi',
                description: 'Penggandaan dokumen hitam putih.',
            },
            {
                name: 'Cetak Dokumen',
                description: 'Pencetakan dokumen kebutuhan warga.',
            },
            {
                name: 'Alat Tulis',
                description: 'Perlengkapan dasar sekolah dan administrasi.',
            },
        ],
        map: {
            latitude: -7.635,
            longitude: 112.3356,
            locationLabel: 'Lokasi layanan simulasi di Jalan Raya Ngampungan',
        },
    },
] satisfies readonly VillagePotentialEntry[];

export function findVillagePotentialCategory(
    key: VillagePotentialKey,
): VillagePotentialCategory {
    return (
        villagePotentialCategories.find((category) => category.key === key) ??
        villagePotentialCategories[0]
    );
}

export function getDummyVillagePotentialEntries(
    category: VillagePotentialFilter = 'all',
): VillagePotentialEntry[] {
    if (category === 'all') {
        return [...dummyVillagePotentialEntries];
    }

    return dummyVillagePotentialEntries.filter(
        (entry) => entry.category === category,
    );
}

export function findDummyVillagePotentialEntry(
    slug: string,
): VillagePotentialEntry | undefined {
    return dummyVillagePotentialEntries.find((entry) => entry.slug === slug);
}

export function getRelatedDummyVillagePotentialEntries(
    entry: VillagePotentialEntry,
    limit = 3,
): VillagePotentialEntry[] {
    return dummyVillagePotentialEntries
        .filter(
            (candidate) =>
                candidate.slug !== entry.slug &&
                candidate.category === entry.category,
        )
        .slice(0, limit);
}
