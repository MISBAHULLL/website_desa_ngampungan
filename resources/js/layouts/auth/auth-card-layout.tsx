import { Link } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-screen bg-slate-100/90 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
            <div className="grid min-h-screen w-full lg:grid-cols-12">
                {/* Left Visual Hero Column with Agriculture Unsplash Photo Background */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:col-span-5 lg:flex xl:col-span-5">
                    {/* Unsplash Agriculture Image Background - High Clarity */}
                    <div
                        className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-1000"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')`,
                        }}
                    />

                    {/* Subtle Green Tint Overlay - Subtle green tint instead of heavy dark green block */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-900/35 to-emerald-950/40" />
                    <div className="absolute inset-0 bg-black/25" />

                    {/* Decorative Glowing Orbs */}
                    <div className="pointer-events-none absolute -top-20 -right-20 size-96 rounded-full bg-emerald-400/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-20 size-96 rounded-full bg-teal-400/20 blur-3xl" />

                    {/* Top Branding Header */}
                    <div className="relative z-10 space-y-6">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-3.5 rounded-2xl border border-white/30 bg-emerald-950/50 px-4.5 py-3 shadow-xl backdrop-blur-md transition hover:border-white/40 hover:bg-emerald-900/60"
                        >
                            <img
                                src="/assets/logo_kabupaten_jombang.png"
                                alt="Logo Kabupaten Jombang"
                                className="h-10 w-8 object-contain"
                            />
                            <div className="text-left">
                                <span className="block text-base font-extrabold text-white drop-shadow-sm">
                                    Desa Ngampungan
                                </span>
                                <span className="block text-[10px] font-bold tracking-widest text-emerald-300 uppercase">
                                    Bareng, Kab. Jombang
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Middle Content */}
                    <div className="relative z-10 my-auto max-w-lg space-y-5 rounded-3xl border border-white/15 bg-emerald-950/40 p-6.5 shadow-2xl backdrop-blur-md">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-900/60 px-4 py-1.5 text-xs font-bold text-emerald-200 shadow-md">
                            <ShieldCheck className="size-4 text-emerald-400" />
                            <span>Portal Layanan Digital Resmi Desa</span>
                        </div>
                        <h2 className="text-3xl leading-tight font-black tracking-tight text-white drop-shadow-md xl:text-4xl">
                            Integrasi Layanan & Administrasi Warga Desa
                        </h2>
                        <p className="text-sm leading-relaxed font-medium text-slate-100 drop-shadow-sm">
                            Akses layanan persuratan, pengaduan publik, serta
                            informasi transparansi anggaran Desa Ngampungan
                            secara aman, mudah, dan transparan.
                        </p>
                    </div>

                    {/* Bottom Back Link */}
                    <div className="relative z-10">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-emerald-950/60 px-4 py-2.5 text-xs font-extrabold text-emerald-200 shadow-lg backdrop-blur-md transition hover:bg-emerald-900/80 hover:text-white"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali ke Beranda Utama
                        </Link>
                    </div>
                </div>

                {/* Right Form Card Column - Enlarged Box */}
                <div className="flex flex-col items-center justify-center bg-slate-100/80 p-6 sm:p-10 lg:col-span-7 lg:p-12 xl:col-span-7">
                    <div className="w-full max-w-xl space-y-6">
                        {/* Mobile Logo Branding */}
                        <div className="flex flex-col items-center text-center lg:hidden">
                            <Link
                                href={home()}
                                className="flex items-center gap-3"
                            >
                                <img
                                    src="/assets/logo_kabupaten_jombang.png"
                                    alt="Logo Kabupaten Jombang"
                                    className="h-12 w-9.5 object-contain"
                                />
                                <div className="text-left">
                                    <span className="block text-lg font-black text-slate-900">
                                        Desa Ngampungan
                                    </span>
                                    <span className="block text-xs font-bold text-emerald-700">
                                        Kec. Bareng, Kab. Jombang
                                    </span>
                                </div>
                            </Link>
                        </div>

                        <Card className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl shadow-slate-300/40 sm:p-8 md:p-10">
                            <CardHeader className="space-y-2 px-0 pt-0 pb-6 text-center">
                                {title && (
                                    <CardTitle className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                        {title}
                                    </CardTitle>
                                )}
                                {description && (
                                    <CardDescription className="mx-auto max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
                                        {description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                {children}
                            </CardContent>
                        </Card>

                        <div className="text-center">
                            <Link
                                href={home()}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 lg:hidden"
                            >
                                <ArrowLeft className="size-3.5" />
                                Kembali ke Beranda Utama
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
