import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpRight,
    Banknote,
    Edit3,
    FileDown,
    FileText,
    FileSpreadsheet,
    Plus,
    Trash2,
    Upload,
    WalletCards,
} from 'lucide-react';
import { useState } from 'react';
import {
    create as apbdesCreate,
    destroy as apbdesDestroy,
    edit as apbdesEdit,
} from '@/actions/App/Http/Controllers/Admin/ApbdesController';
import {
    create as apbdesDocumentCreate,
    destroy as apbdesDocumentDestroy,
    edit as apbdesDocumentEdit,
} from '@/actions/App/Http/Controllers/Admin/ApbdesDocumentController';
import { Spinner } from '@/components/ui/spinner';
import { index as transparencyIndex } from '@/routes/transparency';

type Summary = {
    id: number;
    year: string;
    updatedDate: string | null;
    updatedLabel: string | null;
    totalIncome: number;
    totalBudget: number;
    totalRealized: number;
    realizationPercentage: number;
    incomeSourcesCount: number;
    activitiesCount: number;
};

type Props = {
    summaries: Summary[];
    documents: ApbdesDocument[];
};

type ApbdesDocument = {
    id: number;
    title: string;
    category: string;
    year: string;
    documentDateLabel: string;
    format: 'PDF' | 'XLS' | 'XLSX';
    fileSize: string;
    originalName: string | null;
    downloadUrl: string;
};

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export default function AdminApbdesIndex({ summaries, documents }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(
        null,
    );

    function handleDelete(summary: Summary) {
        if (
            !confirm(
                `Hapus seluruh data APBDes ${summary.year}? Sumber pendapatan dan rincian kegiatannya juga akan dihapus.`,
            )
        ) {
            return;
        }

        setDeletingId(summary.id);
        router.delete(apbdesDestroy.url(summary.id), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    }

    function handleDocumentDelete(document: ApbdesDocument) {
        if (!confirm(`Hapus dokumen "${document.title}" dari portal publik?`)) {
            return;
        }

        setDeletingDocumentId(document.id);
        router.delete(apbdesDocumentDestroy.url(document.id), {
            preserveScroll: true,
            onFinish: () => setDeletingDocumentId(null),
        });
    }

    return (
        <>
            <Head title="Kelola APBDes" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Transparansi Anggaran
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Kelola APBDes
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Kelola ringkasan anggaran, sumber pendapatan, serta
                            realisasi kegiatan untuk setiap tahun anggaran.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <a
                            href={`${transparencyIndex.url()}#apbdes`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm font-bold transition hover:border-emerald-500 hover:text-emerald-700"
                        >
                            Lihat halaman publik
                            <ArrowUpRight className="size-4" />
                        </a>
                        <Link
                            href={apbdesCreate()}
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                        >
                            <Plus className="size-4" />
                            Tambah Tahun Anggaran
                        </Link>
                    </div>
                </header>

                {summaries.length > 0 ? (
                    <div className="grid gap-4 xl:grid-cols-2">
                        {summaries.map((summary) => (
                            <article
                                key={summary.id}
                                className="rounded-2xl border border-sidebar-border/70 bg-background p-5 shadow-xs transition hover:border-emerald-600/30 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                            <WalletCards className="size-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                Tahun Anggaran
                                            </p>
                                            <h2 className="text-2xl font-bold tracking-tight">
                                                APBDes {summary.year}
                                            </h2>
                                        </div>
                                    </div>
                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                                        {summary.realizationPercentage}%
                                        terealisasi
                                    </span>
                                </div>

                                <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl bg-muted/45 p-3">
                                        <dt className="text-xs text-muted-foreground">
                                            Pendapatan
                                        </dt>
                                        <dd className="mt-1 text-sm font-bold">
                                            {rupiahFormatter.format(
                                                summary.totalIncome,
                                            )}
                                        </dd>
                                    </div>
                                    <div className="rounded-xl bg-muted/45 p-3">
                                        <dt className="text-xs text-muted-foreground">
                                            Pagu belanja
                                        </dt>
                                        <dd className="mt-1 text-sm font-bold">
                                            {rupiahFormatter.format(
                                                summary.totalBudget,
                                            )}
                                        </dd>
                                    </div>
                                    <div className="rounded-xl bg-muted/45 p-3">
                                        <dt className="text-xs text-muted-foreground">
                                            Realisasi
                                        </dt>
                                        <dd className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                            {rupiahFormatter.format(
                                                summary.totalRealized,
                                            )}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-emerald-600 transition-[width] duration-500"
                                        style={{
                                            width: `${Math.min(summary.realizationPercentage, 100)}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-5 flex flex-col justify-between gap-3 border-t border-sidebar-border/70 pt-4 sm:flex-row sm:items-center">
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                        <span>
                                            {summary.incomeSourcesCount} sumber
                                            pendapatan
                                        </span>
                                        <span>
                                            {summary.activitiesCount} kegiatan
                                        </span>
                                        <span>
                                            Diperbarui{' '}
                                            {summary.updatedLabel ??
                                                'belum diisi'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={apbdesEdit(summary.id)}
                                            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-sidebar-border/70 px-3 text-xs font-bold transition hover:border-emerald-500 hover:text-emerald-700"
                                        >
                                            <Edit3 className="size-3.5" />
                                            Ubah
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(summary)
                                            }
                                            disabled={deletingId === summary.id}
                                            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                                        >
                                            {deletingId === summary.id ? (
                                                <Spinner className="size-3.5" />
                                            ) : (
                                                <Trash2 className="size-3.5" />
                                            )}
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-sidebar-border bg-muted/20 p-8 text-center">
                        <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <FileSpreadsheet className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold">
                            Data APBDes belum tersedia
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Mulai dari satu tahun anggaran, lalu isi sumber
                            pendapatan dan rincian kegiatannya.
                        </p>
                        <Link
                            href={apbdesCreate()}
                            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white hover:bg-emerald-800"
                        >
                            <Banknote className="size-4" />
                            Buat APBDes Pertama
                        </Link>
                    </div>
                )}

                <section className="mt-2 border-t border-sidebar-border/70 pt-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">
                                Dokumen Publik APBDes
                            </h2>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                                Publikasikan PDF atau Excel yang dapat diunduh
                                warga dari halaman Transparansi.
                            </p>
                        </div>
                        <Link
                            href={apbdesDocumentCreate()}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-sm font-bold text-background transition hover:opacity-85"
                        >
                            <Upload className="size-4" />
                            Unggah Dokumen
                        </Link>
                    </div>

                    {documents.length > 0 ? (
                        <div className="mt-5 overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[840px] text-left text-sm">
                                    <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold text-muted-foreground uppercase">
                                        <tr>
                                            <th className="px-5 py-3.5">
                                                Dokumen
                                            </th>
                                            <th className="px-4 py-3.5">
                                                Tahun
                                            </th>
                                            <th className="px-4 py-3.5">
                                                Format
                                            </th>
                                            <th className="px-4 py-3.5">
                                                Tanggal
                                            </th>
                                            <th className="px-5 py-3.5 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sidebar-border/70">
                                        {documents.map((document) => (
                                            <tr
                                                key={document.id}
                                                className="transition hover:bg-muted/20"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                                            <FileText className="size-5" />
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="max-w-lg truncate font-bold">
                                                                {document.title}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                                {
                                                                    document.category
                                                                }
                                                                {document.originalName
                                                                    ? ` · ${document.originalName}`
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 font-semibold">
                                                    {document.year}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="inline-flex rounded-md border border-sidebar-border/70 bg-muted/40 px-2 py-1 text-xs font-bold">
                                                        {document.format} ·{' '}
                                                        {document.fileSize}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-muted-foreground">
                                                    {document.documentDateLabel}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <a
                                                            href={
                                                                document.downloadUrl
                                                            }
                                                            className="inline-flex size-9 items-center justify-center rounded-lg border border-sidebar-border/70 transition hover:border-emerald-500 hover:text-emerald-700"
                                                            title="Unduh dokumen"
                                                        >
                                                            <FileDown className="size-4" />
                                                        </a>
                                                        <Link
                                                            href={apbdesDocumentEdit(
                                                                document.id,
                                                            )}
                                                            className="inline-flex size-9 items-center justify-center rounded-lg border border-sidebar-border/70 transition hover:border-emerald-500 hover:text-emerald-700"
                                                            title="Ubah dokumen"
                                                        >
                                                            <Edit3 className="size-4" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDocumentDelete(
                                                                    document,
                                                                )
                                                            }
                                                            disabled={
                                                                deletingDocumentId ===
                                                                document.id
                                                            }
                                                            className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                                                            title="Hapus dokumen"
                                                        >
                                                            {deletingDocumentId ===
                                                            document.id ? (
                                                                <Spinner className="size-4" />
                                                            ) : (
                                                                <Trash2 className="size-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-5 rounded-2xl border border-dashed border-sidebar-border bg-muted/20 p-8 text-center">
                            <FileText className="mx-auto size-7 text-muted-foreground" />
                            <h3 className="mt-3 font-bold">
                                Belum ada dokumen publik
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Unggah PDF, XLS, atau XLSX maksimal 10 MB.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
