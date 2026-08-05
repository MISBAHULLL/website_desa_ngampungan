import { Form, Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Bell,
    Megaphone,
    Pin,
    Plus,
    ShieldAlert,
} from 'lucide-react';
import { useState } from 'react';
import {
    index as announcementIndex,
    update as announcementUpdate,
} from '@/actions/App/Http/Controllers/Admin/AnnouncementController';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type AnnouncementItem = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    content: string[] | null;
    priority: 'normal' | 'important' | 'emergency';
    status: 'active' | 'archived';
    is_pinned: boolean;
    starts_at: string;
    ends_at: string | null;
};

type AdminAnnouncementEditProps = {
    announcement: AnnouncementItem;
};

function formatDatetimeLocal(isoString: string): string {
    if (!isoString) {
        return '';
    }

    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

export default function AdminAnnouncementEdit({
    announcement,
}: AdminAnnouncementEditProps) {
    const [title, setTitle] = useState(announcement.title);
    const [summary, setSummary] = useState(announcement.summary);
    const [contentParagraphs, setContentParagraphs] = useState<string[]>(
        announcement.content && announcement.content.length > 0
            ? announcement.content
            : [''],
    );
    const [priority, setPriority] = useState<
        'normal' | 'important' | 'emergency'
    >(announcement.priority);
    const [status, setStatus] = useState<'active' | 'archived'>(
        announcement.status,
    );
    const [isPinned, setIsPinned] = useState(announcement.is_pinned);
    const [startsAt, setStartsAt] = useState(
        formatDatetimeLocal(announcement.starts_at),
    );
    const [endsAt, setEndsAt] = useState(
        announcement.ends_at ? formatDatetimeLocal(announcement.ends_at) : '',
    );

    function addParagraph() {
        setContentParagraphs([...contentParagraphs, '']);
    }

    function updateParagraph(index: number, value: string) {
        const next = [...contentParagraphs];
        next[index] = value;
        setContentParagraphs(next);
    }

    function removeParagraph(index: number) {
        if (contentParagraphs.length <= 1) {
            return;
        }

        const next = contentParagraphs.filter((_, i) => i !== index);

        setContentParagraphs(next);
    }

    return (
        <>
            <Head title={`Edit Pengumuman - ${announcement.title}`} />

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
                            Edit Pengumuman
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Perbarui rincian, status, atau prioritas pengumuman
                            desa.
                        </p>
                    </div>
                </header>

                <Form
                    action={announcementUpdate(announcement.id)}
                    transform={() => ({
                        title,
                        summary,
                        content: contentParagraphs.filter(
                            (paragraph) => paragraph.trim() !== '',
                        ),
                        priority,
                        status,
                        is_pinned: isPinned,
                        starts_at: startsAt,
                        ends_at: endsAt || null,
                    })}
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
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
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <span
                                            className={
                                                title.length > 255
                                                    ? 'text-xs font-bold text-red-600'
                                                    : 'text-xs text-muted-foreground'
                                            }
                                        >
                                            {title.length}/255 Karakter
                                        </span>
                                    </div>
                                    <input
                                        id="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        placeholder="Judul pengumuman..."
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
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <span
                                            className={
                                                summary.length > 300
                                                    ? 'text-xs font-bold text-red-600'
                                                    : 'text-xs text-muted-foreground'
                                            }
                                        >
                                            {summary.length}/300 Karakter
                                        </span>
                                    </div>
                                    <textarea
                                        id="summary"
                                        rows={3}
                                        value={summary}
                                        onChange={(e) =>
                                            setSummary(e.target.value)
                                        }
                                        placeholder="Ringkasan pengumuman..."
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
                                                Detail Paragraf Tambahan
                                                (Opsional)
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

                                    {contentParagraphs.map((para, index) => (
                                        <div
                                            key={index}
                                            className="space-y-1.5"
                                        >
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="font-semibold">
                                                    Paragraf {index + 1}
                                                </span>
                                                {contentParagraphs.length >
                                                    1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeParagraph(
                                                                index,
                                                            )
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
                                                    priority === 'normal'
                                                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20'
                                                        : 'border-sidebar-border/70'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="priority"
                                                    value="normal"
                                                    checked={
                                                        priority === 'normal'
                                                    }
                                                    onChange={() =>
                                                        setPriority('normal')
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
                                                    priority === 'important'
                                                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                                                        : 'border-sidebar-border/70'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="priority"
                                                    value="important"
                                                    checked={
                                                        priority === 'important'
                                                    }
                                                    onChange={() =>
                                                        setPriority('important')
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
                                                    priority === 'emergency'
                                                        ? 'border-rose-600 bg-rose-50/50 dark:bg-rose-950/20'
                                                        : 'border-sidebar-border/70'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="priority"
                                                    value="emergency"
                                                    checked={
                                                        priority === 'emergency'
                                                    }
                                                    onChange={() =>
                                                        setPriority('emergency')
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
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(
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
                                                checked={isPinned}
                                                onChange={(e) =>
                                                    setIsPinned(
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
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="starts_at"
                                            type="datetime-local"
                                            value={startsAt}
                                            onChange={(e) =>
                                                setStartsAt(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium outline-none focus:border-emerald-600"
                                            required
                                        />
                                        <InputError
                                            message={errors.starts_at}
                                        />
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
                                            value={endsAt}
                                            onChange={(e) =>
                                                setEndsAt(e.target.value)
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
                                            <span>Simpan Perubahan</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminAnnouncementEdit.layout = {
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
            title: 'Edit Pengumuman',
            href: '#',
        },
    ],
};
