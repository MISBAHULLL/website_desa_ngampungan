import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    Camera,
    ClipboardList,
    FileText,
    Megaphone,
    Newspaper,
    Plus,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard Admin Desa" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="border-b border-sidebar-border/70 pb-5">
                    <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                        Panel Administrator Desa Ngampungan
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        Selamat Datang di Dashboard Admin
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Kelola publikasi informasi, pengumuman resmi, berita, dan pantau permohonan layanan mandiri warga.
                    </p>
                </header>

                {/* Quick Action Grid */}
                <div className="space-y-4">
                    <h2 className="text-base font-bold text-foreground">
                        Aksi Cepat & Pintasan Utama
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Buat Pengumuman Baru Card */}
                        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 transition hover:border-emerald-500 hover:shadow-md dark:border-emerald-900/60 dark:bg-emerald-950/30">
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm dark:bg-emerald-600">
                                        <Megaphone className="size-5" />
                                    </div>
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300">
                                        Pengumuman
                                    </span>
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-foreground">
                                    Buat Pengumuman Baru
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    Tulis dan terbitkan pengumuman resmi baru untuk langsung ditampilkan di landing page warga.
                                </p>
                            </div>

                            <div className="mt-5 flex items-center gap-2">
                                <Link
                                    href="/dashboard/pengumuman/create"
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                >
                                    <Plus className="size-4" />
                                    <span>Form Pengumuman Baru</span>
                                </Link>
                                <Link
                                    href="/dashboard/pengumuman"
                                    className="inline-flex items-center gap-1 rounded-xl border border-sidebar-border/70 bg-background px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                                >
                                    <span>Lihat Semua</span>
                                </Link>
                            </div>
                        </div>

                        {/* Kelola Berita Card */}
                        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background p-5 transition hover:border-emerald-500 hover:shadow-md">
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex size-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                        <Newspaper className="size-5" />
                                    </div>
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        Berita Desa
                                    </span>
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-foreground">
                                    Kelola & Tambah Berita
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    Tulis kabar kegiatan desa, liputan pembangunan, dan berita publikasi terkini.
                                </p>
                            </div>

                            <div className="mt-5 flex items-center gap-2">
                                <Link
                                    href="/dashboard/berita/create"
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800"
                                >
                                    <Plus className="size-4" />
                                    <span>Tulis Berita Baru</span>
                                </Link>
                                <Link
                                    href="/dashboard/berita"
                                    className="inline-flex items-center gap-1 rounded-xl border border-sidebar-border/70 bg-background px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                                >
                                    <span>Kelola Berita</span>
                                </Link>
                            </div>
                        </div>

                        {/* Pengajuan Layanan Warga Card */}
                        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background p-5 transition hover:border-emerald-500 hover:shadow-md">
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex size-11 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm">
                                        <ClipboardList className="size-5" />
                                    </div>
                                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                        Pelayanan
                                    </span>
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-foreground">
                                    Pengajuan Layanan Warga
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    Periksa permohonan surat administrasi yang diajukan warga secara mandiri secara online.
                                </p>
                            </div>

                            <div className="mt-5">
                                <Link
                                    href="/dashboard/layanan"
                                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-700"
                                >
                                    <ClipboardList className="size-4" />
                                    <span>Buka Daftar Pengajuan</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Modules */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/dashboard/galeri"
                        className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-background p-4 transition hover:border-emerald-500 hover:shadow-xs"
                    >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            <Camera className="size-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-foreground">Kelola Galeri Foto</h4>
                            <p className="text-[11px] text-muted-foreground">Unggah foto album & dokumentasi</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/agenda"
                        className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-background p-4 transition hover:border-emerald-500 hover:shadow-xs"
                    >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                            <Calendar className="size-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-foreground">Kelola Agenda Kegiatan</h4>
                            <p className="text-[11px] text-muted-foreground">Jadwal musyawarah & acara desa</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/perangkat-desa"
                        className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-background p-4 transition hover:border-emerald-500 hover:shadow-xs"
                    >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            <Users className="size-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-foreground">Perangkat Desa</h4>
                            <p className="text-[11px] text-muted-foreground">Data pamong & aparatur desa</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/struktur-organisasi"
                        className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-background p-4 transition hover:border-emerald-500 hover:shadow-xs"
                    >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            <FileText className="size-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-foreground">Struktur Organisasi</h4>
                            <p className="text-[11px] text-muted-foreground">Bagan & susunan organisasi</p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
