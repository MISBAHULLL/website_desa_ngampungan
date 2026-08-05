import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Bell,
    Megaphone,
    Pin,
    Plus,
    ShieldAlert,
} from 'lucide-react';
import {
    create as announcementCreate,
    index as announcementIndex,
    store as announcementStore,
} from '@/actions/App/Http/Controllers/Admin/AnnouncementController';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

export default function AdminAnnouncementCreate() {
    const { data, setData, submit, processing, errors } = useForm({
        title: '',
        summary: '',
        content: [''] as string[],
        priority: 'normal' as 'normal' | 'important' | 'emergency',
        status: 'active' as 'active' | 'archived',
        is_pinned: false,
        starts_at: new Date().toISOString().slice(0, 16),
        ends_at: '',
    });

    function addParagraph() {
        setData('content', [...data.content, '']);
    }

    function updateParagraph(index: number, value: string) {
        const next = [...data.content];
        next[index] = value;
        setData('content', next);
    }

    function removeParagraph(index: number) {
        if (data.content.length <= 1) {
            return;
        }

        const next = data.content.filter((_, i) => i !== index);

        setData('content', next);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        submit(announcementStore());
    }

    return (
        <>
            <Head title="Buat Pengumuman Baru" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-center">
                    <div>
                        <Link
                            href={announcementIndex()}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Kelola Pengumuman</span>
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Buat Pengumuman Baru
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Publikasikan pengumuman atau pemberitahuan resmi
                            terbaru untuk warga desa.
                        </p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {/* Title Input */}
                            <div className="space-y-2 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="title"
                                        className="text-sm font-bold text-foreground"
                                    >
                                        Judul Pengumuman{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <span
                                        className={
                                            data.title.length > 255
                                                ? 'text-xs font-bold text-red-600'
                                                : 'text-xs text-muted-foreground'
                                        }
                                    >
                                        {data.title.length}/255 Karakter
                                    </span>
                                </div>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Contoh: Perubahan Jadwal Pelayanan Administrasi Kependudukan"
                                    className="min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            {/* Summary Input */}
                            <div className="space-y-2 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="summary"
                                        className="text-sm font-bold text-foreground"
                                    >
                                        Ringkasan Pengumuman{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <span
                                        className={
                                            data.summary.length > 300
                                                ? 'text-xs font-bold text-red-600'
                                                : 'text-xs text-muted-foreground'
                                        }
                                    >
                                        {data.summary.length}/300 Karakter
                                    </span>
                                </div>
                                <textarea
                                    id="summary"
                                    rows={3}
                                    value={data.summary}
                                    onChange={(e) =>
                                        setData('summary', e.target.value)
                                    }
                                    placeholder="Tulis ringkasan singkat pengumuman yang akan langsung dibaca warga di card landing page..."
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                <InputError message={errors.summary} />
                            </div>

                            {/* Content Paragraphs */}
                            <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-sm font-bold text-foreground">
                                            Detail Paragraf Tambahan (Opsional)
                                        </h2>
                                        <p className="text-xs text-muted-foreground">
                                            Tambahkan paragraf penjelasan
                                            lengkap untuk detail pengumuman.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addParagraph}
                                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                    >
                                        <Plus className="size-3.5" />
                                        Tambah Paragraf
                                    </button>
                                </div>

                                {data.content.map((para, index) => (
                                    <div key={index} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="font-semibold">
                                                Paragraf {index + 1}
                                            </span>
                                            {data.content.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeParagraph(index)
                                                    }
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                        <textarea
                                            rows={3}
                                            value={para}
                                            onChange={(e) =>
                                                updateParagraph(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Penjelasan paragraf ${index + 1}...`}
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Options & Settings Sidebar */}
                        <div className="space-y-6">
                            <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                <h2 className="text-sm font-bold text-foreground">
                                    Pengaturan & Prioritas
                                </h2>

                                {/* Priority Radio Buttons */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">
                                        Tingkat Prioritas
                                    </label>
                                    <div className="grid gap-2">
                                        <label
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                                                data.priority === 'normal'
                                                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20'
                                                    : 'border-sidebar-border/70'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="priority"
                                                value="normal"
                                                checked={
                                                    data.priority === 'normal'
                                                }
                                                onChange={() =>
                                                    setData(
                                                        'priority',
                                                        'normal',
                                                    )
                                                }
                                                className="accent-emerald-600"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Bell className="size-4 text-emerald-600" />
                                                <span className="text-sm font-bold">
                                                    Normal
                                                </span>
                                            </div>
                                        </label>

                                        <label
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                                                data.priority === 'important'
                                                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                                                    : 'border-sidebar-border/70'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="priority"
                                                value="important"
                                                checked={
                                                    data.priority ===
                                                    'important'
                                                }
                                                onChange={() =>
                                                    setData(
                                                        'priority',
                                                        'important',
                                                    )
                                                }
                                                className="accent-amber-600"
                                            />
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="size-4 text-amber-600" />
                                                <span className="text-sm font-bold">
                                                    Penting
                                                </span>
                                            </div>
                                        </label>

                                        <label
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                                                data.priority === 'emergency'
                                                    ? 'border-rose-600 bg-rose-50/50 dark:bg-rose-950/20'
                                                    : 'border-sidebar-border/70'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="priority"
                                                value="emergency"
                                                checked={
                                                    data.priority ===
                                                    'emergency'
                                                }
                                                onChange={() =>
                                                    setData(
                                                        'priority',
                                                        'emergency',
                                                    )
                                                }
                                                className="accent-rose-600"
                                            />
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert className="size-4 text-rose-600" />
                                                <span className="text-sm font-bold text-rose-700 dark:text-rose-400">
                                                    Darurat
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Status Selector */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="status"
                                        className="text-xs font-bold text-muted-foreground uppercase"
                                    >
                                        Status Publikasi
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData(
                                                'status',
                                                e.target.value as
                                                    'active' | 'archived',
                                            )
                                        }
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium outline-none focus:border-emerald-600"
                                    >
                                        <option value="active">
                                            Aktif (Tampil di Landing Page)
                                        </option>
                                        <option value="archived">
                                            Arsip (Dipindahkan ke Arsip)
                                        </option>
                                    </select>
                                </div>

                                {/* Pinned Checkbox */}
                                <div className="border-t border-sidebar-border/70 pt-2">
                                    <label className="flex cursor-pointer items-center gap-2.5">
                                        <input
                                            type="checkbox"
                                            checked={data.is_pinned}
                                            onChange={(e) =>
                                                setData(
                                                    'is_pinned',
                                                    e.target.checked,
                                                )
                                            }
                                            className="size-4 rounded border-sidebar-border text-emerald-600 focus:ring-emerald-600"
                                        />
                                        <div className="flex items-center gap-1.5">
                                            <Pin className="size-4 text-emerald-700" />
                                            <span className="text-sm font-bold">
                                                Sematkan di Atas (Pinned)
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Date Settings */}
                            <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                <h2 className="text-sm font-bold text-foreground">
                                    Masa Berlaku Pengumuman
                                </h2>

                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="starts_at"
                                        className="text-xs font-bold text-muted-foreground uppercase"
                                    >
                                        Tanggal & Waktu Mulai{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="starts_at"
                                        type="datetime-local"
                                        value={data.starts_at}
                                        onChange={(e) =>
                                            setData('starts_at', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium outline-none focus:border-emerald-600"
                                        required
                                    />
                                    <InputError message={errors.starts_at} />
                                </div>

                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="ends_at"
                                        className="text-xs font-bold text-muted-foreground uppercase"
                                    >
                                        Tanggal & Waktu Selesai (Opsional)
                                    </label>
                                    <input
                                        id="ends_at"
                                        type="datetime-local"
                                        value={data.ends_at}
                                        onChange={(e) =>
                                            setData('ends_at', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium outline-none focus:border-emerald-600"
                                    />
                                    <InputError message={errors.ends_at} />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-800 focus:outline-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <Megaphone className="size-4" />
                                        <span>Publikasikan Pengumuman</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminAnnouncementCreate.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Kelola Pengumuman',
            href: announcementIndex(),
        },
        {
            title: 'Buat Pengumuman Baru',
            href: announcementCreate(),
        },
    ],
};
