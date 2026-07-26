export type DemographicKey =
    'gender' | 'age' | 'education' | 'occupation' | 'religion' | 'residency';

export type DemographicDataset = {
    key: DemographicKey;
    label: string;
    shortLabel: string;
    description: string;
    unit: string;
    total: number;
    items: {
        label: string;
        value: number;
    }[];
};

export const dummyVillageIdentity = [
    {
        label: 'Nama Desa',
        value: 'Ngampungan',
        isPlaceholder: false,
    },
    {
        label: 'Kode Desa',
        value: '35.17.XX.XXXX',
        isPlaceholder: true,
    },
    {
        label: 'Kecamatan',
        value: 'Bareng',
        isPlaceholder: false,
    },
    {
        label: 'Kabupaten',
        value: 'Jombang',
        isPlaceholder: false,
    },
    {
        label: 'Provinsi',
        value: 'Jawa Timur',
        isPlaceholder: false,
    },
    {
        label: 'Tahun Pembentukan',
        value: '19XX',
        isPlaceholder: true,
    },
] as const;

export const dummyAdministrativeBoundaries = [
    {
        direction: 'Utara',
        value: 'Data batas utara menunggu verifikasi',
    },
    {
        direction: 'Timur',
        value: 'Data batas timur menunggu verifikasi',
    },
    {
        direction: 'Selatan',
        value: 'Data batas selatan menunggu verifikasi',
    },
    {
        direction: 'Barat',
        value: 'Data batas barat menunggu verifikasi',
    },
] as const;

export const dummyAdministrativeDivisions = [
    {
        code: 'D-01',
        name: 'Dusun 01',
        note: 'Nama dusun menunggu verifikasi',
        rw: 3,
        rt: 8,
        households: 286,
    },
    {
        code: 'D-02',
        name: 'Dusun 02',
        note: 'Nama dusun menunggu verifikasi',
        rw: 3,
        rt: 9,
        households: 302,
    },
    {
        code: 'D-03',
        name: 'Dusun 03',
        note: 'Nama dusun menunggu verifikasi',
        rw: 2,
        rt: 7,
        households: 254,
    },
    {
        code: 'D-04',
        name: 'Dusun 04',
        note: 'Nama dusun menunggu verifikasi',
        rw: 3,
        rt: 8,
        households: 278,
    },
] as const;

export const dummyLandUseComposition = [
    {
        key: 'agriculture',
        label: 'Pertanian dan perkebunan',
        hectares: 234,
        percentage: 52,
    },
    {
        key: 'settlement',
        label: 'Permukiman',
        hectares: 126,
        percentage: 28,
    },
    {
        key: 'openSpace',
        label: 'Ruang terbuka dan hijau',
        hectares: 54,
        percentage: 12,
    },
    {
        key: 'publicFacilities',
        label: 'Fasilitas umum',
        hectares: 36,
        percentage: 8,
    },
] as const;

export const dummyDemographicDatasets: DemographicDataset[] = [
    {
        key: 'gender',
        label: 'Jenis Kelamin',
        shortLabel: 'Jenis Kelamin',
        description: 'Komposisi penduduk berdasarkan jenis kelamin.',
        unit: 'jiwa',
        total: 3420,
        items: [
            { label: 'Laki-laki', value: 1728 },
            { label: 'Perempuan', value: 1692 },
        ],
    },
    {
        key: 'age',
        label: 'Kelompok Usia',
        shortLabel: 'Usia',
        description: 'Sebaran penduduk menurut kelompok usia.',
        unit: 'jiwa',
        total: 3420,
        items: [
            { label: '0–14 tahun', value: 720 },
            { label: '15–24 tahun', value: 560 },
            { label: '25–44 tahun', value: 1010 },
            { label: '45–64 tahun', value: 790 },
            { label: '65 tahun ke atas', value: 340 },
        ],
    },
    {
        key: 'education',
        label: 'Tingkat Pendidikan',
        shortLabel: 'Pendidikan',
        description: 'Pendidikan terakhir yang tercatat pada data simulasi.',
        unit: 'jiwa',
        total: 3420,
        items: [
            { label: 'Belum/tidak sekolah', value: 280 },
            { label: 'SD/sederajat', value: 890 },
            { label: 'SMP/sederajat', value: 720 },
            { label: 'SMA/sederajat', value: 1060 },
            { label: 'Diploma/Sarjana', value: 420 },
            { label: 'Pascasarjana', value: 50 },
        ],
    },
    {
        key: 'occupation',
        label: 'Jenis Pekerjaan',
        shortLabel: 'Pekerjaan',
        description: 'Komposisi kegiatan utama penduduk.',
        unit: 'jiwa',
        total: 3420,
        items: [
            { label: 'Pelajar/belum bekerja', value: 1360 },
            { label: 'Petani dan peternak', value: 720 },
            { label: 'Buruh', value: 540 },
            { label: 'Pedagang dan UMKM', value: 380 },
            { label: 'Karyawan swasta', value: 290 },
            { label: 'ASN/TNI/Polri', value: 70 },
            { label: 'Lainnya', value: 60 },
        ],
    },
    {
        key: 'religion',
        label: 'Agama',
        shortLabel: 'Agama',
        description: 'Komposisi penduduk berdasarkan agama yang tercatat.',
        unit: 'jiwa',
        total: 3420,
        items: [
            { label: 'Islam', value: 3360 },
            { label: 'Kristen', value: 38 },
            { label: 'Katolik', value: 18 },
            { label: 'Hindu', value: 2 },
            { label: 'Buddha', value: 2 },
        ],
    },
    {
        key: 'residency',
        label: 'Status Kependudukan',
        shortLabel: 'Status',
        description: 'Status administrasi penduduk pada data simulasi.',
        unit: 'jiwa',
        total: 3420,
        items: [
            { label: 'Penduduk tetap', value: 3310 },
            { label: 'Penduduk sementara', value: 72 },
            { label: 'Mutasi dalam proses', value: 38 },
        ],
    },
];
