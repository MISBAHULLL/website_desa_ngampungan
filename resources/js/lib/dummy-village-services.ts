export type VillageServiceCategoryKey =
    'administration' | 'population' | 'agriculture' | 'reports';

export type VillageServiceFilter = 'all' | VillageServiceCategoryKey;

export type VillageServiceCategory = {
    key: VillageServiceCategoryKey;
    label: string;
    shortLabel: string;
    description: string;
};

export type VillageService = {
    slug: string;
    title: string;
    shortDescription: string;
    category: VillageServiceCategoryKey;
    audience: string;
    channel: string;
    estimatedDuration: string;
    fee: string;
};

export type VillageServiceDocument = {
    key: string;
    label: string;
    description: string;
    required: boolean;
    acceptedFormats: string;
};

export type VillageServiceApplicationDetail = {
    requirements: readonly string[];
    requiredDocuments: readonly VillageServiceDocument[];
    notes: readonly string[];
    serviceContact: string;
    serviceHours: string;
};

export type VillageServiceProcessStep = {
    title: string;
    description: string;
};

export const villageServiceCategories = [
    {
        key: 'administration',
        label: 'Administrasi dan Surat',
        shortLabel: 'Administrasi',
        description:
            'Informasi surat keterangan, surat pengantar, dan administrasi umum desa.',
    },
    {
        key: 'population',
        label: 'Kependudukan',
        shortLabel: 'Kependudukan',
        description:
            'Informasi pengantar dokumen penduduk, perubahan data, serta perpindahan.',
    },
    {
        key: 'agriculture',
        label: 'Pertanian',
        shortLabel: 'Pertanian',
        description:
            'Informasi layanan kelompok tani, komoditas, dan pelaporan hasil pertanian.',
    },
    {
        key: 'reports',
        label: 'Pengaduan dan Darurat',
        shortLabel: 'Pengaduan',
        description:
            'Kanal informasi pengaduan infrastruktur, ketertiban, dan kondisi mendesak.',
    },
] satisfies readonly VillageServiceCategory[];

export const dummyVillageServices = [
    {
        slug: 'surat-keterangan-usaha',
        title: 'Surat Keterangan Usaha',
        shortDescription:
            'Informasi penerbitan surat keterangan untuk usaha yang dijalankan warga desa.',
        category: 'administration',
        audience: 'Warga pemilik usaha',
        channel: 'Datang ke kantor desa',
        estimatedDuration: '1 hari kerja',
        fee: 'Gratis',
    },
    {
        slug: 'surat-keterangan-domisili',
        title: 'Surat Keterangan Domisili',
        shortDescription:
            'Informasi surat yang menerangkan tempat tinggal atau domisili pemohon.',
        category: 'administration',
        audience: 'Penduduk desa',
        channel: 'Datang ke kantor desa',
        estimatedDuration: '1 hari kerja',
        fee: 'Gratis',
    },
    {
        slug: 'surat-pengantar-skck',
        title: 'Surat Pengantar SKCK',
        shortDescription:
            'Informasi surat pengantar desa sebagai bagian dari pengurusan SKCK.',
        category: 'administration',
        audience: 'Penduduk desa',
        channel: 'Datang ke kantor desa',
        estimatedDuration: '1 hari kerja',
        fee: 'Gratis',
    },
    {
        slug: 'surat-keterangan-tidak-mampu',
        title: 'Surat Keterangan Tidak Mampu',
        shortDescription:
            'Informasi surat keterangan untuk kebutuhan layanan sosial, pendidikan, atau kesehatan.',
        category: 'administration',
        audience: 'Warga yang memenuhi kriteria',
        channel: 'Verifikasi kantor desa',
        estimatedDuration: '1–2 hari kerja',
        fee: 'Gratis',
    },
    {
        slug: 'pengantar-ktp-dan-kartu-keluarga',
        title: 'Pengantar KTP-el dan Kartu Keluarga',
        shortDescription:
            'Informasi pengantar untuk penerbitan atau perubahan dokumen kependudukan.',
        category: 'population',
        audience: 'Penduduk desa',
        channel: 'Datang ke kantor desa',
        estimatedDuration: '1 hari kerja',
        fee: 'Gratis',
    },
    {
        slug: 'surat-pindah-dan-datang',
        title: 'Surat Pindah dan Datang Penduduk',
        shortDescription:
            'Informasi administrasi perpindahan penduduk keluar atau masuk desa.',
        category: 'population',
        audience: 'Penduduk pindah atau pendatang',
        channel: 'Verifikasi kantor desa',
        estimatedDuration: '1–2 hari kerja',
        fee: 'Gratis',
    },
    {
        slug: 'pengantar-akta-kelahiran',
        title: 'Pengantar Akta Kelahiran',
        shortDescription:
            'Informasi dokumen pengantar pencatatan kelahiran anggota keluarga.',
        category: 'population',
        audience: 'Orang tua atau wali',
        channel: 'Datang ke kantor desa',
        estimatedDuration: '1 hari kerja',
        fee: 'Gratis',
    },
    {
        slug: 'pelaporan-hasil-panen',
        title: 'Pelaporan Hasil Panen',
        shortDescription:
            'Pencatatan simulasi komoditas, volume panen, dan jadwal distribusi kelompok tani.',
        category: 'agriculture',
        audience: 'Petani dan kelompok tani',
        channel: 'Koordinasi petugas pertanian',
        estimatedDuration: 'Sesuai jadwal pendataan',
        fee: 'Gratis',
    },
    {
        slug: 'rekomendasi-kebutuhan-kelompok-tani',
        title: 'Rekomendasi Kebutuhan Kelompok Tani',
        shortDescription:
            'Informasi pengajuan rekomendasi sarana produksi dan kebutuhan kelompok tani.',
        category: 'agriculture',
        audience: 'Kelompok tani terdaftar',
        channel: 'Koordinasi pemerintah desa',
        estimatedDuration: '2–3 hari kerja',
        fee: 'Gratis',
    },
    {
        slug: 'pengaduan-infrastruktur-desa',
        title: 'Pengaduan Infrastruktur Desa',
        shortDescription:
            'Kanal informasi untuk melaporkan jalan, drainase, penerangan, dan fasilitas umum.',
        category: 'reports',
        audience: 'Seluruh warga',
        channel: 'Form kontak atau kantor desa',
        estimatedDuration: 'Tanggapan awal 1 hari kerja',
        fee: 'Gratis',
    },
    {
        slug: 'informasi-kondisi-darurat',
        title: 'Informasi Kondisi Darurat',
        shortDescription:
            'Petunjuk awal untuk melaporkan gangguan keamanan, bencana, atau kondisi mendesak.',
        category: 'reports',
        audience: 'Seluruh warga',
        channel: 'Telepon petugas terkait',
        estimatedDuration: 'Menyesuaikan tingkat urgensi',
        fee: 'Gratis',
    },
] satisfies readonly VillageService[];

const identityDocument = {
    key: 'identity-card',
    label: 'KTP pemohon',
    description: 'Salinan atau foto KTP pemohon yang masih terbaca.',
    required: true,
    acceptedFormats: '.pdf,.jpg,.jpeg,.png',
} satisfies VillageServiceDocument;

const familyCardDocument = {
    key: 'family-card',
    label: 'Kartu Keluarga',
    description: 'Salinan atau foto Kartu Keluarga terbaru.',
    required: true,
    acceptedFormats: '.pdf,.jpg,.jpeg,.png',
} satisfies VillageServiceDocument;

const neighbourhoodLetterDocument = {
    key: 'neighbourhood-letter',
    label: 'Surat pengantar RT/RW',
    description: 'Surat pengantar lingkungan sesuai domisili pemohon.',
    required: true,
    acceptedFormats: '.pdf,.jpg,.jpeg,.png',
} satisfies VillageServiceDocument;

export const villageServiceProcessSteps = [
    {
        title: 'Siapkan persyaratan',
        description:
            'Periksa data diri dan dokumen pendukung sebelum memulai pengajuan.',
    },
    {
        title: 'Isi formulir pengajuan',
        description:
            'Lengkapi identitas, tujuan pengajuan, dan unggah dokumen yang diminta.',
    },
    {
        title: 'Verifikasi petugas',
        description:
            'Pada sistem aktif, petugas desa akan memeriksa kelengkapan dan kesesuaian data.',
    },
    {
        title: 'Ambil hasil layanan',
        description:
            'Pemohon menerima pemberitahuan setelah dokumen selesai diproses.',
    },
] satisfies readonly VillageServiceProcessStep[];

export const dummyVillageServiceApplicationDetails: Record<
    string,
    VillageServiceApplicationDetail
> = {
    'surat-keterangan-usaha': {
        requirements: [
            'Pemohon merupakan warga Desa Ngampungan.',
            'Usaha berada atau dijalankan di wilayah desa.',
            'Data usaha yang disampaikan dapat diverifikasi oleh petugas.',
        ],
        requiredDocuments: [
            identityDocument,
            familyCardDocument,
            neighbourhoodLetterDocument,
            {
                key: 'business-evidence',
                label: 'Bukti kegiatan usaha',
                description:
                    'Foto tempat usaha atau dokumen pendukung usaha bila tersedia.',
                required: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png',
            },
        ],
        notes: [
            'Petugas dapat meminta klarifikasi lokasi dan jenis usaha.',
            'Persyaratan final menunggu verifikasi Pemerintah Desa Ngampungan.',
        ],
        serviceContact: 'Kaur Pelayanan Desa',
        serviceHours: 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
    },
    'surat-keterangan-domisili': {
        requirements: [
            'Pemohon tinggal di wilayah Desa Ngampungan.',
            'Alamat yang diajukan sesuai dengan kondisi tempat tinggal.',
        ],
        requiredDocuments: [
            identityDocument,
            familyCardDocument,
            neighbourhoodLetterDocument,
        ],
        notes: [
            'Petugas dapat melakukan konfirmasi domisili kepada lingkungan setempat.',
        ],
        serviceContact: 'Kaur Pelayanan Desa',
        serviceHours: 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
    },
    'surat-pengantar-skck': {
        requirements: [
            'Pemohon merupakan penduduk Desa Ngampungan.',
            'Tujuan pembuatan SKCK dijelaskan secara singkat.',
        ],
        requiredDocuments: [
            identityDocument,
            familyCardDocument,
            neighbourhoodLetterDocument,
        ],
        notes: [
            'Surat desa merupakan dokumen pengantar; penerbitan SKCK tetap dilakukan oleh kepolisian.',
        ],
        serviceContact: 'Kaur Pelayanan Desa',
        serviceHours: 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
    },
    'surat-keterangan-tidak-mampu': {
        requirements: [
            'Pemohon atau anggota keluarga tercatat sebagai warga desa.',
            'Keperluan layanan sosial, pendidikan, atau kesehatan dijelaskan dengan benar.',
            'Data kondisi keluarga bersedia diverifikasi.',
        ],
        requiredDocuments: [
            identityDocument,
            familyCardDocument,
            neighbourhoodLetterDocument,
            {
                key: 'supporting-letter',
                label: 'Dokumen pendukung keperluan',
                description:
                    'Surat dari sekolah, fasilitas kesehatan, atau instansi tujuan bila tersedia.',
                required: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png',
            },
        ],
        notes: ['Penerbitan mengikuti hasil verifikasi data sosial pemohon.'],
        serviceContact: 'Kasi Kesejahteraan',
        serviceHours: 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
    },
    'pengantar-ktp-dan-kartu-keluarga': {
        requirements: [
            'Pemohon atau anggota keluarga terdaftar sebagai penduduk desa.',
            'Jenis layanan dipilih: penerbitan baru, perubahan, atau penggantian.',
        ],
        requiredDocuments: [
            familyCardDocument,
            {
                ...identityDocument,
                required: false,
                description:
                    'KTP lama bila mengajukan perubahan atau penggantian.',
            },
            {
                key: 'population-support',
                label: 'Dokumen pendukung perubahan data',
                description:
                    'Akta kelahiran, buku nikah, ijazah, atau dokumen relevan lainnya.',
                required: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png',
            },
        ],
        notes: [
            'Dokumen kependudukan diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil.',
        ],
        serviceContact: 'Kasi Pemerintahan',
        serviceHours: 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
    },
    'surat-pindah-dan-datang': {
        requirements: [
            'Pemohon menjelaskan alamat asal dan alamat tujuan.',
            'Seluruh anggota keluarga yang ikut pindah dicantumkan.',
        ],
        requiredDocuments: [
            identityDocument,
            familyCardDocument,
            {
                key: 'moving-support',
                label: 'Dokumen pendukung perpindahan',
                description:
                    'Surat pindah dari daerah asal atau bukti alamat tujuan sesuai kebutuhan.',
                required: true,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png',
            },
        ],
        notes: [
            'Verifikasi tambahan dapat diperlukan untuk pemohon yang datang dari luar daerah.',
        ],
        serviceContact: 'Kasi Pemerintahan',
        serviceHours: 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
    },
    'pengantar-akta-kelahiran': {
        requirements: [
            'Pelapor merupakan orang tua, wali, atau anggota keluarga yang berwenang.',
            'Data kelahiran sesuai dengan surat keterangan tenaga kesehatan.',
        ],
        requiredDocuments: [
            familyCardDocument,
            {
                key: 'parents-identity',
                label: 'KTP kedua orang tua',
                description: 'Salinan atau foto KTP ayah dan ibu.',
                required: true,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png',
            },
            {
                key: 'birth-letter',
                label: 'Surat keterangan kelahiran',
                description:
                    'Surat dari bidan, rumah sakit, atau penolong kelahiran.',
                required: true,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png',
            },
            {
                key: 'marriage-book',
                label: 'Buku nikah atau akta perkawinan',
                description: 'Dokumen perkawinan orang tua bila tersedia.',
                required: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png',
            },
        ],
        notes: [
            'Akta kelahiran diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil.',
        ],
        serviceContact: 'Kasi Pemerintahan',
        serviceHours: 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
    },
    'pelaporan-hasil-panen': {
        requirements: [
            'Pelapor merupakan petani atau perwakilan kelompok tani.',
            'Komoditas, luas lahan, dan perkiraan volume panen dicantumkan.',
        ],
        requiredDocuments: [
            identityDocument,
            {
                key: 'harvest-recap',
                label: 'Rekap hasil panen',
                description:
                    'Catatan komoditas, luas lahan, volume, dan waktu panen.',
                required: true,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png',
            },
        ],
        notes: [
            'Jadwal tindak lanjut mengikuti periode pendataan pertanian desa.',
        ],
        serviceContact: 'Kasi Kesejahteraan',
        serviceHours: 'Sesuai jadwal pendataan pertanian',
    },
    'rekomendasi-kebutuhan-kelompok-tani': {
        requirements: [
            'Kelompok tani terdaftar atau diketahui Pemerintah Desa Ngampungan.',
            'Kebutuhan dan penerima manfaat dijelaskan secara terukur.',
        ],
        requiredDocuments: [
            {
                key: 'group-proposal',
                label: 'Proposal kebutuhan kelompok',
                description:
                    'Dokumen kebutuhan, tujuan, jumlah, dan rencana pemanfaatan.',
                required: true,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png',
            },
            {
                key: 'member-list',
                label: 'Daftar anggota kelompok',
                description: 'Daftar anggota dan pengurus kelompok tani.',
                required: true,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png',
            },
        ],
        notes: [
            'Rekomendasi tidak otomatis menjamin bantuan atau pengadaan sarana.',
        ],
        serviceContact: 'Kasi Kesejahteraan',
        serviceHours: 'Senin–Kamis 08.00–15.00',
    },
    'pengaduan-infrastruktur-desa': {
        requirements: [
            'Lokasi masalah dijelaskan secara spesifik.',
            'Jenis kerusakan dan dampaknya terhadap warga dijelaskan.',
        ],
        requiredDocuments: [
            {
                ...identityDocument,
                required: false,
            },
            {
                key: 'infrastructure-evidence',
                label: 'Foto kondisi dan lokasi',
                description:
                    'Foto kerusakan atau fasilitas yang dilaporkan beserta penanda lokasi.',
                required: true,
                acceptedFormats: '.jpg,.jpeg,.png',
            },
        ],
        notes: [
            'Tanggapan awal bukan janji bahwa perbaikan langsung dapat dilaksanakan.',
        ],
        serviceContact: 'Kaur Perencanaan',
        serviceHours: 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
    },
    'informasi-kondisi-darurat': {
        requirements: [
            'Jenis kejadian, lokasi, dan waktu kejadian dijelaskan.',
            'Nomor telepon pelapor dapat dihubungi.',
        ],
        requiredDocuments: [
            {
                key: 'emergency-evidence',
                label: 'Foto kondisi bila aman',
                description:
                    'Dokumentasi hanya diambil bila tidak membahayakan pelapor.',
                required: false,
                acceptedFormats: '.jpg,.jpeg,.png',
            },
        ],
        notes: [
            'Untuk ancaman keselamatan segera, hubungi layanan darurat atau aparat terkait.',
            'Form simulasi ini bukan kanal penanganan darurat aktif.',
        ],
        serviceContact: 'Petugas piket desa',
        serviceHours: 'Kanal darurat menyesuaikan kesiapsiagaan petugas',
    },
};

export function getDummyVillageServices(
    category: VillageServiceFilter,
): readonly VillageService[] {
    if (category === 'all') {
        return dummyVillageServices;
    }

    return dummyVillageServices.filter(
        (service) => service.category === category,
    );
}

export function findDummyVillageService(
    slug: string,
): VillageService | undefined {
    return dummyVillageServices.find((service) => service.slug === slug);
}

export function findDummyVillageServiceApplicationDetail(
    slug: string,
): VillageServiceApplicationDetail | undefined {
    return dummyVillageServiceApplicationDetails[slug];
}

export function findVillageServiceCategory(
    category: VillageServiceCategoryKey,
): VillageServiceCategory {
    return (
        villageServiceCategories.find(
            (candidate) => candidate.key === category,
        ) ?? villageServiceCategories[0]
    );
}
