import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, UserPlus, Upload, X } from 'lucide-react';
import { useState } from 'react';
import {
    index as officialIndex,
    store as officialStore,
} from '@/actions/App/Http/Controllers/Admin/VillageOfficialController';
import { dashboard } from '@/routes';

type ParentOption = {
    id: number;
    name: string;
    position: string;
};

type Props = {
    parentOptions: ParentOption[];
};

export default function AdminVillageOfficialCreate({ parentOptions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        initials: '',
        position: '',
        unit: 'Pemerintah Desa',
        group: 'leadership',
        photo: null as File | null,
        term: '2022–2028',
        employee_id: '',
        summary: '',
        about: '',
        responsibilities: [''],
        service_focus: [''],
        education: [''],
        career: [{ period: '', role: '' }],
        sort_order: 0,
        parent_id: '' as string | number,
        is_active: true,
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    function handleNameChange(name: string) {
        setData((prev) => {
            const parts = name.trim().split(' ');
            let initials = '';
            if (parts.length >= 2) {
                initials = (parts[0][0] + parts[1][0]).toUpperCase();
            } else if (parts.length === 1 && parts[0].length > 0) {
                initials = parts[0].substring(0, 2).toUpperCase();
            }
            return {
                ...prev,
                name,
                initials: prev.initials || initials,
            };
        });
    }

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    }

    function removePhoto() {
        setData('photo', null);
        setPhotoPreview(null);
    }

    // Dynamic Array Handlers
    function handleArrayChange(
        field: 'responsibilities' | 'service_focus' | 'education',
        index: number,
        value: string,
    ) {
        const updated = [...data[field]];
        updated[index] = value;
        setData(field, updated);
    }

    function addArrayField(
        field: 'responsibilities' | 'service_focus' | 'education',
    ) {
        setData(field, [...data[field], '']);
    }

    function removeArrayField(
        field: 'responsibilities' | 'service_focus' | 'education',
        index: number,
    ) {
        if (data[field].length === 1) return;
        const updated = data[field].filter((_, i) => i !== index);
        setData(field, updated);
    }

    // Career Handlers
    function handleCareerChange(
        index: number,
        key: 'period' | 'role',
        value: string,
    ) {
        const updated = [...data.career];
        updated[index] = { ...updated[index], [key]: value };
        setData('career', updated);
    }

    function addCareerField() {
        setData('career', [...data.career, { period: '', role: '' }]);
    }

    function removeCareerField(index: number) {
        if (data.career.length === 1) return;
        const updated = data.career.filter((_, i) => i !== index);
        setData('career', updated);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(officialStore.url());
    }

    return (
        <>
            <Head title="Tambah Perangkat Desa Baru" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <Link
                            href={officialIndex()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Perangkat Desa</span>
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Tambah Perangkat Desa Baru
                        </h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    <div className="space-y-6 rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        <h2 className="border-b border-sidebar-border/70 pb-3 text-base font-bold text-foreground">
                            Informasi Utama & Foto
                        </h2>

                        {/* Photo Upload */}
                        <div>
                            <label className="mb-2 block text-xs font-bold tracking-wider text-foreground uppercase">
                                Foto Perangkat (Opsional)
                            </label>
                            <div className="flex items-center gap-4">
                                {photoPreview ? (
                                    <div className="group relative size-24 shrink-0 overflow-hidden rounded-xl border border-sidebar-border">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="size-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                            className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-90 hover:opacity-100"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex size-24 shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border bg-muted/30 text-muted-foreground">
                                        <Upload className="mb-1 size-6" />
                                        <span className="text-[10px] font-semibold">
                                            Upload Foto
                                        </span>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-emerald-800"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Format JPG, PNG, WebP (maks. 2MB).
                                    </p>
                                    {errors.photo && (
                                        <p className="text-xs text-red-600">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Name & Initials */}
                        <div className="grid gap-5 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="name"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Nama Lengkap & Gelar *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        handleNameChange(e.target.value)
                                    }
                                    placeholder="Contoh: Rina Kurniasih, S.E."
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="initials"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Inisial (Maks 5 Karakter) *
                                </label>
                                <input
                                    id="initials"
                                    type="text"
                                    value={data.initials}
                                    onChange={(e) =>
                                        setData(
                                            'initials',
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    maxLength={5}
                                    placeholder="RK"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                {errors.initials && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.initials}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Position & Unit */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="position"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Jabatan *
                                </label>
                                <input
                                    id="position"
                                    type="text"
                                    value={data.position}
                                    onChange={(e) =>
                                        setData('position', e.target.value)
                                    }
                                    placeholder="Contoh: Sekretaris Desa / Kaur Keuangan"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                {errors.position && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.position}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="unit"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Unit Kerja *
                                </label>
                                <input
                                    id="unit"
                                    type="text"
                                    value={data.unit}
                                    onChange={(e) =>
                                        setData('unit', e.target.value)
                                    }
                                    placeholder="Contoh: Sekretariat Desa / Pelaksana Teknis"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                {errors.unit && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.unit}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Group & Atasan (Parent ID) */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="group"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Kelompok / Kategori *
                                </label>
                                <select
                                    id="group"
                                    value={data.group}
                                    onChange={(e) =>
                                        setData('group', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                >
                                    <option value="leadership">
                                        Pimpinan (Kepala Desa)
                                    </option>
                                    <option value="secretariat">
                                        Sekretariat Desa
                                    </option>
                                    <option value="technical">
                                        Pelaksana Teknis (Kasi)
                                    </option>
                                    <option value="territorial">
                                        Pelaksana Kewilayahan (Kadus)
                                    </option>
                                </select>
                                {errors.group && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.group}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="parent_id"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Atasan Langsung (Struktur Org)
                                </label>
                                <select
                                    id="parent_id"
                                    value={data.parent_id}
                                    onChange={(e) =>
                                        setData('parent_id', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                >
                                    <option value="">
                                        -- Tidak ada atasan (Top Level / Kades)
                                        --
                                    </option>
                                    {parentOptions.map((parent) => (
                                        <option
                                            key={parent.id}
                                            value={parent.id}
                                        >
                                            {parent.name} ({parent.position})
                                        </option>
                                    ))}
                                </select>
                                {errors.parent_id && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.parent_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Term & NIP/ID */}
                        <div className="grid gap-5 sm:grid-cols-3">
                            <div>
                                <label
                                    htmlFor="term"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Masa Jabatan
                                </label>
                                <input
                                    id="term"
                                    type="text"
                                    value={data.term}
                                    onChange={(e) =>
                                        setData('term', e.target.value)
                                    }
                                    placeholder="2022–2028"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="employee_id"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    NIP / ID Perangkat
                                </label>
                                <input
                                    id="employee_id"
                                    type="text"
                                    value={data.employee_id}
                                    onChange={(e) =>
                                        setData('employee_id', e.target.value)
                                    }
                                    placeholder="Kaur-Keu-001"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="sort_order"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Urutan Tampilan
                                </label>
                                <input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData(
                                            'sort_order',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>
                        </div>

                        {/* Summary & About */}
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="summary"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Ringkasan Tugas (Tampil di Card) *
                                </label>
                                <textarea
                                    id="summary"
                                    rows={2}
                                    value={data.summary}
                                    onChange={(e) =>
                                        setData('summary', e.target.value)
                                    }
                                    placeholder="Mengoordinasikan urusan administrasi umum..."
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                {errors.summary && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.summary}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="about"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Tentang Perangkat (Tampil di Modal Detail)
                                </label>
                                <textarea
                                    id="about"
                                    rows={3}
                                    value={data.about}
                                    onChange={(e) =>
                                        setData('about', e.target.value)
                                    }
                                    placeholder="Latar belakang singkat dan uraian tugas..."
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>
                        </div>

                        {/* Responsibilities Dynamic List */}
                        <h2 className="border-b border-sidebar-border/70 pt-2 pb-3 text-base font-bold text-foreground">
                            Poin Tugas & Tanggung Jawab
                        </h2>
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-xs font-bold tracking-wider text-foreground uppercase">
                                    Tugas Utama (Modal Detail)
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        addArrayField('responsibilities')
                                    }
                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Tambah Tugas</span>
                                </button>
                            </div>
                            <div className="space-y-2">
                                {data.responsibilities.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) =>
                                                handleArrayChange(
                                                    'responsibilities',
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Tugas ${index + 1}...`}
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                        {data.responsibilities.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeArrayField(
                                                        'responsibilities',
                                                        index,
                                                    )
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

                        {/* Service Focus Dynamic List */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-xs font-bold tracking-wider text-foreground uppercase">
                                    Fokus Pelayanan (Tag/Badge Modal Detail)
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        addArrayField('service_focus')
                                    }
                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Tambah Fokus</span>
                                </button>
                            </div>
                            <div className="space-y-2">
                                {data.service_focus.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) =>
                                                handleArrayChange(
                                                    'service_focus',
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Contoh: Administrasi / Keuangan / Kependudukan...`}
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                        {data.service_focus.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeArrayField(
                                                        'service_focus',
                                                        index,
                                                    )
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

                        {/* Education Dynamic List */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-xs font-bold tracking-wider text-foreground uppercase">
                                    Riwayat Pendidikan
                                </label>
                                <button
                                    type="button"
                                    onClick={() => addArrayField('education')}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Tambah Pendidikan</span>
                                </button>
                            </div>
                            <div className="space-y-2">
                                {data.education.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) =>
                                                handleArrayChange(
                                                    'education',
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Contoh: Sarjana Ekonomi (S.E.) - Universitas X`}
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                        {data.education.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeArrayField(
                                                        'education',
                                                        index,
                                                    )
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

                        {/* Career Dynamic List */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-xs font-bold tracking-wider text-foreground uppercase">
                                    Riwayat Karir / Jabatan
                                </label>
                                <button
                                    type="button"
                                    onClick={addCareerField}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Tambah Karir</span>
                                </button>
                            </div>
                            <div className="space-y-2">
                                {data.career.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={item.period}
                                            onChange={(e) =>
                                                handleCareerChange(
                                                    index,
                                                    'period',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Periode (e.g. 2022–sekarang)"
                                            className="w-1/3 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                        <input
                                            type="text"
                                            value={item.role}
                                            onChange={(e) =>
                                                handleCareerChange(
                                                    index,
                                                    'role',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Jabatan / Peran"
                                            className="w-2/3 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                        {data.career.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeCareerField(index)
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

                        {/* Status Checkbox */}
                        <div className="border-t border-sidebar-border/70 pt-2">
                            <label className="inline-flex items-center gap-2 text-xs font-bold text-foreground">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    className="size-4 rounded border-sidebar-border text-emerald-700 focus:ring-emerald-600"
                                />
                                <span>
                                    Status Aktif (Tampilkan di Website Public)
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                        >
                            <UserPlus className="size-4" />
                            <span>
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Perangkat'}
                            </span>
                        </button>
                        <Link
                            href={officialIndex()}
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

AdminVillageOfficialCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Perangkat Desa', href: officialIndex() },
        { title: 'Tambah Perangkat Baru', href: '#' },
    ],
};
