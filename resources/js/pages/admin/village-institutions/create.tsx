import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Landmark, Plus, Trash2 } from 'lucide-react';
import { index as institutionIndex, store as institutionStore } from '@/actions/App/Http/Controllers/Admin/VillageInstitutionController';
import { dashboard } from '@/routes';

export default function AdminVillageInstitutionCreate() {
    const { data, setData, post, processing, errors } = useForm({
        acronym: '',
        name: '',
        leader: '',
        member_count: 0,
        focus: '',
        responsibilities: [''],
        sort_order: 0,
        is_active: true,
    });

    function handleArrayChange(index: number, value: string) {
        const updated = [...data.responsibilities];
        updated[index] = value;
        setData('responsibilities', updated);
    }

    function addArrayField() {
        setData('responsibilities', [...data.responsibilities, '']);
    }

    function removeArrayField(index: number) {
        if (data.responsibilities.length === 1) return;
        const updated = data.responsibilities.filter((_, i) => i !== index);
        setData('responsibilities', updated);
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
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-6 shadow-xs">
                        <div className="grid gap-5 sm:grid-cols-3">
                            <div>
                                <label htmlFor="acronym" className="block text-xs font-bold text-foreground uppercase tracking-wider">
                                    Singkatan / Badge *
                                </label>
                                <input
                                    id="acronym"
                                    type="text"
                                    value={data.acronym}
                                    onChange={(e) => setData('acronym', e.target.value.toUpperCase())}
                                    maxLength={10}
                                    placeholder="Contoh: BPD / PKK / Karang Taruna"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                {errors.acronym && <p className="mt-1 text-xs text-red-600">{errors.acronym}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block text-xs font-bold text-foreground uppercase tracking-wider">
                                    Nama Lembaga Lengkap *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Badan Permusyawaratan Desa"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <label htmlFor="leader" className="block text-xs font-bold text-foreground uppercase tracking-wider">
                                    Ketua Lembaga
                                </label>
                                <input
                                    id="leader"
                                    type="text"
                                    value={data.leader}
                                    onChange={(e) => setData('leader', e.target.value)}
                                    placeholder="Nama Ketua / Penanggung Jawab"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="member_count" className="block text-xs font-bold text-foreground uppercase tracking-wider">
                                    Jumlah Anggota *
                                </label>
                                <input
                                    id="member_count"
                                    type="number"
                                    min={0}
                                    value={data.member_count}
                                    onChange={(e) => setData('member_count', parseInt(e.target.value) || 0)}
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="focus" className="block text-xs font-bold text-foreground uppercase tracking-wider">
                                Fokus Utama Lembaga *
                            </label>
                            <textarea
                                id="focus"
                                rows={2}
                                value={data.focus}
                                onChange={(e) => setData('focus', e.target.value)}
                                placeholder="Jelaskan fokus utama kegiatan lembaga..."
                                className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                required
                            />
                            {errors.focus && <p className="mt-1 text-xs text-red-600">{errors.focus}</p>}
                        </div>

                        {/* Responsibilities */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                                    Tugas & Peran Utama (Poin-poin)
                                </label>
                                <button
                                    type="button"
                                    onClick={addArrayField}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Tambah Poin</span>
                                </button>
                            </div>
                            <div className="space-y-2">
                                {data.responsibilities.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleArrayChange(index, e.target.value)}
                                            placeholder={`Poin tugas ${index + 1}...`}
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                        {data.responsibilities.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayField(index)}
                                                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-sidebar-border/70 flex items-center justify-between">
                            <div>
                                <label htmlFor="sort_order" className="block text-xs font-bold text-foreground uppercase tracking-wider">
                                    Urutan Tampilan
                                </label>
                                <input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    className="mt-1.5 w-32 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>

                            <label className="inline-flex items-center gap-2 text-xs font-bold text-foreground">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
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
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                        >
                            <Landmark className="size-4" />
                            <span>{processing ? 'Menyimpan...' : 'Simpan Lembaga'}</span>
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
