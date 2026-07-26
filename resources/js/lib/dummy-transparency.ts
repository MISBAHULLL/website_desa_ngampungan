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
