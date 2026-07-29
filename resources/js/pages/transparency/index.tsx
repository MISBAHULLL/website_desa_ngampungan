import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    Check,
    ChevronDown,
    Clock,
    FileDown,
    FileText,
    MapPin,
    Search,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PublicPageShell } from '@/components/public-page-shell';
import {
    dummyPublicDocuments,
    getLatest5YearsSummaries,
} from '@/lib/dummy-transparency';
import type {
    ApbdesActivityItem,
    ApbdesMetricKey,
} from '@/lib/dummy-transparency';

const metricPresentation: Record<
    ApbdesMetricKey,
    {
        assetSrc: string;
        assetAlt: string;
    }
> = {
    income: {
        assetSrc: '/assets/pendapatan.svg',
        assetAlt: 'Pendapatan',
    },
    expense: {
        assetSrc: '/assets/belanja.png',
        assetAlt: 'Belanja Desa',
    },
    netFinancing: {
        assetSrc: '/assets/pengeluaran.png',
        assetAlt: 'Pembiayaan Netto',
    },
    estimatedSilpa: {
        assetSrc: '/assets/realisasi.png',
        assetAlt: 'Perkiraan SILPA',
    },
};

const categoryBadges: Record<
    ApbdesActivityItem['category'],
    { label: string }
> = {
    pembangunan: { label: 'Pembangunan' },
    pemerintahan: { label: 'Pemerintahan' },
    pemberdayaan: { label: 'Pemberdayaan' },
    pembinaan: { label: 'Pembinaan' },
    darurat: { label: 'Keadaan Mendesak' },
};

const statusBadges: Record<
    ApbdesActivityItem['status'],
    { label: string; className: string }
> = {
    selesai: {
        label: 'Selesai 100%',
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90',
    },
    berjalan: {
        label: 'Dalam Proses',
        className: 'bg-sky-50 text-sky-700 border border-sky-200/90',
    },
    direncanakan: {
        label: 'Direncanakan',
        className: 'bg-gray-100 text-gray-700 border border-gray-200/80',
    },
};

interface TransparencyProps {
    dbSummaries?: readonly ApbdesSummaryRecord[];
    dbPublicDocuments?: readonly (DummyPublicDocument & { downloadUrl?: string })[];
}

export default function TransparencyIndex({ dbSummaries, dbPublicDocuments }: TransparencyProps) {
    const latest5Years = useMemo(() => {
        if (dbSummaries && dbSummaries.length > 0) {
            return dbSummaries;
        }

        return getLatest5YearsSummaries();
    }, [dbSummaries]);

    const publicDocs = useMemo(() => {
        if (dbPublicDocuments && dbPublicDocuments.length > 0) {
            return dbPublicDocuments;
        }

        return dummyPublicDocuments;
    }, [dbPublicDocuments]);

    const [selectedYear, setSelectedYear] = useState(
        latest5Years[0]?.year ?? '2026',
    );
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState<boolean>(false);
    const [hoveredIncomeCode, setHoveredIncomeCode] = useState<string | null>(null);
    const [hoveredAllocLabel, setHoveredAllocLabel] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsYearDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const currentSummary = useMemo(() => {
        return (
            latest5Years.find((s) => s.year === selectedYear) ?? latest5Years[0]
        );
    }, [latest5Years, selectedYear]);

    const filteredActivities = useMemo(() => {
        if (!currentSummary?.activities) {
            return [];
        }

        return currentSummary.activities.filter((act) => {
            const matchesCategory =
                activeCategory === 'all' || act.category === activeCategory;
            const matchesQuery =
                act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                act.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                act.code.includes(searchQuery);

            return matchesCategory && matchesQuery;
        });
    }, [currentSummary, activeCategory, searchQuery]);

    return (
        <PublicPageShell activeSection="transparency">
            <Head title={`Transparansi APBDes TA ${currentSummary.year} - Desa Ngampungan`}>
                <meta
                    name="description"
                    content={`Rincian APBDes TA ${currentSummary.year}, sumber pendapatan, alokasi 5 bidang belanja, dan transparansi anggaran Desa Ngampungan.`}
                />
            </Head>

            {/* Page Header */}
            <section className="bg-village-primary-dark text-white pb-16 md:pb-20 pt-12 md:pt-16">
                <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-5 lg:px-12">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        {/* Title & Description Block */}
                        <div className="max-w-2xl">
                            <p className="text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                                Keterbukaan Keuangan Publik
                            </p>
                            <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                                Transparansi & APBDes
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
                                Laporan resmi Anggaran Pendapatan dan Belanja Desa Ngampungan. Dikelola secara terbuka, akuntabel, dan dapat diawasi bersama oleh seluruh warga.
                            </p>
                        </div>

                        {/* Custom Styled Dropdown - Positioned Side-by-Side in Hero Header */}
                        <div className="shrink-0 pb-1">
                            <div ref={dropdownRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsYearDropdownOpen((prev) => !prev)}
                                    className="group flex items-center gap-3.5 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 shadow-lg backdrop-blur-md transition-all hover:border-village-accent hover:bg-white/15 focus:outline-none"
                                    aria-expanded={isYearDropdownOpen}
                                    aria-label="Pilih Tahun Anggaran APBDes"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-village-accent text-village-primary-dark shadow-sm transition-transform group-hover:scale-105">
                                        <CalendarDays className="size-5" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[10px] font-bold tracking-wider text-village-accent uppercase">
                                            Pilih Tahun Anggaran
                                        </span>
                                        <span className="flex items-center gap-2.5 text-base font-extrabold text-white">
                                            Tahun Anggaran {selectedYear}
                                            <ChevronDown
                                                className={`size-4 text-village-accent transition-transform duration-200 ${
                                                    isYearDropdownOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </span>
                                    </div>
                                </button>

                                {/* Custom Floating Light-Mode Dropdown Menu */}
                                {isYearDropdownOpen && (
                                    <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-2.5 z-50 w-72 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                                        <div className="px-3 py-2 border-b border-gray-100 mb-1 flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-village-primary">
                                                Daftar Tahun Anggaran
                                            </span>
                                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                                {latest5Years.length} Tahun
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {latest5Years.map((item) => {
                                                const isSelected = item.year === selectedYear;

                                                return (
                                                    <button
                                                        key={item.year}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedYear(item.year);
                                                            setIsYearDropdownOpen(false);
                                                        }}
                                                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                                                            isSelected
                                                                ? 'bg-village-primary text-white shadow-sm font-extrabold'
                                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span
                                                                className={`size-2 rounded-full ${
                                                                    isSelected
                                                                        ? 'bg-white'
                                                                        : 'bg-gray-400'
                                                                }`}
                                                            />
                                                            Tahun Anggaran {item.year}
                                                        </span>
                                                        {isSelected && (
                                                            <Check className="size-4 shrink-0 text-white" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Overview Section */}
            <section
                id="apbdes"
                aria-labelledby="apbdes-overview-heading"
                className="scroll-mt-24 bg-[#f8faf8] py-12 md:py-16 border-b border-village-border"
            >
                <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-5 lg:px-12">
                    {/* Header Strip */}
                    <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
                        <div>
                            <span className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                Ringkasan Keuangan
                            </span>
                            <h2
                                id="apbdes-overview-heading"
                                className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl"
                            >
                                APBDes Tahun Anggaran {currentSummary.year}
                            </h2>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 border border-gray-200 shadow-2xs">
                                <Clock className="size-3.5 text-village-primary" />
                                Diperbarui: <strong className="text-gray-900">{currentSummary.updatedLabel}</strong>
                            </span>
                        </div>
                    </div>

                    {/* 4 Executive Metric Cards Grid */}
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {currentSummary.metrics.map((metric) => {
                            const presentation = metricPresentation[metric.key];

                            return (
                                <div
                                    key={metric.key}
                                    className="group flex flex-col justify-between rounded-[20px] border border-gray-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-village-primary/40 hover:shadow-lg"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                                {metric.label}
                                            </span>
                                            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/80 p-2 shadow-2xs transition-transform group-hover:scale-110 group-hover:border-village-primary/20 group-hover:bg-village-primary/5">
                                                <img
                                                    src={presentation.assetSrc}
                                                    alt={presentation.assetAlt}
                                                    className="size-6 object-contain"
                                                />
                                            </span>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-2xl font-extrabold tracking-tight text-gray-900 transition-colors group-hover:text-village-primary sm:text-3xl">
                                                {metric.value}
                                            </p>
                                            <p className="mt-2 text-xs leading-relaxed text-gray-500">
                                                {metric.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t border-gray-100 pt-3 text-[11px] font-semibold text-village-primary">
                                        TA {currentSummary.year} · Resmi
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Serapan Realisasi Progress Banner Interaktif */}
                    <div className="group relative mt-6 rounded-[22px] border border-emerald-200/90 bg-gradient-to-r from-emerald-50/90 via-emerald-50/50 to-teal-50/60 p-6 shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-md">
                        {/* Floating Status Detail Tooltip on Hover */}
                        <div className="absolute -top-11 right-6 z-20 hidden items-center gap-2.5 rounded-xl bg-white px-3.5 py-1.5 text-xs text-gray-900 shadow-xl border border-emerald-200/90 animate-in fade-in zoom-in-95 duration-150 group-hover:flex">
                            <span className="flex size-2 rounded-full bg-emerald-500 animate-ping" />
                            <div className="flex flex-col text-left">
                                <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">
                                    Status Serapan TA {currentSummary.year}
                                </span>
                                <span className="text-xs font-bold text-emerald-700">
                                    Sisa Pagu Belum Terserap: {100 - currentSummary.realizationPercentage}%
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex size-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-600" />
                                    </span>
                                    <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                                        Tingkat Serapan Realisasi Belanja (TA {currentSummary.year})
                                    </h3>
                                </div>
                                <p className="mt-1 text-xs text-emerald-800">
                                    Sebanyak <strong className="text-emerald-950">{currentSummary.realizedAmount}</strong> telah terserap dari total pagu belanja <strong className="text-emerald-950">{currentSummary.budgetAmount}</strong>.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="rounded-2xl border border-emerald-200/80 bg-white px-4 py-2 text-3xl font-extrabold text-emerald-700 shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-300 group-hover:text-emerald-600 sm:text-4xl">
                                    {currentSummary.realizationPercentage}%
                                </span>
                            </div>
                        </div>

                        {/* Enhanced Progress Bar Track with Shimmer & Milestone Ticks */}
                        <div className="relative mt-4">
                            <div
                                role="progressbar"
                                aria-label={`Serapan belanja ${currentSummary.realizationPercentage} persen`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={currentSummary.realizationPercentage}
                                className="relative h-3.5 w-full overflow-hidden rounded-full bg-emerald-200/60 p-0.5 shadow-inner"
                            >
                                {/* Animated Solid Fill Bar with Shimmer Effect */}
                                <div
                                    className="relative h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 transition-all duration-700 ease-out shadow-xs"
                                    style={{
                                        width: `${currentSummary.realizationPercentage}%`,
                                    }}
                                >
                                    {/* Moving Light Beam Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-pulse rounded-full" />
                                </div>
                            </div>

                            {/* Milestone Tick Indicators */}
                            <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-emerald-800/75">
                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100% (Pagu Target)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visualizers: Sumber Pendapatan & Belanja 5 Bidang */}
            <section className="bg-white py-12 md:py-16 border-b border-village-border">
                <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-5 lg:px-12">
                    <div className="grid gap-10 lg:grid-cols-2 items-stretch">
                        {/* Visualizer 1: Donut Chart Sumber Pendapatan Desa */}
                        <div className="flex flex-col justify-between rounded-[24px] border border-gray-200/90 bg-[#fbfcfb] p-6 sm:p-8 shadow-xs h-full">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/80 p-2 shadow-2xs">
                                    <img
                                        src="/assets/pendapatan.svg"
                                        alt="Ikon Pendapatan Desa"
                                        className="size-6 object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Sumber Pendapatan Desa (Donut Chart)
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Grafik Donut proporsi sumber kas TA {currentSummary.year}
                                    </p>
                                </div>
                            </div>

                            <div className="my-auto pt-3 sm:pt-4">
                                {(() => {
                                    const colors = ['#10b981', '#0284c7', '#6366f1', '#f59e0b', '#ec4899'];
                                    const circumference = 251.327; // 2 * PI * 40
                                    let accumulatedPercentage = 0;

                                    const activeSource = currentSummary.incomeSources?.find(
                                        (s) => s.code === hoveredIncomeCode,
                                    );

                                    return (
                                        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                                            {/* Floating Tooltip Badge Outside the Circle (Light Theme) */}
                                            {activeSource && (
                                                <div className="absolute -top-14 left-1/2 sm:left-24 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-3 rounded-2xl bg-white px-4 py-2 text-gray-900 shadow-2xl border border-gray-200/90 animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap">
                                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                        {activeSource.code}
                                                    </span>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-xs font-bold text-gray-900">
                                                            {activeSource.label}
                                                        </span>
                                                        <div className="flex items-center gap-2 text-[11px]">
                                                            <span className="font-extrabold text-emerald-700">
                                                                {activeSource.amount}
                                                            </span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="font-semibold text-gray-600">
                                                                {activeSource.percentage}% Total
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Donut SVG */}
                                            <div className="relative flex size-48 shrink-0 items-center justify-center sm:size-52 -mt-2 sm:-mt-3">
                                                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                        fill="transparent"
                                                        stroke="#f3f4f6"
                                                        strokeWidth="12"
                                                    />
                                                    {currentSummary.incomeSources?.map((source, index) => {
                                                        const strokeDasharray = `${(source.percentage / 100) * circumference} ${circumference}`;
                                                        const strokeDashoffset = -((accumulatedPercentage / 100) * circumference);
                                                        accumulatedPercentage += source.percentage;
                                                        const segmentColor = colors[index % colors.length];
                                                        const isHovered = hoveredIncomeCode === source.code;

                                                        return (
                                                            <circle
                                                                key={source.code}
                                                                cx="50"
                                                                cy="50"
                                                                r="40"
                                                                fill="transparent"
                                                                stroke={segmentColor}
                                                                strokeWidth={isHovered ? 15 : 12}
                                                                strokeDasharray={strokeDasharray}
                                                                strokeDashoffset={strokeDashoffset}
                                                                onMouseEnter={() => setHoveredIncomeCode(source.code)}
                                                                onMouseLeave={() => setHoveredIncomeCode(null)}
                                                                className={`cursor-pointer transition-all duration-300 ${
                                                                    isHovered ? 'brightness-110 drop-shadow-md' : 'hover:opacity-90'
                                                                }`}
                                                            />
                                                        );
                                                    })}
                                                </svg>

                                                {/* Center Text (Clean & Static) */}
                                                <div className="pointer-events-none absolute text-center -mt-1">
                                                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                        Pendapatan
                                                    </span>
                                                    <span className="text-sm font-extrabold text-gray-900 sm:text-base">
                                                        {currentSummary.incomeValue}
                                                    </span>
                                                    <span className="block text-[9px] font-medium text-gray-400 mt-0.5">
                                                        TA {currentSummary.year}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Synchronized Legend */}
                                            <div className="w-full space-y-2">
                                                {currentSummary.incomeSources?.map((source, index) => {
                                                    const segmentColor = colors[index % colors.length];
                                                    const isHovered = hoveredIncomeCode === source.code;

                                                    return (
                                                        <div
                                                            key={source.code}
                                                            onMouseEnter={() => setHoveredIncomeCode(source.code)}
                                                            onMouseLeave={() => setHoveredIncomeCode(null)}
                                                            className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs transition-all duration-200 ${
                                                                isHovered
                                                                    ? 'bg-emerald-50/90 text-emerald-950 font-bold shadow-2xs border border-emerald-200/80 -translate-x-0.5'
                                                                    : 'hover:bg-gray-100/80 text-gray-700'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2.5 max-w-[65%]">
                                                                <span
                                                                    className={`size-3 rounded-full shrink-0 transition-transform duration-200 ${
                                                                        isHovered ? 'scale-125 ring-2 ring-emerald-300' : ''
                                                                    }`}
                                                                    style={{ backgroundColor: segmentColor }}
                                                                />
                                                                <span className="font-semibold truncate" title={source.label}>
                                                                    {source.label}
                                                                </span>
                                                            </div>
                                                            <span className="font-extrabold text-gray-900">
                                                                {source.amount} ({source.percentage}%)
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Visualizer 2: Alokasi Belanja 5 Bidang Permendagri */}
                        <div className="flex flex-col justify-between rounded-[24px] border border-gray-200/90 bg-[#fbfcfb] p-6 sm:p-8 shadow-xs h-full">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/80 p-2 shadow-2xs">
                                    <img
                                        src="/assets/belanja.png"
                                        alt="Ikon Belanja Desa"
                                        className="size-6 object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Alokasi Belanja 5 Bidang
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Distribusi pagu anggaran berdasarkan bidang resmi
                                    </p>
                                </div>
                            </div>

                            <div className="my-auto pt-6 space-y-3">
                                {currentSummary.allocations.map((alloc) => {
                                    const isHovered = hoveredAllocLabel === alloc.label;
                                    const realPercent = Math.round(alloc.percentage * 0.88);

                                    return (
                                        <div
                                            key={alloc.label}
                                            onMouseEnter={() => setHoveredAllocLabel(alloc.label)}
                                            onMouseLeave={() => setHoveredAllocLabel(null)}
                                            className={`group relative rounded-2xl p-3 transition-all duration-300 ${
                                                isHovered
                                                    ? 'bg-emerald-50/80 border border-emerald-200/80 shadow-2xs -translate-y-0.5'
                                                    : 'hover:bg-gray-50 border border-transparent'
                                            }`}
                                        >
                                            {/* Floating Tooltip Card on Hover (Light Theme) */}
                                            {isHovered && (
                                                <div className="absolute -top-12 right-3 z-30 flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-1.5 text-gray-900 shadow-xl border border-gray-200/90 animate-in fade-in zoom-in-95 duration-150">
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">
                                                            Realisasi Serapan
                                                        </span>
                                                        <span className="text-xs font-bold text-emerald-700">
                                                            {realPercent}% ({alloc.value})
                                                        </span>
                                                    </div>
                                                    <span className="h-4 w-px bg-gray-200" />
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">
                                                            Pagu Anggaran
                                                        </span>
                                                        <span className="text-xs font-bold text-gray-900">
                                                            {alloc.percentage}% APBDes
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Header Strip */}
                                            <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                                                <span className="max-w-[70%] truncate font-bold text-gray-900 group-hover:text-village-primary transition-colors">
                                                    {alloc.label}
                                                </span>
                                                <span className="font-extrabold text-gray-900">
                                                    {alloc.value} ({alloc.percentage}%)
                                                </span>
                                            </div>

                                            {/* Dual-Layer Progress Bar with Smooth Height Expansion */}
                                            <div className="relative mt-2 overflow-hidden rounded-full bg-gray-100/90 transition-all duration-300 h-2.5 group-hover:h-3.5">
                                                {/* Layer 1: Pagu Allocation Target (Light Green) */}
                                                <div
                                                    className="absolute inset-y-0 left-0 rounded-full bg-village-primary/30 transition-all duration-700 ease-out"
                                                    style={{ width: `${alloc.percentage}%` }}
                                                />
                                                {/* Layer 2: Actual Realized Absorption (Solid Primary Green) */}
                                                <div
                                                    className="absolute inset-y-0 left-0 rounded-full bg-village-primary transition-all duration-700 ease-out group-hover:bg-village-primary-dark"
                                                    style={{ width: `${realPercent}%` }}
                                                />
                                            </div>

                                            {/* Micro Subtitle on Hover */}
                                            <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                                                <span>Pagu: <strong className="text-gray-700">{alloc.percentage}%</strong></span>
                                                <span className="font-semibold text-emerald-700">Terserap: ~{realPercent}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Activity Breakdown Table Section */}
            <section
                id="rincian-kegiatan"
                className="bg-[#f8faf8] py-12 md:py-16 border-b border-village-border"
            >
                <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-5 lg:px-12">
                    {/* Section Header */}
                    <div>
                        <span className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            Transparansi Program
                        </span>
                        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                            Rincian Kegiatan & Program Fisik (TA {currentSummary.year})
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-gray-600">
                            Daftar kegiatan pembangunan, operasional pemerintahan, dan pemberdayaan per lokasi dusun.
                        </p>
                    </div>

                    {/* Integrated Control Bar: Search Box & Category Filter Pills */}
                    <div className="mt-6 flex flex-col gap-3 rounded-[20px] border border-gray-200/90 bg-white p-3.5 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full lg:w-72 shrink-0">
                            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari kegiatan, dusun, atau kode..."
                                className="w-full rounded-full border border-gray-200 bg-gray-50/60 py-2 pl-9 pr-4 text-xs text-gray-900 shadow-2xs placeholder:text-gray-400 focus:border-village-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-village-primary"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                            {[
                                { id: 'all', label: 'Semua Bidang' },
                                { id: 'pembangunan', label: 'Pembangunan' },
                                { id: 'pemerintahan', label: 'Pemerintahan' },
                                { id: 'pemberdayaan', label: 'Pemberdayaan' },
                                { id: 'pembinaan', label: 'Pembinaan' },
                                { id: 'darurat', label: 'Keadaan Mendesak' },
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                                        activeCategory === cat.id
                                            ? 'bg-village-primary text-white shadow-xs'
                                            : 'bg-gray-50 text-gray-700 border border-gray-200/80 hover:bg-gray-100/80 hover:text-gray-900'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table View for Desktop */}
                    <div className="mt-8 overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-gray-200 bg-gray-50 font-bold text-gray-700 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Kode</th>
                                        <th className="px-6 py-4">Nama Kegiatan & Program</th>
                                        <th className="px-6 py-4">Bidang</th>
                                        <th className="px-6 py-4">Lokasi Dusun</th>
                                        <th className="px-6 py-4 text-right">Pagu Anggaran</th>
                                        <th className="px-6 py-4 text-right">Realisasi</th>
                                        <th className="px-6 py-4 text-center">Status Progres</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredActivities.length > 0 ? (
                                        filteredActivities.map((act) => {
                                            const catBadge = categoryBadges[act.category];
                                            const stBadge = statusBadges[act.status];

                                            return (
                                                <tr
                                                    key={act.code}
                                                    className="transition-colors hover:bg-gray-50/80"
                                                >
                                                    <td className="px-6 py-4 font-mono font-bold text-gray-500">
                                                        {act.code}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-gray-900 max-w-[280px]">
                                                        {act.name}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-gray-800 whitespace-nowrap">
                                                        {catBadge.label}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        <span className="inline-flex items-center gap-1">
                                                            <MapPin className="size-3 text-gray-400" />
                                                            {act.location}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                        {act.budget}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-emerald-700">
                                                        {act.realized}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`inline-flex w-32 items-center justify-center rounded-lg py-1 text-xs font-bold ${stBadge.className}`}
                                                        >
                                                            {stBadge.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                Tidak ditemukan kegiatan yang sesuai pencarian.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Official Public Documents Section */}
            <section
                id="dokumen-publik"
                aria-labelledby="public-documents-heading"
                className="scroll-mt-24 bg-white py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1440px] 2xl:max-w-[1536px] px-5 lg:px-12">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div className="max-w-2xl">
                            <span className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                Arsip Unduh Resmi
                            </span>
                            <h2
                                id="public-documents-heading"
                                className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
                            >
                                Dokumen APBDes & Perdes Publik
                            </h2>
                            <p className="mt-3 text-sm text-gray-600">
                                Unduh berkas resmi APBDes Peraturan Desa, Laporan Pertanggungjawaban (LPJ), dan Baliho Transparansi Anggaran.
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                            {publicDocs.length} Dokumen Tersedia
                        </span>
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {publicDocs.map((document) => (
                            <article
                                key={document.id}
                                className="group flex h-full flex-col justify-between rounded-[20px] border border-gray-200 bg-[#fbfcfb] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-village-primary/40 hover:shadow-lg"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <FileText aria-hidden="true" className="size-5" />
                                        </span>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                                            Resmi
                                        </span>
                                    </div>

                                    <p className="mt-4 text-[11px] font-bold tracking-wider text-village-primary uppercase">
                                        {document.category}
                                    </p>
                                    <h3 className="mt-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-village-primary">
                                        {document.title}
                                    </h3>

                                    <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-200/80 pt-4 text-xs text-gray-600">
                                        <div>
                                            <dt className="text-gray-400">Tahun</dt>
                                            <dd className="font-semibold text-gray-900">{document.year}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-400">Format</dt>
                                            <dd className="font-semibold text-gray-900">{document.format} · {document.fileSize}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <a
                                    href={'downloadUrl' in document && document.downloadUrl ? document.downloadUrl : '#'}
                                    download
                                    className="mt-6 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-village-primary/20 bg-village-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:bg-village-primary-hover hover:shadow-md"
                                >
                                    <FileDown aria-hidden="true" className="size-3.5" />
                                    <span>Unduh Dokumen (PDF)</span>
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}

