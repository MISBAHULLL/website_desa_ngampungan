import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    FileSpreadsheet,
    FileText,
    Save,
    Upload,
} from 'lucide-react';
import { index as apbdesIndex } from '@/actions/App/Http/Controllers/Admin/ApbdesController';
import {
    store as apbdesDocumentStore,
    update as apbdesDocumentUpdate,
} from '@/actions/App/Http/Controllers/Admin/ApbdesDocumentController';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

type DocumentItem = {
    id: number;
    title: string;
    category: string;
    year: string;
    document_date: string;
    file_format: string;
    file_size: string;
    original_name: string | null;
};

type Props = {
    documentItem?: DocumentItem;
    yearOptions: string[];
    categoryOptions: string[];
};

const inputClassName =
    'min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20';

export default function AdminApbdesDocumentForm({
    documentItem,
    yearOptions,
    categoryOptions,
}: Props) {
    const isEditing = Boolean(documentItem);
    const { data, setData, post, processing, progress, errors } = useForm({
        _method: isEditing ? 'put' : 'post',
        title: documentItem?.title ?? '',
        category: documentItem?.category ?? categoryOptions[0] ?? '',
        year: documentItem?.year ?? yearOptions[0] ?? '',
        document_date:
            documentItem?.document_date ??
            new Date().toISOString().slice(0, 10),
        document: null as File | null,
    });

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (documentItem) {
            post(apbdesDocumentUpdate.url(documentItem.id), {
                forceFormData: true,
            });

            return;
        }

        post(apbdesDocumentStore.url(), { forceFormData: true });
    }

    return (
        <>
            <Head
                title={
                    isEditing ? 'Ubah Dokumen APBDes' : 'Unggah Dokumen APBDes'
                }
            />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="border-b border-sidebar-border/70 pb-6">
                    <Link
                        href={apbdesIndex()}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                        <ArrowLeft className="size-3.5" />
                        Kembali ke Kelola APBDes
                    </Link>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight">
                        {isEditing
                            ? 'Ubah Dokumen Publik'
                            : 'Unggah Dokumen Publik'}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        Dokumen yang disimpan akan langsung tersedia di halaman
                        Transparansi untuk diunduh warga.
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
                >
                    <section className="space-y-5 rounded-2xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                <FileText className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-bold">Informasi Dokumen</h2>
                                <p className="text-xs text-muted-foreground">
                                    Gunakan judul yang mudah dikenali warga.
                                </p>
                            </div>
                        </div>

                        <label className="block space-y-1.5 text-sm font-bold">
                            <span>Judul Dokumen</span>
                            <input
                                value={data.title}
                                onChange={(event) =>
                                    setData('title', event.target.value)
                                }
                                placeholder="Contoh: Laporan Realisasi APBDes Semester I"
                                maxLength={255}
                                className={inputClassName}
                                required
                            />
                            <InputError message={errors.title} />
                        </label>

                        <label className="block space-y-1.5 text-sm font-bold">
                            <span>Kategori</span>
                            <input
                                value={data.category}
                                onChange={(event) =>
                                    setData('category', event.target.value)
                                }
                                list="apbdes-document-categories"
                                placeholder="Pilih atau tulis kategori"
                                maxLength={100}
                                className={inputClassName}
                                required
                            />
                            <datalist id="apbdes-document-categories">
                                {categoryOptions.map((category) => (
                                    <option key={category} value={category} />
                                ))}
                            </datalist>
                            <InputError message={errors.category} />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-1.5 text-sm font-bold">
                                <span>Tahun Anggaran</span>
                                <select
                                    value={data.year}
                                    onChange={(event) =>
                                        setData('year', event.target.value)
                                    }
                                    className={inputClassName}
                                    required
                                >
                                    {yearOptions.map((year) => (
                                        <option key={year} value={year}>
                                            APBDes {year}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.year} />
                            </label>

                            <label className="space-y-1.5 text-sm font-bold">
                                <span>Tanggal Dokumen</span>
                                <input
                                    type="date"
                                    value={data.document_date}
                                    onChange={(event) =>
                                        setData(
                                            'document_date',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClassName}
                                    required
                                />
                                <InputError message={errors.document_date} />
                            </label>
                        </div>

                        <div className="space-y-2 rounded-xl border border-dashed border-sidebar-border bg-muted/20 p-5">
                            <label
                                htmlFor="apbdes-document-file"
                                className="flex cursor-pointer flex-col items-center text-center"
                            >
                                <span className="flex size-12 items-center justify-center rounded-xl bg-background text-emerald-700 shadow-xs">
                                    <Upload className="size-5" />
                                </span>
                                <span className="mt-3 text-sm font-bold">
                                    {data.document
                                        ? data.document.name
                                        : isEditing
                                          ? 'Pilih file baru untuk mengganti dokumen'
                                          : 'Pilih dokumen dari perangkat'}
                                </span>
                                <span className="mt-1 text-xs text-muted-foreground">
                                    PDF, XLS, atau XLSX · maksimal 10 MB
                                </span>
                                <input
                                    id="apbdes-document-file"
                                    type="file"
                                    accept=".pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={(event) =>
                                        setData(
                                            'document',
                                            event.target.files?.[0] ?? null,
                                        )
                                    }
                                    className="sr-only"
                                    required={!isEditing}
                                />
                            </label>
                            <InputError message={errors.document} />

                            {progress && (
                                <div className="pt-2">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <span>Mengunggah dokumen</span>
                                        <span>{progress.percentage}%</span>
                                    </div>
                                    <progress
                                        value={progress.percentage}
                                        max={100}
                                        className="mt-2 h-2 w-full overflow-hidden rounded-full accent-emerald-700"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="space-y-4">
                        {documentItem && (
                            <div className="rounded-2xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    File Saat Ini
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                    <FileSpreadsheet className="size-8 text-emerald-700" />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold">
                                            {documentItem.original_name ??
                                                documentItem.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {documentItem.file_format} ·{' '}
                                            {documentItem.file_size}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                                    Biarkan input file kosong jika hanya ingin
                                    mengubah metadata dokumen.
                                </p>
                            </div>
                        )}

                        <div className="rounded-2xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <CalendarDays className="size-4 text-emerald-700" />
                                Dampak Publikasi
                            </div>
                            <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                Card publik menampilkan format sebenarnya dan
                                mengunduh file asli tanpa mengubah isinya.
                            </p>

                            <button
                                type="submit"
                                disabled={
                                    processing || yearOptions.length === 0
                                }
                                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            >
                                {processing ? (
                                    <Spinner className="size-4" />
                                ) : (
                                    <Save className="size-4" />
                                )}
                                {processing
                                    ? 'Menyimpan...'
                                    : isEditing
                                      ? 'Simpan Perubahan'
                                      : 'Publikasikan Dokumen'}
                            </button>
                        </div>
                    </aside>
                </form>
            </div>
        </>
    );
}
