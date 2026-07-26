export type VillageOfficialGroup =
    'leadership' | 'secretariat' | 'technical' | 'territorial';

export type VillageOfficial = {
    slug: string;
    name: string;
    initials: string;
    position: string;
    unit: string;
    group: VillageOfficialGroup;
    photo: string | null;
    term: string;
    employeeId: string;
    summary: string;
    about: string;
    responsibilities: string[];
    serviceFocus: string[];
    education: string[];
    career: {
        period: string;
        role: string;
    }[];
    isPlaceholder: boolean;
};

export type VillageInstitution = {
    acronym: string;
    name: string;
    leader: string;
    memberCount: number;
    focus: string;
    responsibilities: string[];
};

export const dummyVillageOfficials: VillageOfficial[] = [
    {
        slug: 'kusnadi-s-sos',
        name: 'Kusnadi, S.Sos',
        initials: 'KS',
        position: 'Kepala Desa',
        unit: 'Pimpinan Pemerintah Desa',
        group: 'leadership',
        photo: '/assets/Kepala_desa.png',
        term: '2022–2028',
        employeeId: 'Kades-001',
        summary:
            'Memimpin penyelenggaraan pemerintahan, pembangunan, pembinaan kemasyarakatan, dan pemberdayaan warga Desa Ngampungan.',
        about: 'Profil ini merupakan contoh susunan informasi Kepala Desa. Riwayat pendidikan, masa jabatan, dan uraian pengalaman akan disesuaikan setelah dokumen resmi diverifikasi.',
        responsibilities: [
            'Menetapkan kebijakan penyelenggaraan pemerintahan desa.',
            'Mengoordinasikan pembangunan dan pemberdayaan masyarakat.',
            'Membina ketenteraman, ketertiban, dan kehidupan sosial warga.',
            'Memastikan tata kelola anggaran berjalan transparan dan akuntabel.',
        ],
        serviceFocus: [
            'Pelayanan publik',
            'Pembangunan partisipatif',
            'Transparansi anggaran',
        ],
        education: [
            'Sarjana Ilmu Sosial — data simulasi',
            'Pelatihan Kepemimpinan Pemerintahan Desa — data simulasi',
        ],
        career: [
            {
                period: '2022–sekarang',
                role: 'Kepala Desa Ngampungan — simulasi periode',
            },
            {
                period: 'Sebelum 2022',
                role: 'Riwayat pengalaman menunggu data resmi',
            },
        ],
        isPlaceholder: true,
    },
    {
        slug: 'rina-kurniasih',
        name: 'Rina Kurniasih, S.E.',
        initials: 'RK',
        position: 'Sekretaris Desa',
        unit: 'Sekretariat Desa',
        group: 'secretariat',
        photo: null,
        term: 'Data belum tersedia',
        employeeId: 'Sekdes-001',
        summary:
            'Mengoordinasikan administrasi pemerintahan dan mendukung pelaksanaan tugas Kepala Desa.',
        about: 'Data profil Sekretaris Desa masih berupa simulasi untuk menampilkan struktur informasi perangkat desa.',
        responsibilities: [
            'Mengoordinasikan penyusunan kebijakan dan program kerja desa.',
            'Mengelola administrasi umum dan tata naskah pemerintahan.',
            'Mengoordinasikan evaluasi serta pelaporan kegiatan.',
        ],
        serviceFocus: [
            'Administrasi pemerintahan',
            'Koordinasi program',
            'Pelaporan',
        ],
        education: ['Sarjana Ekonomi — data simulasi'],
        career: [
            {
                period: 'Periode simulasi',
                role: 'Sekretaris Desa Ngampungan',
            },
        ],
        isPlaceholder: true,
    },
    {
        slug: 'budi-prasetyo',
        name: 'Budi Prasetyo',
        initials: 'BP',
        position: 'Kaur Tata Usaha dan Umum',
        unit: 'Sekretariat Desa',
        group: 'secretariat',
        photo: null,
        term: 'Data belum tersedia',
        employeeId: 'Kaur-TU-001',
        summary:
            'Mengelola tata naskah, arsip, inventaris, perjalanan dinas, dan pelayanan administrasi umum.',
        about: 'Profil ini menggunakan data dummy hingga informasi aparatur resmi tersedia.',
        responsibilities: [
            'Mengelola surat masuk, surat keluar, dan arsip desa.',
            'Mendata inventaris serta aset operasional kantor desa.',
            'Mendukung kebutuhan administrasi rapat dan kegiatan.',
        ],
        serviceFocus: ['Persuratan', 'Kearsipan', 'Inventaris'],
        education: ['Riwayat pendidikan menunggu data resmi'],
        career: [
            {
                period: 'Periode simulasi',
                role: 'Kaur Tata Usaha dan Umum',
            },
        ],
        isPlaceholder: true,
    },
    {
        slug: 'dewi-lestari',
        name: 'Dewi Lestari, S.Ak.',
        initials: 'DL',
        position: 'Kaur Keuangan',
        unit: 'Sekretariat Desa',
        group: 'secretariat',
        photo: null,
        term: 'Data belum tersedia',
        employeeId: 'Kaur-Keu-001',
        summary:
            'Mendukung pengelolaan keuangan desa mulai dari penatausahaan hingga pelaporan.',
        about: 'Informasi aparatur dan riwayat jabatan pada halaman ini masih berupa simulasi.',
        responsibilities: [
            'Melaksanakan penatausahaan penerimaan dan pengeluaran desa.',
            'Menyiapkan dokumen laporan keuangan pemerintah desa.',
            'Mendukung pengendalian administrasi pelaksanaan APBDes.',
        ],
        serviceFocus: ['Penatausahaan', 'Pelaporan keuangan', 'APBDes'],
        education: ['Sarjana Akuntansi — data simulasi'],
        career: [
            {
                period: 'Periode simulasi',
                role: 'Kaur Keuangan',
            },
        ],
        isPlaceholder: true,
    },
    {
        slug: 'ahmad-fauzi',
        name: 'Ahmad Fauzi, S.Pd.',
        initials: 'AF',
        position: 'Kaur Perencanaan',
        unit: 'Sekretariat Desa',
        group: 'secretariat',
        photo: null,
        term: 'Data belum tersedia',
        employeeId: 'Kaur-Ren-001',
        summary:
            'Mengoordinasikan penyusunan rencana pembangunan dan data pendukung program desa.',
        about: 'Profil aparatur ini disiapkan sebagai contoh tampilan sebelum integrasi CMS.',
        responsibilities: [
            'Menginventarisasi data pembangunan desa.',
            'Menyusun bahan RPJM Desa dan RKP Desa.',
            'Memantau capaian program dan kegiatan pembangunan.',
        ],
        serviceFocus: ['Perencanaan', 'Data pembangunan', 'Evaluasi program'],
        education: ['Sarjana Pendidikan — data simulasi'],
        career: [
            {
                period: 'Periode simulasi',
                role: 'Kaur Perencanaan',
            },
        ],
        isPlaceholder: true,
    },
    {
        slug: 'hadi-santoso',
        name: 'Hadi Santoso',
        initials: 'HS',
        position: 'Kasi Pemerintahan',
        unit: 'Pelaksana Teknis',
        group: 'technical',
        photo: null,
        term: 'Data belum tersedia',
        employeeId: 'Kasi-Pem-001',
        summary:
            'Menangani tata praja, administrasi kependudukan, pertanahan, serta ketenteraman wilayah.',
        about: 'Seluruh data personal masih dummy dan akan diganti melalui CMS perangkat desa.',
        responsibilities: [
            'Mendukung pelayanan administrasi kependudukan.',
            'Menyiapkan data pertanahan dan tata wilayah.',
            'Mengoordinasikan kegiatan ketenteraman dan ketertiban.',
        ],
        serviceFocus: ['Kependudukan', 'Pertanahan', 'Ketertiban'],
        education: ['Riwayat pendidikan menunggu data resmi'],
        career: [
            {
                period: 'Periode simulasi',
                role: 'Kasi Pemerintahan',
            },
        ],
        isPlaceholder: true,
    },
    {
        slug: 'nur-aini',
        name: 'Nur Aini, S.Sos.',
        initials: 'NA',
        position: 'Kasi Kesejahteraan',
        unit: 'Pelaksana Teknis',
        group: 'technical',
        photo: null,
        term: 'Data belum tersedia',
        employeeId: 'Kasi-Kesra-001',
        summary:
            'Mengoordinasikan kegiatan pembangunan, sosial, pendidikan, kesehatan, dan pemberdayaan warga.',
        about: 'Halaman ini menunjukkan pola detail profil yang nanti dikelola melalui CMS.',
        responsibilities: [
            'Mendukung program pembangunan sarana dan prasarana.',
            'Mengoordinasikan kegiatan sosial dan pemberdayaan.',
            'Mendukung program pendidikan serta kesehatan masyarakat.',
        ],
        serviceFocus: ['Kesejahteraan sosial', 'Kesehatan', 'Pemberdayaan'],
        education: ['Sarjana Ilmu Sosial — data simulasi'],
        career: [
            {
                period: 'Periode simulasi',
                role: 'Kasi Kesejahteraan',
            },
        ],
        isPlaceholder: true,
    },
    {
        slug: 'siti-rahmawati',
        name: 'Siti Rahmawati',
        initials: 'SR',
        position: 'Kasi Pelayanan',
        unit: 'Pelaksana Teknis',
        group: 'technical',
        photo: null,
        term: 'Data belum tersedia',
        employeeId: 'Kasi-Pel-001',
        summary:
            'Mendukung pelayanan sosial dasar, penyuluhan, pembinaan masyarakat, dan pelayanan warga.',
        about: 'Data nama dan riwayat pada profil ini masih merupakan simulasi frontend.',
        responsibilities: [
            'Menyusun standar dan informasi pelayanan warga.',
            'Mendukung pembinaan partisipasi serta gotong royong.',
            'Mengoordinasikan pelayanan sosial dasar masyarakat.',
        ],
        serviceFocus: ['Pelayanan warga', 'Penyuluhan', 'Sosial dasar'],
        education: ['Riwayat pendidikan menunggu data resmi'],
        career: [
            {
                period: 'Periode simulasi',
                role: 'Kasi Pelayanan',
            },
        ],
        isPlaceholder: true,
    },
    ...[
        ['agus-wibowo', 'Agus Wibowo', 'AW', 'Kepala Dusun 01', 'Kadus-01'],
        ['lina-maharani', 'Lina Maharani', 'LM', 'Kepala Dusun 02', 'Kadus-02'],
        ['eko-saputro', 'Eko Saputro', 'ES', 'Kepala Dusun 03', 'Kadus-03'],
        [
            'fitri-handayani',
            'Fitri Handayani',
            'FH',
            'Kepala Dusun 04',
            'Kadus-04',
        ],
    ].map(([slug, name, initials, position, employeeId]): VillageOfficial => ({
        slug,
        name,
        initials,
        position,
        unit: 'Pelaksana Kewilayahan',
        group: 'territorial',
        photo: null,
        term: 'Data belum tersedia',
        employeeId,
        summary:
            'Mengoordinasikan penyelenggaraan pemerintahan, pembangunan, dan pembinaan masyarakat di tingkat dusun.',
        about: 'Nama dusun dan data aparatur kewilayahan masih berupa simulasi frontend.',
        responsibilities: [
            'Mendukung pelayanan warga di wilayah dusun.',
            'Mengoordinasikan kegiatan pembangunan kewilayahan.',
            'Menjaga komunikasi antara warga dan pemerintah desa.',
        ],
        serviceFocus: [
            'Pelayanan wilayah',
            'Koordinasi warga',
            'Pembangunan dusun',
        ],
        education: ['Riwayat pendidikan menunggu data resmi'],
        career: [
            {
                period: 'Periode simulasi',
                role: position,
            },
        ],
        isPlaceholder: true,
    })),
];

export const dummyVillageInstitutions: VillageInstitution[] = [
    {
        acronym: 'BPD',
        name: 'Badan Permusyawaratan Desa',
        leader: 'Nama ketua menunggu data resmi',
        memberCount: 7,
        focus: 'Permusyawaratan dan pengawasan pemerintahan desa.',
        responsibilities: [
            'Membahas dan menyepakati rancangan peraturan desa.',
            'Menampung serta menyalurkan aspirasi masyarakat.',
            'Melakukan pengawasan kinerja Kepala Desa.',
        ],
    },
    {
        acronym: 'LPMD',
        name: 'Lembaga Pemberdayaan Masyarakat Desa',
        leader: 'Nama ketua menunggu data resmi',
        memberCount: 12,
        focus: 'Partisipasi warga dalam perencanaan dan pembangunan.',
        responsibilities: [
            'Mendorong partisipasi masyarakat dalam pembangunan.',
            'Membantu penyusunan rencana pembangunan partisipatif.',
            'Menggerakkan swadaya dan gotong royong warga.',
        ],
    },
    {
        acronym: 'PKK',
        name: 'Pemberdayaan dan Kesejahteraan Keluarga',
        leader: 'Nama ketua menunggu data resmi',
        memberCount: 24,
        focus: 'Pemberdayaan keluarga, kesehatan, dan kesejahteraan.',
        responsibilities: [
            'Mengelola program pemberdayaan keluarga.',
            'Mendukung kegiatan kesehatan ibu dan anak.',
            'Mendorong pendidikan serta ekonomi keluarga.',
        ],
    },
    {
        acronym: 'KARTAR',
        name: 'Karang Taruna',
        leader: 'Nama ketua menunggu data resmi',
        memberCount: 30,
        focus: 'Pengembangan kapasitas, kreativitas, dan kepedulian pemuda.',
        responsibilities: [
            'Mengembangkan kegiatan kepemudaan.',
            'Mendorong kreativitas dan usaha produktif pemuda.',
            'Mendukung kegiatan sosial kemasyarakatan.',
        ],
    },
];

export function findDummyVillageOfficial(slug: string) {
    return (
        dummyVillageOfficials.find((official) => official.slug === slug) ?? null
    );
}
