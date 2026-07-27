import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Clock3,
    FileText,
    Search,
    UserRound,
} from 'lucide-react';
import {
    index,
    show,
} from '@/actions/App/Http/Controllers/Admin/ServiceApplicationController';
import { ServiceApplicationStatusBadge } from '@/components/service-application-status-badge';
import type { ServiceApplicationStatus } from '@/components/service-application-status-badge';
import { dashboard } from '@/routes';

type ApplicationSummary = {
    id: number;
    referenceNumber: string;
    serviceTitle: string;
    applicantName: string;
    status: ServiceApplicationStatus;
    statusLabel: string;
    documentsCount: number;
    submittedAt: string;
    reviewedAt: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type ServiceApplicationsIndexProps = {
    applications: {
        data: ApplicationSummary[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        links: PaginationLink[];
    };
    filters: {
        search: string;
        status: ServiceApplicationStatus | null;
    };
    statuses: Array<{
        value: ServiceApplicationStatus;
        label: string;
    }>;
    statistics: {
        total: number;
        submitted: number;
        inReview: number;
        completed: number;
    };
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Sebelumnya')
        .replace('Next &raquo;', 'Berikutnya');
}

export default function ServiceApplicationsIndex({
    applications,
    filters,
    statuses,
    statistics,
}: ServiceApplicationsIndexProps) {
    return (
        <>
            <Head title="Pengajuan Layanan" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 xl:flex-row xl:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Administrasi Desa
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            Pengajuan Layanan
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Periksa identitas, persyaratan dokumen, dan progres
                            setiap permohonan surat dari warga.
                        </p>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Menampilkan {applications.from ?? 0}–
                        {applications.to ?? 0} dari {applications.total}{' '}
                        pengajuan
                    </p>
                </header>

                <section
                    aria-label="Ringkasan pengajuan"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {[
                        {
                            label: 'Total Pengajuan',
                            value: statistics.total,
                            icon: ClipboardList,
                            style: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
                        },
                        {
                            label: 'Pengajuan Masuk',
                            value: statistics.submitted,
                            icon: FileText,
                            style: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                        },
                        {
                            label: 'Sedang Diperiksa',
                            value: statistics.inReview,
                            icon: Clock3,
                            style: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
                        },
                        {
                            label: 'Selesai',
                            value: statistics.completed,
                            icon: CheckCircle2,
                            style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                        },
                    ].map((statistic) => {
                        const Icon = statistic.icon;

                        return (
                            <article
                                key={statistic.label}
                                className="flex items-center justify-between gap-4 rounded-xl border border-sidebar-border/70 bg-background p-5"
                            >
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {statistic.label}
                                    </p>
                                    <p className="mt-1 text-3xl font-bold tracking-tight">
                                        {statistic.value}
                                    </p>
                                </div>
                                <span
                                    className={`flex size-11 items-center justify-center rounded-lg ${statistic.style}`}
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </article>
                        );
                    })}
                </section>

                <Form
                    {...index.form()}
                    className="grid gap-3 rounded-xl border border-sidebar-border/70 bg-background p-4 md:grid-cols-[minmax(0,1fr)_220px_auto]"
                >
                    <label className="relative">
                        <span className="sr-only">
                            Cari nomor pengajuan atau jenis layanan
                        </span>
                        <Search
                            aria-hidden="true"
                            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="search"
                            name="search"
                            defaultValue={filters.search}
                            placeholder="Nomor pengajuan atau layanan"
                            className="min-h-11 w-full rounded-lg border border-input bg-transparent pr-3 pl-10 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                        />
                    </label>
                    <label>
                        <span className="sr-only">Filter status</span>
                        <select
                            name="status"
                            defaultValue={filters.status ?? ''}
                            className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15"
                        >
                            <option value="">Semua status</option>
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="min-h-11 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/85"
                    >
                        Terapkan Filter
                    </button>
                </Form>

                <p className="-mt-3 text-xs leading-5 text-muted-foreground">
                    Untuk menjaga kerahasiaan data terenkripsi, pencarian hanya
                    membaca nomor pengajuan dan jenis layanan.
                </p>

                {applications.data.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background">
                        <div className="hidden grid-cols-[1.25fr_1.35fr_1fr_0.6fr_auto] gap-4 border-b border-sidebar-border/70 bg-muted/30 px-5 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase lg:grid">
                            <span>Pemohon</span>
                            <span>Layanan</span>
                            <span>Status</span>
                            <span>Dokumen</span>
                            <span className="sr-only">Aksi</span>
                        </div>
                        <div className="divide-y divide-sidebar-border/70">
                            {applications.data.map((application) => (
                                <article
                                    key={application.id}
                                    className="grid gap-4 p-5 transition hover:bg-muted/20 lg:grid-cols-[1.25fr_1.35fr_1fr_0.6fr_auto] lg:items-center"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-bold">
                                            {application.applicantName}
                                        </p>
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {application.referenceNumber}
                                        </p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold">
                                            {application.serviceTitle}
                                        </p>
                                        <time
                                            dateTime={application.submittedAt}
                                            className="mt-1 block text-xs text-muted-foreground"
                                        >
                                            Masuk{' '}
                                            {dateFormatter.format(
                                                new Date(
                                                    application.submittedAt,
                                                ),
                                            )}
                                        </time>
                                    </div>
                                    <div>
                                        <ServiceApplicationStatusBadge
                                            status={application.status}
                                            label={application.statusLabel}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {application.documentsCount} berkas
                                    </p>
                                    <Link
                                        href={show(application.id)}
                                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-sidebar-border/70 px-3 text-sm font-semibold transition hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400"
                                    >
                                        Periksa
                                        <ArrowRight
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border bg-muted/20 p-8 text-center">
                        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <UserRound aria-hidden="true" className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold">
                            Pengajuan tidak ditemukan
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Ubah kata pencarian atau status filter untuk melihat
                            pengajuan lain.
                        </p>
                    </div>
                )}

                {applications.last_page > 1 && (
                    <nav
                        aria-label="Pagination pengajuan"
                        className="flex flex-wrap items-center justify-center gap-2"
                    >
                        {applications.links.map((link, linkIndex) => {
                            const label = paginationLabel(link.label);
                            const isPrevious = linkIndex === 0;
                            const isNext =
                                linkIndex === applications.links.length - 1;

                            if (!link.url) {
                                return (
                                    <span
                                        key={`${link.label}-${linkIndex}`}
                                        aria-disabled="true"
                                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-sidebar-border/50 px-3 text-sm text-muted-foreground/40"
                                    >
                                        {isPrevious ? (
                                            <ChevronLeft className="size-4" />
                                        ) : isNext ? (
                                            <ChevronRight className="size-4" />
                                        ) : (
                                            label
                                        )}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={`${link.label}-${linkIndex}`}
                                    href={link.url}
                                    preserveScroll
                                    aria-current={
                                        link.active ? 'page' : undefined
                                    }
                                    className={
                                        link.active
                                            ? 'inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg bg-foreground px-3 text-sm font-bold text-background'
                                            : 'inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm font-semibold transition hover:border-foreground/30'
                                    }
                                >
                                    {isPrevious ? (
                                        <ChevronLeft className="size-4" />
                                    ) : isNext ? (
                                        <ChevronRight className="size-4" />
                                    ) : (
                                        label
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>
        </>
    );
}

ServiceApplicationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Pengajuan Layanan',
            href: index(),
        },
    ],
};
