import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    Info,
    LandPlot,
    LocateFixed,
    MapPin,
} from 'lucide-react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageAdministrativeMap } from '@/components/village-administrative-map';
import { VillageDemographicExplorer } from '@/components/village-demographic-explorer';

type HamletData = {
    code: string;
    name: string;
    rw: number;
    rt: number;
    households: number;
    note: string;
};

type LandUseData = {
    key: string;
    label: string;
    hectares: number;
    percentage: number;
};

type VillageProfileData = {
    id: number;
    total_population: number | null;
    total_families: number | null;
    total_hamlets: number | null;
    total_area_hectares: number | null;
    boundary_north: string | null;
    boundary_east: string | null;
    boundary_south: string | null;
    boundary_west: string | null;
    hamlets: HamletData[] | null;
    land_use: LandUseData[] | null;
};

type VillageProfilePageProps = {
    canonicalUrl: string;
    villageProfile: VillageProfileData | null;
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
        title: 'Asal-Usul & Perintisan Pemukiman',
        description:
            'Awal mula pembentukan wilayah desa oleh tokoh perintis lokal, meletakkan fondasi kebudayaan, nilai sosial, dan semangat gotong royong warga.',
        era: 'Masa Babat Desa',
    },
    {
        title: 'Perkembangan Agraris & Dusun',
        description:
            'Pengembangan wilayah pertanian subur dan pembentukan dusun-dusun sebagai basis kehidupan kemasyarakatan yang asri.',
        era: 'Pertanian & Pemukiman',
    },
    {
        title: 'Formasi Pemerintahan Formal',
        description:
            'Pencatatan dan penetapan struktur kepemimpinan desa resmi di bawah Kecamatan Bareng, Kabupaten Jombang.',
        era: 'Pemerintahan Resmi',
    },
    {
        title: 'Modernisasi Infrastruktur Publik',
        description:
            'Pembangunan jalan, sarana irigasi pertanian, fasilitas kesehatan, dan balai desa untuk mendukung kemajuan warga.',
        era: 'Pembangunan Prasarana',
    },
    {
        title: 'Transformasi Pelayanan Digital',
        description:
            'Inovasi tata kelola berbasis teknologi informasi dan transparansi publik untuk mewujudkan Desa Ngampungan yang mandiri dan berdaya saing.',
        era: 'Era Digital & Masa Depan',
    },
];

const landUsePresentation: Record<string, { barClassName: string; surfaceClassName: string }> = {
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
};

function formatNumber(value: number) {
    return new Intl.NumberFormat('id-ID').format(value);
}

export default function VillageProfileIndex({
    canonicalUrl,
    villageProfile,
}: VillageProfilePageProps) {
    const pageDescription =
        'Profil Desa Ngampungan, Kecamatan Bareng, Kabupaten Jombang yang memuat selayang pandang, visi dan misi, sejarah, serta data wilayah terpadu.';

    const profile = villageProfile;

    const statistics = [
        {
            label: 'Total Penduduk',
            value: profile?.total_population,
            suffix: 'jiwa',
            iconSrc: '/assets/penduduk.png',
        },
        {
            label: 'Jumlah Keluarga',
            value: profile?.total_families,
            suffix: 'KK',
            iconSrc: '/assets/keluarga.png',
        },
        {
            label: 'Wilayah Administratif',
            value: profile?.total_hamlets,
            suffix: 'dusun',
            iconSrc: '/assets/wilayah administratif.png',
        },
        {
            label: 'Luas Wilayah',
            value: profile?.total_area_hectares,
            suffix: 'hektare',
            iconSrc: '/assets/luas wilayah.png',
        },
    ];

    const boundaries = [
        { direction: 'Utara', value: profile?.boundary_north },
        { direction: 'Timur', value: profile?.boundary_east },
        { direction: 'Selatan', value: profile?.boundary_south },
        { direction: 'Barat', value: profile?.boundary_west },
    ];

    const hamlets = profile?.hamlets ?? [];
    const landUse = profile?.land_use ?? [];

    const hamletTotals = hamlets.reduce(
        (totals, h) => ({
            rw: totals.rw + h.rw,
            rt: totals.rt + h.rt,
            households: totals.households + h.households,
        }),
        { rw: 0, rt: 0, households: 0 },
    );

    const totalLandHectares = landUse.reduce((sum, l) => sum + l.hectares, 0);

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

            {/* Section 3: Redesigned Sejarah Desa with Animative Vertical Sinuous Timeline (5 Stages) */}
            <section
                id="sejarah-desa"
                aria-labelledby="sejarah-desa-heading"
                className="group/section relative scroll-mt-24 overflow-hidden border-t border-village-border bg-gradient-to-b from-white via-village-surface-muted/60 to-village-canvas py-16 md:py-24"
            >
                {/* Background Ambient Glow Orbs */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-[28rem] size-80 rounded-full bg-village-primary-light/40 blur-3xl transition-all duration-700 group-hover/section:scale-110"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-1/4 right-1/2 translate-x-[28rem] size-96 rounded-full bg-village-accent/15 blur-3xl transition-all duration-700 group-hover/section:scale-110"
                />

                <div className="relative mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2
                            id="sejarah-desa-heading"
                            className="text-3xl font-bold tracking-tight text-village-ink sm:text-4xl md:text-5xl"
                        >
                            Sejarah Perjalanan Desa
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-village-muted">
                            Alur perkembangan Desa Ngampungan dari masa awal perintisan pemukiman hingga era transformasi pelayanan publik modern.
                        </p>
                    </div>

                    {/* Vertical Timeline Container */}
                    <div className="relative mt-16 mx-auto max-w-4xl">
                        {/* Desktop: Clean Centered Vertical Line */}
                        <div
                            aria-hidden="true"
                            className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-village-primary/60 via-village-primary/30 to-village-accent/40 md:block"
                        />

                        {/* Mobile: Clean Left-Side Vertical Line */}
                        <div
                            aria-hidden="true"
                            className="absolute top-0 bottom-0 left-[1.375rem] w-px bg-gradient-to-b from-village-primary/50 via-village-primary/25 to-village-accent/30 md:hidden"
                        />

                        {/* 5 Timeline Stages */}
                        <div className="space-y-10 md:space-y-16">
                            {historyStages.map((item, index) => {
                                const isEven = index % 2 === 0;

                                return (
                                    <div
                                        key={item.title}
                                        className={`group relative flex items-start md:items-center ${
                                            isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                    >
                                        {/* Numbered Node Dot */}
                                        <div className="absolute left-[1.375rem] md:left-1/2 z-20 -translate-x-1/2 flex size-11 items-center justify-center rounded-full border-[3px] border-white bg-village-primary text-sm font-extrabold text-white shadow-md ring-[3px] ring-village-primary/15 transition-all duration-400 group-hover:scale-110 group-hover:bg-village-primary-dark group-hover:ring-village-primary/30 group-hover:shadow-lg">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>

                                        {/* Content Card */}
                                        <div className="w-full pl-14 md:pl-0 md:w-[calc(50%-2.5rem)]">
                                            <article
                                                className={`group/card rounded-2xl border border-village-border/80 bg-white p-6 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:border-village-primary/40 hover:shadow-xl sm:p-7 ${
                                                    isEven ? 'md:mr-auto' : 'md:ml-auto'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="rounded-md border border-village-border/60 bg-village-surface-muted px-2.5 py-1 text-[11px] font-bold text-village-muted transition-colors group-hover/card:border-village-primary/30 group-hover/card:text-village-ink">
                                                        {item.era}
                                                    </span>
                                                </div>

                                                <h3 className="mt-3 text-lg font-extrabold text-village-ink transition-colors group-hover/card:text-village-primary-dark">
                                                    {item.title}
                                                </h3>

                                                <p className="mt-2.5 text-sm leading-7 text-village-muted">
                                                    {item.description}
                                                </p>
                                            </article>
                                        </div>

                                        {/* Spacer for desktop grid symmetry */}
                                        <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Dynamic Data Wilayah Super-Section */}
            <section
                id="data-wilayah"
                aria-labelledby="data-wilayah-heading"
                className="scroll-mt-24 border-t border-village-border/80 bg-gradient-to-b from-village-canvas via-white to-village-surface-muted/40 py-16 md:py-24"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    {/* Header Section Data Wilayah */}
                    <div className="flex flex-col justify-between gap-6 border-b border-village-border/60 pb-8 md:flex-row md:items-end">
                        <div className="max-w-3xl">
                            <h2
                                id="data-wilayah-heading"
                                className="text-3xl font-extrabold tracking-tight text-village-ink sm:text-4xl md:text-5xl"
                            >
                                Data Wilayah
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-village-muted sm:text-lg">
                                Informasi terpadu demografi, batas administratif, pembagian dusun, penggunaan lahan, dan peta geospasial Desa Ngampungan.
                            </p>
                        </div>
                    </div>

                    {/* Navigation Filter Tabs */}
                    <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
                        <a
                            href="#data-wilayah"
                            className="inline-flex items-center rounded-xl border border-village-border bg-white px-4 py-2.5 text-xs font-extrabold text-village-ink shadow-xs transition-all duration-300 hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary hover:shadow-md"
                        >
                            Ringkasan & Batas
                        </a>
                        <a
                            href="#pembagian-wilayah"
                            className="inline-flex items-center rounded-xl border border-village-border bg-white px-4 py-2.5 text-xs font-extrabold text-village-ink shadow-xs transition-all duration-300 hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary hover:shadow-md"
                        >
                            Pembagian Dusun
                        </a>
                        <a
                            href="#penggunaan-lahan"
                            className="inline-flex items-center rounded-xl border border-village-border bg-white px-4 py-2.5 text-xs font-extrabold text-village-ink shadow-xs transition-all duration-300 hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary hover:shadow-md"
                        >
                            Penggunaan Lahan
                        </a>
                        <a
                            href="#peta-administratif"
                            className="inline-flex items-center rounded-xl border border-village-border bg-white px-4 py-2.5 text-xs font-extrabold text-village-ink shadow-xs transition-all duration-300 hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary hover:shadow-md"
                        >
                            Peta Administratif
                        </a>
                        <a
                            href="#demografi"
                            className="inline-flex items-center rounded-xl border border-village-border bg-white px-4 py-2.5 text-xs font-extrabold text-village-ink shadow-xs transition-all duration-300 hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary hover:shadow-md"
                        >
                            Demografi Penduduk
                        </a>
                    </div>

                    {/* Sub-block 1: Dynamic Statistics Cards */}
                    <div className="mt-10">
                        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {statistics.map((statistic) => (
                                <div
                                    key={statistic.label}
                                    className="group relative overflow-hidden rounded-2xl border border-village-border/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-village-primary/50 hover:shadow-xl"
                                >
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-village-primary-light p-2.5 transition-all duration-300 group-hover:bg-village-primary/15">
                                        <img
                                            src={statistic.iconSrc}
                                            alt={statistic.label}
                                            className="size-full object-contain"
                                        />
                                    </div>
                                    <dt className="mt-5 text-sm font-bold text-village-muted">
                                        {statistic.label}
                                    </dt>
                                    <dd className="mt-1 text-3xl font-extrabold tracking-tight text-village-ink">
                                        {statistic.value != null
                                            ? formatNumber(statistic.value)
                                            : '—'}{' '}
                                        <span className="text-sm font-semibold text-village-muted">
                                            {statistic.suffix}
                                        </span>
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        {/* Batas Administratif Card & Status Aside */}
                        <div className="mt-8 grid gap-6 lg:grid-cols-12">
                            <article className="group rounded-3xl border border-village-border/80 bg-white p-7 shadow-sm transition-all duration-300 hover:border-village-primary/40 hover:shadow-xl lg:col-span-7 lg:p-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-village-primary-light text-village-primary">
                                        <MapPin className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-village-ink">
                                            Batas Administratif Desa
                                        </h3>
                                        <p className="text-xs text-village-muted">
                                            Batas geografis wilayah Desa Ngampungan
                                        </p>
                                    </div>
                                </div>
                                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                                    {boundaries.map((boundary) => (
                                        <div
                                            key={boundary.direction}
                                            className="rounded-xl border border-village-border/60 bg-village-surface-muted/40 p-4 transition-colors group-hover:bg-white"
                                        >
                                            <dt className="text-xs font-extrabold tracking-widest text-village-primary uppercase">
                                                Batas {boundary.direction}
                                            </dt>
                                            <dd className="mt-1.5 text-sm font-semibold leading-relaxed text-village-ink">
                                                {boundary.value || 'Data belum diisi'}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </article>

                            <aside className="group flex flex-col justify-between rounded-3xl border border-village-primary/20 bg-gradient-to-br from-village-primary-dark via-village-primary to-village-primary-dark p-7 text-white shadow-xl lg:col-span-5 lg:p-8">
                                <div>
                                    <h3 className="text-2xl font-extrabold tracking-tight text-white">
                                        Status Data Wilayah
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                                        Seluruh indikator kependudukan, batas geografis, dan penggunaan lahan tersambung secara linier dengan database backend dan dapat diperbarui secara dinamis dari dashboard admin.
                                    </p>
                                </div>
                                <a
                                    href="#selayang-pandang"
                                    className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-village-primary-dark"
                                >
                                    Kembali ke awal profil
                                    <ArrowRight className="size-4 -rotate-90" />
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
                                <span className="text-xs font-extrabold uppercase tracking-wider text-village-primary">
                                    Struktur Administrasi
                                </span>
                                <h3
                                    id="pembagian-wilayah-heading"
                                    className="mt-1 text-2xl font-extrabold tracking-tight text-village-ink sm:text-3xl"
                                >
                                    Pembagian Dusun, RW, dan RT
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-village-muted sm:text-base">
                                    Rincian pembagian wilayah administratif tingkat dusun, rukun warga (RW), dan rukun tetangga (RT) Desa Ngampungan.
                                </p>
                            </div>

                            <dl className="grid grid-cols-3 divide-x divide-village-border/60 rounded-2xl border border-village-border/80 bg-white p-2 shadow-sm lg:col-span-5">
                                <div className="py-3 text-center">
                                    <dt className="text-[11px] font-extrabold tracking-wider text-village-muted uppercase">
                                        Dusun
                                    </dt>
                                    <dd className="mt-1 text-2xl font-extrabold text-village-primary">
                                        {hamlets.length}
                                    </dd>
                                </div>
                                <div className="py-3 text-center">
                                    <dt className="text-[11px] font-extrabold tracking-wider text-village-muted uppercase">
                                        Total RW
                                    </dt>
                                    <dd className="mt-1 text-2xl font-extrabold text-village-primary">
                                        {hamletTotals.rw}
                                    </dd>
                                </div>
                                <div className="py-3 text-center">
                                    <dt className="text-[11px] font-extrabold tracking-wider text-village-muted uppercase">
                                        Total RT
                                    </dt>
                                    <dd className="mt-1 text-2xl font-extrabold text-village-primary">
                                        {hamletTotals.rt}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {hamlets.map((division, index) => (
                                <article
                                    key={division.code}
                                    className="group relative overflow-hidden rounded-2xl border border-village-border/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-village-primary/40 hover:shadow-xl"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="absolute -top-2 -right-1 text-7xl font-extrabold leading-none text-village-primary/[0.06] transition-transform duration-300 group-hover:scale-110"
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <p className="relative text-xs font-extrabold tracking-widest text-village-primary uppercase">
                                        {division.code}
                                    </p>
                                    <h4 className="relative mt-2 text-xl font-extrabold text-village-ink transition-colors group-hover:text-village-primary-dark">
                                        {division.name}
                                    </h4>
                                    <p className="relative mt-2 text-xs leading-5 text-village-muted">
                                        {division.note}
                                    </p>

                                    <dl className="relative mt-6 grid grid-cols-3 border-t border-village-border/60 pt-4">
                                        <div>
                                            <dt className="text-[11px] font-bold text-village-muted">
                                                RW
                                            </dt>
                                            <dd className="mt-0.5 text-base font-extrabold text-village-ink">
                                                {division.rw}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[11px] font-bold text-village-muted">
                                                RT
                                            </dt>
                                            <dd className="mt-0.5 text-base font-extrabold text-village-ink">
                                                {division.rt}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[11px] font-bold text-village-muted">
                                                KK
                                            </dt>
                                            <dd className="mt-0.5 text-base font-extrabold text-village-ink">
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
                                <span className="text-xs font-extrabold uppercase tracking-wider text-village-primary">
                                    Tata Ruang
                                </span>
                                <h3
                                    id="penggunaan-lahan-heading"
                                    className="mt-1 text-2xl font-extrabold tracking-tight text-village-ink sm:text-3xl"
                                >
                                    Penggunaan Lahan
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-village-muted">
                                    Visualisasi pemanfaatan tata ruang wilayah untuk pertanian, permukiman, kawasan terbuka hijau, dan sarana publik.
                                </p>

                                <dl className="mt-8 rounded-2xl border border-village-primary/20 bg-village-primary-light/30 p-5">
                                    <dt className="text-xs font-extrabold tracking-widest text-village-primary uppercase">
                                        Total Luas Wilayah
                                    </dt>
                                    <dd className="mt-2 text-4xl font-extrabold tracking-tight text-village-ink">
                                        {formatNumber(totalLandHectares)}
                                        <span className="ml-2 text-sm font-bold text-village-muted">
                                            hektare
                                        </span>
                                    </dd>
                                </dl>
                            </div>

                            <div className="rounded-3xl border border-village-border/80 bg-white p-6 shadow-sm sm:p-8 lg:col-span-8">
                                <div
                                    role="img"
                                    aria-label="Komposisi penggunaan lahan desa"
                                    className="flex h-6 overflow-hidden rounded-full border border-village-border/40 p-0.5"
                                >
                                    {landUse.map((item) => (
                                        <span
                                            key={item.key}
                                            aria-hidden="true"
                                            className={`h-full transition-all duration-500 ${
                                                landUsePresentation[item.key]?.barClassName || 'bg-village-primary'
                                            }`}
                                            style={{
                                                width: `${item.percentage}%`,
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    {landUse.map((item) => {
                                        const presentation =
                                            landUsePresentation[item.key] || {
                                                barClassName: 'bg-village-primary',
                                                surfaceClassName: 'bg-village-surface-muted',
                                            };

                                        return (
                                            <article
                                                key={item.key}
                                                className={`rounded-2xl border border-village-border/40 ${presentation.surfaceClassName} p-5 transition-all duration-300 hover:shadow-md`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h4 className="font-extrabold text-village-ink">
                                                            {item.label}
                                                        </h4>
                                                        <p className="mt-1 text-sm font-semibold text-village-muted">
                                                            {formatNumber(item.hectares)} hektare
                                                        </p>
                                                    </div>
                                                    <span className="text-2xl font-extrabold text-village-primary-dark">
                                                        {item.percentage}%
                                                    </span>
                                                </div>
                                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80">
                                                    <span
                                                        aria-hidden="true"
                                                        className={`block h-full rounded-full ${presentation.barClassName}`}
                                                        style={{
                                                            width: `${item.percentage}%`,
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
                            <span className="text-xs font-extrabold uppercase tracking-wider text-village-primary">
                                Peta Geospasial
                            </span>
                            <h3
                                id="peta-administratif-heading"
                                className="mt-1 text-2xl font-extrabold tracking-tight text-village-ink sm:text-3xl"
                            >
                                Peta Administratif Desa
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-village-muted sm:text-base">
                                Peta visualisasi batas administratif dan pembagian wilayah dusun Desa Ngampungan.
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
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div className="max-w-3xl">
                                <span className="text-xs font-extrabold uppercase tracking-wider text-village-primary">
                                    Statistik Kependudukan
                                </span>
                                <h3
                                    id="demografi-heading"
                                    className="mt-1 text-2xl font-extrabold tracking-tight text-village-ink sm:text-3xl"
                                >
                                    Demografi Penduduk Terperinci
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-village-muted sm:text-base">
                                    Komposisi dan distribusi statistik penduduk berdasarkan kategori gender, kelompok usia, tingkat pendidikan, mata pencaharian, agama, dan status kependudukan.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <VillageDemographicExplorer />
                        </div>
                    </div>

                    {/* Dynamic Data Notification */}
                    <div className="mt-12 flex items-start gap-3.5 rounded-2xl border border-village-primary/30 bg-village-primary-light/40 p-5 text-sm leading-relaxed text-village-primary-dark shadow-xs">
                        <Info className="mt-0.5 size-5 shrink-0 text-village-primary" />
                        <p>
                            <strong>Data Wilayah Terintegrasi Backend.</strong> Seluruh statistik kependudukan, batas administratif, pembagian dusun, dan penggunaan lahan pada section ini dikelola secara dinamis melalui database backend.
                        </p>
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
