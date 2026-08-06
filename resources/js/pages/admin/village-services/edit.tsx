import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    FileText,
    ListChecks,
    Minus,
    Plus,
    Save,
} from 'lucide-react';
import {
    index as serviceIndex,
    update as serviceUpdate,
} from '@/actions/App/Http/Controllers/Admin/VillageServiceController';
import { dashboard } from '@/routes';

type CategoryOption = {
    value: string;
    label: string;
};

type RequirementRow = {
    id?: number;
    description: string;
};

type DocumentRow = {
    id?: number;
    key: string;
    label: string;
    description: string;
    isRequired: boolean;
    acceptedFormats: string;
};

type ServiceData = {
    id: number;
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    audience: string;
    channel: string;
    estimatedDuration: string;
    fee: string;
    serviceContact: string | null;
    serviceHours: string | null;
    notes: string[];
    isActive: boolean;
    requirements: RequirementRow[];
    documents: DocumentRow[];
};

type VillageServiceEditProps = {
    service: ServiceData;
    categories: CategoryOption[];
};

type FormRequirementRow = {
    description: string;
};

type FormDocumentRow = {
    key: string;
    label: string;
    description: string;
    is_required: boolean;
    accepted_formats: string;
};

export default function VillageServiceEdit({
    service,
    categories,
}: VillageServiceEditProps) {
    const { data, setData, put, processing, errors } = useForm<{
        title: string;
        short_description: string;
        category: string;
        audience: string;
        channel: string;
        estimated_duration: string;
        fee: string;
        service_contact: string;
        service_hours: string;
        notes: string[];
        is_active: boolean;
        requirements: FormRequirementRow[];
        documents: FormDocumentRow[];
    }>({
        title: service.title,
        short_description: service.shortDescription,
        category: service.category,
        audience: service.audience,
        channel: service.channel,
        estimated_duration: service.estimatedDuration,
        fee: service.fee,
        service_contact: service.serviceContact ?? '',
        service_hours: service.serviceHours ?? '',
        notes: service.notes ?? [],
        is_active: service.isActive,
        requirements: service.requirements.map((r) => ({
            description: r.description,
        })),
        documents: service.documents.map((d) => ({
            key: d.key,
            label: d.label,
            description: d.description ?? '',
            is_required: d.isRequired,
            accepted_formats: d.acceptedFormats,
        })),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(serviceUpdate.url(service.id));
    }

    function addRequirement() {
        setData('requirements', [...data.requirements, { description: '' }]);
    }

    function removeRequirement(index: number) {
        setData(
            'requirements',
            data.requirements.filter((_, i) => i !== index),
        );
    }

    function updateRequirement(index: number, value: string) {
        const updated = [...data.requirements];
        updated[index] = { description: value };
        setData('requirements', updated);
    }

    function addDocument() {
        setData('documents', [
            ...data.documents,
            {
                key: '',
                label: '',
                description: '',
                is_required: true,
                accepted_formats: '.pdf,.jpg,.jpeg,.png',
            },
        ]);
    }

    function removeDocument(index: number) {
        setData(
            'documents',
            data.documents.filter((_, i) => i !== index),
        );
    }

    function updateDocument(
        index: number,
        field: keyof FormDocumentRow,
        value: string | boolean,
    ) {
        const updated = [...data.documents];
        updated[index] = { ...updated[index], [field]: value };
        setData('documents', updated);
    }

    function autoGenerateKey(index: number, label: string) {
        const key = label
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        updateDocument(index, 'key', key);
    }

    return (
        <>
            <Head title={`Edit Layanan – ${service.title}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Administrasi Desa
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Edit Layanan
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Perbarui informasi layanan{' '}
                            <strong>{service.title}</strong>, termasuk
                            persyaratan dan berkas pendukungnya.
                        </p>
                    </div>

                    <Link
                        href={serviceIndex()}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-sidebar-border/70 px-4 py-2 text-sm font-semibold transition hover:border-foreground/30"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* SERVICE DETAILS */}
                    <section className="space-y-5 rounded-xl border border-sidebar-border/70 bg-background p-6">
                        <h2 className="flex items-center gap-2 text-lg font-bold">
                            <FileText className="size-5 text-emerald-600" />
                            Informasi Layanan
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-semibold">
                                    Nama Layanan{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-semibold">
                                    Deskripsi Singkat{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.short_description}
                                    onChange={(e) =>
                                        setData(
                                            'short_description',
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                />
                                {errors.short_description && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.short_description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold">
                                    Kategori{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                    className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                >
                                    {categories.map((cat) => (
                                        <option
                                            key={cat.value}
                                            value={cat.value}
                                        >
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold">
                                    Sasaran Warga{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.audience}
                                    onChange={(e) =>
                                        setData('audience', e.target.value)
                                    }
                                    className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                />
                                {errors.audience && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.audience}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold">
                                    Kanal Pelayanan{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.channel}
                                    onChange={(e) =>
                                        setData('channel', e.target.value)
                                    }
                                    className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                />
                                {errors.channel && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.channel}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold">
                                    Estimasi Waktu{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.estimated_duration}
                                    onChange={(e) =>
                                        setData(
                                            'estimated_duration',
                                            e.target.value,
                                        )
                                    }
                                    className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                />
                                {errors.estimated_duration && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.estimated_duration}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold">
                                    Biaya
                                </label>
                                <input
                                    type="text"
                                    value={data.fee}
                                    onChange={(e) =>
                                        setData('fee', e.target.value)
                                    }
                                    className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold">
                                    Kontak Petugas
                                </label>
                                <input
                                    type="text"
                                    value={data.service_contact}
                                    onChange={(e) =>
                                        setData(
                                            'service_contact',
                                            e.target.value,
                                        )
                                    }
                                    className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold">
                                    Jam Pelayanan
                                </label>
                                <input
                                    type="text"
                                    value={data.service_hours}
                                    onChange={(e) =>
                                        setData(
                                            'service_hours',
                                            e.target.value,
                                        )
                                    }
                                    className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                />
                            </div>

                            <div className="flex items-center gap-3 md:col-span-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    className="size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                                />
                                <label
                                    htmlFor="is_active"
                                    className="text-sm font-semibold"
                                >
                                    Layanan aktif dan tampil di halaman publik
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* REQUIREMENTS */}
                    <section className="space-y-5 rounded-xl border border-sidebar-border/70 bg-background p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                <ListChecks className="size-5 text-emerald-600" />
                                Persyaratan Pemohon
                            </h2>
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                            >
                                <Plus className="size-3.5" />
                                Tambah
                            </button>
                        </div>

                        <div className="space-y-3">
                            {data.requirements.map((req, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                                        {index + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={req.description}
                                        onChange={(e) =>
                                            updateRequirement(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Deskripsi persyaratan..."
                                        className="min-h-10 flex-1 rounded-lg border border-input bg-transparent px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                    />
                                    {data.requirements.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeRequirement(index)
                                            }
                                            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-900/60"
                                        >
                                            <Minus className="size-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* DOCUMENT REQUIREMENTS */}
                    <section className="space-y-5 rounded-xl border border-sidebar-border/70 bg-background p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                <FileText className="size-5 text-blue-600" />
                                Berkas Pendukung
                            </h2>
                            <button
                                type="button"
                                onClick={addDocument}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
                            >
                                <Plus className="size-3.5" />
                                Tambah Dokumen
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.documents.map((doc, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-sidebar-border/70 bg-muted/20 p-4"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm font-bold text-muted-foreground">
                                            Dokumen #{index + 1}
                                        </span>
                                        {data.documents.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeDocument(index)
                                                }
                                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/60"
                                            >
                                                <Minus className="size-3" />
                                                Hapus
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold">
                                                Nama Dokumen{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={doc.label}
                                                onChange={(e) => {
                                                    updateDocument(
                                                        index,
                                                        'label',
                                                        e.target.value,
                                                    );
                                                    if (!doc.key) {
                                                        autoGenerateKey(
                                                            index,
                                                            e.target.value,
                                                        );
                                                    }
                                                }}
                                                className="min-h-10 w-full rounded-lg border border-input bg-background px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-semibold">
                                                Kode Dokumen{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={doc.key}
                                                onChange={(e) =>
                                                    updateDocument(
                                                        index,
                                                        'key',
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-10 w-full rounded-lg border border-input bg-background px-3 font-mono text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="mb-1 block text-xs font-semibold">
                                                Keterangan
                                            </label>
                                            <input
                                                type="text"
                                                value={doc.description}
                                                onChange={(e) =>
                                                    updateDocument(
                                                        index,
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-10 w-full rounded-lg border border-input bg-background px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-semibold">
                                                Format yang Diterima
                                            </label>
                                            <input
                                                type="text"
                                                value={doc.accepted_formats}
                                                onChange={(e) =>
                                                    updateDocument(
                                                        index,
                                                        'accepted_formats',
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-10 w-full rounded-lg border border-input bg-background px-3 font-mono text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 pt-5">
                                            <input
                                                type="checkbox"
                                                id={`doc-required-${index}`}
                                                checked={doc.is_required}
                                                onChange={(e) =>
                                                    updateDocument(
                                                        index,
                                                        'is_required',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                                            />
                                            <label
                                                htmlFor={`doc-required-${index}`}
                                                className="text-sm font-semibold"
                                            >
                                                Wajib dilengkapi
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3 border-t border-sidebar-border/70 pt-6">
                        <Link
                            href={serviceIndex()}
                            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-sidebar-border/70 px-5 py-2.5 text-sm font-semibold transition hover:border-foreground/30"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-800 disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                        >
                            <Save className="size-4" />
                            {processing
                                ? 'Menyimpan...'
                                : 'Perbarui Layanan'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

VillageServiceEdit.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Kelola Layanan',
            href: serviceIndex(),
        },
        {
            title: 'Edit Layanan',
        },
    ],
};
