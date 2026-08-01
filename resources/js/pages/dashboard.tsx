import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Calendar,
    Camera,
    CheckCircle2,
    ClipboardList,
    FileText,
    Landmark,
    Megaphone,
    MessagesSquare,
    Newspaper,
    Plus,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard Admin - Desa Ngampungan" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
                
                {/* Header Welcome Banner */}
                <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 justify-between md:flex-row md:items-center">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Sistem Informasi & Administrasi Desa</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Dashboard Utama Admin
                        </h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-2xl">
                            Kelola publikasi informasi publik, berita, pengumuman resmi, dan pantau pengajuan layanan mandiri warga Desa Ngampungan secara efisien.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/dashboard/pengumuman/create"
                            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4.5 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
                        >
                            <Plus className="size-4" />
                            <span>Buat Pengumuman</span>
                        </Link>
                        <Link
                            href="/dashboard/berita/create"
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4.5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all"
                        >
                            <Plus className="size-4" />
                            <span>Tulis Berita</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Counter Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Stat Card 1 */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Pengumuman
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <Megaphone className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">Aktif</span>
                            <p className="mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="size-3" />
                                Terpublikasi di portal desa
                            </p>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Berita Desa
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <Newspaper className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">Kelola</span>
                            <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Berita & liputan kegiatan
                            </p>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Permohonan Surat
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                                <ClipboardList className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">Layanan Warga</span>
                            <p className="mt-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                Pengajuan mandiri online
                            </p>
                        </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Pesan Masuk
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                                <MessagesSquare className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">Pengaduan</span>
                            <p className="mt-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                                Aspirasi & pertanyaan warga
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Action Cards */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Modul Kelola & Aksi Utama
                        </h2>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                            Pilih modul untuk mulai mengelola
                        </span>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Card 1: Pengumuman */}
                        <div className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:border-emerald-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                                        <Megaphone className="size-6" />
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                        Pengumuman
                                    </span>
                                </div>
                                <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                                    Buat Pengumuman Baru
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                                    Tulis dan publikasikan informasi penting atau imbauan resmi desa yang akan langsung muncul di halaman utama warga.
                                </p>
                            </div>

                            <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                <Link
                                    href="/dashboard/pengumuman/create"
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
                                >
                                    <Plus className="size-4" />
                                    <span>Form Baru</span>
                                </Link>
                                <Link
                                    href="/dashboard/pengumuman"
                                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
                                >
                                    <span>Kelola</span>
                                </Link>
                            </div>
                        </div>

                        {/* Card 2: Berita */}
                        <div className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:border-blue-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                                        <Newspaper className="size-6" />
                                    </div>
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                        Berita Desa
                                    </span>
                                </div>
                                <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    Kelola & Tulis Berita
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                                    Tulis artikel liputan pembangunan desa, kegiatan kemasyarakatan, serta dokumentasi kegiatan desa lainnya.
                                </p>
                            </div>

                            <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                <Link
                                    href="/dashboard/berita/create"
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
                                >
                                    <Plus className="size-4" />
                                    <span>Tulis Berita</span>
                                </Link>
                                <Link
                                    href="/dashboard/berita"
                                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
                                >
                                    <span>Kelola</span>
                                </Link>
                            </div>
                        </div>

                        {/* Card 3: Pelayanan Warga */}
                        <div className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:border-amber-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-md shadow-amber-600/20">
                                        <ClipboardList className="size-6" />
                                    </div>
                                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                        Pelayanan Mandiri
                                    </span>
                                </div>
                                <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                                    Pengajuan Layanan Warga
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                                    Verifikasi dokumen dan permohonan surat keterangan administrasi desa yang diajukan oleh warga desa.
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                <Link
                                    href="/dashboard/layanan"
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-700"
                                >
                                    <ClipboardList className="size-4" />
                                    <span>Buka Daftar Pengajuan</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Quick Links Grid */}
                <div className="space-y-4 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Pengelolaan Data & Galeri Desa
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href="/dashboard/galeri"
                            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4.5 transition hover:border-emerald-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="flex size-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 group-hover:scale-105 transition-transform">
                                <Camera className="size-5.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors truncate">
                                    Galeri Foto
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                    Album & foto desa
                                </p>
                            </div>
                            <ArrowUpRight className="size-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                        </Link>

                        <Link
                            href="/dashboard/agenda"
                            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4.5 transition hover:border-emerald-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300 group-hover:scale-105 transition-transform">
                                <Calendar className="size-5.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors truncate">
                                    Agenda Kegiatan
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                    Jadwal musyawarah
                                </p>
                            </div>
                            <ArrowUpRight className="size-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                        </Link>

                        <Link
                            href="/dashboard/perangkat-desa"
                            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4.5 transition hover:border-emerald-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 group-hover:scale-105 transition-transform">
                                <Users className="size-5.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                                    Perangkat Desa
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                    Data aparatur desa
                                </p>
                            </div>
                            <ArrowUpRight className="size-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </Link>

                        <Link
                            href="/dashboard/struktur-organisasi"
                            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4.5 transition hover:border-emerald-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 group-hover:scale-105 transition-transform">
                                <FileText className="size-5.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors truncate">
                                    Struktur Organisasi
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                    Bagan susunan pemdes
                                </p>
                            </div>
                            <ArrowUpRight className="size-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
                        </Link>
                    </div>
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

