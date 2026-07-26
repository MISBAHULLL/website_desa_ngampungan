import {
    BriefcaseBusiness,
    CookingPot,
    MapPinned,
    Palette,
    Store,
    Wheat,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { VillagePotentialKey } from '@/lib/dummy-village-potentials';

type PotentialCategoryPresentation = {
    icon: LucideIcon;
    panelClassName: string;
    iconClassName: string;
    accentClassName: string;
};

export const potentialCategoryPresentation: Record<
    VillagePotentialKey,
    PotentialCategoryPresentation
> = {
    umkm: {
        icon: Store,
        panelClassName: 'bg-[#e4f2eb] text-village-primary-dark',
        iconClassName: 'bg-village-primary text-white',
        accentClassName: 'bg-village-primary',
    },
    agriculture: {
        icon: Wheat,
        panelClassName: 'bg-[#edf2e5] text-[#466333]',
        iconClassName: 'bg-[#587a3f] text-white',
        accentClassName: 'bg-[#759a58]',
    },
    tourism: {
        icon: MapPinned,
        panelClassName: 'bg-[#e8f1f5] text-[#315f74]',
        iconClassName: 'bg-[#3f748a] text-white',
        accentClassName: 'bg-[#5b8ea3]',
    },
    culture: {
        icon: Palette,
        panelClassName: 'bg-[#f6ebe2] text-[#8a5634]',
        iconClassName: 'bg-[#a8653c] text-white',
        accentClassName: 'bg-[#c28155]',
    },
    culinary: {
        icon: CookingPot,
        panelClassName: 'bg-[#fff3d6] text-[#835a10]',
        iconClassName: 'bg-[#a87314] text-white',
        accentClassName: 'bg-village-accent',
    },
    services: {
        icon: BriefcaseBusiness,
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
    const Icon = potentialCategoryPresentation[category].icon;

    return <Icon aria-hidden="true" className={className} />;
}
