import { Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    UserRound,
    UsersRound,
} from 'lucide-react';
import { index as villageLeaderIndex } from '@/actions/App/Http/Controllers/Admin/VillageLeaderController';
import { dashboard } from '@/routes';

type VillageLeader = {
    id: number;
    name: string;
    position: string;
    photo: string | null;
    startedAt: string;
    endedAt: string | null;
    isActive: boolean;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedLeaders = {
    data: VillageLeader[];
    current_page: number;
    last_page: number;
    total: number;
    links: PaginationLink[];
};

type Props = {
    leaders: PaginatedLeaders;
};

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Sebelumnya')
        .replace('Next &raquo;', 'Berikutnya');
}

export default function AdminVillageLeadersIndex({ leaders }: Props) {
    const activeLeader = leaders.data.find((leader) => leader.isActive);

    return (
        <>
            <Head title="Kepala Desa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="border-b border-sidebar-border/70 pb-6">
                    <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                        Pemerintahan Desa
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                        Kepala Desa
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        Data kepala desa aktif dan riwayat masa jabatan yang
                        ditampilkan pada website Desa Ngampungan.
                    </p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <span className="flex size-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <UsersRound className="size-5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Total riwayat
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {leaders.total}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                        <p className="text-xs font-semibold text-muted-foreground">
                            Kepala desa aktif
                        </p>
                        <p className="mt-1 text-lg font-bold text-foreground">
                            {activeLeader?.name ?? 'Belum ditentukan'}
                        </p>
                        {activeLeader && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                Menjabat sejak {activeLeader.startedAt}
                            </p>
                        )}
                    </div>
                </div>

                {leaders.data.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {leaders.data.map((leader) => (
                            <article
                                key={leader.id}
                                className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background shadow-xs"
                            >
                                <div className="flex gap-4 p-5">
                                    <div className="size-24 shrink-0 overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted">
                                        {leader.photo ? (
                                            <img
                                                src={leader.photo}
                                                alt={`Foto ${leader.name}`}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-full items-center justify-center text-muted-foreground">
                                                <UserRound className="size-8" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <h2 className="text-lg font-bold text-foreground">
                                                    {leader.name}
                                                </h2>
                                                <p className="mt-0.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                                    {leader.position}
                                                </p>
                                            </div>
                                            <span
                                                className={
                                                    leader.isActive
                                                        ? 'rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : 'rounded-full border border-sidebar-border/70 bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground'
                                                }
                                            >
                                                {leader.isActive
                                                    ? 'Aktif'
                                                    : 'Selesai menjabat'}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                                            <CalendarDays className="mt-0.5 size-4 shrink-0" />
                                            <span>
                                                {leader.startedAt} —{' '}
                                                {leader.endedAt ?? 'Sekarang'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border bg-muted/20 p-8 text-center">
                        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <UserRound className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold text-foreground">
                            Belum ada data kepala desa
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Halaman ini akan menampilkan kepala desa aktif dan
                            riwayat masa jabatan setelah data tersedia.
                        </p>
                    </div>
                )}

                {leaders.last_page > 1 && (
                    <nav
                        aria-label="Navigasi halaman kepala desa"
                        className="flex flex-wrap items-center justify-center gap-2"
                    >
                        {leaders.links.map((link, index) => {
                            const isPrevious = index === 0;
                            const isNext = index === leaders.links.length - 1;
                            const label = paginationLabel(link.label);

                            if (!link.url) {
                                return (
                                    <span
                                        key={`${link.label}-${index}`}
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
                                    key={`${link.label}-${index}`}
                                    href={link.url}
                                    preserveScroll
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

AdminVillageLeadersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Kepala Desa', href: villageLeaderIndex() },
    ],
};
