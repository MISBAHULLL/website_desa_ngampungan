import { useState } from 'react';
import { dummyDemographicDatasets } from '@/lib/dummy-village-profile';
import type { DemographicDataset } from '@/lib/dummy-village-profile';

function formatNumber(value: number) {
    return new Intl.NumberFormat('id-ID').format(value);
}

interface VillageDemographicExplorerProps {
    demographics?: DemographicDataset[] | null;
}

export function VillageDemographicExplorer({
    demographics,
}: VillageDemographicExplorerProps) {
    const datasets =
        demographics && demographics.length > 0
            ? demographics
            : dummyDemographicDatasets;

    const [activeDemographicKey, setActiveDemographicKey] = useState<string>(
        datasets[0]?.key || 'gender',
    );

    const activeDataset =
        datasets.find((dataset) => dataset.key === activeDemographicKey) ??
        datasets[0];

    if (!activeDataset) {
        return null;
    }

    return (
        <div className="rounded-3xl border border-village-border/80 bg-white p-5 shadow-sm transition-all duration-500 hover:border-emerald-300/80 hover:shadow-md sm:p-7">
            {/* Styled Filter Chips Bar */}
            <div className="border-b border-village-border/60 pb-5">
                <div
                    role="tablist"
                    aria-label="Kategori data demografi"
                    className="flex flex-wrap items-center gap-2"
                >
                    <span className="mr-1.5 text-xs font-extrabold tracking-wider text-village-muted uppercase">
                        Filter Data:
                    </span>
                    {datasets.map((dataset) => {
                        const isSelected = activeDemographicKey === dataset.key;

                        return (
                            <button
                                key={dataset.key}
                                id={`demographic-tab-${dataset.key}`}
                                type="button"
                                role="tab"
                                aria-selected={isSelected}
                                aria-controls={`demographic-panel-${dataset.key}`}
                                onClick={() =>
                                    setActiveDemographicKey(dataset.key)
                                }
                                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all duration-300 active:scale-95 ${
                                    isSelected
                                        ? 'scale-[1.02] bg-village-primary-dark text-white shadow-xs ring-2 ring-emerald-600/20'
                                        : 'bg-village-surface-muted/80 text-village-ink hover:scale-[1.02] hover:bg-emerald-100/80 hover:text-emerald-950'
                                }`}
                            >
                                {dataset.shortLabel || dataset.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Panel Content Grid */}
            <div
                id={`demographic-panel-${activeDataset.key}`}
                role="tabpanel"
                aria-labelledby={`demographic-tab-${activeDataset.key}`}
                className="mt-6 grid gap-6 lg:grid-cols-12"
            >
                {/* Left Card: Soft Green Background Theme with Asset Icon & Hover Animation */}
                <aside className="group flex flex-col justify-between rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-[#ecf6f0] to-[#e4f2e9] p-6 text-village-ink shadow-xs transition-all duration-500 hover:border-emerald-300 hover:shadow-md sm:p-7 lg:col-span-4">
                    <div>
                        <span className="flex size-12 items-center justify-center rounded-2xl bg-white/90 p-2 shadow-xs transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <img
                                src="/assets/penduduk.png"
                                alt="Ikon Demografi Penduduk"
                                className="size-7 object-contain"
                            />
                        </span>
                        <p className="mt-6 text-xs font-extrabold tracking-wider text-emerald-800 uppercase">
                            Kategori Aktif
                        </p>
                        <h4 className="mt-1.5 text-xl font-extrabold text-emerald-950 transition-colors group-hover:text-emerald-800">
                            {activeDataset.label}
                        </h4>
                        <p className="mt-2 text-xs leading-relaxed font-medium text-emerald-800/80">
                            {activeDataset.description}
                        </p>
                    </div>

                    <dl className="mt-8 border-t border-emerald-200/60 pt-5">
                        <dt className="text-xs font-extrabold tracking-wider text-emerald-800 uppercase">
                            Total Basis Data
                        </dt>
                        <dd className="mt-1.5 text-3xl font-extrabold tracking-tight text-emerald-950">
                            {formatNumber(activeDataset.total)}
                            <span className="ml-2 text-xs font-bold text-emerald-700">
                                {activeDataset.unit}
                            </span>
                        </dd>
                    </dl>
                </aside>

                {/* Right Panel: Data Distribution List & Progress Bars with Asset Icon */}
                <div className="rounded-2xl border border-village-border/60 bg-village-surface-muted/30 p-6 transition-all duration-500 hover:border-emerald-200/80 hover:shadow-xs sm:p-7 lg:col-span-8">
                    <div className="flex items-center justify-between gap-4 border-b border-village-border/60 pb-4">
                        <div>
                            <p className="text-xs font-extrabold tracking-wider text-village-primary uppercase">
                                Distribusi Data
                            </p>
                            <h4 className="mt-0.5 text-lg font-extrabold text-village-ink">
                                {activeDataset.label}
                            </h4>
                        </div>
                        <span className="flex size-10 items-center justify-center rounded-xl bg-village-primary-light/80 p-2 shadow-xs transition-transform duration-300 hover:scale-105">
                            <img
                                src="/assets/layanan.png"
                                alt="Ikon Statistik Data"
                                className="size-5 object-contain"
                            />
                        </span>
                    </div>

                    <div className="mt-5 space-y-3">
                        {activeDataset.items.map((item) => {
                            const total = activeDataset.total || 1;
                            const percentage = (item.value / total) * 100;

                            return (
                                <div
                                    key={item.label}
                                    className="group/item rounded-2xl p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border hover:border-emerald-100 hover:bg-white hover:shadow-xs"
                                >
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-extrabold text-village-ink transition-colors group-hover/item:text-village-primary-dark">
                                                {item.label}
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-village-muted">
                                                {formatNumber(item.value)}{' '}
                                                {activeDataset.unit}
                                            </p>
                                        </div>
                                        <span className="rounded-xl bg-village-primary-light/80 px-2.5 py-0.5 text-xs font-extrabold text-village-primary-dark transition-colors group-hover/item:bg-village-primary group-hover/item:text-white">
                                            {percentage.toFixed(1)}%
                                        </span>
                                    </div>

                                    {/* Styled Progress Bar Track */}
                                    <div
                                        role="progressbar"
                                        aria-label={`${item.label} ${percentage.toFixed(1)} persen`}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={Number(
                                            percentage.toFixed(1),
                                        )}
                                        className="mt-2.5 h-3 overflow-hidden rounded-full bg-emerald-100/60 p-0.5 transition-colors group-hover/item:bg-emerald-100"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="block h-full rounded-full bg-gradient-to-r from-village-primary via-emerald-600 to-teal-500 transition-all duration-700 ease-out group-hover/item:brightness-110"
                                            style={{
                                                width: `${Math.max(percentage, 1.5)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
