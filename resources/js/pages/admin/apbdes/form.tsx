import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    CircleAlert,
    ClipboardList,
    Plus,
    Save,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import {
    index as apbdesIndex,
    store as apbdesStore,
    update as apbdesUpdate,
} from '@/actions/App/Http/Controllers/Admin/ApbdesController';
import { Spinner } from '@/components/ui/spinner';

type Option = {
    value: string;
    label: string;
};

type IncomeSource = {
    code: string;
    label: string;
    amount: string | number;
    description: string;
};

type Activity = {
    code: string;
    name: string;
    category: string;
    budget: string | number;
    realized: string | number;
    location: string;
    status: string;
};

type FormData = {
    year: string;
    updated_date: string;
    net_financing: string | number;
    income_sources: IncomeSource[];
    activities: Activity[];
};

type Summary = FormData & {
    id: number;
};

type Props = {
    summary?: Summary;
    categoryOptions: Option[];
    statusOptions: Option[];
};

const inputClassName =
    'min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20';

const emptyIncomeSource = (): IncomeSource => ({
    code: '',
    label: '',
    amount: '',
    description: '',
});

const emptyActivity = (): Activity => ({
    code: '',
    name: '',
    category: 'pembangunan',
    budget: '',
    realized: '',
    location: '',
    status: 'direncanakan',
});

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

function numericValue(value: string): string {
    return value.replace(/[^0-9]/g, '');
}

function signedNumericValue(value: string): string {
    const negative = value.trimStart().startsWith('-');
    const digits = numericValue(value);

    return negative && digits ? `-${digits}` : digits;
}

function amount(value: string | number): number {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
}

function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>;
}

export default function AdminApbdesForm({
    summary,
    categoryOptions,
    statusOptions,
}: Props) {
    const isEditing = Boolean(summary);
    const { data, setData, submit, processing, errors } = useForm<FormData>({
        year: summary?.year ?? String(new Date().getFullYear()),
        updated_date:
            summary?.updated_date ?? new Date().toISOString().slice(0, 10),
        net_financing: summary?.net_financing ?? 0,
        income_sources: summary?.income_sources.length
            ? summary.income_sources
            : [emptyIncomeSource()],
        activities: summary?.activities.length
            ? summary.activities
            : [emptyActivity()],
    });
    const nestedErrors = errors as Record<string, string | undefined>;

    const totalIncome = data.income_sources.reduce(
        (total, source) => total + amount(source.amount),
        0,
    );
    const totalBudget = data.activities.reduce(
        (total, activity) => total + amount(activity.budget),
        0,
    );
    const totalRealized = data.activities.reduce(
        (total, activity) => total + amount(activity.realized),
        0,
    );
    const realizationPercentage =
        totalBudget > 0 ? Math.round((totalRealized / totalBudget) * 100) : 0;

    function updateIncomeSource(
        index: number,
        field: keyof IncomeSource,
        value: string,
    ) {
        const next = [...data.income_sources];
        next[index] = { ...next[index], [field]: value };
        setData('income_sources', next);
    }

    function removeIncomeSource(index: number) {
        if (data.income_sources.length === 1) {
            return;
        }

        setData(
            'income_sources',
            data.income_sources.filter((_, itemIndex) => itemIndex !== index),
        );
    }

    function updateActivity(
        index: number,
        field: keyof Activity,
        value: string,
    ) {
        const next = [...data.activities];
        next[index] = { ...next[index], [field]: value };
        setData('activities', next);
    }

    function removeActivity(index: number) {
        if (data.activities.length === 1) {
            return;
        }

        setData(
            'activities',
            data.activities.filter((_, itemIndex) => itemIndex !== index),
        );
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        submit(summary ? apbdesUpdate(summary.id) : apbdesStore());
    }

    return (
        <>
            <Head
                title={
                    isEditing ? `Ubah APBDes ${summary?.year}` : 'Tambah APBDes'
                }
            />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="border-b border-sidebar-border/70 pb-6">
                    <Link
                        href={apbdesIndex()}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                        <ArrowLeft className="size-3.5" />
                        Kembali ke Kelola APBDes
                    </Link>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight">
                        {isEditing
                            ? `Ubah APBDes ${summary?.year}`
                            : 'Tambah Tahun Anggaran'}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        Isi angka dalam rupiah tanpa titik atau simbol. Total di
                        bawah dihitung otomatis sebelum data disimpan.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="rounded-2xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <CalendarDays className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-bold">
                                    Identitas Anggaran
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Satu tahun hanya boleh mempunyai satu data
                                    APBDes.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                            <label className="space-y-1.5 text-sm font-bold">
                                <span>Tahun Anggaran</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={data.year}
                                    onChange={(event) =>
                                        setData(
                                            'year',
                                            numericValue(
                                                event.target.value,
                                            ).slice(0, 4),
                                        )
                                    }
                                    className={inputClassName}
                                    required
                                />
                                <FieldError message={errors.year} />
                            </label>

                            <label className="space-y-1.5 text-sm font-bold">
                                <span>Tanggal Pembaruan</span>
                                <input
                                    type="date"
                                    value={data.updated_date}
                                    onChange={(event) =>
                                        setData(
                                            'updated_date',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClassName}
                                />
                                <FieldError message={errors.updated_date} />
                            </label>

                            <label className="space-y-1.5 text-sm font-bold">
                                <span>Pembiayaan Neto</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={data.net_financing}
                                    onChange={(event) =>
                                        setData(
                                            'net_financing',
                                            signedNumericValue(
                                                event.target.value,
                                            ),
                                        )
                                    }
                                    placeholder="Contoh: 30000000"
                                    className={inputClassName}
                                    required
                                />
                                <p className="text-xs font-normal text-muted-foreground">
                                    {rupiahFormatter.format(
                                        amount(data.net_financing),
                                    )}
                                </p>
                                <FieldError message={errors.net_financing} />
                            </label>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                    <TrendingUp className="size-5" />
                                </span>
                                <div>
                                    <h2 className="font-bold">
                                        Sumber Pendapatan
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Dana Desa, ADD, PADes, bagi hasil, dan
                                        sumber lainnya.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setData('income_sources', [
                                        ...data.income_sources,
                                        emptyIncomeSource(),
                                    ])
                                }
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                            >
                                <Plus className="size-3.5" />
                                Tambah Sumber
                            </button>
                        </div>

                        <FieldError message={nestedErrors.income_sources} />

                        <div className="mt-5 space-y-4">
                            {data.income_sources.map((source, index) => (
                                <div
                                    key={`income-${index}`}
                                    className="rounded-xl border border-sidebar-border/70 bg-muted/15 p-4"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-bold">
                                            Sumber pendapatan {index + 1}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeIncomeSource(index)
                                            }
                                            disabled={
                                                data.income_sources.length === 1
                                            }
                                            className="inline-flex size-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-950/40"
                                            aria-label={`Hapus sumber pendapatan ${index + 1}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>

                                    <div className="mt-3 grid gap-3 lg:grid-cols-[140px_1fr_220px]">
                                        <label className="space-y-1 text-xs font-bold">
                                            <span>Kode</span>
                                            <input
                                                value={source.code}
                                                onChange={(event) =>
                                                    updateIncomeSource(
                                                        index,
                                                        'code',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="DD"
                                                className={inputClassName}
                                                required
                                            />
                                            <FieldError
                                                message={
                                                    nestedErrors[
                                                        `income_sources.${index}.code`
                                                    ]
                                                }
                                            />
                                        </label>
                                        <label className="space-y-1 text-xs font-bold">
                                            <span>Nama Sumber</span>
                                            <input
                                                value={source.label}
                                                onChange={(event) =>
                                                    updateIncomeSource(
                                                        index,
                                                        'label',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Dana Desa"
                                                className={inputClassName}
                                                required
                                            />
                                            <FieldError
                                                message={
                                                    nestedErrors[
                                                        `income_sources.${index}.label`
                                                    ]
                                                }
                                            />
                                        </label>
                                        <label className="space-y-1 text-xs font-bold">
                                            <span>Nominal</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={source.amount}
                                                onChange={(event) =>
                                                    updateIncomeSource(
                                                        index,
                                                        'amount',
                                                        numericValue(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                                placeholder="800000000"
                                                className={inputClassName}
                                                required
                                            />
                                            <p className="font-normal text-muted-foreground">
                                                {rupiahFormatter.format(
                                                    amount(source.amount),
                                                )}
                                            </p>
                                            <FieldError
                                                message={
                                                    nestedErrors[
                                                        `income_sources.${index}.amount`
                                                    ]
                                                }
                                            />
                                        </label>
                                    </div>
                                    <label className="mt-3 block space-y-1 text-xs font-bold">
                                        <span>Keterangan (opsional)</span>
                                        <input
                                            value={source.description}
                                            onChange={(event) =>
                                                updateIncomeSource(
                                                    index,
                                                    'description',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Keterangan singkat sumber dana"
                                            className={inputClassName}
                                        />
                                        <FieldError
                                            message={
                                                nestedErrors[
                                                    `income_sources.${index}.description`
                                                ]
                                            }
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                                    <ClipboardList className="size-5" />
                                </span>
                                <div>
                                    <h2 className="font-bold">
                                        Kegiatan & Belanja
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Rincian pagu dan realisasi program per
                                        lokasi.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setData('activities', [
                                        ...data.activities,
                                        emptyActivity(),
                                    ])
                                }
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                            >
                                <Plus className="size-3.5" />
                                Tambah Kegiatan
                            </button>
                        </div>

                        <FieldError message={nestedErrors.activities} />

                        <div className="mt-5 space-y-4">
                            {data.activities.map((activity, index) => (
                                <div
                                    key={`activity-${index}`}
                                    className="rounded-xl border border-sidebar-border/70 bg-muted/15 p-4"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-bold">
                                            Kegiatan {index + 1}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeActivity(index)
                                            }
                                            disabled={
                                                data.activities.length === 1
                                            }
                                            className="inline-flex size-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-950/40"
                                            aria-label={`Hapus kegiatan ${index + 1}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>

                                    <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                        <label className="space-y-1 text-xs font-bold">
                                            <span>Kode</span>
                                            <input
                                                value={activity.code}
                                                onChange={(event) =>
                                                    updateActivity(
                                                        index,
                                                        'code',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="2.1.01"
                                                className={inputClassName}
                                                required
                                            />
                                            <FieldError
                                                message={
                                                    nestedErrors[
                                                        `activities.${index}.code`
                                                    ]
                                                }
                                            />
                                        </label>
                                        <label className="space-y-1 text-xs font-bold md:col-span-1 xl:col-span-2">
                                            <span>Nama Kegiatan</span>
                                            <input
                                                value={activity.name}
                                                onChange={(event) =>
                                                    updateActivity(
                                                        index,
                                                        'name',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Pembangunan jalan lingkungan"
                                                className={inputClassName}
                                                required
                                            />
                                            <FieldError
                                                message={
                                                    nestedErrors[
                                                        `activities.${index}.name`
                                                    ]
                                                }
                                            />
                                        </label>
                                        <label className="space-y-1 text-xs font-bold">
                                            <span>Bidang</span>
                                            <select
                                                value={activity.category}
                                                onChange={(event) =>
                                                    updateActivity(
                                                        index,
                                                        'category',
                                                        event.target.value,
                                                    )
                                                }
                                                className={inputClassName}
                                            >
                                                {categoryOptions.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            <FieldError
                                                message={
                                                    nestedErrors[
                                                        `activities.${index}.category`
                                                    ]
                                                }
                                            />
                                        </label>
                                        <label className="space-y-1 text-xs font-bold">
                                            <span>Pagu Anggaran</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={activity.budget}
                                                onChange={(event) =>
                                                    updateActivity(
                                                        index,
                                                        'budget',
                                                        numericValue(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                                className={inputClassName}
                                                required
                                            />
                                            <p className="font-normal text-muted-foreground">
                                                {rupiahFormatter.format(
                                                    amount(activity.budget),
                                                )}
                                            </p>
                                            <FieldError
                                                message={
                                                    nestedErrors[
                                                        `activities.${index}.budget`
                                                    ]
                                                }
                                            />
                                        </label>
                                        <label className="space-y-1 text-xs font-bold">
                                            <span>Realisasi</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={activity.realized}
                                                onChange={(event) =>
                                                    updateActivity(
                                                        index,
                                                        'realized',
                                                        numericValue(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                                className={inputClassName}
                                                required
                                            />
                                            <p className="font-normal text-muted-foreground">
                                                {rupiahFormatter.format(
                                                    amount(activity.realized),
                                                )}
                                            </p>
                                            <FieldError
                                                message={
                                                    nestedErrors[
                                                        `activities.${index}.realized`
                                                    ]
                                                }
                                            />
                                        </label>
                                        <label className="space-y-1 text-xs font-bold">
                                            <span>Lokasi</span>
                                            <input
                                                value={activity.location}
                                                onChange={(event) =>
                                                    updateActivity(
                                                        index,
                                                        'location',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Dusun Ngampungan"
                                                className={inputClassName}
                                                required
                                            />
                                            <FieldError
                                                message={
                                                    nestedErrors[
                                                        `activities.${index}.location`
                                                    ]
                                                }
                                            />
                                        </label>
                                        <label className="space-y-1 text-xs font-bold">
                                            <span>Status</span>
                                            <select
                                                value={activity.status}
                                                onChange={(event) =>
                                                    updateActivity(
                                                        index,
                                                        'status',
                                                        event.target.value,
                                                    )
                                                }
                                                className={inputClassName}
                                            >
                                                {statusOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <FieldError
                                                message={
                                                    nestedErrors[
                                                        `activities.${index}.status`
                                                    ]
                                                }
                                            />
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="sticky bottom-4 z-10 rounded-2xl border border-emerald-800/20 bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/90">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <dl className="grid flex-1 gap-3 sm:grid-cols-3">
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Total pendapatan
                                    </dt>
                                    <dd className="font-bold">
                                        {rupiahFormatter.format(totalIncome)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Total pagu belanja
                                    </dt>
                                    <dd className="font-bold">
                                        {rupiahFormatter.format(totalBudget)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Realisasi belanja
                                    </dt>
                                    <dd className="font-bold text-emerald-700 dark:text-emerald-400">
                                        {rupiahFormatter.format(totalRealized)}{' '}
                                        ({realizationPercentage}%)
                                    </dd>
                                </div>
                            </dl>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            >
                                {processing ? (
                                    <Spinner className="size-4" />
                                ) : (
                                    <Save className="size-4" />
                                )}
                                {processing
                                    ? 'Menyimpan...'
                                    : isEditing
                                      ? 'Simpan Perubahan'
                                      : 'Simpan APBDes'}
                            </button>
                        </div>

                        {Object.keys(errors).length > 0 && (
                            <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-red-600">
                                <CircleAlert className="size-4" />
                                Periksa kembali bagian yang ditandai sebelum
                                menyimpan.
                            </p>
                        )}
                    </section>
                </form>
            </div>
        </>
    );
}
