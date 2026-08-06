import { Head, Link, useForm } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ImagePlus,
    MessageSquareText,
    Save,
    Trash2,
    UserRound,
} from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import {
    index as villageLeaderIndex,
    update as updateVillageLeader,
    updateWelcome,
} from '@/actions/App/Http/Controllers/Admin/VillageLeaderController';
import InputError from '@/components/input-error';
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

type ActiveVillageLeader = VillageLeader & {
    welcomeTitle: string | null;
    welcomeMessage: string;
    vision: string | null;
    mission: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedLeaders = {
    data: VillageLeader[];
    last_page: number;
    total: number;
    links: PaginationLink[];
};

type Props = {
    activeLeader: ActiveVillageLeader | null;
    leaders: PaginatedLeaders;
};

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Sebelumnya')
        .replace('Next &raquo;', 'Berikutnya');
}

export default function AdminVillageLeadersIndex({
    activeLeader,
    leaders,
}: Props) {
    const profileForm = useForm({
        _method: 'PATCH',
        name: activeLeader?.name ?? '',
        position: activeLeader?.position ?? 'Kepala Desa Ngampungan',
        photo: null as File | null,
        remove_photo: false,
        started_at: activeLeader?.startedAt ?? '',
        ended_at: activeLeader?.endedAt ?? '',
        is_active: true,
    });
    const welcomeForm = useForm({
        welcome_title: activeLeader?.welcomeTitle ?? '',
        welcome_message: activeLeader?.welcomeMessage ?? '',
        vision: activeLeader?.vision ?? '',
        mission: activeLeader?.mission ?? '',
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        activeLeader?.photo ?? null,
    );

    useEffect(() => {
        return () => {
            if (photoPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;

        profileForm.setData('photo', file);
        profileForm.setData('remove_photo', false);
        setPhotoPreview(
            file ? URL.createObjectURL(file) : (activeLeader?.photo ?? null),
        );
    }

    function removePhoto() {
        profileForm.setData('photo', null);
        profileForm.setData('remove_photo', true);
        setPhotoPreview(null);
    }

    function submitProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!activeLeader) {
            return;
        }

        profileForm.post(updateVillageLeader.url(activeLeader.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    function submitWelcome(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!activeLeader) {
            return;
        }

        welcomeForm.patch(updateWelcome.url(activeLeader.id), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Kepala Desa" />

            <div className="flex flex-1 flex-col gap-8 p-4 md:p-6">
                <header className="border-b border-sidebar-border/70 pb-6">
                    <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                        Pemerintahan Desa
                    </p>
                    <div className="mt-2 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Kepala Desa
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                Kelola identitas kepala desa dan sambutan publik
                                melalui dua aksi simpan yang terpisah.
                            </p>
                        </div>
                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <CheckCircle2 className="size-4" />
                            Sinkron ke website publik
                        </span>
                    </div>
                </header>

                {activeLeader ? (
                    <div className="grid items-start gap-6 xl:grid-cols-12">
                        <form
                            onSubmit={submitProfile}
                            className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background shadow-xs xl:col-span-5"
                        >
                            <div className="border-b border-sidebar-border/70 p-5 sm:p-6">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                        <UserRound className="size-5" />
                                    </span>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">
                                            Profil Kepala Desa
                                        </h2>
                                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                            Foto dan identitas pada kartu profil
                                            publik.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 p-5 sm:p-6">
                                <div className="grid gap-5 sm:grid-cols-[160px_1fr] sm:items-start">
                                    <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-sidebar-border/70 bg-muted">
                                        {photoPreview ? (
                                            <img
                                                src={photoPreview}
                                                alt="Pratinjau foto kepala desa"
                                                className="size-full object-cover object-top"
                                            />
                                        ) : (
                                            <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                                                <UserRound className="size-10" />
                                                <span className="text-xs font-semibold">
                                                    Belum ada foto
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block">
                                            <span className="text-sm font-semibold text-foreground">
                                                Unggah foto
                                            </span>
                                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                                JPG, PNG, atau WEBP. Maksimal 3
                                                MB. Gunakan foto potret resmi.
                                            </span>
                                            <span className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-sidebar-border bg-background px-3 text-sm font-bold transition hover:border-emerald-500 hover:text-emerald-700">
                                                <ImagePlus className="size-4" />
                                                Pilih dari galeri
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handlePhotoChange}
                                                    className="sr-only"
                                                />
                                            </span>
                                        </label>
                                        {photoPreview && (
                                            <button
                                                type="button"
                                                onClick={removePhoto}
                                                className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                                            >
                                                <Trash2 className="size-4" />
                                                Hapus foto
                                            </button>
                                        )}
                                        <InputError
                                            message={profileForm.errors.photo}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="leader-name"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Nama lengkap dan gelar
                                    </label>
                                    <input
                                        id="leader-name"
                                        value={profileForm.data.name}
                                        onChange={(event) =>
                                            profileForm.setData(
                                                'name',
                                                event.target.value,
                                            )
                                        }
                                        className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                                    />
                                    <InputError
                                        message={profileForm.errors.name}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="leader-position"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Jabatan
                                    </label>
                                    <input
                                        id="leader-position"
                                        value={profileForm.data.position}
                                        onChange={(event) =>
                                            profileForm.setData(
                                                'position',
                                                event.target.value,
                                            )
                                        }
                                        className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                                    />
                                    <InputError
                                        message={profileForm.errors.position}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="leader-started-at"
                                            className="text-sm font-semibold text-foreground"
                                        >
                                            Mulai menjabat
                                        </label>
                                        <input
                                            id="leader-started-at"
                                            type="date"
                                            value={profileForm.data.started_at}
                                            onChange={(event) =>
                                                profileForm.setData(
                                                    'started_at',
                                                    event.target.value,
                                                )
                                            }
                                            className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                                        />
                                        <InputError
                                            message={
                                                profileForm.errors.started_at
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="leader-ended-at"
                                            className="text-sm font-semibold text-foreground"
                                        >
                                            Selesai menjabat
                                        </label>
                                        <input
                                            id="leader-ended-at"
                                            type="date"
                                            value={profileForm.data.ended_at}
                                            onChange={(event) =>
                                                profileForm.setData(
                                                    'ended_at',
                                                    event.target.value,
                                                )
                                            }
                                            className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Kosongkan jika masih menjabat.
                                        </p>
                                        <InputError
                                            message={
                                                profileForm.errors.ended_at
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-sidebar-border/70 bg-muted/20 p-5 sm:px-6">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save className="size-4" />
                                    {profileForm.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Profil'}
                                </button>
                            </div>
                        </form>

                        <form
                            onSubmit={submitWelcome}
                            className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background shadow-xs xl:col-span-7"
                        >
                            <div className="border-b border-sidebar-border/70 p-5 sm:p-6">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                        <MessageSquareText className="size-5" />
                                    </span>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">
                                            Sambutan Kepala Desa
                                        </h2>
                                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                            Narasi sambutan dan komitmen yang
                                            dibaca warga di website publik.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 p-5 sm:p-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="welcome-title"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Judul sambutan
                                    </label>
                                    <input
                                        id="welcome-title"
                                        value={welcomeForm.data.welcome_title}
                                        onChange={(event) =>
                                            welcomeForm.setData(
                                                'welcome_title',
                                                event.target.value,
                                            )
                                        }
                                        className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                                    />
                                    <InputError
                                        message={
                                            welcomeForm.errors.welcome_title
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="welcome-message"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Isi sambutan
                                    </label>
                                    <textarea
                                        id="welcome-message"
                                        rows={10}
                                        value={welcomeForm.data.welcome_message}
                                        onChange={(event) =>
                                            welcomeForm.setData(
                                                'welcome_message',
                                                event.target.value,
                                            )
                                        }
                                        className="w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Pisahkan paragraf dengan satu baris
                                        kosong agar mudah dibaca.
                                    </p>
                                    <InputError
                                        message={
                                            welcomeForm.errors.welcome_message
                                        }
                                    />
                                </div>

                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="leader-vision"
                                            className="text-sm font-semibold text-foreground"
                                        >
                                            Visi
                                        </label>
                                        <textarea
                                            id="leader-vision"
                                            rows={5}
                                            value={welcomeForm.data.vision}
                                            onChange={(event) =>
                                                welcomeForm.setData(
                                                    'vision',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6"
                                        />
                                        <InputError
                                            message={welcomeForm.errors.vision}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="leader-mission"
                                            className="text-sm font-semibold text-foreground"
                                        >
                                            Misi / komitmen utama
                                        </label>
                                        <textarea
                                            id="leader-mission"
                                            rows={5}
                                            value={welcomeForm.data.mission}
                                            onChange={(event) =>
                                                welcomeForm.setData(
                                                    'mission',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6"
                                        />
                                        <InputError
                                            message={welcomeForm.errors.mission}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-sidebar-border/70 bg-muted/20 p-5 sm:px-6">
                                <button
                                    type="submit"
                                    disabled={welcomeForm.processing}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-bold text-background transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save className="size-4" />
                                    {welcomeForm.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Sambutan'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-sidebar-border bg-muted/20 p-8 text-center">
                        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <UserRound className="size-6" />
                        </span>
                        <h2 className="mt-5 text-xl font-bold text-foreground">
                            Belum ada kepala desa aktif
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Tambahkan atau aktifkan data kepala desa terlebih
                            dahulu agar profil dan sambutan dapat dikelola.
                        </p>
                    </div>
                )}

                <section aria-labelledby="leader-history-heading">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                Arsip kepemimpinan
                            </p>
                            <h2
                                id="leader-history-heading"
                                className="mt-1 text-xl font-bold text-foreground"
                            >
                                Riwayat Kepala Desa
                            </h2>
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">
                            {leaders.total} data
                        </span>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        {leaders.data.map((leader) => (
                            <article
                                key={leader.id}
                                className="flex gap-4 rounded-xl border border-sidebar-border/70 bg-background p-4 shadow-xs"
                            >
                                <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted">
                                    {leader.photo ? (
                                        <img
                                            src={leader.photo}
                                            alt={`Foto ${leader.name}`}
                                            className="size-full object-cover object-top"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center text-muted-foreground">
                                            <UserRound className="size-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-foreground">
                                                {leader.name}
                                            </h3>
                                            <p className="mt-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                                {leader.position}
                                            </p>
                                        </div>
                                        {leader.isActive && (
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                Aktif
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                        <CalendarDays className="size-4" />
                                        {leader.startedAt} —{' '}
                                        {leader.endedAt ?? 'Sekarang'}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>

                    {leaders.last_page > 1 && (
                        <nav
                            aria-label="Navigasi riwayat kepala desa"
                            className="mt-5 flex flex-wrap items-center justify-center gap-2"
                        >
                            {leaders.links.map((link, index) => {
                                const isPrevious = index === 0;
                                const isNext =
                                    index === leaders.links.length - 1;
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
                </section>
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
