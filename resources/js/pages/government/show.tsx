import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    BriefcaseBusiness,
    Check,
    ChevronRight,
    GraduationCap,
    Info,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import { PublicPageShell } from '@/components/public-page-shell';
import {
    dummyVillageOfficials,
    findDummyVillageOfficial,
} from '@/lib/dummy-village-government';
import { home } from '@/routes';
import { index as governmentIndex } from '@/routes/government';
import { show as officialShow } from '@/routes/government/officials';

type VillageOfficialShowPageProps = {
    slug: string;
    canonicalUrl: string;
};

export default function VillageOfficialShow({
    slug,
    canonicalUrl,
}: VillageOfficialShowPageProps) {
    const official = findDummyVillageOfficial(slug);

    if (!official) {
        return (
            <PublicPageShell activeSection="government">
                <Head title="Profil Perangkat Tidak Ditemukan" />
                <section className="bg-village-canvas py-20">
                    <div className="mx-auto max-w-2xl px-5 text-center lg:px-12">
                        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-village-primary-light text-village-primary">
                            <UserRound aria-hidden="true" className="size-6" />
                        </span>
                        <h1 className="mt-6 text-3xl font-bold">
                            Profil perangkat tidak ditemukan
                        </h1>
                        <p className="mt-4 leading-7 text-village-muted">
                            Slug perangkat belum tersedia pada data dummy
                            frontend.
                        </p>
                        <Link
                            href={`${governmentIndex.url()}#perangkat-desa`}
                            className="mt-8 inline-flex min-h-11 items-center gap-2 bg-village-primary px-5 py-3 text-sm font-bold text-white"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Kembali ke daftar perangkat
                        </Link>
                    </div>
                </section>
            </PublicPageShell>
        );
    }

    const pageDescription = `${official.name}, ${official.position} Pemerintah Desa Ngampungan. Profil ini masih menggunakan data simulasi frontend.`;
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

            <section className="border-b border-village-border bg-white">
                <div className="mx-auto max-w-[1280px] px-5 py-10 lg:px-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-sm text-village-muted"
                    >
                        <Link
                            href={home()}
                            className="transition hover:text-village-primary"
                        >
                            Beranda
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-4 text-village-border"
                        />
                        <Link
                            href={governmentIndex()}
                            className="transition hover:text-village-primary"
                        >
                            Pemerintahan Desa
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-4 text-village-border"
                        />
                        <span aria-current="page" className="text-village-ink">
                            {official.name}
                        </span>
                    </nav>
                </div>
            </section>

            <section className="bg-village-primary-dark text-white">
                <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-12 lg:grid-cols-12 lg:items-center lg:px-12 lg:py-16">
                    <div className="lg:col-span-4">
                        <div className="relative mx-auto flex aspect-[4/5] max-w-sm items-end justify-center overflow-hidden border border-white/15 bg-white/[0.06]">
                            <div
                                aria-hidden="true"
                                className="absolute -top-12 -right-12 size-48 rounded-full border-[38px] border-white/[0.04]"
                            />
                            {official.photo ? (
                                <img
                                    src={official.photo}
                                    alt={`Ilustrasi sementara ${official.name}`}
                                    className="relative h-[92%] w-full object-contain object-bottom p-5"
                                />
                            ) : (
                                <div className="relative mb-16 flex size-32 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-4xl font-bold">
                                    {official.initials}
                                </div>
                            )}
                            <span className="absolute top-5 left-5 bg-village-accent px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.12em] text-village-primary-dark uppercase">
                                Data simulasi
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-accent uppercase">
                            Profil Perangkat Desa
                        </p>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
                            {official.name}
                        </h1>
                        <p className="mt-3 text-xl font-semibold text-white/70">
                            {official.position}
                        </p>
                        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/65">
                            {official.summary}
                        </p>

                        <dl className="mt-9 grid gap-px bg-white/15 sm:grid-cols-3">
                            <div className="bg-village-primary-dark py-4 sm:pr-5">
                                <dt className="text-xs tracking-[0.13em] text-white/45 uppercase">
                                    Unit Kerja
                                </dt>
                                <dd className="mt-2 font-bold">
                                    {official.unit}
                                </dd>
                            </div>
                            <div className="bg-village-primary-dark py-4 sm:px-5">
                                <dt className="text-xs tracking-[0.13em] text-white/45 uppercase">
                                    Kode Profil
                                </dt>
                                <dd className="mt-2 font-bold">
                                    {official.employeeId}
                                </dd>
                            </div>
                            <div className="bg-village-primary-dark py-4 sm:pl-5">
                                <dt className="text-xs tracking-[0.13em] text-white/45 uppercase">
                                    Periode
                                </dt>
                                <dd className="mt-2 font-bold">
                                    {official.term}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            <section className="bg-village-canvas py-14 md:py-20">
                <div className="mx-auto grid max-w-[1280px] gap-6 px-5 lg:grid-cols-12 lg:px-12">
                    <div className="grid gap-6 lg:col-span-8">
                        <article className="border border-village-border bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex items-center gap-3">
                                <BadgeCheck
                                    aria-hidden="true"
                                    className="size-5 text-village-primary"
                                />
                                <h2 className="text-2xl font-bold">
                                    Tentang Perangkat
                                </h2>
                            </div>
                            <p className="mt-5 leading-8 text-village-muted">
                                {official.about}
                            </p>
                        </article>

                        <article className="border border-village-border bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex items-center gap-3">
                                <BriefcaseBusiness
                                    aria-hidden="true"
                                    className="size-5 text-village-primary"
                                />
                                <h2 className="text-2xl font-bold">
                                    Tugas dan Tanggung Jawab
                                </h2>
                            </div>
                            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                                {official.responsibilities.map(
                                    (responsibility) => (
                                        <li
                                            key={responsibility}
                                            className="flex items-start gap-3 border-t border-village-border pt-4 leading-7 text-village-muted"
                                        >
                                            <Check
                                                aria-hidden="true"
                                                className="mt-1 size-4 shrink-0 text-village-primary"
                                            />
                                            {responsibility}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </article>

                        <article className="border border-village-border bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex items-center gap-3">
                                <GraduationCap
                                    aria-hidden="true"
                                    className="size-5 text-village-primary"
                                />
                                <h2 className="text-2xl font-bold">
                                    Pendidikan dan Riwayat Jabatan
                                </h2>
                            </div>

                            <div className="mt-6 grid gap-8 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-xs font-bold tracking-[0.14em] text-village-primary uppercase">
                                        Pendidikan
                                    </h3>
                                    <ul className="mt-4 grid gap-3">
                                        {official.education.map((education) => (
                                            <li
                                                key={education}
                                                className="border-l-2 border-village-primary-light pl-4 text-sm leading-6 text-village-muted"
                                            >
                                                {education}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-[0.14em] text-village-primary uppercase">
                                        Riwayat Jabatan
                                    </h3>
                                    <ol className="mt-4 grid gap-4">
                                        {official.career.map((career) => (
                                            <li
                                                key={`${career.period}-${career.role}`}
                                                className="border-l-2 border-village-accent pl-4"
                                            >
                                                <p className="text-xs font-bold text-village-primary">
                                                    {career.period}
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-village-muted">
                                                    {career.role}
                                                </p>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </article>
                    </div>

                    <aside className="grid content-start gap-6 lg:col-span-4">
                        <div className="border border-village-border bg-white p-6 shadow-sm">
                            <ShieldCheck
                                aria-hidden="true"
                                className="size-6 text-village-primary"
                            />
                            <h2 className="mt-5 text-xl font-bold">
                                Fokus Pelayanan
                            </h2>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {official.serviceFocus.map((focus) => (
                                    <span
                                        key={focus}
                                        className="bg-village-primary-light px-3 py-2 text-sm font-semibold text-village-primary-dark"
                                    >
                                        {focus}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-start gap-3 border border-[#efdcae] bg-[#fff8ea] p-5 text-sm leading-6 text-[#755018]">
                            <Info
                                aria-hidden="true"
                                className="mt-0.5 size-5 shrink-0"
                            />
                            <p>
                                <strong>Profil simulasi.</strong> Informasi
                                personal, pendidikan, masa jabatan, dan tugas
                                akan disesuaikan setelah data resmi tersedia.
                            </p>
                        </div>

                        <Link
                            href={`${governmentIndex.url()}#perangkat-desa`}
                            className="inline-flex min-h-11 items-center justify-center gap-2 border border-village-border bg-white px-5 py-3 text-sm font-bold text-village-primary transition hover:border-village-primary hover:bg-village-primary-light"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Kembali ke daftar perangkat
                        </Link>
                    </aside>
                </div>
            </section>

            {relatedOfficials.length > 0 && (
                <section className="border-t border-village-border bg-white py-14 md:py-20">
                    <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                    Satu Kelompok Kerja
                                </p>
                                <h2 className="mt-2 text-3xl font-bold">
                                    Perangkat Terkait
                                </h2>
                            </div>
                            <Link
                                href={`${governmentIndex.url()}#perangkat-desa`}
                                className="inline-flex min-h-11 items-center gap-2 font-bold text-village-primary"
                            >
                                Lihat semua
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>

                        <div className="mt-8 grid gap-5 md:grid-cols-3">
                            {relatedOfficials.map((relatedOfficial) => (
                                <Link
                                    key={relatedOfficial.slug}
                                    href={officialShow(relatedOfficial.slug)}
                                    className="group flex items-center gap-4 border border-village-border bg-village-canvas p-5 transition hover:border-village-primary/50 hover:shadow-village-soft"
                                >
                                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-village-primary-light font-bold text-village-primary-dark">
                                        {relatedOfficial.initials}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate font-bold">
                                            {relatedOfficial.name}
                                        </span>
                                        <span className="mt-1 block truncate text-sm text-village-muted">
                                            {relatedOfficial.position}
                                        </span>
                                    </span>
                                    <ChevronRight
                                        aria-hidden="true"
                                        className="ml-auto size-4 shrink-0 text-village-primary transition-transform group-hover:translate-x-1"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicPageShell>
    );
}
