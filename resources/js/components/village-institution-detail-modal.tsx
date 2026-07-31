import {
    Check,
    CheckCircle2,
    Landmark,
    ShieldCheck,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useEffect } from 'react';

export type InstitutionMember = {
    name: string;
    role: string;
};

export type VillageInstitutionData = {
    id: number;
    acronym: string;
    logo_url?: string | null;
    name: string;
    leader: string | null;
    member_count: number;
    focus: string;
    description?: string | null;
    responsibilities?: string[] | null;
    members?: InstitutionMember[] | null;
    sort_order?: number;
};

type VillageInstitutionDetailModalProps = {
    institution: VillageInstitutionData | null;
    onClose: () => void;
};

export function VillageInstitutionDetailModal({
    institution,
    onClose,
}: VillageInstitutionDetailModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (institution) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [institution, onClose]);

    if (!institution) return null;

    const memberList = institution.members || [];
    const responsibilitiesList = institution.responsibilities || [];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="institution-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6 animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Modal Container */}
            <div
                className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl transition-all duration-300 transform flex flex-col"
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

                    {/* Header Banner - Soft Header */}
                    <div className="relative bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-100 border-b border-slate-200/80 p-6 sm:p-8 text-slate-900">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                            {/* Logo or Badge Container */}
                            <div className="relative flex size-20 sm:size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-2 shadow-sm">
                                {institution.logo_url ? (
                                    <img
                                        src={institution.logo_url}
                                        alt={`Logo ${institution.name}`}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center rounded-xl bg-emerald-800 font-black text-xl text-white shadow-xs">
                                        {institution.acronym}
                                    </div>
                                )}
                            </div>

                            {/* Main Title & Meta */}
                            <div className="flex-1 text-center sm:text-left space-y-2">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800 px-3.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-2xs">
                                        <Landmark className="size-3" />
                                        {institution.acronym}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-700 border border-slate-200 shadow-2xs">
                                        <Users className="size-3 text-emerald-600" />
                                        {institution.member_count} Anggota Terdaftar
                                    </span>
                                </div>

                                <h2
                                    id="institution-modal-title"
                                    className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight"
                                >
                                    {institution.name}
                                </h2>

                                {institution.leader && (
                                    <p className="text-xs sm:text-sm font-semibold text-slate-600">
                                        Ketua Lembaga: <span className="font-bold text-slate-900">{institution.leader}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 sm:p-8 space-y-8 bg-white">

                        {/* Focus & Description */}
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-2 border-l-4 border-l-emerald-600">
                                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-800">
                                    <ShieldCheck className="size-4 text-emerald-600" />
                                    <span>Fokus Utama Lembaga</span>
                                </div>
                                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                                    {institution.focus}
                                </p>
                            </div>

                            {institution.description && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                                        Gambaran Umum & Peran Lembaga
                                    </h3>
                                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                                        {institution.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Poin Tugas & Fungsi Utama */}
                        {responsibilitiesList.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                                    Tugas & Peran Utama
                                </h3>
                                <div className="grid gap-2.5">
                                    {responsibilitiesList.map((resp, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 text-xs font-medium text-slate-700 shadow-2xs"
                                        >
                                            <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                                            <span>{resp}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Daftar Pengurus & Anggota */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                                        <Users className="size-4 text-emerald-600" />
                                    </span>
                                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                                        Daftar Pengurus & Anggota ({memberList.length})
                                    </h3>
                                </div>
                            </div>

                            {memberList.length > 0 ? (
                                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-4 py-3">No</th>
                                                    <th className="px-4 py-3">Nama Anggota / Pengurus</th>
                                                    <th className="px-4 py-3 text-right">Jabatan / Peran</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {memberList.map((member, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                                                        <td className="px-4 py-3 font-semibold text-slate-400 w-12">{idx + 1}</td>
                                                        <td className="px-4 py-3 font-bold text-slate-900">{member.name}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-800 border border-slate-200">
                                                                {member.role || 'Anggota'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-500">
                                    Daftar pengurus/anggota rinci belum diinputkan oleh pengurus.
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="flex justify-end border-t border-slate-100 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl bg-slate-800 px-7 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-900 transition active:scale-95 cursor-pointer"
                            >
                                Tutup Detail
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
