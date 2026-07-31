import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    BadgeCheck,
    BriefcaseBusiness,
    Check,
    ChevronRight,
    GraduationCap,
    ShieldCheck,
    UserCheck,
    UserRound,
} from 'lucide-react';
import { PublicPageShell } from '@/components/public-page-shell';
import {
    dummyVillageOfficials,
    findDummyVillageOfficial,
} from '@/lib/dummy-village-government';
import { home } from '@/routes';
import { index as governmentIndex } from '@/routes/government';

type OfficialData = {
    id?: number;
    slug?: string;
    name: string;
    initials?: string;
    position: string;
    unit: string;
    group?: string;
    photo_url?: string | null;
    photo?: string | null;
    term?: string | null;
    employee_id?: string | null;
    employeeId?: string | null;
    summary?: string | null;
    about?: string | null;
    responsibilities?: string[] | null;
    service_focus?: string[] | null;
    serviceFocus?: string[] | null;
    education?: string[] | null;
    career?: { period: string; role: string }[] | null;
};

type VillageOfficialShowPageProps = {
    official?: OfficialData | null;
    slug?: string;
    canonicalUrl: string;
};

export default function VillageOfficialShow({
    official: propOfficial,
    slug,
    canonicalUrl,
}: VillageOfficialShowPageProps) {
    const official = propOfficial || (slug ? findDummyVillageOfficial(slug) : null);

    if (!official) {
        return (
            <PublicPageShell activeSection="government">
                <Head title="Profil Perangkat Tidak Ditemukan" />
                <section className="bg-gray-50/60 py-20">
                    <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
                        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
                            <UserRound aria-hidden="true" className="size-8" />
                        </span>
                        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Profil perangkat tidak ditemukan
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600">
                            Profil aparatur desa yang Anda cari belum tersedia.
                        </p>
                        <Link
                            href={`${governmentIndex.url()}#perangkat-desa`}
                            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-emerald-700 px-6 text-sm font-bold text-white shadow-md shadow-emerald-700/20 transition-all hover:bg-emerald-800"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            <span>Kembali ke Daftar Perangkat</span>
                        </Link>
                    </div>
                </section>
            </PublicPageShell>
        );
    }

    const photoSrc = official.photo_url || official.photo;
    const employeeId = official.employee_id || official.employeeId || 'Perangkat Desa';
    const term = official.term || '2022–2028';
    const serviceFocusList = official.service_focus || official.serviceFocus || [];
    const responsibilitiesList = official.responsibilities || [];
    const educationList = official.education || [];
    const careerList = official.career || [];
    const initials = official.initials || official.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

    const pageDescription = `${official.name}, ${official.position} Pemerintah Desa Ngampungan. Profil resmi aparatur desa Ngampungan.`;
    const relatedOfficials = dummyVillageOfficials
        .filter(
            (candidate) =>
                candidate.slug !== official.slug &&
                candidate.group === official.group,
        )
        .slice(0, 3);

    return (
        <PublicPageShell activeSection="government">
            <Head>
                <title>{`${official.name} - ${official.position}`}</title>
                <meta
                    head-key="description"
                    name="description"
                    content={pageDescription}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content={`${official.name} - ${official.position}`}
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={pageDescription}
                />
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={canonicalUrl}
                />
                <meta head-key="og:type" property="og:type" content="profile" />
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={canonicalUrl}
                />
            </Head>

            {/* BREADCRUMB HEADER */}
            <section className="border-b border-gray-200/80 bg-white">
                <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-10">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500"
                    >
                        <Link
                            href={home()}
                            className="transition-colors hover:text-emerald-700"
                        >
                            Beranda
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-3.5 text-gray-300"
                        />
                        <Link
                            href={governmentIndex()}
                            className="transition-colors hover:text-emerald-700"
                        >
                            Pemerintahan Desa
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-3.5 text-gray-300"
                        />
                        <span aria-current="page" className="font-bold text-gray-900">
                            {official.name}
                        </span>
                    </nav>
                </div>
            </section>

            {/* HERO PROFILE SUMMARY */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-emerald-500/15 blur-3xl"
                />

                <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 md:py-16">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        {/* Profile Image Column */}
                        <div className="lg:col-span-4">
                            <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-3xl border border-emerald-700/60 bg-emerald-950/80 p-4 shadow-2xl">
                                {photoSrc ? (
                                    <img
                                        src={photoSrc}
                                        alt={`Foto ${official.name}`}
                                        className="h-full w-full object-contain object-bottom"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-emerald-900 text-4xl font-extrabold text-white ring-1 ring-emerald-700/50">
                                        {initials}
                                    </div>
                                )}
                                <span className="absolute top-6 left-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-3 py-1 text-[11px] font-bold tracking-wider text-white shadow-xs uppercase">
                                    <UserCheck className="size-3" />
                                    {official.unit}
                                </span>
                            </div>
                        </div>

                        {/* Profile Title & Quick Data Column */}
                        <div className="lg:col-span-8">
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold tracking-wider text-emerald-300 uppercase">
                                <Award className="size-3.5 text-emerald-400" />
                                Aparatur Pemerintah Desa
                            </span>
                            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
                                {official.name}
                            </h1>
                            <p className="mt-2 text-lg font-bold text-emerald-300">
                                {official.position}
                            </p>

                            {official.summary && (
                                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-emerald-100/80 md:text-base">
                                    {official.summary}
                                </p>
                            )}

                            <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-emerald-800 bg-emerald-900/60 p-5 sm:grid-cols-3">
                                <div>
                                    <dt className="text-[11px] font-bold tracking-wider text-emerald-200/70 uppercase">
                                        Unit Kerja
                                    </dt>
                                    <dd className="mt-1 text-sm font-extrabold text-white">
                                        {official.unit}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-[11px] font-bold tracking-wider text-emerald-200/70 uppercase">
                                        NIP / ID
                                    </dt>
                                    <dd className="mt-1 text-sm font-extrabold text-white">
                                        {employeeId}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-[11px] font-bold tracking-wider text-emerald-200/70 uppercase">
                                        Masa Jabatan
                                    </dt>
                                    <dd className="mt-1 text-sm font-extrabold text-white">
                                        {term}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </section>

            {/* DETAILED INFORMATION CARDS */}
            <section className="bg-gray-50/60 py-14 md:py-20">
                <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
                    <div className="grid gap-6 lg:col-span-8">
                        {/* Tentang Perangkat Card */}
                        {official.about && (
                            <article className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                                        <BadgeCheck aria-hidden="true" className="size-5 text-emerald-700" />
                                    </span>
                                    <h2 className="text-xl font-extrabold text-gray-900">
                                        Tentang Perangkat
                                    </h2>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
                                    {official.about}
                                </p>
                            </article>
                        )}

                        {/* Tugas dan Tanggung Jawab Card */}
                        {responsibilitiesList.length > 0 && (
                            <article className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                                        <BriefcaseBusiness aria-hidden="true" className="size-5 text-emerald-700" />
                                    </span>
                                    <h2 className="text-xl font-extrabold text-gray-900">
                                        Tugas dan Tanggung Jawab
                                    </h2>
                                </div>
                                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {responsibilitiesList.map((resp) => (
                                        <li
                                            key={resp}
                                            className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 text-xs font-medium leading-relaxed text-gray-700"
                                        >
                                            <Check
                                                aria-hidden="true"
                                                className="mt-0.5 size-4 shrink-0 text-emerald-700"
                                            />
                                            <span>{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        )}

                        {/* Pendidikan dan Riwayat Jabatan Card */}
                        {(educationList.length > 0 || careerList.length > 0) && (
                            <article className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                                        <GraduationCap aria-hidden="true" className="size-5 text-emerald-700" />
                                    </span>
                                    <h2 className="text-xl font-extrabold text-gray-900">
                                        Pendidikan dan Riwayat Jabatan
                                    </h2>
                                </div>

                                <div className="mt-6 grid gap-8 sm:grid-cols-2">
                                    {/* Education */}
                                    {educationList.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-extrabold tracking-wider text-gray-800 uppercase">
                                                Riwayat Pendidikan
                                            </h3>
                                            <ul className="mt-4 grid gap-3">
                                                {educationList.map((edu) => (
                                                    <li
                                                        key={edu}
                                                        className="rounded-xl border-l-4 border-emerald-700 bg-slate-50 p-3.5 text-xs font-semibold text-gray-800"
                                                    >
                                                        {edu}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Career */}
                                    {careerList.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-extrabold tracking-wider text-gray-800 uppercase">
                                                Riwayat Jabatan
                                            </h3>
                                            <ol className="mt-4 grid gap-3">
                                                {careerList.map((car) => (
                                                    <li
                                                        key={`${car.period}-${car.role}`}
                                                        className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-3.5"
                                                    >
                                                        <span className="inline-block rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-gray-800">
                                                            {car.period}
                                                        </span>
                                                        <p className="mt-1 text-xs font-bold text-gray-900">
                                                            {car.role}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}
                                </div>
                            </article>
                        )}
                    </div>

                    {/* Sidebar Information */}
                    <aside className="grid content-start gap-6 lg:col-span-4">
                        {/* Service Focus */}
                        {serviceFocusList.length > 0 && (
                            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                                    <ShieldCheck aria-hidden="true" className="size-5 text-emerald-700" />
                                </span>
                                <h2 className="mt-4 text-lg font-extrabold text-gray-900">
                                    Fokus Pelayanan
                                </h2>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {serviceFocusList.map((focus) => (
                                        <span
                                            key={focus}
                                            className="inline-flex items-center rounded-xl border border-gray-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-gray-800"
                                        >
                                            {focus}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back Button */}
                        <Link
                            href={`${governmentIndex.url()}#perangkat-desa`}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-800 shadow-2xs transition-all hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            <span>Kembali ke Daftar Perangkat</span>
                        </Link>
                    </aside>
                </div>
            </section>
        </PublicPageShell>
    );
}
