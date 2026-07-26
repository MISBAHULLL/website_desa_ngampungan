export type ApbdesMetricKey =
    'income' | 'expense' | 'netFinancing' | 'estimatedSilpa';

export type ApbdesMetric = {
    key: ApbdesMetricKey;
    label: string;
    value: string;
    description: string;
};

export type ApbdesAllocation = {
    label: string;
    value: string;
    percentage: number;
};

export type DummyPublicDocument = {
    id: string;
    title: string;
    category: string;
    year: string;
    documentDate: string;
    documentDateLabel: string;
    format: 'PDF';
    fileSize: string;
};

export const dummyApbdesSummary = {
    year: '2026',
    updatedAt: '2026-07-20',
    updatedLabel: '20 Juli 2026',
    realizationPercentage: 68,
    realizedAmount: 'Rp1,38 miliar',
    budgetAmount: 'Rp2,03 miliar',
    metrics: [
        {
            key: 'income',
            label: 'Pendapatan Desa',
            value: 'Rp2,14 miliar',
            description: 'Target pendapatan tahun berjalan.',
        },
        {
            key: 'expense',
            label: 'Belanja Desa',
            value: 'Rp2,03 miliar',
            description: 'Pagu belanja seluruh bidang.',
        },
        {
            key: 'netFinancing',
            label: 'Pembiayaan Neto',
            value: 'Rp30 juta',
            description: 'Selisih penerimaan dan pengeluaran pembiayaan.',
        },
        {
            key: 'estimatedSilpa',
            label: 'Perkiraan SILPA',
            value: 'Rp145 juta',
            description: 'Sisa lebih pembiayaan anggaran tahun berjalan.',
        },
    ] satisfies readonly ApbdesMetric[],
    allocations: [
        {
            label: 'Penyelenggaraan Pemerintahan Desa',
            value: 'Rp720 juta',
            percentage: 35.6,
        },
        {
            label: 'Pelaksanaan Pembangunan Desa',
            value: 'Rp650 juta',
            percentage: 32.1,
        },
        {
            label: 'Pembinaan Kemasyarakatan',
            value: 'Rp285 juta',
            percentage: 14.1,
        },
        {
            label: 'Pemberdayaan Masyarakat',
            value: 'Rp250 juta',
            percentage: 12.3,
        },
        {
            label: 'Penanggulangan Bencana dan Keadaan Mendesak',
            value: 'Rp120 juta',
            percentage: 5.9,
        },
    ] satisfies readonly ApbdesAllocation[],
} as const;

export const dummyPublicDocuments = [
    {
        id: 'realisasi-apbdes-semester-1-2026',
        title: 'Laporan Realisasi APBDes Semester I Tahun 2026',
        category: 'Laporan Realisasi',
        year: '2026',
        documentDate: '2026-07-20',
        documentDateLabel: '20 Juli 2026',
        format: 'PDF',
        fileSize: '3,1 MB',
    },
    {
        id: 'apbdes-2026',
        title: 'APBDes Desa Ngampungan Tahun Anggaran 2026',
        category: 'APBDes',
        year: '2026',
        documentDate: '2026-01-10',
        documentDateLabel: '10 Januari 2026',
        format: 'PDF',
        fileSize: '2,4 MB',
    },
    {
        id: 'perdes-penetapan-apbdes-2026',
        title: 'Peraturan Desa tentang Penetapan APBDes Tahun 2026',
        category: 'Peraturan Desa',
        year: '2026',
        documentDate: '2026-01-08',
        documentDateLabel: '8 Januari 2026',
        format: 'PDF',
        fileSize: '1,8 MB',
    },
] satisfies readonly DummyPublicDocument[];
