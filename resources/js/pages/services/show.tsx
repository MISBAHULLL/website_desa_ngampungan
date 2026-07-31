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
    Sparkles,
    UsersRound,
} from 'lucide-react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageServiceApplicationForm } from '@/components/village-service-application-form';
import type { ServiceApplicationSuccess } from '@/components/village-service-application-form';
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
    serviceApplicationSuccess: ServiceApplicationSuccess | null;
};

export default function ServiceShow({
    slug,
    canonicalUrl,
    serviceApplicationSuccess,
}: ServiceShowPageProps) {
    const service = findDummyVillageService(slug);
    const detail = findDummyVillageServiceApplicationDetail(slug);

    if (!service || !detail) {
        return (
            <PublicPageShell activeSection="services">
                <Head title="Layanan Tidak Ditemukan" />
                <section className="bg-slate-50 py-20">
                    <div className="mx-auto max-w-2xl px-5 text-center lg:px-12">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 border border-amber-200">
                            <AlertTriangle
                                aria-hidden="true"
                                className="size-8"
                            />
                        </div>
                        <h1 className="mt-5 text-2xl font-black text-slate-900">
                            Layanan tidak ditemukan
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Data layanan dengan alamat tersebut belum tersedia pada sistem direktori Desa Ngampungan.
                        </p>
                        <Link
                            href={servicesIndex()}
                            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-800"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Kembali ke Direktori Layanan
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
                    content={`${service.shortDescription} Lihat persyaratan dan ajukan layanan secara daring.`}
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

            {/* BREADCRUMB BAR */}
            <section className="border-b border-slate-200/80 bg-white py-3.5">
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600"
                    >
                        <Link
                            href={home()}
                            className="transition hover:text-emerald-700"
                        >
                            Beranda
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-3.5 text-slate-400"
                        />
                        <Link
                            href={servicesIndex({
                                query: { category: service.category },
                            })}
                            className="transition hover:text-emerald-700"
                        >
                            Informasi Pelayanan
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-3.5 text-slate-400"
                        />
                        <span className="font-bold text-slate-900">
                            {service.title}
                        </span>
                    </nav>
                </div>
            </section>

            {/* HERO HEADER SECTION */}
            <section className="bg-village-primary-dark text-white">
                <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-12 lg:grid-cols-12 lg:items-center lg:px-12 lg:py-16">
                    <div className="lg:col-span-8">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-bold tracking-wider text-emerald-300 uppercase">
                            <Sparkles className="size-3 text-emerald-300" />
                            {category.label}
                        </span>
                        <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                            {service.title}
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-emerald-100/90 sm:text-base lg:text-lg">
                            {service.shortDescription}
                        </p>
                        <a
                            href="#form-pengajuan"
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-950/20 transition-all hover:bg-emerald-400"
                        >
                            Mulai Pengajuan
                            <ArrowDown aria-hidden="true" className="size-4" />
                        </a>
                    </div>

                    {/* Service Info Cards Grid (Solid High Contrast Style) */}
                    <div className="grid grid-cols-3 gap-3 lg:col-span-4">
                        <div className="rounded-2xl bg-white p-4 shadow-lg border border-emerald-100">
                            <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase tracking-wider">
                                <UsersRound className="size-3.5 text-emerald-600" />
                                Sasaran
                            </span>
                            <p className="mt-1 text-xs font-black text-emerald-950 truncate" title={service.audience}>{service.audience}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-lg border border-emerald-100">
                            <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase tracking-wider">
                                <Headphones className="size-3.5 text-emerald-600" />
                                Kanal
                            </span>
                            <p className="mt-1 text-xs font-black text-emerald-950 truncate" title={service.channel}>{service.channel}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-lg border border-emerald-100">
                            <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase tracking-wider">
                                <Clock3 className="size-3.5 text-emerald-600" />
                                Estimasi
                            </span>
                            <p className="mt-1 text-xs font-black text-emerald-950 truncate" title={service.estimatedDuration}>{service.estimatedDuration}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* REQUIREMENTS & DOCUMENTS SECTION */}
            <section
                aria-labelledby="requirements-heading"
                className="bg-slate-50/50 py-12 md:py-16"
            >
                <div className="mx-auto grid max-w-[1280px] gap-8 px-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:px-12">
                    <div className="space-y-8">
                        {/* Requirements Card */}
                        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
                            <div className="flex items-start gap-4">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                    <CheckCircle2
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </div>
                                <div>
                                    <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                        Sebelum Mengajukan
                                    </span>
                                    <h2
                                        id="requirements-heading"
                                        className="mt-1 text-2xl font-black tracking-tight text-slate-900"
                                    >
                                        Persyaratan Pemohon
                                    </h2>
                                </div>
                            </div>

                            <ul className="mt-6 grid gap-3">
                                {detail.requirements.map(
                                    (requirement, index) => (
                                        <li
                                            key={requirement}
                                            className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:bg-slate-100/80"
                                        >
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-xs font-bold text-white shadow-xs">
                                                {index + 1}
                                            </span>
                                            <span className="pt-0.5 text-xs font-medium leading-relaxed text-slate-700">
                                                {requirement}
                                            </span>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </section>

                        {/* Documents Card */}
                        <section
                            aria-labelledby="documents-heading"
                            className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60">
                                    <FileCheck2
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </div>
                                <div>
                                    <span className="text-xs font-bold tracking-wider text-amber-700 uppercase">
                                        Berkas Pendukung
                                    </span>
                                    <h2
                                        id="documents-heading"
                                        className="mt-1 text-2xl font-black tracking-tight text-slate-900"
                                    >
                                        Dokumen yang Perlu Disiapkan
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                {detail.requiredDocuments.map((document) => (
                                    <article
                                        key={document.key}
                                        className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-2xs transition-all hover:border-emerald-300"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                                    <FileText className="size-4.5" />
                                                </div>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                                                        document.required
                                                            ? 'bg-rose-50 text-rose-800 border border-rose-200/80'
                                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                    }`}
                                                >
                                                    {document.required
                                                        ? 'Wajib'
                                                        : 'Opsional'}
                                                </span>
                                            </div>
                                            <h3 className="mt-3 font-bold text-slate-900 text-sm">
                                                {document.label}
                                            </h3>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                                {document.description}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Help Card */}
                    <aside className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs lg:sticky lg:top-28 space-y-6">
                        <div className="space-y-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/60">
                                Bantuan Layanan
                            </span>
                            <dl className="grid gap-4 text-xs">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                                    <dt className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                                        Petugas Penanggung Jawab
                                    </dt>
                                    <dd className="mt-1 font-bold text-slate-800 text-sm">
                                        {detail.serviceContact}
                                    </dd>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                                    <dt className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                                        Jam Pelayanan Kantor Desa
                                    </dt>
                                    <dd className="mt-1 font-bold text-slate-800 leading-snug">
                                        {detail.serviceHours}
                                    </dd>
                                </div>
                            </dl>

                            <a
                                href="#form-pengajuan"
                                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-800"
                            >
                                Ajukan Layanan Ini
                                <ArrowDown
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </a>
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900">
                            <div className="flex items-start gap-2.5">
                                <Info
                                    aria-hidden="true"
                                    className="mt-0.5 size-4 shrink-0 text-amber-700"
                                />
                                <span>Persyaratan ini merupakan direktori awal pelayanan publik Desa Ngampungan.</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* PROCESS STEPS SECTION */}
            <section
                aria-labelledby="service-process-heading"
                className="border-y border-slate-200/80 bg-white py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/60 uppercase tracking-wider">
                            Alur Pelayanan
                        </span>
                        <h2
                            id="service-process-heading"
                            className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
                        >
                            Dari Pengajuan Sampai Selesai
                        </h2>
                    </div>

                    <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {villageServiceProcessSteps.map((step, index) => (
                            <li
                                key={step.title}
                                className="relative rounded-3xl border border-slate-200/90 bg-slate-50/60 p-6 shadow-xs transition-all hover:border-emerald-300 hover:bg-white"
                            >
                                <span className="text-4xl font-black tracking-tighter text-emerald-600/25 font-mono">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <h3 className="mt-3 text-base font-bold text-slate-900">
                                    {step.title}
                                </h3>
                                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                                    {step.description}
                                </p>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50/60 p-5 text-xs leading-relaxed text-amber-900">
                        <div className="flex items-center gap-2 font-bold text-amber-950 mb-1">
                            <ShieldAlert className="size-4 text-amber-700" />
                            Catatan Penting Layanan:
                        </div>
                        <ul className="ml-6 list-disc space-y-1 text-amber-800">
                            {detail.notes.map((note) => (
                                <li key={note}>{note}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ONLINE APPLICATION FORM SECTION */}
            <section
                id="form-pengajuan"
                aria-labelledby="application-form-heading"
                className="scroll-mt-24 bg-slate-50/50 py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1080px] px-5 lg:px-12">
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-10 shadow-xs">
                        <div className="max-w-3xl">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/60">
                                Form Daring
                            </span>
                            <h2
                                id="application-form-heading"
                                className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
                            >
                                Form Pengajuan Layanan Publik
                            </h2>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                Lengkapi data pemohon dan unggah berkas persyaratan. Setelah mengajukan, Anda akan menerima kode pelacakan untuk memantau status berkas Anda.
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <VillageServiceApplicationForm
                                service={service}
                                detail={detail}
                                submissionSuccess={serviceApplicationSuccess}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <Link
                            href={servicesIndex({
                                query: { category: service.category },
                            })}
                            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4 text-emerald-700" />
                            Kembali ke Direktori {category.label}
                        </Link>
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
