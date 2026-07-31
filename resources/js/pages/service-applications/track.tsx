import { Form, Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    ClipboardCheck,
    Clock3,
    FileSearch,
    Info,
    Search,
    ShieldCheck,
    TriangleAlert,
} from 'lucide-react';
import ServiceApplicationTrackingController from '@/actions/App/Http/Controllers/Public/ServiceApplicationTrackingController';
import InputError from '@/components/input-error';
import { PublicPageShell } from '@/components/public-page-shell';
import type { ServiceApplicationStatus } from '@/components/service-application-status-badge';
import { Spinner } from '@/components/ui/spinner';
import { home } from '@/routes';
import { index as servicesIndex } from '@/routes/services';

type TrackingTimelineEntry = {
    status: ServiceApplicationStatus;
    statusLabel: string;
    description: string;
    publicNotes: string | null;
    occurredAt: string;
};

type TrackedApplication = {
    referenceNumber: string;
    serviceTitle: string;
    status: ServiceApplicationStatus;
    statusLabel: string;
    statusDescription: string;
    publicNotes: string | null;
    submittedAt: string;
    updatedAt: string;
    timeline: TrackingTimelineEntry[];
};

type ServiceApplicationTrackingProps = {
    referenceNumber: string;
    lookupAttempted: boolean;
    application: TrackedApplication | null;
    canonicalUrl: string;
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
});

const statusStyles: Record<
    ServiceApplicationStatus,
    { badge: string; text: string }
> = {
    submitted: {
        badge: 'border-amber-200 bg-amber-50 text-amber-900',
        text: 'text-amber-700',
    },
    in_review: {
        badge: 'border-blue-200 bg-blue-50 text-blue-900',
        text: 'text-blue-700',
    },
    needs_revision: {
        badge: 'border-orange-200 bg-orange-50 text-orange-900',
        text: 'text-orange-700',
    },
    approved: {
        badge: 'border-teal-200 bg-teal-50 text-teal-900',
        text: 'text-teal-700',
    },
    rejected: {
        badge: 'border-red-200 bg-red-50 text-red-900',
        text: 'text-red-700',
    },
    completed: {
        badge: 'border-emerald-200 bg-emerald-50 text-emerald-900',
        text: 'text-emerald-700',
    },
};

export default function ServiceApplicationTracking({
    referenceNumber,
    lookupAttempted,
    application,
    canonicalUrl,
}: ServiceApplicationTrackingProps) {
    return (
        <PublicPageShell activeSection="services">
            <Head>
                <title>Lacak Pengajuan Layanan</title>
                <meta
                    head-key="description"
                    name="description"
                    content="Periksa perkembangan pengajuan layanan Desa Ngampungan menggunakan nomor pengajuan."
                />
                <meta
                    head-key="robots"
                    name="robots"
                    content="noindex,nofollow"
                />
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={canonicalUrl}
                />
            </Head>

            {/* HERO HEADER SECTION (Consistent with Services Index) */}
            <section className="bg-village-primary-dark text-white">
                <div className="mx-auto max-w-[1280px] px-5 py-12 md:py-16 lg:px-12">
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                        <div className="max-w-3xl lg:col-span-8">
                            <nav
                                aria-label="Breadcrumb"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90"
                            >
                                <Link
                                    href={home()}
                                    className="transition hover:text-emerald-300"
                                >
                                    Beranda
                                </Link>
                                <ChevronRight className="size-3 text-emerald-300/80" />
                                <Link
                                    href={servicesIndex()}
                                    className="transition hover:text-emerald-300"
                                >
                                    Layanan
                                </Link>
                                <ChevronRight className="size-3 text-emerald-300/80" />
                                <span className="font-bold text-white">
                                    Lacak Pengajuan
                                </span>
                            </nav>

                            <p className="mt-4 text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                                Status Layanan Warga
                            </p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Lacak Pengajuan Layanan Desa
                            </h1>
                            <p className="mt-4 text-sm leading-relaxed text-emerald-100/90 sm:text-base lg:text-lg">
                                Masukkan nomor resi referensi yang Anda dapatkan setelah formulir dikirim untuk memeriksa perkembangan dan petunjuk petugas.
                            </p>
                        </div>

                        {/* Privacy Info Card (Rounded-3xl Glass Card) */}
                        <div className="lg:col-span-4">
                            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-village-accent text-village-primary-dark shadow-sm">
                                        <ShieldCheck className="size-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                                            Privasi Terjamin
                                        </h3>
                                        <p className="mt-0.5 text-xs text-white/80">
                                            Informasi Publik Aman
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-3.5 text-xs leading-relaxed text-emerald-100/80">
                                    Halaman ini tidak menampilkan NIK, alamat, nomor telepon, maupun dokumen pribadi warga.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEARCH INPUT CARD SECTION */}
            <section className="bg-slate-50/50 py-8 md:py-12 border-b border-slate-200/80">
                <div className="mx-auto max-w-[980px] px-5 lg:px-12">
                    <Form
                        {...ServiceApplicationTrackingController.form()}
                        options={{ preserveScroll: true }}
                    >
                        {({ errors, processing }) => (
                            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="reference"
                                        className="text-base font-black text-slate-900"
                                    >
                                        Nomor Pengajuan / Kode Resi
                                    </label>
                                    <p className="text-xs text-slate-500">
                                        Contoh format: <span className="font-mono font-bold text-emerald-700">NGP-20260731-VMMRXBRB</span>
                                    </p>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                                    <div>
                                        <div className="relative">
                                            <Search
                                                aria-hidden="true"
                                                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400"
                                            />
                                            <input
                                                id="reference"
                                                name="reference"
                                                type="text"
                                                defaultValue={referenceNumber}
                                                placeholder="NGP-YYYYMMDD-XXXXXXXX"
                                                autoComplete="off"
                                                spellCheck={false}
                                                aria-invalid={
                                                    errors.reference
                                                        ? true
                                                        : undefined
                                                }
                                                className="min-h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pr-4 pl-12 font-mono text-sm tracking-widest uppercase transition outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.reference}
                                            className="mt-2"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-7 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <FileSearch className="size-5" />
                                        )}
                                        Periksa Status
                                    </button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            </section>

            {/* TRACKING RESULTS CONTENT */}
            <section
                aria-live="polite"
                className="bg-slate-50/50 py-10 md:py-16"
            >
                <div className="mx-auto max-w-[980px] px-5 lg:px-12">
                    {application ? (
                        <div className="grid gap-8">
                            {/* Current Status Overview Card */}
                            <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs">
                                <div className="grid gap-6 border-b border-slate-100 bg-slate-50/50 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:p-8">
                                    <div>
                                        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-100/70 px-3 py-1 text-xs font-mono font-bold tracking-wider text-emerald-950">
                                            {application.referenceNumber}
                                        </div>
                                        <h2 className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">
                                            {application.serviceTitle}
                                        </h2>
                                        <p className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                                            <CalendarDays className="size-4 text-slate-400" />
                                            Diajukan{' '}
                                            {dateFormatter.format(
                                                new Date(
                                                    application.submittedAt,
                                                ),
                                            )}
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-extrabold shadow-2xs ${statusStyles[application.status].badge}`}
                                    >
                                        {application.statusLabel}
                                    </span>
                                </div>

                                <div className="grid gap-5 p-6 md:grid-cols-[auto_minmax(0,1fr)] md:p-8">
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-2xs">
                                        <ClipboardCheck className="size-7" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                                            Perkembangan Terkini
                                        </p>
                                        <p className="mt-1.5 text-base md:text-lg leading-snug font-bold text-slate-900">
                                            {application.statusDescription}
                                        </p>

                                        {application.publicNotes && (
                                            <div className="mt-4 rounded-2xl border-l-4 border-amber-400 bg-amber-50/80 p-4 text-xs md:text-sm leading-relaxed text-amber-950">
                                                <strong className="font-bold text-amber-900">Catatan Petugas:</strong>{' '}
                                                {application.publicNotes}
                                            </div>
                                        )}

                                        <p className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                                            <Clock3 className="size-4" />
                                            Terakhir diperbarui{' '}
                                            {dateFormatter.format(
                                                new Date(application.updatedAt),
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Timeline Progression Card */}
                            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-2xs">
                                        <CheckCircle2 className="size-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                                            Riwayat Tahapan
                                        </p>
                                        <h2 className="mt-1 text-2xl font-black text-slate-900">
                                            Linimasa Pengajuan
                                        </h2>
                                    </div>
                                </div>

                                <ol className="mt-8 grid">
                                    {application.timeline.map(
                                        (entry, entryIndex) => (
                                            <li
                                                key={`${entry.status}-${entry.occurredAt}-${entryIndex}`}
                                                className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 pb-8 last:pb-0"
                                            >
                                                {entryIndex <
                                                    application.timeline
                                                        .length -
                                                        1 && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute top-9 bottom-0 left-[1.1875rem] w-0.5 bg-slate-200"
                                                    />
                                                )}
                                                <span className="relative z-10 flex size-9 items-center justify-center rounded-full border-4 border-white bg-emerald-600 text-white shadow-xs">
                                                    <span className="size-2 rounded-full bg-white" />
                                                </span>
                                                <div className="pt-0.5">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <h3 className="font-bold text-slate-900 text-base">
                                                            {entry.statusLabel}
                                                        </h3>
                                                        <time
                                                            dateTime={
                                                                entry.occurredAt
                                                            }
                                                            className="text-xs font-medium text-slate-400"
                                                        >
                                                            {dateFormatter.format(
                                                                new Date(
                                                                    entry.occurredAt,
                                                                ),
                                                            )}
                                                        </time>
                                                    </div>
                                                    <p className="mt-1 text-xs md:text-sm leading-relaxed text-slate-600">
                                                        {entry.description}
                                                    </p>
                                                    {entry.publicNotes && (
                                                        <p className="mt-2.5 rounded-xl border-l-2 border-amber-400 bg-amber-50/50 p-3 text-xs leading-relaxed text-slate-700">
                                                            {entry.publicNotes}
                                                        </p>
                                                    )}
                                                </div>
                                            </li>
                                        ),
                                    )}
                                </ol>
                            </section>
                        </div>
                    ) : lookupAttempted ? (
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 md:p-12 text-center shadow-xs">
                            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                                <TriangleAlert className="size-7" />
                            </div>
                            <h2 className="mt-5 text-2xl font-black text-slate-900">
                                Pengajuan Belum Ditemukan
                            </h2>
                            <p className="mx-auto mt-2 max-w-xl text-xs md:text-sm leading-relaxed text-slate-500">
                                Periksa kembali setiap huruf dan angka pada nomor resi pengajuan Anda. Demi keamanan data warga, sistem hanya menampilkan data apabila nomor resi yang dimasukkan cocok.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-2xs">
                                    <Info className="size-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Petunjuk Penggunaan Kode Resi
                                    </h2>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                        Kode Resi ditampilkan pada halaman konfirmasi segera setelah formulir pengajuan berhasil dikirim. Jika Anda kehilangan kode resi, silakan hubungi perangkat desa melalui kantor desa atau kontak resmi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicPageShell>
    );
}

