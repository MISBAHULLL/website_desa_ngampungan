import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import {
    index as villageProfileIndex,
    update as villageProfileUpdate,
} from '@/actions/App/Http/Controllers/Admin/VillageProfileController';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type Hamlet = {
    name: string;
    rw_count: number;
    rt_count: number;
    kk_count: number;
    description?: string;
};

type LandUse = {
    category: string;
    area_hectares: number;
    percentage: number;
};

type VillageProfile = {
    id: number;
    totalPopulation: number;
    totalFamilies: number;
    totalHamlets: number;
    totalAreaHectares: number;
    boundaryNorth: string;
    boundaryEast: string;
    boundarySouth: string;
    boundaryWest: string;
    hamlets: Hamlet[];
    landUse: LandUse[];
    demographics: any;
    mapLatitude?: number;
    mapLongitude?: number;
    mapZoom?: number;
    mapGoogleUrl?: string;
    mapHdFileUrl?: string;
};

type Props = {
    profile: VillageProfile;
};

export default function AdminVillageProfileEdit({ profile }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        totalPopulation: profile.totalPopulation || 0,
        totalFamilies: profile.totalFamilies || 0,
        totalHamlets: profile.totalHamlets || 0,
        totalAreaHectares: profile.totalAreaHectares || 0,
        boundaryNorth: profile.boundaryNorth || '',
        boundaryEast: profile.boundaryEast || '',
        boundarySouth: profile.boundarySouth || '',
        boundaryWest: profile.boundaryWest || '',
        hamlets: profile.hamlets?.length
            ? profile.hamlets
            : [
                  {
                      name: '',
                      rw_count: 0,
                      rt_count: 0,
                      kk_count: 0,
                      description: '',
                  },
              ],
        landUse: profile.landUse?.length
            ? profile.landUse
            : [{ category: '', area_hectares: 0, percentage: 0 }],
        mapLatitude: profile.mapLatitude || undefined,
        mapLongitude: profile.mapLongitude || undefined,
        mapZoom: profile.mapZoom || 15,
        mapGoogleUrl: profile.mapGoogleUrl || '',
        mapHdFileUrl: profile.mapHdFileUrl || '',
    });

    function handleHamletChange(
        index: number,
        field: keyof Hamlet,
        value: string | number,
    ) {
        const updated = [...data.hamlets];
        updated[index] = { ...updated[index], [field]: value };
        setData('hamlets', updated);
    }

    function addHamlet() {
        setData('hamlets', [
            ...data.hamlets,
            {
                name: '',
                rw_count: 0,
                rt_count: 0,
                kk_count: 0,
                description: '',
            },
        ]);
    }

    function removeHamlet(index: number) {
        if (data.hamlets.length === 1) {
            return;
        }

        const updated = data.hamlets.filter((_, i) => i !== index);

        setData('hamlets', updated);
    }

    function handleLandUseChange(
        index: number,
        field: keyof LandUse,
        value: string | number,
    ) {
        const updated = [...data.landUse];
        updated[index] = { ...updated[index], [field]: value };
        setData('landUse', updated);
    }

    function addLandUse() {
        setData('landUse', [
            ...data.landUse,
            { category: '', area_hectares: 0, percentage: 0 },
        ]);
    }

    function removeLandUse(index: number) {
        if (data.landUse.length === 1) {
            return;
        }

        const updated = data.landUse.filter((_, i) => i !== index);

        setData('landUse', updated);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        patch(villageProfileUpdate.url());
    }

    return (
        <>
            <Head title="Edit Profil Desa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <Link
                            href={villageProfileIndex()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Profil Desa</span>
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Edit Profil Desa
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Perbarui informasi profil desa dan data statistik
                        </p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
                    {/* Data Statistik Umum */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        <h2 className="mb-4 border-b border-sidebar-border/70 pb-3 text-lg font-bold text-foreground">
                            Data Statistik Umum
                        </h2>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label
                                    htmlFor="totalPopulation"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Total Penduduk *
                                </label>
                                <input
                                    id="totalPopulation"
                                    type="number"
                                    min={0}
                                    value={data.totalPopulation}
                                    onChange={(e) =>
                                        setData(
                                            'totalPopulation',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                <InputError
                                    message={errors.totalPopulation}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="totalFamilies"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Total KK *
                                </label>
                                <input
                                    id="totalFamilies"
                                    type="number"
                                    min={0}
                                    value={data.totalFamilies}
                                    onChange={(e) =>
                                        setData(
                                            'totalFamilies',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                <InputError
                                    message={errors.totalFamilies}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="totalHamlets"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Jumlah Dusun *
                                </label>
                                <input
                                    id="totalHamlets"
                                    type="number"
                                    min={0}
                                    value={data.totalHamlets}
                                    onChange={(e) =>
                                        setData(
                                            'totalHamlets',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                <InputError
                                    message={errors.totalHamlets}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="totalAreaHectares"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Luas Wilayah (Ha) *
                                </label>
                                <input
                                    id="totalAreaHectares"
                                    type="number"
                                    step="1"
                                    min={0}
                                    value={data.totalAreaHectares}
                                    onChange={(e) =>
                                        setData(
                                            'totalAreaHectares',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                <InputError
                                    message={errors.totalAreaHectares}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Batas Wilayah */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        <h2 className="mb-4 border-b border-sidebar-border/70 pb-3 text-lg font-bold text-foreground">
                            Batas Wilayah Desa
                        </h2>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="boundaryNorth"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Utara *
                                </label>
                                <input
                                    id="boundaryNorth"
                                    type="text"
                                    value={data.boundaryNorth}
                                    onChange={(e) =>
                                        setData('boundaryNorth', e.target.value)
                                    }
                                    placeholder="Contoh: Desa Sumberdadap"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                <InputError
                                    message={errors.boundaryNorth}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="boundaryEast"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Timur *
                                </label>
                                <input
                                    id="boundaryEast"
                                    type="text"
                                    value={data.boundaryEast}
                                    onChange={(e) =>
                                        setData('boundaryEast', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                <InputError
                                    message={errors.boundaryEast}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="boundarySouth"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Selatan *
                                </label>
                                <input
                                    id="boundarySouth"
                                    type="text"
                                    value={data.boundarySouth}
                                    onChange={(e) =>
                                        setData('boundarySouth', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                <InputError
                                    message={errors.boundarySouth}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="boundaryWest"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Barat *
                                </label>
                                <input
                                    id="boundaryWest"
                                    type="text"
                                    value={data.boundaryWest}
                                    onChange={(e) =>
                                        setData('boundaryWest', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                <InputError
                                    message={errors.boundaryWest}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dusun Dynamic */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between border-b border-sidebar-border/70 pb-3">
                            <h2 className="text-lg font-bold text-foreground">
                                Data Dusun
                            </h2>
                            <button
                                type="button"
                                onClick={addHamlet}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                            >
                                <Plus className="size-3.5" />
                                <span>Tambah Dusun</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.hamlets.map((hamlet, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-sidebar-border/60 bg-muted/20 p-4"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-xs font-bold text-muted-foreground">
                                            Dusun #{index + 1}
                                        </span>
                                        {data.hamlets.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeHamlet(index)
                                                }
                                                className="text-xs text-red-600 hover:underline"
                                            >
                                                Hapus Dusun
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                        <div className="lg:col-span-2">
                                            <label className="block text-xs font-semibold text-foreground">
                                                Nama Dusun *
                                            </label>
                                            <input
                                                type="text"
                                                value={hamlet.name}
                                                onChange={(e) =>
                                                    handleHamletChange(
                                                        index,
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Dusun Krajan"
                                                className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-foreground">
                                                RW
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={hamlet.rw_count}
                                                onChange={(e) =>
                                                    handleHamletChange(
                                                        index,
                                                        'rw_count',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-foreground">
                                                RT
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={hamlet.rt_count}
                                                onChange={(e) =>
                                                    handleHamletChange(
                                                        index,
                                                        'rt_count',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-foreground">
                                                KK
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={hamlet.kk_count}
                                                onChange={(e) =>
                                                    handleHamletChange(
                                                        index,
                                                        'kk_count',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <label className="block text-xs font-semibold text-foreground">
                                            Keterangan (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={hamlet.description || ''}
                                            onChange={(e) =>
                                                handleHamletChange(
                                                    index,
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Deskripsi singkat..."
                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Penggunaan Lahan Dynamic */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between border-b border-sidebar-border/70 pb-3">
                            <h2 className="text-lg font-bold text-foreground">
                                Penggunaan Lahan
                            </h2>
                            <button
                                type="button"
                                onClick={addLandUse}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                            >
                                <Plus className="size-3.5" />
                                <span>Tambah Kategori</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.landUse.map((land, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-sidebar-border/60 bg-muted/20 p-4"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-xs font-bold text-muted-foreground">
                                            Kategori #{index + 1}
                                        </span>
                                        {data.landUse.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeLandUse(index)
                                                }
                                                className="text-xs text-red-600 hover:underline"
                                            >
                                                Hapus Kategori
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-foreground">
                                                Kategori Lahan *
                                            </label>
                                            <input
                                                type="text"
                                                value={land.category}
                                                onChange={(e) =>
                                                    handleLandUseChange(
                                                        index,
                                                        'category',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Sawah"
                                                className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-foreground">
                                                Luas (Ha) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                value={land.area_hectares}
                                                onChange={(e) =>
                                                    handleLandUseChange(
                                                        index,
                                                        'area_hectares',
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-foreground">
                                                Persentase (%) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                max={100}
                                                value={land.percentage}
                                                onChange={(e) =>
                                                    handleLandUseChange(
                                                        index,
                                                        'percentage',
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map Info */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        <h2 className="mb-4 border-b border-sidebar-border/70 pb-3 text-lg font-bold text-foreground">
                            Informasi Peta Wilayah
                        </h2>
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label
                                        htmlFor="mapLatitude"
                                        className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                    >
                                        Latitude
                                    </label>
                                    <input
                                        id="mapLatitude"
                                        type="number"
                                        step="0.0000001"
                                        value={data.mapLatitude || ''}
                                        onChange={(e) =>
                                            setData(
                                                'mapLatitude',
                                                parseFloat(e.target.value) ||
                                                    undefined,
                                            )
                                        }
                                        placeholder="-7.123456"
                                        className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="mapLongitude"
                                        className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                    >
                                        Longitude
                                    </label>
                                    <input
                                        id="mapLongitude"
                                        type="number"
                                        step="0.0000001"
                                        value={data.mapLongitude || ''}
                                        onChange={(e) =>
                                            setData(
                                                'mapLongitude',
                                                parseFloat(e.target.value) ||
                                                    undefined,
                                            )
                                        }
                                        placeholder="110.123456"
                                        className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="mapZoom"
                                        className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                    >
                                        Zoom Level
                                    </label>
                                    <input
                                        id="mapZoom"
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={data.mapZoom || 15}
                                        onChange={(e) =>
                                            setData(
                                                'mapZoom',
                                                parseInt(e.target.value) || 15,
                                            )
                                        }
                                        className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="mapGoogleUrl"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    URL Google Maps
                                </label>
                                <input
                                    id="mapGoogleUrl"
                                    type="url"
                                    value={data.mapGoogleUrl || ''}
                                    onChange={(e) =>
                                        setData('mapGoogleUrl', e.target.value)
                                    }
                                    placeholder="https://maps.google.com/..."
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="mapHdFileUrl"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    URL File Peta HD
                                </label>
                                <input
                                    id="mapHdFileUrl"
                                    type="url"
                                    value={data.mapHdFileUrl || ''}
                                    onChange={(e) =>
                                        setData('mapHdFileUrl', e.target.value)
                                    }
                                    placeholder="https://example.com/map.pdf"
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={villageProfileIndex()}
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-sidebar-border/70 bg-background px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                        >
                            {processing ? (
                                <Spinner />
                            ) : (
                                <Save className="size-4" />
                            )}
                            <span>Simpan Perubahan</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminVillageProfileEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Profil Desa', href: villageProfileIndex() },
        { title: 'Edit Profil', href: villageProfileIndex() },
    ],
};
