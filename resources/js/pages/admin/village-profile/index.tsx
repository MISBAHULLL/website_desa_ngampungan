import { Head, Link } from '@inertiajs/react';
import { Edit3, MapPin, Users } from 'lucide-react';
import {
    edit as villageProfileEdit,
    index as villageProfileIndex,
} from '@/actions/App/Http/Controllers/Admin/VillageProfileController';
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
    updatedAt?: string;
};

type Props = {
    profile: VillageProfile;
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
});

export default function AdminVillageProfileIndex({ profile }: Props) {
    return (
        <>
            <Head title="Profil Desa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Data & Statistik Desa
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Profil Desa
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Data lengkap profil Desa Ngampungan termasuk
                            demografi, batas wilayah, dan penggunaan lahan.
                        </p>
                    </div>

                    <Link
                        href={villageProfileEdit()}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        <Edit3 className="size-4" />
                        <span>Edit Profil Desa</span>
                    </Link>
                </header>

                {/* Stats Overview */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <Users className="size-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Total Penduduk
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {profile.totalPopulation.toLocaleString(
                                        'id-ID',
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                                <Users className="size-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Kepala Keluarga
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {profile.totalFamilies.toLocaleString(
                                        'id-ID',
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                                <MapPin className="size-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Jumlah Dusun
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {profile.totalHamlets}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400">
                                <MapPin className="size-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Luas Wilayah
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {profile.totalAreaHectares} Ha
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Batas Wilayah */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                    <h2 className="mb-4 text-lg font-bold text-foreground">
                        Batas Wilayah Desa
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase">
                                Utara
                            </p>
                            <p className="mt-1 text-sm text-foreground">
                                {profile.boundaryNorth || '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase">
                                Timur
                            </p>
                            <p className="mt-1 text-sm text-foreground">
                                {profile.boundaryEast || '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase">
                                Selatan
                            </p>
                            <p className="mt-1 text-sm text-foreground">
                                {profile.boundarySouth || '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase">
                                Barat
                            </p>
                            <p className="mt-1 text-sm text-foreground">
                                {profile.boundaryWest || '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dusun List */}
                {profile.hamlets && profile.hamlets.length > 0 && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-background shadow-xs">
                        <div className="border-b border-sidebar-border/70 p-5">
                            <h2 className="text-lg font-bold text-foreground">
                                Data Dusun
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5">
                                            Nama Dusun
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Jumlah RW
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Jumlah RT
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Jumlah KK
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/70">
                                    {profile.hamlets.map((hamlet, index) => (
                                        <tr
                                            key={index}
                                            className="transition hover:bg-muted/20"
                                        >
                                            <td className="px-5 py-4 font-semibold text-foreground">
                                                {hamlet.name}
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">
                                                {hamlet.rw_count}
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">
                                                {hamlet.rt_count}
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">
                                                {hamlet.kk_count}
                                            </td>
                                            <td className="px-4 py-4 text-xs text-muted-foreground">
                                                {hamlet.description || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Penggunaan Lahan */}
                {profile.landUse && profile.landUse.length > 0 && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-background shadow-xs">
                        <div className="border-b border-sidebar-border/70 p-5">
                            <h2 className="text-lg font-bold text-foreground">
                                Penggunaan Lahan
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5">
                                            Kategori
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Luas (Ha)
                                        </th>
                                        <th scope="col" className="px-4 py-3.5">
                                            Persentase
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/70">
                                    {profile.landUse.map((land, index) => (
                                        <tr
                                            key={index}
                                            className="transition hover:bg-muted/20"
                                        >
                                            <td className="px-5 py-4 font-semibold text-foreground">
                                                {land.category}
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">
                                                {land.area_hectares.toLocaleString(
                                                    'id-ID',
                                                )}{' '}
                                                Ha
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className="h-full bg-emerald-600"
                                                            style={{
                                                                width: `${land.percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-semibold text-muted-foreground">
                                                        {land.percentage}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Map Info */}
                {(profile.mapGoogleUrl || profile.mapHdFileUrl) && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        <h2 className="mb-4 text-lg font-bold text-foreground">
                            Peta Wilayah
                        </h2>
                        <div className="space-y-3">
                            {profile.mapGoogleUrl && (
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">
                                        Google Maps URL
                                    </p>
                                    <a
                                        href={profile.mapGoogleUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-block text-sm text-emerald-700 hover:underline dark:text-emerald-400"
                                    >
                                        {profile.mapGoogleUrl}
                                    </a>
                                </div>
                            )}
                            {profile.mapHdFileUrl && (
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">
                                        File Peta HD
                                    </p>
                                    <a
                                        href={profile.mapHdFileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-block text-sm text-emerald-700 hover:underline dark:text-emerald-400"
                                    >
                                        {profile.mapHdFileUrl}
                                    </a>
                                </div>
                            )}
                            {profile.mapLatitude && profile.mapLongitude && (
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">
                                        Koordinat
                                    </p>
                                    <p className="mt-1 text-sm text-foreground">
                                        {profile.mapLatitude},{' '}
                                        {profile.mapLongitude}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Last Updated */}
                {profile.updatedAt && (
                    <div className="text-center text-xs text-muted-foreground">
                        Terakhir diperbarui:{' '}
                        {dateFormatter.format(new Date(profile.updatedAt))}
                    </div>
                )}
            </div>
        </>
    );
}

AdminVillageProfileIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Profil Desa', href: villageProfileIndex() },
    ],
};
