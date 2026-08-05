import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as agendaIndex,
    update as agendaUpdate,
} from '@/actions/App/Http/Controllers/Admin/AgendaController';
import { AdminImageUploadField } from '@/components/admin-news-image-field';
import { dashboard } from '@/routes';

type AgendaItemProps = {
    agendaItem: {
        id: number;
        title: string;
        category: string;
        summary: string;
        details: string[] | null;
        event_date: string;
        time_label: string;
        location: string;
        organizer: string;
        contact: string | null;
        registration_required: boolean;
        status: 'upcoming' | 'completed';
        is_featured: boolean;
        image_path: string | null;
        image_alt: string | null;
    };
    categoryOptions: string[];
    otherCategoryLabel: string;
};

export default function AdminAgendaEdit({
    agendaItem,
    categoryOptions,
    otherCategoryLabel,
}: AgendaItemProps) {
    const isStandardCategory = categoryOptions.includes(agendaItem.category);
    const [categorySelection, setCategorySelection] = useState(
        isStandardCategory ? agendaItem.category : otherCategoryLabel,
    );
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: agendaItem.title,
        category: agendaItem.category,
        summary: agendaItem.summary,
        details:
            agendaItem.details && agendaItem.details.length > 0
                ? agendaItem.details
                : [''],
        event_date: agendaItem.event_date
            ? agendaItem.event_date.split('T')[0]
            : '',
        time_label: agendaItem.time_label,
        location: agendaItem.location,
        organizer: agendaItem.organizer,
        contact: agendaItem.contact || '',
        registration_required: agendaItem.registration_required,
        status: agendaItem.status,
        is_featured: agendaItem.is_featured,
        image: null as File | null,
        image_url: agendaItem.image_path?.startsWith('http')
            ? agendaItem.image_path
            : '',
        image_alt: agendaItem.image_alt || '',
    });

    function handleDetailChange(index: number, value: string) {
        const updated = [...data.details];
        updated[index] = value;
        setData('details', updated);
    }

    function addDetailField() {
        setData('details', [...data.details, '']);
    }

    function removeDetailField(index: number) {
        if (data.details.length === 1) {
return;
}

        const updated = data.details.filter((_, i) => i !== index);
        setData('details', updated);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(agendaUpdate.url(agendaItem.id));
    }

    return (
        <>
            <Head title={`Sunting Agenda: ${agendaItem.title}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <Link
                            href={agendaIndex()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Kelola Agenda</span>
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Sunting Agenda Desa
                        </h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    <div className="space-y-5 rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-xs font-bold tracking-wider text-foreground uppercase"
                            >
                                Judul Agenda *
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Kategori *
                                </label>
                                <select
                                    id="category"
                                    value={categorySelection}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setCategorySelection(value);
                                        setData(
                                            'category',
                                            value === otherCategoryLabel
                                                ? ''
                                                : value,
                                        );
                                    }}
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                >
                                    {categoryOptions.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                    <option value={otherCategoryLabel}>
                                        {otherCategoryLabel}
                                    </option>
                                </select>
                                {categorySelection === otherCategoryLabel && (
                                    <div className="mt-3">
                                        <label
                                            htmlFor="custom_category"
                                            className="block text-xs font-semibold text-muted-foreground"
                                        >
                                            Nama kategori lainnya
                                        </label>
                                        <input
                                            id="custom_category"
                                            type="text"
                                            required
                                            maxLength={100}
                                            value={data.category}
                                            onChange={(event) =>
                                                setData(
                                                    'category',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                    </div>
                                )}
                                {errors.category && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="event_date"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Tanggal Pelaksanaan *
                                </label>
                                <input
                                    id="event_date"
                                    type="date"
                                    value={data.event_date}
                                    onChange={(e) =>
                                        setData('event_date', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="time_label"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Waktu / Jam Pelaksanaan *
                                </label>
                                <input
                                    id="time_label"
                                    type="text"
                                    value={data.time_label}
                                    onChange={(e) =>
                                        setData('time_label', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="location"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Lokasi Pelaksanaan *
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="summary"
                                className="block text-xs font-bold tracking-wider text-foreground uppercase"
                            >
                                Ringkasan Kegiatan *
                            </label>
                            <textarea
                                id="summary"
                                rows={2}
                                value={data.summary}
                                onChange={(e) =>
                                    setData('summary', e.target.value)
                                }
                                className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                required
                            />
                        </div>

                        {/* Details */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold tracking-wider text-foreground uppercase">
                                    Poin Pembahasan / Detail Kegiatan (Opsional)
                                </label>
                                <button
                                    type="button"
                                    onClick={addDetailField}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Tambah Poin</span>
                                </button>
                            </div>
                            <div className="mt-2 space-y-2">
                                {data.details.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={detail}
                                            onChange={(e) =>
                                                handleDetailChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Poin ${index + 1}...`}
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                        {data.details.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeDetailField(index)
                                                }
                                                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <AdminImageUploadField
                            title="Foto / Dokumentasi Agenda"
                            previewFallbackAlt="Pratinjau foto agenda"
                            currentImage={agendaItem.image_path}
                            imageUrl={data.image_url}
                            imageAlt={data.image_alt}
                            imageError={errors.image}
                            imageUrlError={errors.image_url}
                            imageAltError={errors.image_alt}
                            onFileChange={(file) => setData('image', file)}
                            onImageUrlChange={(value) =>
                                setData('image_url', value)
                            }
                            onImageAltChange={(value) =>
                                setData('image_alt', value)
                            }
                        />

                        <div className="grid gap-5 border-t border-sidebar-border/70 pt-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="organizer"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Penyelenggara *
                                </label>
                                <input
                                    id="organizer"
                                    type="text"
                                    value={data.organizer}
                                    onChange={(e) =>
                                        setData('organizer', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Kontak / Narahubung
                                </label>
                                <input
                                    id="contact"
                                    type="text"
                                    value={data.contact}
                                    onChange={(e) =>
                                        setData('contact', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Status Agenda *
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData(
                                            'status',
                                            e.target.value as
                                                'upcoming' | 'completed',
                                        )
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                >
                                    <option value="upcoming">
                                        Akan Datang
                                    </option>
                                    <option value="completed">Selesai</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <label className="inline-flex items-center gap-2 text-xs font-bold text-foreground">
                                    <input
                                        type="checkbox"
                                        checked={data.registration_required}
                                        onChange={(e) =>
                                            setData(
                                                'registration_required',
                                                e.target.checked,
                                            )
                                        }
                                        className="size-4 rounded border-sidebar-border text-emerald-700 focus:ring-emerald-600"
                                    />
                                    <span>Memerlukan Pendaftaran Warga</span>
                                </label>

                                <label className="inline-flex items-center gap-2 text-xs font-bold text-foreground">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) =>
                                            setData(
                                                'is_featured',
                                                e.target.checked,
                                            )
                                        }
                                        className="size-4 rounded border-sidebar-border text-emerald-700 focus:ring-emerald-600"
                                    />
                                    <span>Agenda Utama</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                        >
                            <Save className="size-4" />
                            <span>
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Perbarui Agenda'}
                            </span>
                        </button>
                        <Link
                            href={agendaIndex()}
                            className="rounded-xl border border-sidebar-border/70 px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminAgendaEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Kelola Agenda', href: agendaIndex() },
        { title: 'Sunting Agenda', href: '#' },
    ],
};
