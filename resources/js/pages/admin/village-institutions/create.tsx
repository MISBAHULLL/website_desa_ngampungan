import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Image as ImageIcon,
    Landmark,
    Plus,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import {
    index as institutionIndex,
    store as institutionStore,
} from '@/actions/App/Http/Controllers/Admin/VillageInstitutionController';
import { dashboard } from '@/routes';

type MemberItem = {
    name: string;
    role: string;
};

export default function AdminVillageInstitutionCreate() {
    const { data, setData, post, processing, errors } = useForm({
        acronym: '',
        name: '',
        leader: '',
        member_count: 0,
        focus: '',
        description: '',
        responsibilities: [''],
        members: [{ name: '', role: '' }] as MemberItem[],
        logo: null as File | null,
        sort_order: 0,
        is_active: true,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    }

    // Responsibilities helpers
    function handleResponsibilityChange(index: number, value: string) {
        const updated = [...data.responsibilities];
        updated[index] = value;
        setData('responsibilities', updated);
    }

    function addResponsibility() {
        setData('responsibilities', [...data.responsibilities, '']);
    }

    function removeResponsibility(index: number) {
        if (data.responsibilities.length === 1) {
            return;
        }

        const updated = data.responsibilities.filter((_, i) => i !== index);
        setData('responsibilities', updated);
    }

    // Members helpers
    function handleMemberChange(
        index: number,
        field: 'name' | 'role',
        value: string,
    ) {
        const updated = [...data.members];
        updated[index] = { ...updated[index], [field]: value };
        setData('members', updated);
    }

    function addMember() {
        setData('members', [...data.members, { name: '', role: '' }]);
    }

    function removeMember(index: number) {
        if (data.members.length === 1) {
            return;
        }

        const updated = data.members.filter((_, i) => i !== index);
        setData('members', updated);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(institutionStore.url());
    }

    return (
        <>
            <Head title="Tambah Lembaga Desa Baru" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <Link
                            href={institutionIndex()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Lembaga Desa</span>
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Tambah Lembaga Desa Baru
                        </h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    <div className="space-y-6 rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        {/* Logo Upload Section */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold tracking-wider text-foreground uppercase">
                                Logo / Lambang Lembaga (Opsional)
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-sidebar-border bg-muted/30">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Preview Logo"
                                            className="h-full w-full object-contain p-1"
                                        />
                                    ) : (
                                        <ImageIcon className="size-8 text-muted-foreground/50" />
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="text-xs text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-emerald-800"
                                    />
                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                        Format JPG/PNG, maks 2MB.
                                    </p>
                                </div>
                            </div>
                            {errors.logo && (
                                <p className="text-xs text-red-600">
                                    {errors.logo}
                                </p>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="grid gap-5 sm:grid-cols-3">
                            <div>
                                <label
                                    htmlFor="acronym"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Singkatan / Badge *
                                </label>
                                <input
                                    id="acronym"
                                    type="text"
                                    value={data.acronym}
                                    onChange={(e) =>
                                        setData(
                                            'acronym',
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    maxLength={10}
                                    placeholder="BPD / PKK / KARTAR"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                {errors.acronym && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.acronym}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="name"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Nama Lembaga Lengkap *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Contoh: Badan Permusyawaratan Desa"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="leader"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Ketua / Penanggung Jawab
                                </label>
                                <input
                                    id="leader"
                                    type="text"
                                    value={data.leader}
                                    onChange={(e) =>
                                        setData('leader', e.target.value)
                                    }
                                    placeholder="Nama Ketua Lembaga"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="member_count"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Jumlah Total Anggota *
                                </label>
                                <input
                                    id="member_count"
                                    type="number"
                                    min={0}
                                    value={data.member_count}
                                    onChange={(e) =>
                                        setData(
                                            'member_count',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="focus"
                                className="block text-xs font-bold tracking-wider text-foreground uppercase"
                            >
                                Fokus Utama Lembaga *
                            </label>
                            <textarea
                                id="focus"
                                rows={2}
                                value={data.focus}
                                onChange={(e) =>
                                    setData('focus', e.target.value)
                                }
                                placeholder="Singkapan fokus kegiatan utama..."
                                className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                required
                            />
                            {errors.focus && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.focus}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-xs font-bold tracking-wider text-foreground uppercase"
                            >
                                Deskripsi Lengkap Lembaga (Opsional)
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Jelaskan peran, sejarah singkat, atau gambaran umum kegiatan lembaga..."
                                className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                            />
                        </div>

                        {/* Responsibilities Array */}
                        <div className="space-y-3 border-t border-sidebar-border/70 pt-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold tracking-wider text-foreground uppercase">
                                    Tugas & Peran Utama (Poin-poin)
                                </label>
                                <button
                                    type="button"
                                    onClick={addResponsibility}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Tambah Poin Tugas</span>
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
                                                handleResponsibilityChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Poin tugas ${index + 1}...`}
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                        {data.responsibilities.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeResponsibility(index)
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

                        {/* Members Array (Nama & Jabatan Anggota) */}
                        <div className="space-y-3 border-t border-sidebar-border/70 pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-xs font-bold tracking-wider text-foreground uppercase">
                                        Daftar Pengurus & Anggota Lembaga
                                    </label>
                                    <p className="text-[11px] text-muted-foreground">
                                        Tambahkan nama pengurus/anggota dan
                                        jabatannya (misal: Ketua, Sekretaris,
                                        Bendahara, Anggota).
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addMember}
                                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                                >
                                    <UserPlus className="size-3.5" />
                                    <span>Tambah Anggota</span>
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {data.members.map((member, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-12 items-center gap-2 rounded-xl border border-sidebar-border/60 bg-muted/20 p-2.5"
                                    >
                                        <div className="col-span-6">
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Nama Lengkap Anggota"
                                                className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                                            />
                                        </div>
                                        <div className="col-span-5">
                                            <input
                                                type="text"
                                                value={member.role}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        'role',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Jabatan / Peran (e.g. Sekretaris)"
                                                className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                                            />
                                        </div>
                                        <div className="col-span-1 text-right">
                                            {data.members.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeMember(index)
                                                    }
                                                    className="inline-flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Settings */}
                        <div className="flex items-center justify-between border-t border-sidebar-border/70 pt-4">
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
                                    className="mt-1.5 w-32 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>

                            <label className="inline-flex items-center gap-2 text-xs font-bold text-foreground">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    className="size-4 rounded border-sidebar-border text-emerald-700 focus:ring-emerald-600"
                                />
                                <span>Status Aktif</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                        >
                            <Landmark className="size-4" />
                            <span>
                                {processing ? 'Menyimpan...' : 'Simpan Lembaga'}
                            </span>
                        </button>
                        <Link
                            href={institutionIndex()}
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

AdminVillageInstitutionCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Lembaga Desa', href: institutionIndex() },
        { title: 'Tambah Lembaga', href: '#' },
    ],
};
