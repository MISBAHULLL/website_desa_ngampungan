import { Form, Head, Link } from '@inertiajs/react';
import {
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    CircleCheck,
    Clock3,
    Mail,
    MailOpen,
    MessagesSquare,
    UserRound,
} from 'lucide-react';
import {
    index as contactMessagesIndex,
    updateStatus,
} from '@/actions/App/Http/Controllers/Admin/ContactMessageController';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type ContactMessageStatus = 'unread' | 'read' | 'resolved';

type ContactMessage = {
    id: number;
    name: string;
    contact: string;
    category: string;
    message: string;
    status: ContactMessageStatus;
    readAt: string | null;
    resolvedAt: string | null;
    createdAt: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedContactMessages = {
    data: ContactMessage[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

type ContactMessagesIndexProps = {
    messages: PaginatedContactMessages;
    activeStatus: ContactMessageStatus | 'all';
    statuses: Array<{
        value: ContactMessageStatus;
        label: string;
    }>;
    statistics: {
        total: number;
        unread: number;
        resolved: number;
    };
};

const categoryLabels: Record<string, string> = {
    general: 'Pertanyaan Umum',
    service_complaint: 'Pengaduan Layanan',
    development_proposal: 'Usulan Pembangunan',
};

const statusStyles: Record<ContactMessageStatus, string> = {
    unread: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200',
    read: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-200',
    resolved:
        'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200',
};

const statusLabels: Record<ContactMessageStatus, string> = {
    unread: 'Belum dibaca',
    read: 'Sudah dibaca',
    resolved: 'Selesai',
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

export default function ContactMessagesIndex({
    messages,
    activeStatus,
    statuses,
    statistics,
}: ContactMessagesIndexProps) {
    const filters = [{ value: 'all' as const, label: 'Semua' }, ...statuses];

    return (
        <>
            <Head title="Pesan Masuk" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                            Layanan Warga
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Pesan Masuk
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Pertanyaan, pengaduan, dan usulan yang dikirim dari
                            formulir publik tersimpan di halaman ini.
                        </p>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Menampilkan {messages.from ?? 0}–{messages.to ?? 0} dari{' '}
                        {messages.total} pesan
                    </p>
                </header>

                <section
                    aria-label="Ringkasan pesan"
                    className="grid gap-4 sm:grid-cols-3"
                >
                    {[
                        {
                            label: 'Total Pesan',
                            value: statistics.total,
                            icon: MessagesSquare,
                            iconClassName:
                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
                        },
                        {
                            label: 'Belum Dibaca',
                            value: statistics.unread,
                            icon: MailOpen,
                            iconClassName:
                                'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                        },
                        {
                            label: 'Selesai',
                            value: statistics.resolved,
                            icon: CircleCheck,
                            iconClassName:
                                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
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
                                    className={`flex size-11 items-center justify-center rounded-lg ${statistic.iconClassName}`}
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

                <nav
                    aria-label="Filter status pesan"
                    className="flex gap-2 overflow-x-auto pb-1"
                >
                    {filters.map((filter) => (
                        <Link
                            key={filter.value}
                            href={contactMessagesIndex({
                                query:
                                    filter.value === 'all'
                                        ? {}
                                        : { status: filter.value },
                            })}
                            preserveScroll
                            className={
                                activeStatus === filter.value
                                    ? 'min-h-10 shrink-0 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background'
                                    : 'min-h-10 shrink-0 rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-foreground/30 hover:text-foreground'
                            }
                        >
                            {filter.label}
                        </Link>
                    ))}
                </nav>

                {messages.data.length > 0 ? (
                    <div className="grid gap-4">
                        {messages.data.map((message) => (
                            <article
                                key={message.id}
                                className={
                                    message.status === 'unread'
                                        ? 'rounded-xl border border-amber-200 bg-amber-50/35 p-5 shadow-sm dark:border-amber-900/70 dark:bg-amber-950/10'
                                        : 'rounded-xl border border-sidebar-border/70 bg-background p-5'
                                }
                            >
                                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`inline-flex min-h-7 items-center border px-2.5 text-xs font-bold ${statusStyles[message.status]}`}
                                            >
                                                {statusLabels[message.status]}
                                            </span>
                                            <span className="inline-flex min-h-7 items-center border border-sidebar-border/70 bg-muted/40 px-2.5 text-xs font-semibold text-muted-foreground">
                                                {categoryLabels[
                                                    message.category
                                                ] ?? message.category}
                                            </span>
                                        </div>

                                        <h2 className="mt-4 text-xl font-bold">
                                            {message.name}
                                        </h2>
                                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                                            <p className="flex items-center gap-2">
                                                <Mail
                                                    aria-hidden="true"
                                                    className="size-4"
                                                />
                                                {message.contact}
                                            </p>
                                            <time
                                                dateTime={message.createdAt}
                                                className="flex items-center gap-2"
                                            >
                                                <Clock3
                                                    aria-hidden="true"
                                                    className="size-4"
                                                />
                                                {dateFormatter.format(
                                                    new Date(message.createdAt),
                                                )}
                                            </time>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 flex-wrap gap-2">
                                        {message.status === 'unread' && (
                                            <Form
                                                {...updateStatus.form(
                                                    message.id,
                                                )}
                                            >
                                                {({ processing }) => (
                                                    <>
                                                        <input
                                                            type="hidden"
                                                            name="status"
                                                            value="read"
                                                        />
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm font-semibold transition hover:border-blue-400 hover:text-blue-700 disabled:opacity-60 dark:hover:text-blue-300"
                                                        >
                                                            {processing ? (
                                                                <Spinner />
                                                            ) : (
                                                                <MailOpen
                                                                    aria-hidden="true"
                                                                    className="size-4"
                                                                />
                                                            )}
                                                            Tandai Dibaca
                                                        </button>
                                                    </>
                                                )}
                                            </Form>
                                        )}

                                        {message.status !== 'resolved' && (
                                            <Form
                                                {...updateStatus.form(
                                                    message.id,
                                                )}
                                            >
                                                {({ processing }) => (
                                                    <>
                                                        <input
                                                            type="hidden"
                                                            name="status"
                                                            value="resolved"
                                                        />
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-700 px-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                                        >
                                                            {processing ? (
                                                                <Spinner />
                                                            ) : (
                                                                <CheckCheck
                                                                    aria-hidden="true"
                                                                    className="size-4"
                                                                />
                                                            )}
                                                            Tandai Selesai
                                                        </button>
                                                    </>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-5 border-t border-sidebar-border/70 pt-5">
                                    <p className="text-sm leading-7 whitespace-pre-wrap text-foreground/85">
                                        {message.message}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border bg-muted/20 p-8 text-center">
                        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <UserRound aria-hidden="true" className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold">
                            Belum ada pesan
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Belum ada pesan dengan status yang dipilih.
                        </p>
                    </div>
                )}

                {messages.last_page > 1 && (
                    <nav
                        aria-label="Pagination pesan"
                        className="flex flex-wrap items-center justify-center gap-2"
                    >
                        {messages.links.map((link, index) => {
                            const label = paginationLabel(link.label);
                            const isPrevious = index === 0;
                            const isNext = index === messages.links.length - 1;

                            if (!link.url) {
                                return (
                                    <span
                                        key={`${link.label}-${index}`}
                                        aria-disabled="true"
                                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-sidebar-border/50 px-3 text-sm text-muted-foreground/40"
                                    >
                                        {isPrevious ? (
                                            <ChevronLeft
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                        ) : isNext ? (
                                            <ChevronRight
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                        ) : (
                                            label
                                        )}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url}
                                    preserveScroll
                                    aria-label={
                                        isPrevious || isNext
                                            ? label
                                            : `Halaman ${label}`
                                    }
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
                                        <ChevronLeft
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    ) : isNext ? (
                                        <ChevronRight
                                            aria-hidden="true"
                                            className="size-4"
                                        />
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

ContactMessagesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Pesan Masuk',
            href: contactMessagesIndex(),
        },
    ],
};
