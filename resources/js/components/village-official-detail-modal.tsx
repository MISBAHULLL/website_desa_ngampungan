import {
    Award,
    BadgeCheck,
    BriefcaseBusiness,
    Check,
    GraduationCap,
    ShieldCheck,
    UserCheck,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export type VillageOfficialData = {
    id?: number;
    slug?: string;
    name: string;
    initials?: string;
    position: string;
    unit: string;
    group?: string;
    photo_url?: string | null;
    photo?: string | null;
    term?: string | null;
    employee_id?: string | null;
    employeeId?: string | null;
    summary?: string | null;
    about?: string | null;
    responsibilities?: string[] | null;
    service_focus?: string[] | null;
    serviceFocus?: string[] | null;
    education?: string[] | null;
    career?: { period: string; role: string }[] | null;
};

type VillageOfficialDetailModalProps = {
    official: VillageOfficialData | null;
    onClose: () => void;
};

function OfficialPortrait({
    photoSrc,
    name,
    initials,
}: {
    photoSrc: string | null | undefined;
    name: string;
    initials: string;
}) {
    const [hasImageError, setHasImageError] = useState(false);

    if (photoSrc && !hasImageError) {
        return (
            <img
                src={photoSrc}
                alt={`Foto ${name}`}
                className="h-full w-full rounded-xl object-cover object-top"
                onError={() => setHasImageError(true)}
            />
        );
    }

    return (
        <div className="flex size-full items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 via-teal-50 to-slate-100 text-3xl font-extrabold text-emerald-800 shadow-inner">
            {initials}
        </div>
    );
}

export function VillageOfficialDetailModal({
    official,
    onClose,
}: VillageOfficialDetailModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (official) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [official, onClose]);

    if (!official) {
        return null;
    }

    const photoSrc = official.photo_url || official.photo;
    const employeeId =
        official.employee_id || official.employeeId || 'Perangkat Desa';
    const term = official.term || '2022–2028';
    const serviceFocusList =
        official.service_focus || official.serviceFocus || [];
    const responsibilitiesList = official.responsibilities || [];
    const educationList = official.education || [];
    const careerList = official.career || [];
    const initials =
        official.initials ||
        official.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="official-modal-title"
            className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-3 duration-200 fade-in sm:p-6"
            onClick={onClose}
        >
            {/* Modal Container */}
            <div
                className="relative flex max-h-[90vh] w-full max-w-4xl transform flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Floating Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup modal"
                    className="absolute top-4 right-4 z-30 flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
                >
                    <X className="size-4" />
                </button>

                {/* Scrollable Container */}
                <div className="flex-1 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
                    {/* Header Banner - Soft Neutral/Emerald Header */}
                    <div className="relative border-b border-slate-200/80 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6 text-slate-900 sm:p-8">
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                            {/* Avatar / Photo Container */}
                            <div className="relative flex aspect-[4/5] w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-1 shadow-sm sm:w-36">
                                <OfficialPortrait
                                    key={`${official.id ?? official.slug}-${photoSrc ?? 'initials'}`}
                                    photoSrc={photoSrc}
                                    name={official.name}
                                    initials={initials}
                                />
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 space-y-2 text-center sm:text-left">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800 px-3.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-2xs">
                                        <UserCheck className="size-3" />
                                        {official.unit}
                                    </span>
                                </div>

                                <h2
                                    id="official-modal-title"
                                    className="text-2xl leading-tight font-extrabold text-slate-900 sm:text-3xl"
                                >
                                    {official.name}
                                </h2>

                                <p className="text-sm font-bold text-emerald-700 sm:text-base">
                                    {official.position}
                                </p>

                                {official.summary && (
                                    <p className="max-w-2xl pt-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                                        {official.summary}
                                    </p>
                                )}

                                {/* Meta Pills */}
                                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs sm:justify-start">
                                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 font-bold text-slate-800 shadow-2xs">
                                        <Award className="size-3.5 text-emerald-600" />
                                        NIP/ID: {employeeId}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 font-bold text-slate-800 shadow-2xs">
                                        Masa Jabatan: {term}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="space-y-8 bg-white p-6 sm:p-8">
                        {/* Section 1: Tentang & Fokus Pelayanan Grid */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Tentang Perangkat */}
                            <div className="space-y-2.5 rounded-2xl border border-l-4 border-slate-200/90 border-l-emerald-600 bg-slate-50/70 p-5">
                                <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-slate-800 uppercase">
                                    <BadgeCheck className="size-4 text-emerald-600" />
                                    <span>Tentang Perangkat Desa</span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                                    {official.about ||
                                        'Aparatur Pemerintah Desa Ngampungan yang bertugas melayani masyarakat dengan dedikasi dan profesionalitas.'}
                                </p>
                            </div>

                            {/* Fokus Pelayanan */}
                            <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5">
                                <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-slate-800 uppercase">
                                    <ShieldCheck className="size-4 text-emerald-600" />
                                    <span>Fokus Pelayanan</span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-0.5">
                                    {serviceFocusList.length > 0 ? (
                                        serviceFocusList.map((focus) => (
                                            <span
                                                key={focus}
                                                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs"
                                            >
                                                {focus}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-500 italic">
                                            Pelayanan Masyarakat Desa
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Tugas dan Tanggung Jawab */}
                        {responsibilitiesList.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-800">
                                        <BriefcaseBusiness className="size-4" />
                                    </span>
                                    <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase sm:text-sm">
                                        Tugas dan Tanggung Jawab
                                    </h3>
                                </div>
                                <ul className="grid gap-3 sm:grid-cols-2">
                                    {responsibilitiesList.map((resp) => (
                                        <li
                                            key={resp}
                                            className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-xs leading-relaxed font-medium text-slate-700 shadow-2xs transition hover:border-slate-300"
                                        >
                                            <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                            <span>{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Section 3: Pendidikan & Riwayat Jabatan */}
                        {(educationList.length > 0 ||
                            careerList.length > 0) && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-800">
                                        <GraduationCap className="size-4" />
                                    </span>
                                    <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase sm:text-sm">
                                        Pendidikan dan Riwayat Jabatan
                                    </h3>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Education */}
                                    {educationList.length > 0 && (
                                        <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-2xs">
                                            <h4 className="text-xs font-extrabold tracking-wider text-slate-800 uppercase">
                                                Pendidikan Formil
                                            </h4>
                                            <ul className="space-y-2">
                                                {educationList.map((edu) => (
                                                    <li
                                                        key={edu}
                                                        className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3.5 text-xs font-semibold text-slate-800 shadow-2xs"
                                                    >
                                                        <span className="size-2 shrink-0 rounded-full bg-slate-400" />
                                                        <span>{edu}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Career */}
                                    {careerList.length > 0 && (
                                        <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-2xs">
                                            <h4 className="text-xs font-extrabold tracking-wider text-slate-800 uppercase">
                                                Riwayat Jabatan
                                            </h4>
                                            <ol className="space-y-2">
                                                {careerList.map((car) => (
                                                    <li
                                                        key={`${car.period}-${car.role}`}
                                                        className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs"
                                                    >
                                                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800">
                                                            {car.period}
                                                        </span>
                                                        <p className="mt-1 text-xs font-bold text-slate-900">
                                                            {car.role}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Footer Action */}
                        <div className="flex justify-end border-t border-slate-100 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer rounded-xl bg-slate-800 px-7 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-900 active:scale-95"
                            >
                                Tutup Profil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
