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
import { useEffect } from 'react';
import type { VillageOfficial } from '@/lib/dummy-village-government';

type VillageOfficialDetailModalProps = {
    official: VillageOfficial | null;
    onClose: () => void;
};

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

    if (!official) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="official-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6 animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Modal Container */}
            <div
                className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl transition-all duration-300 transform flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Floating Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup modal"
                    className="absolute top-4 right-4 z-30 flex size-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                >
                    <X className="size-4" />
                </button>

                {/* Scrollable Container */}
                <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                    
                    {/* Header Banner - Soft Emerald Header */}
                    <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 border-b border-emerald-100/80 p-6 sm:p-8 text-slate-900">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar / Photo Container */}
                            <div className="relative aspect-[4/5] w-28 sm:w-36 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-1 shadow-sm flex items-center justify-center">
                                {official.photo ? (
                                    <img
                                        src={official.photo}
                                        alt={`Foto ${official.name}`}
                                        className="h-full w-full object-contain object-bottom rounded-xl"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 text-emerald-800 font-extrabold text-3xl shadow-inner">
                                        {official.initials}
                                    </div>
                                )}
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 text-center sm:text-left space-y-2">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-2xs">
                                        <UserCheck className="size-3" />
                                        {official.unit}
                                    </span>
                                </div>

                                <h2
                                    id="official-modal-title"
                                    className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight"
                                >
                                    {official.name}
                                </h2>

                                <p className="text-sm sm:text-base font-bold text-emerald-700">
                                    {official.position}
                                </p>

                                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 max-w-2xl pt-0.5">
                                    {official.summary}
                                </p>

                                {/* Meta Pills */}
                                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 font-bold text-slate-800 border border-slate-200 shadow-2xs">
                                        <Award className="size-3.5 text-emerald-600" />
                                        NIP/ID: {official.employeeId}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 font-bold text-slate-800 border border-slate-200 shadow-2xs">
                                        Masa Jabatan: {official.term}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 sm:p-8 space-y-8 bg-white">
                        
                        {/* Section 1: Tentang & Fokus Pelayanan Grid */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Tentang Perangkat */}
                            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-2.5 border-l-4 border-l-emerald-500">
                                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                                    <BadgeCheck className="size-4 text-emerald-600" />
                                    <span>Tentang Perangkat Desa</span>
                                </div>
                                <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                                    {official.about}
                                </p>
                            </div>

                            {/* Fokus Pelayanan */}
                            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                                    <ShieldCheck className="size-4 text-emerald-600" />
                                    <span>Fokus Pelayanan</span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-0.5">
                                    {official.serviceFocus.map((focus) => (
                                        <span
                                            key={focus}
                                            className="inline-flex items-center rounded-xl border border-emerald-200/80 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs"
                                        >
                                            {focus}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Tugas dan Tanggung Jawab */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                                    <BriefcaseBusiness className="size-4" />
                                </span>
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                                    Tugas dan Tanggung Jawab
                                </h3>
                            </div>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {official.responsibilities.map((resp) => (
                                    <li
                                        key={resp}
                                        className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-xs font-medium leading-relaxed text-slate-700 shadow-2xs hover:border-emerald-300 transition"
                                    >
                                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                        <span>{resp}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Section 3: Pendidikan & Riwayat Jabatan */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                                    <GraduationCap className="size-4" />
                                </span>
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                                    Pendidikan dan Riwayat Jabatan
                                </h3>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                {/* Education */}
                                <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-2xs">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                                        Pendidikan Formil
                                    </h4>
                                    <ul className="space-y-2">
                                        {official.education.map((edu) => (
                                            <li
                                                key={edu}
                                                className="rounded-xl border border-emerald-200/80 bg-white p-3.5 text-xs font-semibold text-slate-800 flex items-center gap-2.5 shadow-2xs"
                                            >
                                                <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                                                <span>{edu}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Career */}
                                <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-2xs">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                                        Riwayat Jabatan
                                    </h4>
                                    <ol className="space-y-2">
                                        {official.career.map((car) => (
                                            <li
                                                key={`${car.period}-${car.role}`}
                                                className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs"
                                            >
                                                <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                                    {car.period}
                                                </span>
                                                <p className="mt-1 text-xs font-bold text-slate-900">
                                                    {car.role}
                                                </p>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="flex justify-end border-t border-slate-100 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl bg-emerald-600 px-7 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition active:scale-95 cursor-pointer"
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
