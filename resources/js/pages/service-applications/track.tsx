import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
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

const statusStyles: Record<ServiceApplicationStatus, string> = {
    submitted: 'border-amber-300 bg-amber-50 text-amber-900',
    in_review: 'border-blue-300 bg-blue-50 text-blue-900',
    needs_revision: 'border-orange-300 bg-orange-50 text-orange-900',
    approved: 'border-teal-300 bg-teal-50 text-teal-900',
    rejected: 'border-red-300 bg-red-50 text-red-900',
    completed: 'border-emerald-300 bg-emerald-50 text-emerald-900',
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

            <section className="relative overflow-hidden bg-village-primary-dark text-white">
                <div
                    aria-hidden="true"
                    className="absolute -top-36 -right-24 size-[32rem] rounded-full border-[6rem] border-white/[0.04]"
                />
                <div className="relative mx-auto max-w-[1280px] px-5 py-14 lg:px-12 lg:py-20">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-sm text-white/65"
                    >
                        <Link href={home()} className="hover:text-white">
                            Beranda
                        </Link>
                        <ArrowRight aria-hidden="true" className="size-4" />
                        <Link
                            href={servicesIndex()}
                            className="hover:text-white"
                        >
                            Layanan
                        </Link>
                        <ArrowRight aria-hidden="true" className="size-4" />
                        <span className="font-semibold text-white">
                            Lacak Pengajuan
                        </span>
                    </nav>

                    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                                Status Layanan Warga
                            </p>
                            <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
                                Lacak Pengajuan Tanpa Datang ke Kantor Desa
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                                Masukkan nomor yang diperoleh setelah formulir
                                berhasil dikirim untuk melihat status dan
                                petunjuk dari petugas.
                            </p>
                        </div>

                        <div className="border border-white/20 bg-white/5 p-5 backdrop-blur-sm">
                            <ShieldCheck
                                aria-hidden="true"
                                className="size-7 text-village-accent"
                            />
                            <p className="mt-4 text-sm leading-6 text-white/70">
                                Halaman ini tidak menampilkan NIK, alamat, nomor
                                telepon, dokumen, atau catatan internal petugas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-village-border bg-white">
                <div className="mx-auto max-w-[980px] px-5 py-10 lg:px-12">
                    <Form
                        {...ServiceApplicationTrackingController.form()}
                        options={{ preserveScroll: true }}
                    >
                        {({ errors, processing }) => (
                            <div className="border border-village-border bg-village-canvas p-5 md:p-7">
                                <label
                                    htmlFor="reference"
                                    className="text-sm font-bold text-village-ink"
                                >
                                    Nomor pengajuan
                                </label>
                                <p className="mt-1 text-sm leading-6 text-village-muted">
                                    Contoh format: NGP-20260727-AB12CD34
                                </p>
                                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                                    <div>
                                        <div className="relative">
                                            <Search
                                                aria-hidden="true"
                                                className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-village-muted"
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
                                                className="min-h-13 w-full border border-village-border bg-white pr-4 pl-12 font-mono text-sm tracking-wide uppercase transition outline-none focus:border-village-primary focus:ring-3 focus:ring-village-primary/15"
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
                                        className="inline-flex min-h-13 items-center justify-center gap-2 bg-village-primary px-6 text-sm font-bold text-white transition hover:bg-village-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
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

            <section
                aria-live="polite"
                className="bg-village-canvas py-12 md:py-16"
            >
                <div className="mx-auto max-w-[980px] px-5 lg:px-12">
                    {application ? (
                        <div className="grid gap-7">
                            <section className="overflow-hidden border border-village-border bg-white">
                                <div className="grid gap-6 border-b border-village-border p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:p-8">
                                    <div>
                                        <p className="font-mono text-sm font-bold tracking-wide text-village-primary">
                                            {application.referenceNumber}
                                        </p>
                                        <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                                            {application.serviceTitle}
                                        </h2>
                                        <p className="mt-3 flex items-center gap-2 text-sm text-village-muted">
                                            <CalendarDays className="size-4" />
                                            Diajukan{' '}
                                            {dateFormatter.format(
                                                new Date(
                                                    application.submittedAt,
                                                ),
                                            )}
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-flex min-h-9 w-fit items-center border px-3 text-sm font-bold ${statusStyles[application.status]}`}
                                    >
                                        {application.statusLabel}
                                    </span>
                                </div>

                                <div className="grid gap-5 p-6 md:grid-cols-[auto_minmax(0,1fr)] md:p-8">
                                    <span className="flex size-12 items-center justify-center bg-village-primary-light text-village-primary">
                                        <ClipboardCheck className="size-6" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold tracking-[0.15em] text-village-primary uppercase">
                                            Perkembangan Terkini
                                        </p>
                                        <p className="mt-2 text-lg leading-7 font-bold">
                                            {application.statusDescription}
                                        </p>
                                        {application.publicNotes && (
                                            <div className="mt-5 border-l-4 border-village-accent bg-[#fff8e8] p-4 text-sm leading-7 text-[#6d4c13]">
                                                <strong>Pesan petugas:</strong>{' '}
                                                {application.publicNotes}
                                            </div>
                                        )}
                                        <p className="mt-4 flex items-center gap-2 text-xs text-village-muted">
                                            <Clock3 className="size-4" />
                                            Diperbarui{' '}
                                            {dateFormatter.format(
                                                new Date(application.updatedAt),
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="border border-village-border bg-white p-6 md:p-8">
                                <div className="flex items-start gap-4">
                                    <span className="flex size-11 shrink-0 items-center justify-center bg-village-primary-light text-village-primary">
                                        <CheckCircle2 className="size-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold tracking-[0.15em] text-village-primary uppercase">
                                            Riwayat Proses
                                        </p>
                                        <h2 className="mt-2 text-2xl font-bold">
                                            Timeline pengajuan
                                        </h2>
                                    </div>
                                </div>

                                <ol className="mt-8 grid">
                                    {application.timeline.map(
                                        (entry, entryIndex) => (
                                            <li
                                                key={`${entry.status}-${entry.occurredAt}-${entryIndex}`}
                                                className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-4 pb-8 last:pb-0"
                                            >
                                                {entryIndex <
                                                    application.timeline
                                                        .length -
                                                        1 && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute top-8 bottom-0 left-[0.9375rem] w-px bg-village-border"
                                                    />
                                                )}
                                                <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-4 border-white bg-village-primary text-white">
                                                    <span className="size-2 rounded-full bg-white" />
                                                </span>
                                                <div className="pt-1">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <h3 className="font-bold">
                                                            {entry.statusLabel}
                                                        </h3>
                                                        <time
                                                            dateTime={
                                                                entry.occurredAt
                                                            }
                                                            className="text-xs text-village-muted"
                                                        >
                                                            {dateFormatter.format(
                                                                new Date(
                                                                    entry.occurredAt,
                                                                ),
                                                            )}
                                                        </time>
                                                    </div>
                                                    <p className="mt-2 text-sm leading-6 text-village-muted">
                                                        {entry.description}
                                                    </p>
                                                    {entry.publicNotes && (
                                                        <p className="mt-3 border-l-2 border-village-accent pl-3 text-sm leading-6 text-village-ink">
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
                        <div className="border border-village-border bg-white p-7 text-center md:p-10">
                            <span className="mx-auto flex size-14 items-center justify-center bg-red-50 text-village-error">
                                <TriangleAlert className="size-6" />
                            </span>
                            <h2 className="mt-5 text-2xl font-bold">
                                Pengajuan belum ditemukan
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl leading-7 text-village-muted">
                                Periksa kembali setiap huruf dan angka pada
                                nomor pengajuan. Demi keamanan, sistem tidak
                                memberikan informasi tambahan untuk nomor yang
                                tidak cocok.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 border border-village-border bg-white p-7 md:grid-cols-[auto_minmax(0,1fr)] md:p-10">
                            <span className="flex size-12 items-center justify-center bg-village-primary-light text-village-primary">
                                <Info className="size-6" />
                            </span>
                            <div>
                                <h2 className="text-xl font-bold">
                                    Siapkan nomor pengajuan
                                </h2>
                                <p className="mt-2 max-w-2xl leading-7 text-village-muted">
                                    Nomor ditampilkan setelah formulir pengajuan
                                    berhasil disimpan. Jika nomor hilang,
                                    hubungi kantor desa pada jam pelayanan.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicPageShell>
    );
}
