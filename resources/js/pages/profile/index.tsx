import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpenText,
    ChartBar,
    Check,
    ChevronRight,
    Compass,
    Flag,
    Grid3X3,
    Home,
    Info,
    LandPlot,
    LocateFixed,
    Map,
    MapPin,
    Milestone,
    Ruler,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PublicPageShell } from '@/components/public-page-shell';
import { VillageAdministrativeMap } from '@/components/village-administrative-map';
import { VillageDemographicExplorer } from '@/components/village-demographic-explorer';
import {
    dummyAdministrativeBoundaries,
    dummyAdministrativeDivisions,
    dummyLandUseComposition,
    dummyVillageIdentity,
} from '@/lib/dummy-village-profile';
import { home } from '@/routes';

type VillageProfilePageProps = {
    canonicalUrl: string;
};

type ProfileSectionLink = {
    label: string;
    description: string;
    href: `#${string}`;
    icon: LucideIcon;
};

const profileSectionLinks: ProfileSectionLink[] = [
    {
        label: 'Selayang Pandang',
        description: 'Identitas dan gambaran umum desa',
        href: '#selayang-pandang',
        icon: Compass,
    },
    {
        label: 'Visi dan Misi',
        description: 'Arah pembangunan desa',
        href: '#visi-misi',
        icon: Flag,
    },
    {
        label: 'Sejarah Desa',
        description: 'Perjalanan Desa Ngampungan',
        href: '#sejarah-desa',
        icon: BookOpenText,
    },
    {
        label: 'Data Wilayah',
        description: 'Ringkasan demografi dan wilayah',
        href: '#data-wilayah',
        icon: Map,
    },
    {
        label: 'Pembagian Wilayah',
        description: 'Susunan dusun, RW, dan RT',
        href: '#pembagian-wilayah',
        icon: Grid3X3,
    },
    {
        label: 'Penggunaan Lahan',
        description: 'Komposisi pemanfaatan wilayah',
        href: '#penggunaan-lahan',
        icon: LandPlot,
    },
    {
        label: 'Peta Administratif',
        description: 'Peta skematik wilayah desa',
        href: '#peta-administratif',
        icon: LocateFixed,
    },
    {
        label: 'Demografi',
        description: 'Rincian komposisi penduduk',
        href: '#demografi',
        icon: ChartBar,
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
    'Meningkatkan kualitas pelayanan publik yang mudah, ramah, dan transparan.',
    'Mendorong penguatan ekonomi warga melalui pertanian dan UMKM desa.',
    'Mengembangkan sumber daya manusia yang sehat, terampil, dan berdaya saing.',
    'Menjaga lingkungan, budaya lokal, serta semangat gotong royong masyarakat.',
    'Mewujudkan tata kelola pembangunan yang partisipatif dan dapat dipertanggungjawabkan.',
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
        'Profil Desa Ngampungan, Kecamatan Bareng, Kabupaten Jombang yang memuat selayang pandang, visi dan misi, sejarah, serta data wilayah.';

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

            <section className="relative isolate overflow-hidden bg-village-primary-dark text-white">
                <div
                    aria-hidden="true"
                    className="absolute inset-y-0 right-0 -z-10 w-2/5 border-l border-white/10 bg-white/[0.035]"
                />
                <div
                    aria-hidden="true"
                    className="absolute -top-24 right-[8%] -z-10 size-80 rounded-full border-[56px] border-white/[0.035]"
                />

                <div className="mx-auto max-w-[1280px] px-5 py-14 md:py-20 lg:px-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-sm text-white/65"
                    >
                        <Link
                            href={home()}
                            className="rounded-sm transition hover:text-white focus-visible:ring-2 focus-visible:ring-village-accent focus-visible:outline-none"
                        >
                            Beranda
                        </Link>
                        <ChevronRight
                            aria-hidden="true"
                            className="size-4 text-white/35"
                        />
                        <span aria-current="page" className="text-white">
                            Profil Desa
                        </span>
                    </nav>

                    <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
                        <div className="max-w-3xl lg:col-span-8">
                            <p className="text-xs font-bold tracking-[0.2em] text-village-accent uppercase">
                                Mengenal Desa Ngampungan
                            </p>
                            <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
                                Profil Desa Ngampungan
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                                Mengenal identitas, arah pembangunan,
                                perjalanan, dan gambaran wilayah Desa Ngampungan
                                dalam satu halaman informasi.
                            </p>
                        </div>

                        <dl className="grid grid-cols-2 border-y border-white/15 lg:col-span-4">
                            <div className="border-r border-white/15 py-5 pr-5">
                                <dt className="text-xs tracking-[0.14em] text-white/55 uppercase">
                                    Kecamatan
                                </dt>
                                <dd className="mt-2 font-bold">Bareng</dd>
                            </div>
                            <div className="py-5 pl-5">
                                <dt className="text-xs tracking-[0.14em] text-white/55 uppercase">
                                    Kabupaten
                                </dt>
                                <dd className="mt-2 font-bold">Jombang</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            <nav
                aria-label="Daftar isi profil desa"
                className="sticky top-20 z-40 border-b border-village-border bg-white/95 backdrop-blur-xl"
            >
                <div className="mx-auto flex max-w-[1280px] [scrollbar-width:none] gap-2 overflow-x-auto px-5 py-3 [-ms-overflow-style:none] lg:px-12 [&::-webkit-scrollbar]:hidden">
                    {profileSectionLinks.map((section) => (
                        <a
                            key={section.href}
                            href={section.href}
                            className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-village-border bg-white px-4 py-2.5 text-sm font-bold text-village-muted transition hover:border-village-primary hover:bg-village-primary-light hover:text-village-primary-dark focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none"
                        >
                            <section.icon
                                aria-hidden="true"
                                className="size-4"
                            />
                            {section.label}
                        </a>
                    ))}
                </div>
            </nav>

            <section
                id="selayang-pandang"
                aria-labelledby="selayang-pandang-heading"
                className="scroll-mt-40 bg-village-canvas py-14 md:py-20"
            >
                <div className="mx-auto grid max-w-[1280px] gap-10 px-5 lg:grid-cols-12 lg:px-12">
                    <div className="lg:col-span-4">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            01 · Identitas Desa
                        </p>
                        <h2
                            id="selayang-pandang-heading"
                            className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                        >
                            Selayang Pandang
                        </h2>
                        <p className="mt-4 leading-7 text-village-muted">
                            Gambaran singkat mengenai posisi dan karakter Desa
                            Ngampungan.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:col-span-8">
                        <article className="border border-village-border bg-white p-6 shadow-village-soft sm:p-8">
                            <p className="text-lg leading-8 text-village-muted">
                                Desa Ngampungan merupakan bagian dari Kecamatan
                                Bareng, Kabupaten Jombang. Halaman ini disiapkan
                                sebagai pusat informasi profil desa yang mudah
                                dipahami warga, mulai dari identitas wilayah
                                hingga arah pembangunannya.
                            </p>
                            <p className="mt-5 leading-7 text-village-muted">
                                Narasi rinci mengenai kondisi sosial, ekonomi,
                                geografis, dan karakter masyarakat akan
                                dilengkapi setelah dokumen profil resmi desa
                                selesai diverifikasi.
                            </p>
                        </article>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {dummyVillageIdentity.map((identity) => (
                                <dl
                                    key={identity.label}
                                    className="border-t-2 border-village-primary bg-village-surface-muted p-5"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <dt className="text-xs font-bold tracking-[0.12em] text-village-muted uppercase">
                                            {identity.label}
                                        </dt>
                                        {identity.isPlaceholder && (
                                            <span className="bg-[#fff2cf] px-2 py-1 text-[0.625rem] font-bold tracking-[0.1em] text-[#755018] uppercase">
                                                Placeholder
                                            </span>
                                        )}
                                    </div>
                                    <dd className="mt-3 text-lg font-bold">
                                        {identity.value}
                                    </dd>
                                </dl>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="visi-misi"
                aria-labelledby="visi-misi-heading"
                className="scroll-mt-40 border-t border-village-border bg-white py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="grid gap-6 lg:grid-cols-12">
                        <article className="relative overflow-hidden bg-village-primary-dark p-7 text-white sm:p-10 lg:col-span-5">
                            <div
                                aria-hidden="true"
                                className="absolute top-0 right-0 size-36 translate-x-12 -translate-y-12 rounded-full border-[28px] border-white/[0.06]"
                            />
                            <p className="text-xs font-bold tracking-[0.18em] text-village-accent uppercase">
                                02 · Arah Pembangunan
                            </p>
                            <h2
                                id="visi-misi-heading"
                                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Visi dan Misi
                            </h2>
                            <div className="mt-10 border-l-2 border-village-accent pl-5">
                                <p className="text-xs font-bold tracking-[0.16em] text-white/55 uppercase">
                                    Visi
                                </p>
                                <p className="mt-3 text-xl leading-8 font-semibold">
                                    “Terwujudnya Desa Ngampungan yang maju,
                                    mandiri, sejahtera, dan berkarakter melalui
                                    pelayanan yang transparan.”
                                </p>
                            </div>
                            <p className="mt-8 text-sm leading-6 text-white/60">
                                Rumusan visi dan misi masih berupa simulasi
                                tampilan dan menunggu dokumen resmi pemerintah
                                desa.
                            </p>
                        </article>

                        <article className="border border-village-border bg-village-canvas p-7 sm:p-10 lg:col-span-7">
                            <p className="text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                                Misi
                            </p>
                            <ol className="mt-6 grid gap-5">
                                {villageMissions.map((mission, index) => (
                                    <li
                                        key={mission}
                                        className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-village-border pb-5 last:border-0 last:pb-0"
                                    >
                                        <span className="flex size-8 items-center justify-center bg-village-primary-light text-sm font-bold text-village-primary">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="leading-7 text-village-muted">
                                            {mission}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </article>
                    </div>
                </div>
            </section>

            <section
                id="sejarah-desa"
                aria-labelledby="sejarah-desa-heading"
                className="scroll-mt-40 border-t border-village-border bg-village-surface-muted py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            03 · Perjalanan Desa
                        </p>
                        <h2
                            id="sejarah-desa-heading"
                            className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                        >
                            Sejarah Desa
                        </h2>
                        <p className="mt-4 leading-7 text-village-muted">
                            Struktur cerita sejarah telah disiapkan tanpa
                            mengarang tahun atau peristiwa yang belum
                            diverifikasi.
                        </p>
                    </div>

                    <div className="relative mt-10 grid gap-5 md:grid-cols-3">
                        <div
                            aria-hidden="true"
                            className="absolute top-6 right-[16.5%] left-[16.5%] hidden h-px bg-village-border md:block"
                        />
                        {historyStages.map((item, index) => (
                            <article
                                key={item.stage}
                                className="relative border border-village-border bg-white p-6 shadow-sm"
                            >
                                <span className="relative z-10 flex size-12 items-center justify-center rounded-full border-4 border-village-surface-muted bg-village-primary text-white">
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
                                <h3 className="mt-2 text-xl font-bold">
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

            <section
                id="data-wilayah"
                aria-labelledby="data-wilayah-heading"
                className="scroll-mt-40 border-t border-village-border bg-village-canvas py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="max-w-2xl">
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                04 · Ringkasan Data
                            </p>
                            <h2
                                id="data-wilayah-heading"
                                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Data Wilayah
                            </h2>
                            <p className="mt-4 leading-7 text-village-muted">
                                Ringkasan awal untuk menunjukkan susunan data
                                demografi dan administratif desa.
                            </p>
                        </div>
                        <span className="w-fit border border-[#efdcae] bg-[#fff8ea] px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#755018] uppercase">
                            Data simulasi
                        </span>
                    </div>

                    <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {villageStatistics.map((statistic) => (
                            <div
                                key={statistic.label}
                                className="border border-village-border bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-village-primary/40 hover:shadow-village-soft"
                            >
                                <statistic.icon
                                    aria-hidden="true"
                                    className="size-6 text-village-primary"
                                />
                                <dt className="mt-8 text-sm font-bold text-village-muted">
                                    {statistic.label}
                                </dt>
                                <dd className="mt-2 text-3xl font-bold tracking-tight">
                                    {statistic.value}{' '}
                                    <span className="text-sm font-semibold text-village-muted">
                                        {statistic.suffix}
                                    </span>
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-6 grid gap-6 lg:grid-cols-12">
                        <article className="border border-village-border bg-white p-6 lg:col-span-7 lg:p-8">
                            <div className="flex items-center gap-3">
                                <MapPin
                                    aria-hidden="true"
                                    className="size-5 text-village-primary"
                                />
                                <h3 className="text-xl font-bold">
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

                        <aside className="flex flex-col justify-between bg-village-primary-light p-6 lg:col-span-5 lg:p-8">
                            <div>
                                <span className="flex size-11 items-center justify-center rounded-full bg-white text-village-primary">
                                    <Check
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                                <h3 className="mt-6 text-xl font-bold text-village-primary-dark">
                                    Status data
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

                    <div className="mt-6 flex items-start gap-3 border border-[#efdcae] bg-[#fff8ea] p-4 text-sm leading-6 text-[#755018]">
                        <Info
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                        <p>
                            <strong>Konten simulasi frontend.</strong> Narasi,
                            visi dan misi, sejarah, serta angka wilayah akan
                            diganti setelah data resmi Pemerintah Desa
                            Ngampungan tersedia.
                        </p>
                    </div>
                </div>
            </section>

            <section
                id="pembagian-wilayah"
                aria-labelledby="pembagian-wilayah-heading"
                className="scroll-mt-40 border-t border-village-border bg-white py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                        <div className="max-w-2xl lg:col-span-7">
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                05 · Struktur Administratif
                            </p>
                            <h2
                                id="pembagian-wilayah-heading"
                                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Pembagian Dusun, RW, dan RT
                            </h2>
                            <p className="mt-4 leading-7 text-village-muted">
                                Contoh susunan data wilayah terkecil agar warga
                                dapat memahami pembagian administrasi desa
                                secara ringkas.
                            </p>
                        </div>

                        <dl className="grid grid-cols-3 divide-x divide-village-border border-y border-village-border lg:col-span-5">
                            <div className="py-4 pr-4">
                                <dt className="text-xs font-bold tracking-[0.12em] text-village-muted uppercase">
                                    Dusun
                                </dt>
                                <dd className="mt-2 text-2xl font-bold">
                                    {dummyAdministrativeDivisions.length}
                                </dd>
                            </div>
                            <div className="px-4 py-4">
                                <dt className="text-xs font-bold tracking-[0.12em] text-village-muted uppercase">
                                    RW
                                </dt>
                                <dd className="mt-2 text-2xl font-bold">
                                    {administrativeDivisionTotals.rw}
                                </dd>
                            </div>
                            <div className="py-4 pl-4">
                                <dt className="text-xs font-bold tracking-[0.12em] text-village-muted uppercase">
                                    RT
                                </dt>
                                <dd className="mt-2 text-2xl font-bold">
                                    {administrativeDivisionTotals.rt}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {dummyAdministrativeDivisions.map((division, index) => (
                            <article
                                key={division.code}
                                className="group relative overflow-hidden border border-village-border bg-village-canvas p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-village-primary/40 hover:shadow-village-soft"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute top-0 right-0 text-7xl leading-none font-bold text-village-primary/[0.055]"
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <p className="relative text-xs font-bold tracking-[0.15em] text-village-primary uppercase">
                                    {division.code}
                                </p>
                                <h3 className="relative mt-3 text-xl font-bold">
                                    {division.name}
                                </h3>
                                <p className="relative mt-2 text-sm leading-6 text-village-muted">
                                    {division.note}
                                </p>

                                <dl className="relative mt-8 grid grid-cols-3 border-t border-village-border pt-5">
                                    <div>
                                        <dt className="text-xs text-village-muted">
                                            RW
                                        </dt>
                                        <dd className="mt-1 font-bold">
                                            {division.rw}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-village-muted">
                                            RT
                                        </dt>
                                        <dd className="mt-1 font-bold">
                                            {division.rt}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-village-muted">
                                            KK
                                        </dt>
                                        <dd className="mt-1 font-bold">
                                            {formatNumber(division.households)}
                                        </dd>
                                    </div>
                                </dl>
                            </article>
                        ))}
                    </div>

                    <p className="mt-5 text-sm leading-6 text-village-muted">
                        Nama dusun serta jumlah RW, RT, dan keluarga masih
                        berupa simulasi struktur frontend.
                    </p>
                </div>
            </section>

            <section
                id="penggunaan-lahan"
                aria-labelledby="penggunaan-lahan-heading"
                className="scroll-mt-40 border-t border-village-border bg-village-surface-muted py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-4">
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                06 · Komposisi Wilayah
                            </p>
                            <h2
                                id="penggunaan-lahan-heading"
                                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Penggunaan Lahan
                            </h2>
                            <p className="mt-4 leading-7 text-village-muted">
                                Visualisasi pemanfaatan luas wilayah untuk
                                pertanian, permukiman, ruang terbuka, dan
                                fasilitas umum.
                            </p>

                            <dl className="mt-8 border-l-2 border-village-primary pl-5">
                                <dt className="text-xs font-bold tracking-[0.14em] text-village-muted uppercase">
                                    Luas basis simulasi
                                </dt>
                                <dd className="mt-2 text-4xl font-bold tracking-tight">
                                    450
                                    <span className="ml-2 text-sm font-semibold text-village-muted">
                                        hektare
                                    </span>
                                </dd>
                            </dl>
                        </div>

                        <div className="border border-village-border bg-white p-6 shadow-village-soft sm:p-8 lg:col-span-8">
                            <div
                                role="img"
                                aria-label="Komposisi penggunaan lahan simulasi: pertanian 52 persen, permukiman 28 persen, ruang terbuka 12 persen, dan fasilitas umum 8 persen"
                                className="flex h-6 overflow-hidden"
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
                                            className={`${presentation.surfaceClassName} p-5`}
                                        >
                                            <div className="flex items-start justify-between gap-5">
                                                <div>
                                                    <h3 className="font-bold">
                                                        {landUse.label}
                                                    </h3>
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
                                            <div className="mt-5 h-1.5 bg-white/80">
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

                            <p className="mt-6 text-sm leading-6 text-village-muted">
                                Komposisi ini dibuat untuk menguji keterbacaan
                                diagram dan akan diganti berdasarkan data
                                penggunaan lahan resmi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="peta-administratif"
                aria-labelledby="peta-administratif-heading"
                className="scroll-mt-40 border-t border-village-border bg-village-canvas py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            07 · Orientasi Wilayah
                        </p>
                        <h2
                            id="peta-administratif-heading"
                            className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                        >
                            Peta Administratif Desa
                        </h2>
                        <p className="mt-4 leading-7 text-village-muted">
                            Peta skematik untuk menunjukkan pola penyajian batas
                            desa dan pembagian dusun sebelum data geospasial
                            resmi tersedia.
                        </p>
                    </div>

                    <div className="mt-9">
                        <VillageAdministrativeMap />
                    </div>
                </div>
            </section>

            <section
                id="demografi"
                aria-labelledby="demografi-heading"
                className="scroll-mt-40 border-t border-village-border bg-white py-14 md:py-20"
            >
                <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                08 · Data Penduduk
                            </p>
                            <h2
                                id="demografi-heading"
                                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Demografi Terperinci
                            </h2>
                            <p className="mt-4 leading-7 text-village-muted">
                                Pilih kategori untuk melihat komposisi penduduk
                                berdasarkan jenis kelamin, usia, pendidikan,
                                pekerjaan, agama, atau status kependudukan.
                            </p>
                        </div>
                        <span className="w-fit border border-[#efdcae] bg-[#fff8ea] px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#755018] uppercase">
                            Seluruh angka simulasi
                        </span>
                    </div>

                    <div className="mt-9">
                        <VillageDemographicExplorer />
                    </div>

                    <div className="mt-6 flex items-start gap-3 border border-[#efdcae] bg-[#fff8ea] p-4 text-sm leading-6 text-[#755018]">
                        <Info
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                        <p>
                            <strong>Konten simulasi frontend.</strong> Seluruh
                            identitas, pembagian wilayah, penggunaan lahan,
                            peta, dan demografi harus diganti setelah data resmi
                            Pemerintah Desa Ngampungan diverifikasi.
                        </p>
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
