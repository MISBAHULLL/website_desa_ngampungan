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

export type ApbdesSummaryRecord = {
    year: string;
    updatedAt: string;
    updatedLabel: string;
    realizationPercentage: number;
    realizedAmount: string;
    budgetAmount: string;
    incomeValue: string;
    expenseValue: string;
    surplusValue: string;
    metrics: readonly ApbdesMetric[];
    allocations: readonly ApbdesAllocation[];
};

export const dummyApbdesSummaries: readonly ApbdesSummaryRecord[] = [
    {
        year: '2026',
        updatedAt: '2026-07-20',
        updatedLabel: '20 Juli 2026',
        realizationPercentage: 68,
        realizedAmount: 'Rp1,38 miliar',
        budgetAmount: 'Rp2,03 miliar',
        incomeValue: 'Rp2,14 miliar',
        expenseValue: 'Rp2,03 miliar',
        surplusValue: '+Rp110 juta',
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
        ],
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
        ],
    },
    {
        year: '2025',
        updatedAt: '2025-12-31',
        updatedLabel: '31 Desember 2025',
        realizationPercentage: 96,
        realizedAmount: 'Rp1,87 miliar',
        budgetAmount: 'Rp1,95 miliar',
        incomeValue: 'Rp1,98 miliar',
        expenseValue: 'Rp1,95 miliar',
        surplusValue: '+Rp30 juta',
        metrics: [
            {
                key: 'income',
                label: 'Pendapatan Desa',
                value: 'Rp1,98 miliar',
                description: 'Realisasi akhir pendapatan TA 2025.',
            },
            {
                key: 'expense',
                label: 'Belanja Desa',
                value: 'Rp1,95 miliar',
                description: 'Realisasi akhir belanja TA 2025.',
            },
            {
                key: 'netFinancing',
                label: 'Pembiayaan Neto',
                value: 'Rp25 juta',
                description: 'Selisih pembiayaan TA 2025.',
            },
            {
                key: 'estimatedSilpa',
                label: 'SILPA Terbukti',
                value: 'Rp55 juta',
                description: 'SILPA akhir TA 2025.',
            },
        ],
        allocations: [
            {
                label: 'Penyelenggaraan Pemerintahan Desa',
                value: 'Rp680 juta',
                percentage: 34.8,
            },
            {
                label: 'Pelaksanaan Pembangunan Desa',
                value: 'Rp640 juta',
                percentage: 32.8,
            },
            {
                label: 'Pembinaan Kemasyarakatan',
                value: 'Rp270 juta',
                percentage: 13.8,
            },
            {
                label: 'Pemberdayaan Masyarakat',
                value: 'Rp240 juta',
                percentage: 12.3,
            },
            {
                label: 'Penanggulangan Bencana dan Keadaan Mendesak',
                value: 'Rp120 juta',
                percentage: 6.3,
            },
        ],
    },
];

export const dummyApbdesSummary = dummyApbdesSummaries[0];

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
