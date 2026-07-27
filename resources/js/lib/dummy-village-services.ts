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

export function findVillageServiceCategory(
    category: VillageServiceCategoryKey,
): VillageServiceCategory {
    return (
        villageServiceCategories.find(
            (candidate) => candidate.key === category,
        ) ?? villageServiceCategories[0]
    );
}
