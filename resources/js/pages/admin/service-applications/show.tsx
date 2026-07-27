import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarClock,
    Download,
    FileText,
    LockKeyhole,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import {
    index,
    update,
} from '@/actions/App/Http/Controllers/Admin/ServiceApplicationController';
import ServiceApplicationDocumentController from '@/actions/App/Http/Controllers/Admin/ServiceApplicationDocumentController';
import InputError from '@/components/input-error';
import { ServiceApplicationStatusBadge } from '@/components/service-application-status-badge';
import type { ServiceApplicationStatus } from '@/components/service-application-status-badge';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type ApplicationDetail = {
    id: number;
    referenceNumber: string;
    serviceTitle: string;
    serviceSlug: string;
    applicantName: string;
    nationalId: string;
    phone: string;
    address: string;
    purpose: string;
    status: ServiceApplicationStatus;
    statusLabel: string;
    adminNotes: string | null;
    submittedAt: string;
    reviewedAt: string | null;
    reviewerName: string | null;
    documents: Array<{
        id: number;
        key: string;
        label: string;
        originalName: string;
        mimeType: string;
        size: number;
    }>;
};

type ServiceApplicationShowProps = {
    application: ApplicationDetail;
    statuses: Array<{
        value: ServiceApplicationStatus;
        label: string;
    }>;
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
});

const numberFormatter = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 1,
});

function fileSize(size: number): string {
    if (size < 1024 * 1024) {
        return `${numberFormatter.format(size / 1024)} KB`;
    }

    return `${numberFormatter.format(size / (1024 * 1024))} MB`;
}

export default function ServiceApplicationShow({
    application,
    statuses,
}: ServiceApplicationShowProps) {
    return (
        <>
            <Head title={`Pengajuan ${application.referenceNumber}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="border-b border-sidebar-border/70 pb-6">
                    <Link
                        href={index()}
                        className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        Kembali ke daftar
                    </Link>
                    <div className="mt-4 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                    {application.referenceNumber}
                                </p>
                                <ServiceApplicationStatusBadge
                                    status={application.status}
                                    label={application.statusLabel}
                                />
                            </div>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight">
                                {application.serviceTitle}
                            </h1>
                            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarClock
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                Diajukan{' '}
                                {dateFormatter.format(
                                    new Date(application.submittedAt),
                                )}
                            </p>
                        </div>
                        <div className="inline-flex max-w-md items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                            <LockKeyhole
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0"
                            />
                            Data pribadi pada halaman ini terenkripsi dan hanya
                            ditampilkan di area admin.
                        </div>
                    </div>
                </header>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
                    <div className="grid content-start gap-6">
                        <section className="rounded-xl border border-sidebar-border/70 bg-background">
                            <div className="border-b border-sidebar-border/70 px-5 py-4">
                                <h2 className="text-lg font-bold">
                                    Data Pemohon
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Cocokkan data berikut dengan dokumen yang
                                    dilampirkan.
                                </p>
                            </div>
                            <dl className="grid gap-5 p-5 sm:grid-cols-2">
                                {[
                                    {
                                        label: 'Nama lengkap',
                                        value: application.applicantName,
                                        icon: UserRound,
                                    },
                                    {
                                        label: 'NIK',
                                        value: application.nationalId,
                                        icon: ShieldCheck,
                                    },
                                    {
                                        label: 'Nomor telepon',
                                        value: application.phone,
                                        icon: Phone,
                                    },
                                    {
                                        label: 'Alamat',
                                        value: application.address,
                                        icon: MapPin,
                                    },
                                ].map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.label}
                                            className="flex gap-3"
                                        >
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                <Icon className="size-4" />
                                            </span>
                                            <div className="min-w-0">
                                                <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                                                    {item.label}
                                                </dt>
                                                <dd className="mt-1 text-sm leading-6 font-semibold break-words">
                                                    {item.value}
                                                </dd>
                                            </div>
                                        </div>
                                    );
                                })}
                            </dl>
                            <div className="border-t border-sidebar-border/70 p-5">
                                <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                                    Keperluan pengajuan
                                </h3>
                                <p className="mt-2 text-sm leading-7 whitespace-pre-wrap">
                                    {application.purpose}
                                </p>
                            </div>
                        </section>

                        <section className="rounded-xl border border-sidebar-border/70 bg-background">
                            <div className="flex items-center justify-between gap-4 border-b border-sidebar-border/70 px-5 py-4">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Dokumen Persyaratan
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {application.documents.length} berkas
                                        tersimpan pada penyimpanan privat.
                                    </p>
                                </div>
                                <FileText className="size-5 text-muted-foreground" />
                            </div>
                            <div className="divide-y divide-sidebar-border/70">
                                {application.documents.map((document) => (
                                    <article
                                        key={document.id}
                                        className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                                    >
                                        <div className="min-w-0">
                                            <h3 className="font-semibold">
                                                {document.label}
                                            </h3>
                                            <p className="mt-1 truncate text-sm text-muted-foreground">
                                                {document.originalName} ·{' '}
                                                {fileSize(document.size)}
                                            </p>
                                        </div>
                                        <a
                                            href={ServiceApplicationDocumentController.url(
                                                {
                                                    serviceApplication:
                                                        application.id,
                                                    document: document.id,
                                                },
                                            )}
                                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-sidebar-border/70 px-3 text-sm font-semibold transition hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400"
                                        >
                                            <Download className="size-4" />
                                            Unduh
                                        </a>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="xl:sticky xl:top-6 xl:self-start">
                        <Form
                            {...update.form(application.id)}
                            options={{ preserveScroll: true }}
                            className="rounded-xl border border-sidebar-border/70 bg-background"
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <div className="border-b border-sidebar-border/70 px-5 py-4">
                                        <h2 className="text-lg font-bold">
                                            Tindak Lanjut
                                        </h2>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            Status ini menjadi sumber progres
                                            layanan di sistem.
                                        </p>
                                    </div>
                                    <div className="grid gap-5 p-5">
                                        {recentlySuccessful && (
                                            <p
                                                role="status"
                                                className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                                            >
                                                Perubahan berhasil disimpan.
                                            </p>
                                        )}
                                        <label className="grid gap-2 text-sm font-semibold">
                                            Status pengajuan
                                            <select
                                                name="status"
                                                defaultValue={
                                                    application.status
                                                }
                                                className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                            >
                                                {statuses.map((status) => (
                                                    <option
                                                        key={status.value}
                                                        value={status.value}
                                                    >
                                                        {status.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.status}
                                            />
                                        </label>
                                        <label className="grid gap-2 text-sm font-semibold">
                                            Catatan internal admin
                                            <textarea
                                                name="admin_notes"
                                                defaultValue={
                                                    application.adminNotes ?? ''
                                                }
                                                rows={7}
                                                maxLength={3000}
                                                placeholder="Contoh: berkas sudah lengkap, menunggu tanda tangan kepala desa."
                                                className="resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm leading-6 transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                                            />
                                            <span className="text-xs leading-5 font-normal text-muted-foreground">
                                                Catatan ini terenkripsi dan
                                                belum ditampilkan kepada warga.
                                            </span>
                                            <InputError
                                                message={errors.admin_notes}
                                            />
                                        </label>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                        >
                                            {processing ? (
                                                <Spinner />
                                            ) : (
                                                <Save className="size-4" />
                                            )}
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                    {application.reviewedAt && (
                                        <p className="border-t border-sidebar-border/70 px-5 py-4 text-xs leading-5 text-muted-foreground">
                                            Terakhir diperbarui oleh{' '}
                                            <strong className="text-foreground">
                                                {application.reviewerName ??
                                                    'Admin'}
                                            </strong>{' '}
                                            pada{' '}
                                            {dateFormatter.format(
                                                new Date(
                                                    application.reviewedAt,
                                                ),
                                            )}
                                            .
                                        </p>
                                    )}
                                </>
                            )}
                        </Form>
                    </aside>
                </div>
            </div>
        </>
    );
}

ServiceApplicationShow.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Pengajuan Layanan',
            href: index(),
        },
        {
            title: 'Detail Pengajuan',
            href: index(),
        },
    ],
};
