import { Compass, Info } from 'lucide-react';
import { dummyAdministrativeDivisions } from '@/lib/dummy-village-profile';

const zonePresentation = [
    {
        fillClassName: 'fill-[#cfeadd]',
        markerClassName: 'bg-[#cfeadd]',
        textX: 240,
        textY: 190,
    },
    {
        fillClassName: 'fill-[#f4d99c]',
        markerClassName: 'bg-[#f4d99c]',
        textX: 520,
        textY: 150,
    },
    {
        fillClassName: 'fill-[#cfe2f3]',
        markerClassName: 'bg-[#cfe2f3]',
        textX: 430,
        textY: 310,
    },
] as const;

const zonePolygons = [
    '120,80 360,60 330,380 95,285',
    '360,60 600,105 570,250 360,200',
    '360,200 570,250 550,375 330,380',
] as const;

export function VillageAdministrativeMap() {
    return (
        <div className="grid gap-6 lg:grid-cols-12">
            <figure className="border border-village-border bg-white p-4 shadow-village-soft sm:p-6 lg:col-span-8">
                <div className="flex flex-col justify-between gap-3 border-b border-village-border pb-4 sm:flex-row sm:items-center">
                    <figcaption>
                        <p className="font-bold text-village-ink">
                            Skema wilayah administratif
                        </p>
                        <p className="mt-1 text-sm text-village-muted">
                            Ilustrasi pembagian tiga wilayah dusun Desa Ngampungan.
                        </p>
                    </figcaption>
                    <span className="w-fit bg-[#fff2cf] px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.12em] text-[#755018] uppercase">
                        Bukan peta ukur
                    </span>
                </div>

                <div className="mt-5 overflow-hidden bg-village-surface-muted">
                    <svg
                        viewBox="0 0 720 440"
                        role="img"
                        aria-labelledby="administrative-map-title administrative-map-description"
                        className="h-auto w-full"
                    >
                        <title id="administrative-map-title">
                            Peta administratif simulasi Desa Ngampungan
                        </title>
                        <desc id="administrative-map-description">
                            Diagram skematik tiga wilayah dusun yang belum
                            menunjukkan batas geografis sebenarnya.
                        </desc>

                        <defs>
                            <pattern
                                id="profile-map-grid"
                                width="24"
                                height="24"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 24 0 L 0 0 0 24"
                                    fill="none"
                                    stroke="#d6ddd8"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>

                        <rect
                            width="720"
                            height="440"
                            fill="url(#profile-map-grid)"
                        />

                        {zonePolygons.map((points, index) => {
                            const zone = zonePresentation[index];
                            const division = (dummyAdministrativeDivisions as readonly { code: string; name: string; rw: number; rt: number }[])[index];

                            if (!division || !zone) return null;

                            return (
                                <g key={division.code}>
                                    <polygon
                                        points={points}
                                        className={`${zone.fillClassName} stroke-white transition-opacity duration-300 hover:opacity-80`}
                                        strokeWidth="6"
                                        strokeLinejoin="round"
                                    />
                                    <text
                                        x={zone.textX}
                                        y={zone.textY}
                                        textAnchor="middle"
                                        className="fill-village-primary-dark text-[18px] font-bold"
                                    >
                                        {division.name}
                                    </text>
                                    <text
                                        x={zone.textX}
                                        y={zone.textY + 25}
                                        textAnchor="middle"
                                        className="fill-village-muted text-[12px] font-semibold"
                                    >
                                        {division.rw} RW · {division.rt} RT
                                    </text>
                                </g>
                            );
                        })}

                        <path
                            d="M120 80 L600 105 L550 375 L95 285 Z"
                            fill="none"
                            stroke="#1f7350"
                            strokeWidth="4"
                            strokeDasharray="10 8"
                            strokeLinejoin="round"
                        />

                        <g transform="translate(640 42)">
                            <circle
                                cx="0"
                                cy="0"
                                r="24"
                                fill="#ffffff"
                                stroke="#cdd7d1"
                            />
                            <path d="M0 -16 L7 5 L0 1 L-7 5 Z" fill="#1f7350" />
                            <text
                                x="0"
                                y="39"
                                textAnchor="middle"
                                className="fill-village-primary-dark text-[12px] font-bold"
                            >
                                U
                            </text>
                        </g>
                    </svg>
                </div>
            </figure>

            <aside className="flex flex-col justify-between border border-village-border bg-village-primary-dark p-6 text-white lg:col-span-4 lg:p-8">
                <div>
                    <span className="flex size-11 items-center justify-center rounded-full bg-white/10 text-village-accent">
                        <Compass aria-hidden="true" className="size-5" />
                    </span>
                    <h3 className="mt-6 text-xl font-bold">Legenda wilayah</h3>
                    <div className="mt-6 grid gap-4">
                        {(dummyAdministrativeDivisions as readonly { code: string; name: string; note: string; rw: number; rt: number }[]).map((division, index) => {
                            const zone = zonePresentation[index];
                            if (!division || !zone) return null;

                            return (
                                <div
                                    key={division.code}
                                    className="flex items-start gap-3 border-t border-white/15 pt-4"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`mt-1 size-3 shrink-0 ${zone.markerClassName}`}
                                    />
                                    <div>
                                        <p className="font-bold">{division.name}</p>
                                        <p className="mt-1 text-sm text-white/55">
                                            {division.note}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 flex items-start gap-3 border border-white/15 bg-white/[0.06] p-4 text-sm leading-6 text-white/65">
                    <Info
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-village-accent"
                    />
                    Batas koordinat akan diganti dengan data geospasial resmi.
                </div>
            </aside>
        </div>
    );
}
