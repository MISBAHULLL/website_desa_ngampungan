import { TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ApbdesSummaryRecord } from '@/lib/dummy-transparency';

type Props = {
    summaries: readonly ApbdesSummaryRecord[];
};

type Series = {
    key: 'incomeAmount' | 'expenseAmount' | 'realizedAmountValue';
    label: string;
    color: string;
};

const series: Series[] = [
    { key: 'incomeAmount', label: 'Pendapatan', color: '#0f766e' },
    { key: 'expenseAmount', label: 'Pagu belanja', color: '#d97706' },
    { key: 'realizedAmountValue', label: 'Realisasi', color: '#2563eb' },
];

const compactRupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    notation: 'compact',
    maximumFractionDigits: 1,
});

const fullRupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export function ApbdesTrendChart({ summaries }: Props) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const chartData = useMemo(
        () =>
            [...summaries]
                .filter(
                    (summary) =>
                        summary.incomeAmount !== undefined &&
                        summary.expenseAmount !== undefined &&
                        summary.realizedAmountValue !== undefined,
                )
                .sort((first, second) => first.year.localeCompare(second.year)),
        [summaries],
    );

    if (chartData.length === 0) {
        return null;
    }

    const width = 760;
    const height = 280;
    const padding = { top: 24, right: 28, bottom: 42, left: 76 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(
        ...chartData.flatMap((summary) =>
            series.map((item) => Number(summary[item.key] ?? 0)),
        ),
        1,
    );
    const roundedMax = Math.ceil(maxValue / 100_000_000) * 100_000_000;
    const xPosition = (index: number) =>
        chartData.length === 1
            ? padding.left + plotWidth / 2
            : padding.left + (index / (chartData.length - 1)) * plotWidth;
    const yPosition = (value: number) =>
        padding.top + plotHeight - (value / roundedMax) * plotHeight;
    const linePath = (item: Series) =>
        chartData
            .map((summary, index) => {
                const x = xPosition(index);
                const y = yPosition(Number(summary[item.key] ?? 0));

                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');

    return (
        <section
            aria-labelledby="apbdes-trend-heading"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:p-7"
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <TrendingUp className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                        <h2
                            id="apbdes-trend-heading"
                            className="text-lg font-bold text-gray-900"
                        >
                            Tren Anggaran Antar Tahun
                        </h2>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            Perbandingan pendapatan, pagu belanja, dan realisasi
                            dari data APBDes yang dikelola admin.
                        </p>
                    </div>
                </div>

                <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-gray-700">
                    {series.map((item) => (
                        <li key={item.key} className="flex items-center gap-2">
                            <span
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-5 overflow-x-auto pb-1">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    role="img"
                    aria-label="Line chart tren pendapatan, belanja, dan realisasi APBDes"
                    className="min-w-[680px]"
                >
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                        const y = padding.top + plotHeight * (1 - ratio);
                        const value = roundedMax * ratio;

                        return (
                            <g key={ratio}>
                                <line
                                    x1={padding.left}
                                    x2={width - padding.right}
                                    y1={y}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeDasharray="4 5"
                                />
                                <text
                                    x={padding.left - 12}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-gray-500 text-[10px]"
                                >
                                    {compactRupiah.format(value)}
                                </text>
                            </g>
                        );
                    })}

                    {chartData.map((summary, index) => (
                        <g key={summary.year}>
                            {activeIndex === index && (
                                <line
                                    x1={xPosition(index)}
                                    x2={xPosition(index)}
                                    y1={padding.top}
                                    y2={padding.top + plotHeight}
                                    stroke="#94a3b8"
                                    strokeDasharray="3 4"
                                />
                            )}
                            <text
                                x={xPosition(index)}
                                y={height - 14}
                                textAnchor="middle"
                                className="fill-gray-600 text-[11px] font-semibold"
                            >
                                {summary.year}
                            </text>
                        </g>
                    ))}

                    {series.map((item) => (
                        <g key={item.key}>
                            {chartData.length > 1 && (
                                <path
                                    d={linePath(item)}
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    vectorEffect="non-scaling-stroke"
                                />
                            )}
                            {chartData.map((summary, index) => {
                                const value = Number(summary[item.key] ?? 0);

                                return (
                                    <circle
                                        key={`${item.key}-${summary.year}`}
                                        cx={xPosition(index)}
                                        cy={yPosition(value)}
                                        r={activeIndex === index ? 6 : 4.5}
                                        fill="white"
                                        stroke={item.color}
                                        strokeWidth="3"
                                        tabIndex={0}
                                        className="cursor-pointer transition-[r] outline-none focus:stroke-[5px]"
                                        onMouseEnter={() =>
                                            setActiveIndex(index)
                                        }
                                        onMouseLeave={() =>
                                            setActiveIndex(null)
                                        }
                                        onFocus={() => setActiveIndex(index)}
                                        onBlur={() => setActiveIndex(null)}
                                        aria-label={`${item.label} ${summary.year}: ${fullRupiah.format(value)}`}
                                    />
                                );
                            })}
                        </g>
                    ))}
                </svg>
            </div>

            {activeIndex !== null && chartData[activeIndex] && (
                <div
                    aria-live="polite"
                    className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-100 pt-4 text-xs"
                >
                    <strong className="text-gray-900">
                        TA {chartData[activeIndex].year}
                    </strong>
                    {series.map((item) => (
                        <span key={item.key} className="text-gray-600">
                            {item.label}:{' '}
                            <strong style={{ color: item.color }}>
                                {fullRupiah.format(
                                    Number(
                                        chartData[activeIndex][item.key] ?? 0,
                                    ),
                                )}
                            </strong>
                        </span>
                    ))}
                </div>
            )}

            {chartData.length === 1 && (
                <p className="mt-3 border-t border-gray-100 pt-4 text-xs text-gray-500">
                    Tambahkan APBDes tahun lain agar garis tren antar tahun
                    dapat terbentuk. Saat ini grafik menampilkan satu titik
                    data.
                </p>
            )}
        </section>
    );
}
