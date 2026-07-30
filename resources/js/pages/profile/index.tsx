import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    ChartBar,
    Check,
    Compass,
    Grid3X3,
    Home,
    Info,
    LandPlot,
    LocateFixed,
    MapPin,
    Milestone,
    Ruler,
    Users,
} from 'lucide-react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageAdministrativeMap } from '@/components/village-administrative-map';
import { VillageDemographicExplorer } from '@/components/village-demographic-explorer';
import {
    dummyAdministrativeBoundaries,
    dummyAdministrativeDivisions,
    dummyLandUseComposition,
} from '@/lib/dummy-village-profile';

type VillageProfilePageProps = {
    canonicalUrl: string;
};

const villageOfficialIdentity = [
    { label: 'Nama Desa', value: 'Ngampungan' },
    { label: 'Kode Kemendagri', value: '35.17.02.2007' },
    { label: 'Kecamatan', value: 'Bareng' },
    { label: 'Kabupaten', value: 'Jombang' },
    { label: 'Provinsi', value: 'Jawa Timur' },
    { label: 'Tipologi Wilayah', value: 'Agraris & Perkebunan' },
];

const villageCharacteristics = [
    {
        title: 'Kawasan Agraris Subur',
        description: 'Potensi pertanian padi, palawija, dan komoditas perkebunan lokal.',
        iconSrc: '/assets/agraris.png',
        alt: 'Ikon Kawasan Agraris',
    },
    {
        title: 'Topografi Pegunungan',
        description: 'Wilayah berada di kawasan kaki pegunungan dengan udara sejuk.',
        iconSrc: '/assets/topografi.png',
        alt: 'Ikon Topografi Pegunungan',
    },
    {
        title: 'Layanan Publik Digital',
        description: 'Kemudahan akses informasi dan administrasi berbasis teknologi.',
        iconSrc: '/assets/layanan.png',
        alt: 'Ikon Layanan Publik',
    },
];

const villageStatistics = [
    {
        label: 'Total Penduduk',
        value: '3.420',
        suffix: 'jiwa',
        icon: Users,
    },
    {
        label: 'Jumlah Keluarga',
        value: '1.120',
        suffix: 'KK',
        icon: Home,
    },
    {
        label: 'Wilayah Administratif',
        value: '4',
        suffix: 'dusun',
        icon: MapPin,
    },
    {
        label: 'Luas Wilayah',
        value: '450',
        suffix: 'hektare',
        icon: Ruler,
    },
];

const villageMissions = [
    {
        category: 'Pelayanan',
        text: 'Meningkatkan kualitas pelayanan publik yang mudah, ramah, dan transparan.',
    },
    {
        category: 'Ekonomi',
        text: 'Mendorong penguatan ekonomi warga melalui pertanian dan UMKM desa.',
    },
    {
        category: 'SDM',
        text: 'Mengembangkan sumber daya manusia yang sehat, terampil, dan berdaya saing.',
    },
    {
        category: 'Lingkungan',
        text: 'Menjaga lingkungan, budaya lokal, serta semangat gotong royong masyarakat.',
    },
    {
        category: 'Tata Kelola',
        text: 'Mewujudkan tata kelola pembangunan yang partisipatif dan dapat dipertanggungjawabkan.',
    },
];

const historyStages = [
    {
        stage: 'Masa Awal',
        title: 'Pembentukan komunitas desa',
        description:
            'Narasi asal-usul, tokoh perintis, dan pembentukan wilayah akan ditulis berdasarkan arsip serta keterangan warga yang telah diverifikasi.',
    },
    {
        stage: 'Perkembangan',
        title: 'Pertumbuhan pemerintahan dan pelayanan',
        description:
            'Bagian ini disiapkan untuk mencatat perkembangan pemerintahan, fasilitas umum, kegiatan ekonomi, dan kehidupan sosial masyarakat.',
    },
    {
        stage: 'Masa Kini',
        title: 'Transformasi layanan desa',
        description:
            'Desa Ngampungan mengembangkan akses informasi dan layanan digital agar warga lebih mudah memperoleh pelayanan publik.',
    },
];

const landUsePresentation = {
    agriculture: {
        barClassName: 'bg-village-primary',
        surfaceClassName: 'bg-village-primary-light',
    },
    settlement: {
        barClassName: 'bg-[#d89b2b]',
        surfaceClassName: 'bg-[#fff2cf]',
    },
    openSpace: {
        barClassName: 'bg-village-info',
        surfaceClassName: 'bg-[#e7f1fb]',
    },
    publicFacilities: {
        barClassName: 'bg-village-primary-dark',
        surfaceClassName: 'bg-village-surface-muted',
    },
} as const;

function formatNumber(value: number) {
    return new Intl.NumberFormat('id-ID').format(value);
}

const administrativeDivisionTotals = dummyAdministrativeDivisions.reduce(
    (totals, division) => ({
        rw: totals.rw + division.rw,
        rt: totals.rt + division.rt,
        households: totals.households + division.households,
    }),
    { rw: 0, rt: 0, households: 0 },
);

export default function VillageProfileIndex({
    canonicalUrl,
}: VillageProfilePageProps) {
    const pageDescription =
        'Profil Desa Ngampungan, Kecamatan Bareng, Kabupaten Jombang yang memuat selayang pandang, visi dan misi, sejarah, serta data wilayah terpadu.';

    return (
        <PublicPageShell activeSection="profile">
            <Head>
                <title>Profil Desa Ngampungan</title>
                <meta
                    head-key="description"
                    name="description"
                    content={pageDescription}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content="Profil Desa Ngampungan"
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={pageDescription}
                />
                <meta head-key="og:type" property="og:type" content="website" />
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

            {/* Clean Modern Hero Header */}
            <section className="bg-village-primary-dark text-white">
                <div className="mx-auto max-w-[1280px] px-5 py-12 md:py-16 lg:px-12">
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                        <div className="max-w-3xl lg:col-span-8">
                            <p className="text-xs font-bold tracking-widest text-village-accent uppercase">
                                Informasi Umum Desa
                            </p>
                            <h1 className="mt-3 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                                Profil Desa Ngampungan
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                                Mengenal identitas, arah pembangunan,
                                perjalanan, serta data wilayah Desa Ngampungan
                                dalam satu halaman informasi terpadu.
                            </p>
                        </div>

                        <dl className="grid grid-cols-2 border-l-2 border-village-accent/80 pl-6 lg:col-span-4">
                            <div className="pr-4">
                                <dt className="text-xs font-bold tracking-[0.14em] text-white/60 uppercase">
                                    Kecamatan
                                </dt>
                                <dd className="mt-1 text-2xl font-extrabold text-white">
                                    Bareng
                                </dd>
                            </div>
                            <div className="border-l border-white/15 pl-4">
                                <dt className="text-xs font-bold tracking-[0.14em] text-white/60 uppercase">
                                    Kabupaten
                                </dt>
                                <dd className="mt-1 text-2xl font-extrabold text-white">
                                    Jombang
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* Section 1: Redesigned Selayang Pandang */}
            <section
                id="selayang-pandang"
                aria-labelledby="selayang-pandang-heading"
                className="scroll-mt-24 bg-village-canvas py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
                        {/* Left Column: Heading & Enhanced Identity Card */}
                        <div className="lg:col-span-5">
                            <h2
                                id="selayang-pandang-heading"
                                className="text-3xl font-bold tracking-tight text-village-ink md:text-4xl"
                            >
                                Selayang Pandang
                            </h2>
                            <p className="mt-3 text-base leading-7 text-village-muted">
                                Gambaran umum, posisi geografis, serta identitas administrasi resmi Desa Ngampungan.
                            </p>

                            {/* Official Identity Card Box with Hover Animation & Asset Icon */}
                            <div className="group relative mt-8 overflow-hidden rounded-3xl border border-village-border/80 bg-white p-7 shadow-md transition-all duration-300 hover:border-village-primary/40 hover:shadow-xl">
                                <div
                                    aria-hidden="true"
                                    className="absolute -top-12 -right-12 size-36 rounded-full bg-village-primary-light/40 blur-2xl transition-transform duration-500 group-hover:scale-150"
                                />

                                <div className="relative flex items-center gap-3 border-b border-village-border pb-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-village-surface-muted p-1.5 shadow-2xs transition-transform group-hover:scale-105">
                                        <img
                                            src="/assets/logo_kabupaten_jombang.png"
                                            alt="Logo Kabupaten Jombang"
                                            className="size-7 object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-village-primary">
                                            Identitas Administrasi
                                        </h3>
                                        <p className="text-sm font-extrabold text-village-ink">
                                            Desa Ngampungan
                                        </p>
                                    </div>
                                </div>

                                <dl className="relative mt-4 divide-y divide-village-border/60 text-xs sm:text-sm">
                                    {villageOfficialIdentity.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between rounded-xl px-2 py-2.5 transition-colors hover:bg-village-primary-light/40"
                                        >
                                            <dt className="font-semibold text-village-muted">
                                                {item.label}
                                            </dt>
                                            <dd className="font-bold text-village-ink">
                                                {item.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>

                        {/* Right Column: Clean Text Narrative Card & Interactive Characteristics */}
                        <div className="space-y-6 lg:col-span-7">
                            {/* Main Narrative Card (Clean Text Only) */}
                            <article className="group relative overflow-hidden rounded-3xl border border-village-border/80 bg-white p-7 shadow-md transition-all duration-300 hover:border-village-primary/30 hover:shadow-xl sm:p-9">
                                <div
                                    aria-hidden="true"
                                    className="absolute top-0 right-0 size-32 translate-x-8 -translate-y-8 rounded-full bg-village-primary-light/30 blur-xl"
                                />
                                <h3 className="relative text-xl font-extrabold text-village-ink transition-colors group-hover:text-village-primary">
                                    Mengenal Desa Ngampungan
                                </h3>
                                <p className="relative mt-4 text-base leading-8 text-village-muted">
                                    Desa Ngampungan terletak di Kecamatan Bareng, Kabupaten Jombang, Jawa Timur. Kawasan ini dikenal dengan bentang alamnya yang asri, potensi pertanian yang subur, serta semangat gotong royong masyarakatnya yang masih terjaga dengan erat.
                                </p>
                                <p className="relative mt-4 text-base leading-8 text-village-muted">
                                    Sebagai bagian penting dari wilayah Kecamatan Bareng, Pemerintah Desa Ngampungan berkomitmen untuk terus mendorong kemajuan desa melalui tata kelola yang transparan, pelayanan publik yang responsif, serta pemanfaatan teknologi digital untuk kesejahteraan warga.
                                </p>
                            </article>

                            {/* 3 Characteristic Cards with Asset Icons & Micro-Animations */}
                            <div className="grid gap-4 sm:grid-cols-3">
                                {villageCharacteristics.map((item) => (
                                    <article
                                        key={item.title}
                                        className="group relative overflow-hidden rounded-2xl border border-village-border/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-village-primary/50 hover:bg-gradient-to-b hover:from-white hover:to-village-primary-light/30 hover:shadow-lg"
                                    >
                                        <div className="flex size-14 items-center justify-center rounded-2xl bg-village-primary-light/80 p-3 shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:bg-village-primary group-hover:shadow-md">
                                            <img
                                                src={item.iconSrc}
                                                alt={item.alt}
                                                className="size-8 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                                            />
                                        </div>
                                        <h4 className="mt-5 text-sm font-extrabold text-village-ink transition-colors group-hover:text-village-primary-dark">
                                            {item.title}
                                        </h4>
                                        <p className="mt-2 text-xs leading-5 text-village-muted">
                                            {item.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Redesigned Visi dan Misi using Card Showcase Reference Pattern */}
            <section
                id="visi-misi"
                aria-labelledby="visi-misi-heading"
                className="scroll-mt-24 border-t border-village-border bg-white py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="max-w-2xl mb-10">
                        <h2
                            id="visi-misi-heading"
                            className="text-3xl font-bold tracking-tight text-village-ink md:text-4xl"
                        >
                            Visi & Misi Pembangunan
                        </h2>
                        <p className="mt-3 text-base leading-7 text-village-muted">
                            Arah kebijakan strategis dan komitmen Pemerintah Desa Ngampungan dalam mewujudkan kesejahteraan warga.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
                        {/* Variant B: Dark Glassmorphic Card (Visi Utama) */}
                        <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-village-primary-dark p-7 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_32px_rgba(26,77,46,0.45)] sm:p-9 lg:col-span-5">
                            <div className="relative">
                                {/* Header Badge */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-extrabold uppercase tracking-widest text-village-accent">
                                        Visi Utama Desa
                                    </span>
                                </div>

                                <h3 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
                                    Rencana Strategis
                                </h3>

                                <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                                    <p className="text-base leading-8 font-semibold italic text-white/95 sm:text-lg">
                                        “Terwujudnya Desa Ngampungan yang maju,
                                        mandiri, sejahtera, dan berkarakter melalui
                                        pelayanan publik yang transparan.”
                                    </p>
                                </div>
                            </div>

                            {/* Reference-Inspired Stats Bar (Tabular Figures & Dividers) */}
                            <div className="relative mt-8">
                                <div className="grid grid-cols-3 divide-x divide-white/20 rounded-2xl border border-white/15 bg-white/5 py-4 text-center backdrop-blur-xs">
                                    <div className="px-2">
                                        <div className="text-sm font-extrabold text-white tabular-nums">
                                            4 Pilar
                                        </div>
                                        <div className="mt-0.5 text-[11px] font-medium text-white/70">
                                            Pembangunan
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <div className="text-sm font-extrabold text-[#ffd700] tabular-nums">
                                            2026–2031
                                        </div>
                                        <div className="mt-0.5 text-[11px] font-medium text-white/70">
                                            Periode RPJMDes
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <div className="text-sm font-extrabold text-white tabular-nums">
                                            100%
                                        </div>
                                        <div className="mt-0.5 text-[11px] font-medium text-white/70">
                                            Komitmen Publik
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Variant A: Light Surface Card (5 Misi Pembangunan) */}
                        <article className="group flex flex-col justify-between rounded-3xl border border-village-border bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-village-primary/30 hover:shadow-xl sm:p-9 lg:col-span-7">
                            <div>
                                <div className="border-b border-village-border pb-4">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-village-primary">
                                        5 Misi Pembangunan
                                    </span>
                                    <h3 className="mt-1 text-2xl font-extrabold text-village-ink">
                                        Langkah Konkret Pelaksanaan
                                    </h3>
                                </div>

                                <ol className="mt-4 space-y-1">
                                    {villageMissions.map((item, index) => (
                                        <li
                                            key={item.category}
                                            className="group/item flex items-start gap-4 rounded-2xl p-3.5 transition-all duration-200 hover:bg-village-primary-light/60 hover:shadow-2xs"
                                        >
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-village-primary-light text-xs font-extrabold text-village-primary transition-all duration-200 group-hover/item:bg-village-primary group-hover/item:text-white group-hover/item:shadow-xs">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div>
                                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-village-primary/80 transition-colors group-hover/item:text-village-primary">
                                                    Pilar {item.category}
                                                </span>
                                                <p className="mt-0.5 text-sm leading-6 font-semibold text-village-ink transition-colors group-hover/item:text-village-primary-dark">
                                                    {item.text}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Reference-Inspired Light Stats Bar */}
                            <div className="mt-6 border-t border-village-border pt-5">
                                <div className="flex items-center justify-between gap-3 text-xs text-village-muted">
                                    <span className="font-semibold">
                                        Status Implementasi: <strong className="text-village-ink font-bold">Rencana Strategis Desa</strong>
                                    </span>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* Section 3: Sejarah Desa */}
            <section
                id="sejarah-desa"
                aria-labelledby="sejarah-desa-heading"
                className="scroll-mt-24 border-t border-village-border bg-village-surface-muted py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="max-w-2xl">
                        <h2
                            id="sejarah-desa-heading"
                            className="text-3xl font-bold tracking-tight text-village-ink md:text-4xl"
                        >
                            Sejarah Desa
                        </h2>
                        <p className="mt-4 leading-7 text-village-muted">
                            Struktur cerita sejarah telah disiapkan tanpa
                            mengarang tahun atau peristiwa yang belum
                            diverifikasi.
                        </p>
                    </div>

                    <div className="relative mt-10 grid gap-6 md:grid-cols-3">
                        <div
                            aria-hidden="true"
                            className="absolute top-6 right-[16.5%] left-[16.5%] hidden h-0.5 bg-village-border md:block"
                        />
                        {historyStages.map((item, index) => (
                            <article
                                key={item.stage}
                                className="relative rounded-2xl border border-village-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-village-soft"
                            >
                                <span className="relative z-10 flex size-12 items-center justify-center rounded-full border-4 border-village-surface-muted bg-village-primary text-white shadow-sm">
                                    {index === historyStages.length - 1 ? (
                                        <Milestone
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    ) : (
                                        <span className="text-sm font-bold">
                                            {index + 1}
                                        </span>
                                    )}
                                </span>
                                <p className="mt-6 text-xs font-bold tracking-[0.15em] text-village-primary uppercase">
                                    {item.stage}
                                </p>
                                <h3 className="mt-2 text-xl font-bold text-village-ink">
                                    {item.title}
                                </h3>
                                <p className="mt-3 leading-7 text-village-muted">
                                    {item.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: Unified Data Wilayah Super-Section */}
            <section
                id="data-wilayah"
                aria-labelledby="data-wilayah-heading"
                className="scroll-mt-24 border-t border-village-border bg-village-canvas py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    {/* Header Section Data Wilayah */}
                    <div className="flex flex-col justify-between gap-5 border-b border-village-border pb-8 md:flex-row md:items-end">
                        <div className="max-w-3xl">
                            <h2
                                id="data-wilayah-heading"
                                className="text-3xl font-bold tracking-tight text-village-ink md:text-5xl"
                            >
                                Fitur Data Wilayah
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-village-muted md:text-lg">
                                Informasi terpadu mengenai data demografi, pembagian wilayah dusun, penggunaan lahan, dan peta administratif Desa Ngampungan.
                            </p>
                        </div>
                    </div>

                    {/* Sub-navigation Quick-Jump Links inside Data Wilayah */}
                    <div className="mt-6 flex flex-wrap gap-2.5">
                        <a
                            href="#data-wilayah"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-village-border bg-white px-3.5 py-2 text-xs font-bold text-village-ink transition hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary"
                        >
                            <ChartBar className="size-3.5 text-village-primary" />
                            Ringkasan & Batas
                        </a>
                        <a
                            href="#pembagian-wilayah"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-village-border bg-white px-3.5 py-2 text-xs font-bold text-village-ink transition hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary"
                        >
                            <Grid3X3 className="size-3.5 text-village-primary" />
                            Pembagian Dusun
                        </a>
                        <a
                            href="#penggunaan-lahan"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-village-border bg-white px-3.5 py-2 text-xs font-bold text-village-ink transition hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary"
                        >
                            <LandPlot className="size-3.5 text-village-primary" />
                            Penggunaan Lahan
                        </a>
                        <a
                            href="#peta-administratif"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-village-border bg-white px-3.5 py-2 text-xs font-bold text-village-ink transition hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary"
                        >
                            <LocateFixed className="size-3.5 text-village-primary" />
                            Peta Administratif
                        </a>
                        <a
                            href="#demografi"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-village-border bg-white px-3.5 py-2 text-xs font-bold text-village-ink transition hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary"
                        >
                            <Users className="size-3.5 text-village-primary" />
                            Demografi Penduduk
                        </a>
                    </div>

                    {/* Sub-block 1: Ringkasan Statistics & Batas Administratif */}
                    <div className="mt-10">
                        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {villageStatistics.map((statistic) => (
                                <div
                                    key={statistic.label}
                                    className="rounded-2xl border border-village-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-village-primary/40 hover:shadow-village-soft"
                                >
                                    <statistic.icon
                                        aria-hidden="true"
                                        className="size-6 text-village-primary"
                                    />
                                    <dt className="mt-6 text-sm font-bold text-village-muted">
                                        {statistic.label}
                                    </dt>
                                    <dd className="mt-2 text-3xl font-bold tracking-tight text-village-ink">
                                        {statistic.value}{' '}
                                        <span className="text-sm font-semibold text-village-muted">
                                            {statistic.suffix}
                                        </span>
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-6 grid gap-6 lg:grid-cols-12">
                            <article className="rounded-2xl border border-village-border bg-white p-6 shadow-sm lg:col-span-7 lg:p-8">
                                <div className="flex items-center gap-3">
                                    <MapPin
                                        aria-hidden="true"
                                        className="size-5 text-village-primary"
                                    />
                                    <h3 className="text-xl font-bold text-village-ink">
                                        Batas Administratif
                                    </h3>
                                </div>
                                <dl className="mt-6 grid sm:grid-cols-2">
                                    {dummyAdministrativeBoundaries.map(
                                        (boundary) => (
                                            <div
                                                key={boundary.direction}
                                                className="border-t border-village-border py-4 sm:odd:pr-5 sm:even:pl-5"
                                            >
                                                <dt className="text-xs font-bold tracking-[0.14em] text-village-primary uppercase">
                                                    {boundary.direction}
                                                </dt>
                                                <dd className="mt-2 text-sm leading-6 text-village-muted">
                                                    {boundary.value}
                                                </dd>
                                            </div>
                                        ),
                                    )}
                                </dl>
                            </article>

                            <aside className="flex flex-col justify-between rounded-2xl bg-village-primary-light p-6 lg:col-span-5 lg:p-8">
                                <div>
                                    <span className="flex size-11 items-center justify-center rounded-full bg-white text-village-primary shadow-xs">
                                        <Check
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>
                                    <h3 className="mt-6 text-xl font-bold text-village-primary-dark">
                                        Status Data Wilayah
                                    </h3>
                                    <p className="mt-3 leading-7 text-village-primary-dark/70">
                                        Angka dan batas wilayah pada halaman ini
                                        belum menjadi data publik resmi. Struktur
                                        tampilannya siap menerima data terverifikasi
                                        dari backend pada tahap CMS.
                                    </p>
                                </div>
                                <a
                                    href="#selayang-pandang"
                                    className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 font-bold text-village-primary-dark transition hover:text-village-primary focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                                >
                                    Kembali ke awal profil
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4 -rotate-90"
                                    />
                                </a>
                            </aside>
                        </div>
                    </div>

                    {/* Sub-block 2: Pembagian Wilayah (Dusun, RW, RT) */}
                    <div
                        id="pembagian-wilayah"
                        className="scroll-mt-24 mt-16 border-t border-village-border/60 pt-14"
                    >
                        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                            <div className="max-w-2xl lg:col-span-7">
                                <h3
                                    id="pembagian-wilayah-heading"
                                    className="text-2xl font-bold tracking-tight text-village-ink md:text-3xl"
                                >
                                    Pembagian Dusun, RW, dan RT
                                </h3>
                                <p className="mt-3 leading-7 text-village-muted">
                                    Susunan data wilayah terkecil agar warga
                                    dapat memahami pembagian administrasi desa
                                    secara ringkas.
                                </p>
                            </div>

                            <dl className="grid grid-cols-3 divide-x divide-village-border rounded-xl border border-village-border bg-white lg:col-span-5">
                                <div className="py-4 text-center">
                                    <dt className="text-xs font-bold tracking-[0.12em] text-village-muted uppercase">
                                        Dusun
                                    </dt>
                                    <dd className="mt-2 text-2xl font-bold text-village-primary">
                                        {dummyAdministrativeDivisions.length}
                                    </dd>
                                </div>
                                <div className="py-4 text-center">
                                    <dt className="text-xs font-bold tracking-[0.12em] text-village-muted uppercase">
                                        RW
                                    </dt>
                                    <dd className="mt-2 text-2xl font-bold text-village-primary">
                                        {administrativeDivisionTotals.rw}
                                    </dd>
                                </div>
                                <div className="py-4 text-center">
                                    <dt className="text-xs font-bold tracking-[0.12em] text-village-muted uppercase">
                                        RT
                                    </dt>
                                    <dd className="mt-2 text-2xl font-bold text-village-primary">
                                        {administrativeDivisionTotals.rt}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {dummyAdministrativeDivisions.map((division, index) => (
                                <article
                                    key={division.code}
                                    className="group relative overflow-hidden rounded-2xl border border-village-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-village-primary/40 hover:shadow-village-soft"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="absolute top-0 right-0 text-7xl font-bold leading-none text-village-primary/[0.055]"
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <p className="relative text-xs font-bold tracking-[0.15em] text-village-primary uppercase">
                                        {division.code}
                                    </p>
                                    <h4 className="relative mt-3 text-xl font-bold text-village-ink">
                                        {division.name}
                                    </h4>
                                    <p className="relative mt-2 text-sm leading-6 text-village-muted">
                                        {division.note}
                                    </p>

                                    <dl className="relative mt-8 grid grid-cols-3 border-t border-village-border pt-5">
                                        <div>
                                            <dt className="text-xs text-village-muted">
                                                RW
                                            </dt>
                                            <dd className="mt-1 font-bold text-village-ink">
                                                {division.rw}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-village-muted">
                                                RT
                                            </dt>
                                            <dd className="mt-1 font-bold text-village-ink">
                                                {division.rt}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-village-muted">
                                                KK
                                            </dt>
                                            <dd className="mt-1 font-bold text-village-ink">
                                                {formatNumber(division.households)}
                                            </dd>
                                        </div>
                                    </dl>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Sub-block 3: Penggunaan Lahan */}
                    <div
                        id="penggunaan-lahan"
                        className="scroll-mt-24 mt-16 border-t border-village-border/60 pt-14"
                    >
                        <div className="grid gap-8 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <h3
                                    id="penggunaan-lahan-heading"
                                    className="text-2xl font-bold tracking-tight text-village-ink md:text-3xl"
                                >
                                    Penggunaan Lahan
                                </h3>
                                <p className="mt-3 leading-7 text-village-muted">
                                    Visualisasi pemanfaatan luas wilayah untuk
                                    pertanian, permukiman, ruang terbuka, dan
                                    fasilitas umum.
                                </p>

                                <dl className="mt-8 border-l-2 border-village-primary pl-5">
                                    <dt className="text-xs font-bold tracking-[0.14em] text-village-muted uppercase">
                                        Luas Basis Simulasi
                                    </dt>
                                    <dd className="mt-2 text-4xl font-bold tracking-tight text-village-ink">
                                        450
                                        <span className="ml-2 text-sm font-semibold text-village-muted">
                                            hektare
                                        </span>
                                    </dd>
                                </dl>
                            </div>

                            <div className="rounded-2xl border border-village-border bg-white p-6 shadow-village-soft sm:p-8 lg:col-span-8">
                                <div
                                    role="img"
                                    aria-label="Komposisi penggunaan lahan simulasi: pertanian 52 persen, permukiman 28 persen, ruang terbuka 12 persen, dan fasilitas umum 8 persen"
                                    className="flex h-6 overflow-hidden rounded-full"
                                >
                                    {dummyLandUseComposition.map((landUse) => (
                                        <span
                                            key={landUse.key}
                                            aria-hidden="true"
                                            className={
                                                landUsePresentation[landUse.key]
                                                    .barClassName
                                            }
                                            style={{
                                                width: `${landUse.percentage}%`,
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    {dummyLandUseComposition.map((landUse) => {
                                        const presentation =
                                            landUsePresentation[landUse.key];

                                        return (
                                            <article
                                                key={landUse.key}
                                                className={`${presentation.surfaceClassName} rounded-xl p-5`}
                                            >
                                                <div className="flex items-start justify-between gap-5">
                                                    <div>
                                                        <h4 className="font-bold text-village-ink">
                                                            {landUse.label}
                                                        </h4>
                                                        <p className="mt-2 text-sm text-village-muted">
                                                            {formatNumber(
                                                                landUse.hectares,
                                                            )}{' '}
                                                            hektare
                                                        </p>
                                                    </div>
                                                    <span className="text-2xl font-bold text-village-primary-dark">
                                                        {landUse.percentage}%
                                                    </span>
                                                </div>
                                                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/80">
                                                    <span
                                                        aria-hidden="true"
                                                        className={`block h-full ${presentation.barClassName}`}
                                                        style={{
                                                            width: `${landUse.percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sub-block 4: Peta Administratif Desa */}
                    <div
                        id="peta-administratif"
                        className="scroll-mt-24 mt-16 border-t border-village-border/60 pt-14"
                    >
                        <div className="max-w-3xl">
                            <h3
                                id="peta-administratif-heading"
                                className="text-2xl font-bold tracking-tight text-village-ink md:text-3xl"
                            >
                                Peta Administratif Desa
                            </h3>
                            <p className="mt-3 leading-7 text-village-muted">
                                Peta skematik untuk menunjukkan pola penyajian batas
                                desa dan pembagian dusun sebelum data geospasial
                                resmi tersedia.
                            </p>
                        </div>

                        <div className="mt-8">
                            <VillageAdministrativeMap />
                        </div>
                    </div>

                    {/* Sub-block 5: Demografi Terperinci */}
                    <div
                        id="demografi"
                        className="scroll-mt-24 mt-16 border-t border-village-border/60 pt-14"
                    >
                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                            <div className="max-w-3xl">
                                <h3
                                    id="demografi-heading"
                                    className="text-2xl font-bold tracking-tight text-village-ink md:text-3xl"
                                >
                                    Demografi Penduduk Terperinci
                                </h3>
                                <p className="mt-3 leading-7 text-village-muted">
                                    Pilih kategori untuk melihat komposisi penduduk
                                    berdasarkan jenis kelamin, usia, pendidikan,
                                    pekerjaan, agama, atau status kependudukan.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <VillageDemographicExplorer />
                        </div>
                    </div>

                    {/* Global Simulation Disclaimer */}
                    <div className="mt-10 flex items-start gap-3 rounded-xl border border-[#efdcae] bg-[#fff8ea] p-4 text-sm leading-6 text-[#755018]">
                        <Info
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                        <p>
                            <strong>Konten simulasi frontend.</strong> Seluruh
                            identitas, pembagian wilayah, penggunaan lahan,
                            peta, dan demografi akan diperbarui secara otomatis setelah data resmi
                            Pemerintah Desa Ngampungan diverifikasi.
                        </p>
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
