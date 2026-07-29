import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    FileDown,
    FileText,
    Info,
    Landmark,
    TrendingUp,
    WalletCards,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PublicPageShell } from '@/components/public-page-shell';
import {
    dummyApbdesSummary,
    dummyPublicDocuments,
} from '@/lib/dummy-transparency';
import type { ApbdesMetricKey } from '@/lib/dummy-transparency';

const metricPresentation: Record<
    ApbdesMetricKey,
    {
        icon: LucideIcon;
        iconClassName: string;
    }
> = {
    income: {
        icon: TrendingUp,
        iconClassName: 'bg-village-primary-light text-village-primary',
    },
    expense: {
        icon: FileText,
        iconClassName: 'bg-[#fff2cf] text-[#94620d]',
    },
    netFinancing: {
        icon: WalletCards,
        iconClassName: 'bg-[#e7f1fb] text-village-info',
    },
    estimatedSilpa: {
        icon: Landmark,
        iconClassName: 'bg-village-surface-muted text-village-primary-dark',
    },
};

export default function TransparencyIndex() {
    return (
        <PublicPageShell activeSection="transparency">
            <Head title="Transparansi Desa">
                <meta
                    name="description"
                    content="Ringkasan APBDes, realisasi anggaran, dan informasi transparansi Pemerintah Desa Ngampungan."
                />
            </Head>

            <section className="bg-village-primary-dark text-white">
                <div className="mx-auto max-w-[1280px] px-5 py-14 md:py-20 lg:px-12">
                    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                                Pemerintahan Terbuka
                            </p>
                            <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
                                Transparansi Desa
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                                Akses ringkasan anggaran dan perkembangan
                                realisasi APBDes Desa Ngampungan dalam satu
                                halaman.
                            </p>
                        </div>

                        <div className="w-fit border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold">
                            Data simulasi tahun {dummyApbdesSummary.year}
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="apbdes"
                aria-labelledby="apbdes-overview-heading"
                className="scroll-mt-24 bg-village-canvas py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                Tahun Anggaran {dummyApbdesSummary.year}
                            </p>
                            <h2
                                id="apbdes-overview-heading"
                                className="mt-2 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Ringkasan APBDes
                            </h2>
                        </div>
                        <p className="inline-flex items-center gap-2 text-sm font-medium text-village-muted">
                            <CalendarDays
                                aria-hidden="true"
                                className="size-4"
                            />
                            Diperbarui{' '}
                            <time dateTime={dummyApbdesSummary.updatedAt}>
                                {dummyApbdesSummary.updatedLabel}
                            </time>
                        </p>
                    </div>

                    <div className="mt-8 grid gap-5 lg:grid-cols-12">
                        <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                            {dummyApbdesSummary.metrics.map((metric) => {
                                const presentation =
                                    metricPresentation[metric.key];
                                const MetricIcon = presentation.icon;

                                return (
                                    <div
                                        key={metric.key}
                                        className="border border-village-border bg-white p-6 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-5">
                                            <dt className="text-sm font-bold tracking-wide text-village-muted uppercase">
                                                {metric.label}
                                            </dt>
                                            <span
                                                className={`flex size-11 shrink-0 items-center justify-center rounded-full ${presentation.iconClassName}`}
                                            >
                                                <MetricIcon
                                                    aria-hidden="true"
                                                    className="size-5"
                                                />
                                            </span>
                                        </div>
                                        <dd className="mt-6 text-3xl font-bold tracking-tight text-village-ink">
                                            {metric.value}
                                        </dd>
                                        <p className="mt-3 text-sm leading-6 text-village-muted">
                                            {metric.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </dl>

                        <aside className="flex flex-col justify-between bg-village-primary-light p-6 sm:p-8 lg:col-span-4">
                            <div>
                                <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                    Realisasi Belanja
                                </p>
                                <p className="mt-4 text-5xl font-bold tracking-tight text-village-primary-dark">
                                    {dummyApbdesSummary.realizationPercentage}
                                    <span className="text-2xl">%</span>
                                </p>
                                <p className="mt-4 leading-7 text-village-primary-dark/75">
                                    {dummyApbdesSummary.realizedAmount} telah
                                    terealisasi dari pagu{' '}
                                    {dummyApbdesSummary.budgetAmount}.
                                </p>
                            </div>

                            <div
                                role="progressbar"
                                aria-label={`Realisasi belanja ${dummyApbdesSummary.realizationPercentage} persen`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={
                                    dummyApbdesSummary.realizationPercentage
                                }
                                className="mt-8 h-3 overflow-hidden rounded-full bg-white/80"
                            >
                                <span
                                    aria-hidden="true"
                                    className="block h-full rounded-full bg-village-primary"
                                    style={{
                                        width: `${dummyApbdesSummary.realizationPercentage}%`,
                                    }}
                                />
                            </div>
                        </aside>
                    </div>

                    <div className="mt-5 flex items-start gap-3 border border-[#efdcae] bg-[#fff8ea] p-4 text-sm leading-6 text-[#755018]">
                        <Info
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                        <p>
                            <strong>Data simulasi tampilan.</strong> Angka akan
                            diganti setelah data APBDes diverifikasi oleh
                            Pemerintah Desa Ngampungan.
                        </p>
                    </div>
                </div>
            </section>

            <section
                id="statistik"
                aria-labelledby="allocation-heading"
                className="scroll-mt-24 border-t border-village-border bg-white py-12 md:py-16"
            >
                <div className="mx-auto grid max-w-[1280px] gap-10 px-5 lg:grid-cols-12 lg:px-12">
                    <div className="lg:col-span-4">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            Komposisi Belanja
                        </p>
                        <h2
                            id="allocation-heading"
                            className="mt-3 text-3xl font-bold tracking-tight"
                        >
                            Alokasi per Bidang
                        </h2>
                        <p className="mt-4 leading-7 text-village-muted">
                            Distribusi pagu belanja berdasarkan bidang
                            penyelenggaraan pemerintahan desa.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:col-span-8">
                        {dummyApbdesSummary.allocations.map((allocation) => (
                            <div key={allocation.label}>
                                <div className="flex items-end justify-between gap-5">
                                    <div>
                                        <h3 className="font-bold text-village-ink">
                                            {allocation.label}
                                        </h3>
                                        <p className="mt-1 text-sm text-village-muted">
                                            {allocation.value}
                                        </p>
                                    </div>
                                    <span className="text-sm font-bold text-village-primary">
                                        {allocation.percentage}%
                                    </span>
                                </div>
                                <div
                                    role="progressbar"
                                    aria-label={`${allocation.label} ${allocation.percentage} persen`}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={allocation.percentage}
                                    className="mt-3 h-2 overflow-hidden rounded-full bg-village-surface-muted"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="block h-full rounded-full bg-village-primary"
                                        style={{
                                            width: `${allocation.percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="dokumen-publik"
                aria-labelledby="public-documents-heading"
                className="scroll-mt-24 border-t border-village-border bg-village-surface-muted py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div className="max-w-2xl">
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                Arsip Transparansi
                            </p>
                            <h2
                                id="public-documents-heading"
                                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Dokumen Publik Terbaru
                            </h2>
                            <p className="mt-4 leading-7 text-village-muted">
                                Contoh susunan dokumen anggaran yang kelak dapat
                                diakses warga setelah berkas resmi diterbitkan.
                            </p>
                        </div>
                        <p className="text-sm font-semibold text-village-muted">
                            {dummyPublicDocuments.length} dokumen
                        </p>
                    </div>

                    <div className="mt-8 flex items-start gap-3 border border-[#efdcae] bg-[#fff8ea] p-4 text-sm leading-6 text-[#755018]">
                        <Info
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                        <p>
                            <strong>Metadata simulasi.</strong> File PDF belum
                            disertakan sehingga dokumen belum dapat diunduh.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {dummyPublicDocuments.map((document) => (
                            <article
                                key={document.id}
                                className="flex h-full flex-col border border-village-border bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-village-primary/35 hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <span className="flex size-11 shrink-0 items-center justify-center bg-village-primary-light text-village-primary">
                                        <FileText
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>
                                    <span className="border border-[#efdcae] bg-[#fff8ea] px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.12em] text-[#755018] uppercase">
                                        Simulasi
                                    </span>
                                </div>

                                <p className="mt-6 text-xs font-bold tracking-[0.15em] text-village-primary uppercase">
                                    {document.category}
                                </p>
                                <h3 className="mt-2 text-xl leading-7 font-bold text-village-ink">
                                    {document.title}
                                </h3>

                                <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-village-border pt-5 text-sm">
                                    <div>
                                        <dt className="text-village-muted">
                                            Tahun
                                        </dt>
                                        <dd className="mt-1 font-semibold text-village-ink">
                                            {document.year}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-village-muted">
                                            Berkas
                                        </dt>
                                        <dd className="mt-1 font-semibold text-village-ink">
                                            {document.format} ·{' '}
                                            {document.fileSize}
                                        </dd>
                                    </div>
                                    <div className="col-span-2">
                                        <dt className="text-village-muted">
                                            Tanggal dokumen
                                        </dt>
                                        <dd className="mt-1 font-semibold text-village-ink">
                                            <time
                                                dateTime={document.documentDate}
                                            >
                                                {document.documentDateLabel}
                                            </time>
                                        </dd>
                                    </div>
                                </dl>

                                <button
                                    type="button"
                                    disabled
                                    aria-disabled="true"
                                    className="mt-6 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 border border-village-border bg-village-surface-muted px-4 py-2.5 text-sm font-bold text-village-muted opacity-75"
                                >
                                    <FileDown
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                    File belum tersedia
                                </button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
