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
    realizedValue?: string;
    realizedPercentage?: number;
    absorptionPercentage?: number;
};

export type DummyPublicDocument = {
    id: string;
    title: string;
    category: string;
    year: string;
    documentDate: string;
    documentDateLabel: string;
    format: 'PDF' | 'XLS' | 'XLSX';
    fileSize: string;
};

export type ApbdesIncomeSource = {
    code: string;
    label: string;
    amount: string;
    percentage: number;
    description: string;
};

export type ApbdesActivityItem = {
    code: string;
    name: string;
    category:
        | 'pemerintahan'
        | 'pembangunan'
        | 'pembinaan'
        | 'pemberdayaan'
        | 'darurat';
    categoryLabel: string;
    budget: string;
    realized: string;
    percentage: number;
    location: string;
    status: 'selesai' | 'berjalan' | 'direncanakan';
};

export type ApbdesSummaryRecord = {
    year: string;
    updatedAt: string;
    updatedLabel: string;
    realizationPercentage: number;
    incomeAmount?: number;
    expenseAmount?: number;
    realizedAmountValue?: number;
    realizedAmount: string;
    budgetAmount: string;
    incomeValue: string;
    expenseValue: string;
    surplusValue: string;
    metrics: readonly ApbdesMetric[];
    allocations: readonly ApbdesAllocation[];
    incomeSources: readonly ApbdesIncomeSource[];
    activities: readonly ApbdesActivityItem[];
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
        incomeSources: [
            {
                code: '4.1',
                label: 'Dana Desa (DD - APBN)',
                amount: 'Rp1.120.000.000',
                percentage: 52.3,
                description:
                    'Transfer pemerintah pusat untuk pembangunan & BLT',
            },
            {
                code: '4.2',
                label: 'Alokasi Dana Desa (ADD - Kabupaten)',
                amount: 'Rp680.000.000',
                percentage: 31.8,
                description: 'Penghasilan tetap perdes & operasional kantor',
            },
            {
                code: '4.3',
                label: 'Bagi Hasil Pajak & Retribusi (PBH)',
                amount: 'Rp180.000.000',
                percentage: 8.4,
                description: 'Bagi hasil pajak daerah Kabupaten Jombang',
            },
            {
                code: '4.4',
                label: 'Pendapatan Asli Desa (PADes)',
                amount: 'Rp110.000.000',
                percentage: 5.1,
                description: 'Hasil sewa tanah kas desa & bagi hasil BUMDes',
            },
            {
                code: '4.5',
                label: 'Bantuan Keuangan Provinsi / Kab',
                amount: 'Rp50.000.000',
                percentage: 2.4,
                description: 'Bantuan khusus program infrastruktur',
            },
        ],
        activities: [
            {
                code: '2.1.01',
                name: 'Pembangunan Pavingisasi Jalan Usaha Tani',
                category: 'pembangunan',
                categoryLabel: 'Pembangunan Desa',
                budget: 'Rp185.000.000',
                realized: 'Rp145.000.000',
                percentage: 78,
                location: 'Dusun Ngampungan',
                status: 'berjalan',
            },
            {
                code: '2.1.02',
                name: 'Rehabilitasi Drainase Pemukiman RT 03/RW 01',
                category: 'pembangunan',
                categoryLabel: 'Pembangunan Desa',
                budget: 'Rp120.000.000',
                realized: 'Rp120.000.000',
                percentage: 100,
                location: 'Dusun Wates',
                status: 'selesai',
            },
            {
                code: '1.1.01',
                name: 'Penghasilan Tetap & Tunjangan Aparatur Desa',
                category: 'pemerintahan',
                categoryLabel: 'Pemerintahan',
                budget: 'Rp480.000.000',
                realized: 'Rp360.000.000',
                percentage: 75,
                location: 'Kantor Desa',
                status: 'berjalan',
            },
            {
                code: '4.1.01',
                name: 'Pelatihan & Pendampingan UMKM Keripik Pisang',
                category: 'pemberdayaan',
                categoryLabel: 'Pemberdayaan',
                budget: 'Rp65.000.000',
                realized: 'Rp65.000.000',
                percentage: 100,
                location: 'Balai Desa',
                status: 'selesai',
            },
            {
                code: '3.1.01',
                name: 'Penyelenggaraan Festival Budaya & Sedekah Bumi',
                category: 'pembinaan',
                categoryLabel: 'Pembinaan',
                budget: 'Rp45.000.000',
                realized: 'Rp45.000.000',
                percentage: 100,
                location: 'Lapangan Desa',
                status: 'selesai',
            },
            {
                code: '5.1.01',
                name: 'Penyaluran Bantuan Langsung Tunai (BLT-DD)',
                category: 'darurat',
                categoryLabel: 'Keadaan Mendesak',
                budget: 'Rp120.000.000',
                realized: 'Rp90.000.000',
                percentage: 75,
                location: 'Semua Dusun',
                status: 'berjalan',
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
        incomeSources: [
            {
                code: '4.1',
                label: 'Dana Desa (DD - APBN)',
                amount: 'Rp1.050.000.000',
                percentage: 53.0,
                description: 'Realisasi akhir Dana Desa 2025',
            },
            {
                code: '4.2',
                label: 'Alokasi Dana Desa (ADD - Kabupaten)',
                amount: 'Rp640.000.000',
                percentage: 32.3,
                description: 'Realisasi ADD Kabupaten Jombang',
            },
            {
                code: '4.3',
                label: 'Bagi Hasil Pajak & Retribusi (PBH)',
                amount: 'Rp160.000.000',
                percentage: 8.1,
                description: 'Bagi hasil pajak & retribusi daerah',
            },
            {
                code: '4.4',
                label: 'Pendapatan Asli Desa (PADes)',
                amount: 'Rp90.000.000',
                percentage: 4.5,
                description: 'Hasil pengelolaan tanah kas & BUMDes',
            },
            {
                code: '4.5',
                label: 'Bantuan Keuangan Provinsi / Kab',
                amount: 'Rp40.000.000',
                percentage: 2.1,
                description: 'Bantuan fisik sarana publik',
            },
        ],
        activities: [
            {
                code: '2.1.01',
                name: 'Pembangunan Penerangan Jalan Umum (PJU) Solar Cell',
                category: 'pembangunan',
                categoryLabel: 'Pembangunan Desa',
                budget: 'Rp150.000.000',
                realized: 'Rp150.000.000',
                percentage: 100,
                location: 'Jalan Utama Desa',
                status: 'selesai',
            },
            {
                code: '2.1.02',
                name: 'Pembangunan MCK Komunal Dusun Wates',
                category: 'pembangunan',
                categoryLabel: 'Pembangunan Desa',
                budget: 'Rp95.000.000',
                realized: 'Rp95.000.000',
                percentage: 100,
                location: 'Dusun Wates',
                status: 'selesai',
            },
            {
                code: '1.1.01',
                name: 'Operasional Pemerintah & Badan Permusyawaratan Desa',
                category: 'pemerintahan',
                categoryLabel: 'Pemerintahan',
                budget: 'Rp450.000.000',
                realized: 'Rp450.000.000',
                percentage: 100,
                location: 'Kantor Desa',
                status: 'selesai',
            },
            {
                code: '4.1.01',
                name: 'Pengadaan Alat Mesin Pertanian (Alsintan) Poktan',
                category: 'pemberdayaan',
                categoryLabel: 'Pemberdayaan',
                budget: 'Rp110.000.000',
                realized: 'Rp110.000.000',
                percentage: 100,
                location: 'Kelompok Tani',
                status: 'selesai',
            },
        ],
    },
];

/**
 * Dynamically computes total budget, realized amounts, absorption percentages,
 * 5-bidang allocation breakdowns, and SILPA from underlying activity records.
 */
export function computeDynamicSummary(
    summary: ApbdesSummaryRecord,
): ApbdesSummaryRecord {
    // 1. Calculate total income from income sources
    const totalIncomeNum = summary.incomeSources.reduce((acc, src) => {
        const val = parseFloat(src.amount.replace(/[^0-9]/g, '')) || 0;

        return acc + val;
    }, 0);

    // 2. Calculate total budget and realized expense from activities
    let totalBudgetNum = 0;
    let totalRealizedNum = 0;

    const categoryTotals: Record<
        string,
        { label: string; budget: number; realized: number }
    > = {
        pemerintahan: {
            label: 'Penyelenggaraan Pemerintahan Desa',
            budget: 0,
            realized: 0,
        },
        pembangunan: {
            label: 'Pelaksanaan Pembangunan Desa',
            budget: 0,
            realized: 0,
        },
        pembinaan: {
            label: 'Pembinaan Kemasyarakatan',
            budget: 0,
            realized: 0,
        },
        pemberdayaan: {
            label: 'Pemberdayaan Masyarakat',
            budget: 0,
            realized: 0,
        },
        darurat: {
            label: 'Penanggulangan Bencana dan Keadaan Mendesak',
            budget: 0,
            realized: 0,
        },
    };

    summary.activities.forEach((act) => {
        const b = parseFloat(act.budget.replace(/[^0-9]/g, '')) || 0;
        const r = parseFloat(act.realized.replace(/[^0-9]/g, '')) || 0;
        totalBudgetNum += b;
        totalRealizedNum += r;

        if (categoryTotals[act.category]) {
            categoryTotals[act.category].budget += b;
            categoryTotals[act.category].realized += r;
        }
    });

    const realizationPercentage =
        totalBudgetNum > 0
            ? Math.round((totalRealizedNum / totalBudgetNum) * 100)
            : 0;

    const dynamicAllocations: ApbdesAllocation[] = Object.values(
        categoryTotals,
    ).map((cat) => {
        const pct =
            totalBudgetNum > 0
                ? parseFloat(((cat.budget / totalBudgetNum) * 100).toFixed(1))
                : 0;
        const valJuta = (cat.budget / 1_000_000).toLocaleString('id-ID');

        return {
            label: cat.label,
            value: `Rp${valJuta} juta`,
            percentage: pct,
        };
    });

    return {
        ...summary,
        realizationPercentage,
        realizedAmount: `Rp${(totalRealizedNum / 1_000_000_000).toFixed(2).replace('.', ',')} miliar`,
        budgetAmount: `Rp${(totalBudgetNum / 1_000_000_000).toFixed(2).replace('.', ',')} miliar`,
        incomeValue: `Rp${(totalIncomeNum / 1_000_000_000).toFixed(2).replace('.', ',')} miliar`,
        allocations: dynamicAllocations,
    };
}

/**
 * Returns summaries for the 5 most recent fiscal years (sorted descending).
 * If the dataset grows beyond 5 years, older years automatically roll off.
 */
export function getLatest5YearsSummaries(): readonly ApbdesSummaryRecord[] {
    return [...dummyApbdesSummaries]
        .map(computeDynamicSummary)
        .sort((a, b) => Number(b.year) - Number(a.year))
        .slice(0, 5);
}

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
