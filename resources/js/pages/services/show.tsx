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
import { findVillageServiceCategory } from '@/pages/services/index';
import { home } from '@/routes';
import { index as servicesIndex } from '@/routes/services';

const villageServiceProcessSteps = [
    {
        title: 'Pengajuan Online',
        description:
            'Warga mengisi formulir pengajuan dan mengunggah dokumen persyaratan melalui sistem secara online.',
    },
    {
        title: 'Verifikasi Berkas',
        description:
            'Petugas desa memverifikasi kelengkapan dan keabsahan dokumen pengajuan.',
    },
    {
        title: 'Proses Penerbitan',
        description:
            'Pembuatan draf surat, penandatanganan oleh Kepala Desa, dan stempel resmi.',
    },
    {
        title: 'Pengambilan',
        description:
            'Warga mengambil berkas fisik di Balai Desa dengan membawa dokumen asli untuk pencocokan jika diperlukan.',
    },
];

type ServiceData = {
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    audience: string;
    channel: string;
    estimatedDuration: string;
    fee: string;
    serviceContact: string | null;
    serviceHours: string | null;
    notes: string[];
};

type DocumentRequirementData = {
    key: string;
    label: string;
    description: string;
    required: boolean;
    acceptedFormats: string;
};

type ServiceShowPageProps = {
    slug: string;
    service: ServiceData;
    requirements: string[];
    requiredDocuments: DocumentRequirementData[];
    canonicalUrl: string;
    serviceApplicationSuccess: ServiceApplicationSuccess | null;
};

export default function ServiceShow({
    slug,
    service,
    requirements,
    requiredDocuments,
    canonicalUrl,
    serviceApplicationSuccess,
}: ServiceShowPageProps) {
    if (!service) {
        return (
            <PublicPageShell activeSection="services">
                <Head title="Layanan Tidak Ditemukan" />
                <section className="bg-slate-50 py-20">
                    <div className="mx-auto max-w-2xl px-5 text-center lg:px-12">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl border border-amber-200 bg-amber-50 text-amber-600">
                            <AlertTriangle
                                aria-hidden="true"
                                className="size-8"
                            />
                        </div>
                        <h1 className="mt-5 text-2xl font-black text-slate-900">
                            Layanan tidak ditemukan
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Data layanan dengan alamat tersebut belum tersedia
                            pada sistem direktori Desa Ngampungan.
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
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold tracking-wider text-emerald-300 uppercase">
                            <Sparkles className="size-3 text-emerald-300" />
                            {category.label}
                        </span>
                        <h1 className="mt-4 text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
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

                    {/* Service Info Cards Grid (No Truncation Style) */}
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 lg:col-span-4">
                        <div className="flex flex-col justify-center rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg">
                            <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-emerald-800 uppercase">
                                <UsersRound className="size-3.5 shrink-0 text-emerald-600" />
                                Sasaran
                            </span>
                            <p className="mt-1 text-xs leading-snug font-bold break-words text-slate-900">
                                {service.audience}
                            </p>
                        </div>
                        <div className="flex flex-col justify-center rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg">
                            <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-emerald-800 uppercase">
                                <Headphones className="size-3.5 shrink-0 text-emerald-600" />
                                Kanal
                            </span>
                            <p className="mt-1 text-xs leading-snug font-bold break-words text-slate-900">
                                {service.channel}
                            </p>
                        </div>
                        <div className="flex flex-col justify-center rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg">
                            <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-emerald-800 uppercase">
                                <Clock3 className="size-3.5 shrink-0 text-emerald-600" />
                                Estimasi
                            </span>
                            <p className="mt-1 text-xs leading-snug font-bold break-words text-slate-900">
                                {service.estimatedDuration}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* UNIFIED REQUIREMENTS & DOCUMENTS SECTION (Combined 1 Single Card) */}
            <section
                aria-labelledby="requirements-documents-heading"
                className="bg-slate-50/50 py-10 md:py-14"
            >
                <div className="mx-auto max-w-[1080px] px-5 lg:px-12">
                    <div className="space-y-10 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-10">
                        {/* Main Header */}
                        <div className="border-b border-slate-100 pb-5">
                            <h2
                                id="requirements-documents-heading"
                                className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
                            >
                                Persyaratan & Berkas Pendukung
                            </h2>
                            <p className="mt-1.5 text-xs text-slate-600 sm:text-sm">
                                Pastikan seluruh kriteria dan dokumen fisik
                                maupun digital telah siap sebelum mengisi
                                formulir pengajuan.
                            </p>
                        </div>

                        {/* SUB-SECTION 1: Persyaratan Pemohon (Numbered Steps List) */}
                        <div>
                            <div className="mb-5 flex items-center gap-3.5">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/60 bg-emerald-50/80 p-2 shadow-2xs">
                                    <img
                                        src="/assets/dokumen.png"
                                        alt=""
                                        className="size-6 object-contain"
                                    />
                                </div>
                                <div>
                                    <h3
                                        id="requirements-heading"
                                        className="text-xl font-bold text-slate-900"
                                    >
                                        Persyaratan Pemohon
                                    </h3>
                                </div>
                            </div>

                            <ol className="grid gap-3.5 sm:grid-cols-2">
                                {requirements.map((requirement, index) => (
                                    <li
                                        key={requirement}
                                        className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/30"
                                    >
                                        <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-xs font-black text-white shadow-xs">
                                            {index + 1}
                                        </span>
                                        <span className="pt-0.5 text-xs leading-relaxed font-semibold text-slate-700">
                                            {requirement}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Visual Sub-Section Divider */}
                        <div className="my-6 border-t border-slate-100" />

                        {/* SUB-SECTION 2: Dokumen yang Disiapkan */}
                        <div>
                            <div className="mb-5 flex items-center gap-3.5">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/60 bg-emerald-50/80 p-2 shadow-2xs">
                                    <img
                                        src="/assets/dokumen.png"
                                        alt=""
                                        className="size-6 object-contain"
                                    />
                                </div>
                                <div>
                                    <h3
                                        id="documents-heading"
                                        className="text-xl font-bold text-slate-900"
                                    >
                                        Dokumen yang Perlu Disiapkan
                                    </h3>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {requiredDocuments.map((document) => (
                                    <article
                                        key={document.key}
                                        className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-2xs transition-all hover:border-emerald-300 hover:bg-white"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 p-1.5 text-emerald-700">
                                                    <img
                                                        src="/assets/dokumen.png"
                                                        alt=""
                                                        className="size-5 object-contain"
                                                    />
                                                </div>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase ${
                                                        document.required
                                                            ? 'border border-rose-200/80 bg-rose-50 text-rose-800'
                                                            : 'border border-slate-200 bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    {document.required
                                                        ? 'Wajib'
                                                        : 'Opsional'}
                                                </span>
                                            </div>
                                            <h4 className="mt-3 text-sm font-bold text-slate-900">
                                                {document.label}
                                            </h4>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                                {document.description}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        {/* Information Disclaimer Banner inside Card */}
                        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4.5 text-xs leading-relaxed text-amber-900">
                            <div className="flex items-start gap-2.5">
                                <Info
                                    aria-hidden="true"
                                    className="mt-0.5 size-4 shrink-0 text-amber-700"
                                />
                                <span>
                                    Persyaratan ini merupakan direktori awal
                                    pelayanan publik Desa Ngampungan.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ONLINE APPLICATION FORM SECTION (With Integrated Process Summary) */}
            <section
                id="form-pengajuan"
                aria-labelledby="application-form-heading"
                className="scroll-mt-24 border-t border-slate-200/80 bg-slate-50/50 py-10 md:py-14"
            >
                <div className="mx-auto max-w-[1080px] px-5 lg:px-12">
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs md:p-10">
                        <div className="max-w-3xl">
                            <h2
                                id="application-form-heading"
                                className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
                            >
                                Form Pengajuan Layanan Publik
                            </h2>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                Lengkapi data pemohon dan unggah berkas
                                persyaratan. Setelah mengajukan, Anda akan
                                menerima kode pelacakan untuk memantau status
                                berkas Anda.
                            </p>
                        </div>

                        {/* Integrated Process Summary Strip */}
                        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                            <span className="mb-2 block text-[10px] font-extrabold tracking-wider text-emerald-800 uppercase">
                                Ringkasan Alur Pelayanan Desa:
                            </span>
                            <div className="grid gap-2 text-xs sm:grid-cols-4">
                                {villageServiceProcessSteps.map(
                                    (step, index) => (
                                        <div
                                            key={step.title}
                                            className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs"
                                        >
                                            <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-[11px] font-bold text-white">
                                                {index + 1}
                                            </span>
                                            <span
                                                className="truncate text-[11px] font-bold text-slate-800"
                                                title={step.description}
                                            >
                                                {step.title}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <VillageServiceApplicationForm
                                service={service}
                                detail={{ requiredDocuments }}
                                submissionSuccess={serviceApplicationSuccess}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <Link
                            href={servicesIndex({
                                query: { category: service.category },
                            })}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
                        >
                            <ArrowLeft
                                aria-hidden="true"
                                className="size-4 text-emerald-700"
                            />
                            Kembali ke Direktori {category.label}
                        </Link>
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
