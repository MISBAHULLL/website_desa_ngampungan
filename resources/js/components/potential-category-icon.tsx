import type { VillagePotentialKey } from '@/lib/dummy-village-potentials';

type PotentialCategoryPresentation = {
    src: string;
    alt: string;
    panelClassName: string;
    iconClassName: string;
    accentClassName: string;
};

export const potentialCategoryPresentation: Record<
    VillagePotentialKey,
    PotentialCategoryPresentation
> = {
    umkm: {
        src: '/assets/umkm.png',
        alt: 'UMKM',
        panelClassName: 'bg-[#e4f2eb] text-village-primary-dark',
        iconClassName: 'bg-village-primary text-white',
        accentClassName: 'bg-village-primary',
    },
    agriculture: {
        src: '/assets/pertanian.png',
        alt: 'Pertanian',
        panelClassName: 'bg-[#edf2e5] text-[#466333]',
        iconClassName: 'bg-[#587a3f] text-white',
        accentClassName: 'bg-[#759a58]',
    },
    tourism: {
        src: '/assets/wisata.png',
        alt: 'Wisata',
        panelClassName: 'bg-[#e8f1f5] text-[#315f74]',
        iconClassName: 'bg-[#3f748a] text-white',
        accentClassName: 'bg-[#5b8ea3]',
    },
    culture: {
        src: '/assets/budaya.png',
        alt: 'Budaya',
        panelClassName: 'bg-[#f6ebe2] text-[#8a5634]',
        iconClassName: 'bg-[#a8653c] text-white',
        accentClassName: 'bg-[#c28155]',
    },
    culinary: {
        src: '/assets/kuliner.png',
        alt: 'Kuliner',
        panelClassName: 'bg-[#fff3d6] text-[#835a10]',
        iconClassName: 'bg-[#a87314] text-white',
        accentClassName: 'bg-village-accent',
    },
    services: {
        src: '/assets/jasa.png',
        alt: 'Jasa',
        panelClassName: 'bg-[#e7eeeb] text-village-primary-dark',
        iconClassName: 'bg-village-primary-dark text-white',
        accentClassName: 'bg-village-primary-dark',
    },
};

export function PotentialCategoryIcon({
    category,
    className,
}: {
    category: VillagePotentialKey;
    className?: string;
}) {
    const item = potentialCategoryPresentation[category];

    return (
        <img
            src={item.src}
            alt={item.alt}
            aria-hidden="true"
            className={className ?? 'size-5 object-contain'}
        />
    );
}
