import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowDown,
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    Clock3,
    FileCheck2,
    FileText,
    Headphones,
    Info,
    ShieldAlert,
    UsersRound,
    Wallet,
} from 'lucide-react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageServiceApplicationForm } from '@/components/village-service-application-form';
import {
    findDummyVillageService,
    findDummyVillageServiceApplicationDetail,
    findVillageServiceCategory,
    villageServiceProcessSteps,
} from '@/lib/dummy-village-services';
import { home } from '@/routes';
import { index as servicesIndex } from '@/routes/services';

type ServiceShowPageProps = {
    slug: string;
    canonicalUrl: string;
};

export default function ServiceShow({
    slug,
    canonicalUrl,
}: ServiceShowPageProps) {
    const service = findDummyVillageService(slug);
    const detail = findDummyVillageServiceApplicationDetail(slug);

    if (!service || !detail) {
        return (
            <PublicPageShell activeSection="services">
                <Head title="Layanan Tidak Ditemukan" />
                <section className="bg-village-canvas py-20">
                    <div className="mx-auto max-w-2xl px-5 text-center lg:px-12">
                        <AlertTriangle
                            aria-hidden="true"
                            className="mx-auto size-12 text-village-secondary"
                        />
                        <h1 className="mt-5 text-3xl font-bold">
                            Layanan tidak ditemukan
                        </h1>
                        <p className="mt-3 leading-7 text-village-muted">
                            Data layanan dengan alamat tersebut belum tersedia
                            pada simulasi frontend.
                        </p>
                        <Link
                            href={servicesIndex()}
                            className="mt-7 inline-flex min-h-11 items-center gap-2 bg-village-primary px-5 py-3 text-sm font-bold text-white"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Kembali ke direktori
                        </Link>
                    </div>
                </section>
            </PublicPageShell>
        );
    }

    const category = findVillageServiceCategory(service.category);
    const pageTitle = `${service.title} - Layanan Desa Ngampungan`;

    return (
        <PublicPageShell activeSection="services">
            <Head title={pageTitle}>
                <meta
                    head-key="description"
                    name="description"
                    content={`${service.shortDescription} Lihat persyaratan dan coba alur pengajuan frontend.`}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content={pageTitle}
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={service.shortDescription}
                />
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={canonicalUrl}
                />
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={canonicalUrl}
                />
            </Head>

            <section className="border-b border-village-border bg-white">
                <div className="mx-auto max-w-[1280px] px-5 py-5 lg:px-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-sm"
                    >
                        <Link
                            href={home()}
                            className="font-semibold text-village-muted transition hover:text-village-primary"
                        >
                            Beranda
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-4 text-village-muted"
                        />
                        <Link
                            href={servicesIndex({
                                query: { category: service.category },
                            })}
                            className="font-semibold text-village-muted transition hover:text-village-primary"
                        >
                            Informasi Pelayanan
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-4 text-village-muted"
                        />
                        <span className="font-semibold text-village-ink">
                            {service.title}
                        </span>
                    </nav>
                </div>
            </section>

            <section className="relative overflow-hidden bg-village-primary-dark text-white">
                <div
                    aria-hidden="true"
                    className="absolute -top-40 -right-32 size-[34rem] rounded-full border-[7rem] border-white/[0.04]"
                />
                <div className="relative mx-auto grid max-w-[1280px] gap-10 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:px-12 lg:py-20">
                    <div>
                        <p className="text-xs font-bold tracking-[0.18em] text-village-accent uppercase">
                            {category.label}
                        </p>
                        <h1 className="mt-4 max-w-4xl text-4xl leading-tight font-bold tracking-tight md:text-6xl">
                            {service.title}
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                            {service.shortDescription}
                        </p>
                        <a
                            href="#form-pengajuan"
                            className="mt-8 inline-flex min-h-12 items-center gap-2 bg-village-accent px-5 py-3 text-sm font-bold text-village-primary-dark transition hover:bg-white"
                        >
                            Mulai simulasi pengajuan
                            <ArrowDown aria-hidden="true" className="size-4" />
                        </a>
                    </div>

                    <dl className="grid grid-cols-2 border border-white/20 bg-white/5 text-sm backdrop-blur-sm">
                        <div className="border-r border-b border-white/20 p-4">
                            <dt className="flex items-center gap-2 text-white/55">
                                <UsersRound
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                Sasaran
                            </dt>
                            <dd className="mt-2 font-bold">
                                {service.audience}
                            </dd>
                        </div>
                        <div className="border-b border-white/20 p-4">
                            <dt className="flex items-center gap-2 text-white/55">
                                <Headphones
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                Kanal
                            </dt>
                            <dd className="mt-2 font-bold">
                                {service.channel}
                            </dd>
                        </div>
                        <div className="border-r border-white/20 p-4">
                            <dt className="flex items-center gap-2 text-white/55">
                                <Clock3 aria-hidden="true" className="size-4" />
                                Estimasi
                            </dt>
                            <dd className="mt-2 font-bold">
                                {service.estimatedDuration}
                            </dd>
                        </div>
                        <div className="p-4">
                            <dt className="flex items-center gap-2 text-white/55">
                                <Wallet aria-hidden="true" className="size-4" />
                                Biaya
                            </dt>
                            <dd className="mt-2 font-bold">{service.fee}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            <section
                aria-labelledby="requirements-heading"
                className="bg-village-canvas py-12 md:py-16"
            >
                <div className="mx-auto grid max-w-[1280px] gap-8 px-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:px-12">
                    <div className="grid gap-8">
                        <section className="border border-village-border bg-white p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <span className="flex size-11 shrink-0 items-center justify-center bg-village-primary-light text-village-primary">
                                    <CheckCircle2
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                                <div>
                                    <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                        Sebelum Mengajukan
                                    </p>
                                    <h2
                                        id="requirements-heading"
                                        className="mt-2 text-2xl font-bold md:text-3xl"
                                    >
                                        Persyaratan pemohon
                                    </h2>
                                </div>
                            </div>
                            <ul className="mt-7 grid gap-3">
                                {detail.requirements.map(
                                    (requirement, index) => (
                                        <li
                                            key={requirement}
                                            className="flex items-start gap-4 border-t border-village-border pt-4"
                                        >
                                            <span className="flex size-7 shrink-0 items-center justify-center bg-village-primary text-xs font-bold text-white">
                                                {index + 1}
                                            </span>
                                            <span className="pt-0.5 leading-7 text-village-muted">
                                                {requirement}
                                            </span>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </section>

                        <section
                            aria-labelledby="documents-heading"
                            className="border border-village-border bg-white p-6 md:p-8"
                        >
                            <div className="flex items-start gap-4">
                                <span className="flex size-11 shrink-0 items-center justify-center bg-[#fff1cf] text-village-secondary">
                                    <FileCheck2
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                                <div>
                                    <p className="text-xs font-bold tracking-[0.16em] text-village-secondary uppercase">
                                        Berkas Pendukung
                                    </p>
                                    <h2
                                        id="documents-heading"
                                        className="mt-2 text-2xl font-bold md:text-3xl"
                                    >
                                        Dokumen yang disiapkan
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-7 grid gap-4 md:grid-cols-2">
                                {detail.requiredDocuments.map((document) => (
                                    <article
                                        key={document.key}
                                        className="border-t-2 border-village-accent bg-village-canvas p-5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <FileText
                                                aria-hidden="true"
                                                className="size-5 text-village-primary"
                                            />
                                            <span
                                                className={`px-2 py-1 text-[0.65rem] font-bold tracking-[0.08em] uppercase ${
                                                    document.required
                                                        ? 'bg-village-primary-light text-village-primary'
                                                        : 'bg-village-surface-muted text-village-muted'
                                                }`}
                                            >
                                                {document.required
                                                    ? 'Wajib'
                                                    : 'Opsional'}
                                            </span>
                                        </div>
                                        <h3 className="mt-5 font-bold">
                                            {document.label}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-village-muted">
                                            {document.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="border border-village-border bg-white lg:sticky lg:top-28">
                        <div className="border-l-4 border-village-primary p-5">
                            <p className="text-xs font-bold tracking-[0.14em] text-village-primary uppercase">
                                Bantuan Layanan
                            </p>
                            <dl className="mt-5 grid gap-4 text-sm">
                                <div>
                                    <dt className="text-village-muted">
                                        Petugas
                                    </dt>
                                    <dd className="mt-1 font-bold">
                                        {detail.serviceContact}
                                    </dd>
                                </div>
                                <div className="border-t border-village-border pt-4">
                                    <dt className="text-village-muted">
                                        Jam pelayanan
                                    </dt>
                                    <dd className="mt-1 leading-6 font-bold">
                                        {detail.serviceHours}
                                    </dd>
                                </div>
                            </dl>
                            <a
                                href="#form-pengajuan"
                                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-village-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-village-primary-dark"
                            >
                                Coba formulir
                                <ArrowDown
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </a>
                        </div>
                        <div className="border-t border-village-border bg-[#fff8ea] p-5 text-sm leading-6 text-[#755018]">
                            <div className="flex items-start gap-3">
                                <Info
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0"
                                />
                                Persyaratan ini masih data simulasi dan belum
                                menjadi ketentuan resmi desa.
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <section
                aria-labelledby="service-process-heading"
                className="border-y border-village-border bg-white py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                            Alur Pelayanan
                        </p>
                        <h2
                            id="service-process-heading"
                            className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                        >
                            Dari persiapan sampai selesai
                        </h2>
                    </div>

                    <ol className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {villageServiceProcessSteps.map((step, index) => (
                            <li
                                key={step.title}
                                className="relative border-t-4 border-village-primary bg-village-canvas p-5"
                            >
                                <span className="text-4xl font-bold tracking-tighter text-village-primary/20">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <h3 className="mt-5 text-lg font-bold">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-village-muted">
                                    {step.description}
                                </p>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-8 grid gap-3 border border-[#efdcae] bg-[#fff8ea] p-5 text-sm leading-6 text-[#755018]">
                        <div className="flex items-start gap-3 font-bold">
                            <ShieldAlert
                                aria-hidden="true"
                                className="mt-0.5 size-5 shrink-0"
                            />
                            Catatan layanan
                        </div>
                        <ul className="ml-8 list-disc">
                            {detail.notes.map((note) => (
                                <li key={note}>{note}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section
                id="form-pengajuan"
                aria-labelledby="application-form-heading"
                className="scroll-mt-24 bg-village-canvas py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1080px] px-5 lg:px-12">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                            Simulasi Pengajuan
                        </p>
                        <h2
                            id="application-form-heading"
                            className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                        >
                            Coba alur formulir layanan
                        </h2>
                        <p className="mt-4 leading-7 text-village-muted">
                            Form ini membantu menilai pengalaman warga sebelum
                            sistem penyimpanan dan penerusan ke admin
                            dikembangkan pada tahap berikutnya.
                        </p>
                    </div>

                    <div className="mt-8">
                        <VillageServiceApplicationForm
                            service={service}
                            detail={detail}
                        />
                    </div>

                    <Link
                        href={servicesIndex({
                            query: { category: service.category },
                        })}
                        className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-village-primary hover:text-village-primary-dark"
                    >
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        Kembali ke {category.label}
                    </Link>
                </div>
            </section>
        </PublicPageShell>
    );
}
