import { ChartBar, Users } from 'lucide-react';
import { useState } from 'react';
import { dummyDemographicDatasets } from '@/lib/dummy-village-profile';
import type { DemographicKey } from '@/lib/dummy-village-profile';

function formatNumber(value: number) {
    return new Intl.NumberFormat('id-ID').format(value);
}

export function VillageDemographicExplorer() {
    const [activeDemographic, setActiveDemographic] =
        useState<DemographicKey>('gender');
    const activeDataset =
        dummyDemographicDatasets.find(
            (dataset) => dataset.key === activeDemographic,
        ) ?? dummyDemographicDatasets[0];

    return (
        <div className="border border-village-border bg-white shadow-village-soft">
            <div
                role="tablist"
                aria-label="Kategori data demografi"
                className="flex [scrollbar-width:none] gap-2 overflow-x-auto border-b border-village-border p-3 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {dummyDemographicDatasets.map((dataset) => (
                    <button
                        key={dataset.key}
                        id={`demographic-tab-${dataset.key}`}
                        type="button"
                        role="tab"
                        aria-selected={activeDemographic === dataset.key}
                        aria-controls={`demographic-panel-${dataset.key}`}
                        onClick={() => setActiveDemographic(dataset.key)}
                        className={
                            activeDemographic === dataset.key
                                ? 'min-h-11 shrink-0 bg-village-primary px-4 py-2.5 text-sm font-bold text-white'
                                : 'min-h-11 shrink-0 border border-village-border px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:border-village-primary hover:text-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none'
                        }
                    >
                        {dataset.shortLabel}
                    </button>
                ))}
            </div>

            <div
                id={`demographic-panel-${activeDataset.key}`}
                role="tabpanel"
                aria-labelledby={`demographic-tab-${activeDataset.key}`}
                className="grid lg:grid-cols-12"
            >
                <aside className="flex flex-col justify-between bg-village-primary-dark p-6 text-white sm:p-8 lg:col-span-4">
                    <div>
                        <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-village-accent">
                            <Users aria-hidden="true" className="size-5" />
                        </span>
                        <p className="mt-8 text-xs font-bold tracking-[0.16em] text-village-accent uppercase">
                            Kategori Aktif
                        </p>
                        <h3 className="mt-3 text-2xl font-bold">
                            {activeDataset.label}
                        </h3>
                        <p className="mt-3 leading-7 text-white/65">
                            {activeDataset.description}
                        </p>
                    </div>

                    <dl className="mt-10 border-t border-white/15 pt-6">
                        <dt className="text-xs tracking-[0.14em] text-white/50 uppercase">
                            Total basis data
                        </dt>
                        <dd className="mt-2 text-4xl font-bold tracking-tight">
                            {formatNumber(activeDataset.total)}
                            <span className="ml-2 text-sm font-semibold text-white/55">
                                {activeDataset.unit}
                            </span>
                        </dd>
                    </dl>
                </aside>

                <div className="p-6 sm:p-8 lg:col-span-8">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold tracking-[0.15em] text-village-primary uppercase">
                                Distribusi Data
                            </p>
                            <h4 className="mt-2 text-xl font-bold">
                                {activeDataset.label}
                            </h4>
                        </div>
                        <ChartBar
                            aria-hidden="true"
                            className="size-6 text-village-primary"
                        />
                    </div>

                    <div className="mt-8 grid gap-6">
                        {activeDataset.items.map((item) => {
                            const percentage =
                                (item.value / activeDataset.total) * 100;

                            return (
                                <div key={item.label}>
                                    <div className="flex items-end justify-between gap-5">
                                        <div>
                                            <p className="font-bold text-village-ink">
                                                {item.label}
                                            </p>
                                            <p className="mt-1 text-sm text-village-muted">
                                                {formatNumber(item.value)}{' '}
                                                {activeDataset.unit}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-village-primary">
                                            {percentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div
                                        role="progressbar"
                                        aria-label={`${item.label} ${percentage.toFixed(1)} persen`}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={Number(
                                            percentage.toFixed(1),
                                        )}
                                        className="mt-3 h-2.5 overflow-hidden rounded-full bg-village-surface-muted"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="block h-full rounded-full bg-village-primary transition-[width] duration-500"
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
