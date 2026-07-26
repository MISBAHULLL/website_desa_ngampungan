import { Link } from '@inertiajs/react';
import { Building2, Network } from 'lucide-react';
import type { VillageOfficial } from '@/lib/dummy-village-government';
import { dummyVillageOfficials } from '@/lib/dummy-village-government';
import { show as officialShow } from '@/routes/government/officials';

function OrganizationNode({
    official,
    emphasis = false,
}: {
    official: VillageOfficial;
    emphasis?: boolean;
}) {
    return (
        <Link
            href={officialShow(official.slug)}
            className={
                emphasis
                    ? 'relative z-10 block w-full max-w-sm border border-village-primary bg-village-primary-dark p-5 text-center text-white shadow-village-floating transition hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-village-accent focus-visible:ring-offset-2 focus-visible:outline-none'
                    : 'relative z-10 block w-full border border-village-border bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-village-primary/50 hover:shadow-village-soft focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:ring-offset-2 focus-visible:outline-none'
            }
        >
            <span
                className={
                    emphasis
                        ? 'mx-auto flex size-11 items-center justify-center rounded-full bg-white/10 text-village-accent'
                        : 'mx-auto flex size-10 items-center justify-center rounded-full bg-village-primary-light text-sm font-bold text-village-primary-dark'
                }
            >
                {emphasis ? (
                    <Building2 aria-hidden="true" className="size-5" />
                ) : (
                    official.initials
                )}
            </span>
            <span className="mt-3 block text-sm font-bold">
                {official.name}
            </span>
            <span
                className={
                    emphasis
                        ? 'mt-1 block text-xs text-white/60'
                        : 'mt-1 block text-xs text-village-muted'
                }
            >
                {official.position}
            </span>
        </Link>
    );
}

function OrganizationGroup({
    title,
    officials,
}: {
    title: string;
    officials: VillageOfficial[];
}) {
    return (
        <div className="border border-village-border bg-village-surface-muted p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
                <Network
                    aria-hidden="true"
                    className="size-4 text-village-primary"
                />
                <h3 className="text-xs font-bold tracking-[0.14em] text-village-primary uppercase">
                    {title}
                </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                {officials.map((official) => (
                    <OrganizationNode key={official.slug} official={official} />
                ))}
            </div>
        </div>
    );
}

export function VillageOrganizationChart() {
    const villageHead = dummyVillageOfficials.find(
        (official) => official.group === 'leadership',
    );
    const villageSecretary = dummyVillageOfficials.find(
        (official) => official.position === 'Sekretaris Desa',
    );
    const secretariatOfficials = dummyVillageOfficials.filter(
        (official) =>
            official.group === 'secretariat' &&
            official.position !== 'Sekretaris Desa',
    );
    const technicalOfficials = dummyVillageOfficials.filter(
        (official) => official.group === 'technical',
    );
    const territorialOfficials = dummyVillageOfficials.filter(
        (official) => official.group === 'territorial',
    );

    if (!villageHead || !villageSecretary) {
        return null;
    }

    return (
        <div
            aria-label="Bagan struktur organisasi Pemerintah Desa Ngampungan"
            className="overflow-hidden border border-village-border bg-white p-5 shadow-village-soft sm:p-8"
        >
            <div className="flex flex-col items-center">
                <OrganizationNode official={villageHead} emphasis />
                <span
                    aria-hidden="true"
                    className="h-8 w-px bg-village-primary/35"
                />
                <div className="w-full max-w-xs">
                    <OrganizationNode official={villageSecretary} />
                </div>
                <span
                    aria-hidden="true"
                    className="h-8 w-px bg-village-primary/35"
                />

                <div className="relative w-full pt-6">
                    <span
                        aria-hidden="true"
                        className="absolute top-0 right-1/4 left-1/4 h-px bg-village-primary/35"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute top-0 left-1/4 h-6 w-px bg-village-primary/35"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute top-0 right-1/4 h-6 w-px bg-village-primary/35"
                    />
                    <div className="grid gap-5 lg:grid-cols-2">
                        <OrganizationGroup
                            title="Urusan Sekretariat"
                            officials={secretariatOfficials}
                        />
                        <OrganizationGroup
                            title="Pelaksana Teknis"
                            officials={technicalOfficials}
                        />
                    </div>
                </div>

                <span
                    aria-hidden="true"
                    className="h-8 w-px bg-village-primary/35"
                />
                <div className="w-full border border-village-border bg-village-primary-light p-4 sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                        <Network
                            aria-hidden="true"
                            className="size-4 text-village-primary"
                        />
                        <h3 className="text-xs font-bold tracking-[0.14em] text-village-primary uppercase">
                            Pelaksana Kewilayahan
                        </h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {territorialOfficials.map((official) => (
                            <OrganizationNode
                                key={official.slug}
                                official={official}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <p className="mt-6 text-center text-sm leading-6 text-village-muted">
                Klik nama atau jabatan untuk membuka profil perangkat. Susunan
                dan data personal masih berupa simulasi frontend.
            </p>
        </div>
    );
}
