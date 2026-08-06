import { CheckCircle2, Landmark, ShieldCheck, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

function InstitutionLogo({
    logoUrl,
    name,
    acronym,
}: {
    logoUrl: string | null | undefined;
    name: string;
    acronym: string;
}) {
    const [hasImageError, setHasImageError] = useState(false);

    if (logoUrl && !hasImageError) {
        return (
            <img
                src={logoUrl}
                alt={`Logo ${name}`}
                className="h-full w-full object-contain"
                onError={() => setHasImageError(true)}
            />
        );
    }

    return (
        <div className="flex size-full items-center justify-center rounded-xl bg-emerald-800 text-xl font-black text-white shadow-xs">
            {acronym}
        </div>
    );
}

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

    if (!institution) {
        return null;
    }

    const memberList = institution.members || [];
    const responsibilitiesList = institution.responsibilities || [];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="institution-modal-title"
            className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-3 duration-200 fade-in sm:p-6"
            onClick={onClose}
        >
            {/* Modal Container */}
            <div
                className="relative flex max-h-[90vh] w-full max-w-3xl transform flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl transition-all duration-300"
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
                    {/* Header Banner - Soft Header */}
                    <div className="relative border-b border-slate-200/80 bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-100 p-6 text-slate-900 sm:p-8">
                        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                            {/* Logo or Badge Container */}
                            <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-2 shadow-sm sm:size-24">
                                <InstitutionLogo
                                    key={`${institution.id}-${institution.logo_url ?? 'acronym'}`}
                                    logoUrl={institution.logo_url}
                                    name={institution.name}
                                    acronym={institution.acronym}
                                />
                            </div>

                            {/* Main Title & Meta */}
                            <div className="flex-1 space-y-2 text-center sm:text-left">
                                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800 px-3.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-2xs">
                                        <Landmark className="size-3" />
                                        {institution.acronym}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-700 shadow-2xs">
                                        <Users className="size-3 text-emerald-600" />
                                        {institution.member_count} Anggota
                                        Terdaftar
                                    </span>
                                </div>

                                <h2
                                    id="institution-modal-title"
                                    className="text-2xl leading-tight font-extrabold text-slate-900 sm:text-3xl"
                                >
                                    {institution.name}
                                </h2>

                                {institution.leader && (
                                    <p className="text-xs font-semibold text-slate-600 sm:text-sm">
                                        Ketua Lembaga:{' '}
                                        <span className="font-bold text-slate-900">
                                            {institution.leader}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="space-y-8 bg-white p-6 sm:p-8">
                        {/* Focus & Description */}
                        <div className="space-y-4">
                            <div className="space-y-2 rounded-2xl border border-l-4 border-slate-200/90 border-l-emerald-600 bg-slate-50/70 p-5">
                                <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-slate-800 uppercase">
                                    <ShieldCheck className="size-4 text-emerald-600" />
                                    <span>Fokus Utama Lembaga</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-800 sm:text-sm">
                                    {institution.focus}
                                </p>
                            </div>

                            {institution.description && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-extrabold tracking-wider text-slate-700 uppercase">
                                        Gambaran Umum & Peran Lembaga
                                    </h3>
                                    <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                                        {institution.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Poin Tugas & Fungsi Utama */}
                        {responsibilitiesList.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-extrabold tracking-wider text-slate-700 uppercase">
                                    Tugas & Peran Utama
                                </h3>
                                <div className="grid gap-2.5">
                                    {responsibilitiesList.map((resp, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 text-xs font-medium text-slate-700 shadow-2xs"
                                        >
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                            <span>{resp}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Daftar Pengurus & Anggota */}
                        <div className="space-y-3 border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                                        <Users className="size-4 text-emerald-600" />
                                    </span>
                                    <h3 className="text-xs font-extrabold tracking-wider text-slate-900 uppercase sm:text-sm">
                                        Daftar Pengurus & Anggota (
                                        {memberList.length})
                                    </h3>
                                </div>
                            </div>

                            {memberList.length > 0 ? (
                                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="border-b border-slate-200 bg-slate-50 font-extrabold tracking-wider text-slate-700 uppercase">
                                                <tr>
                                                    <th className="px-4 py-3">
                                                        No
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Nama Anggota / Pengurus
                                                    </th>
                                                    <th className="px-4 py-3 text-right">
                                                        Jabatan / Peran
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {memberList.map(
                                                    (member, idx) => (
                                                        <tr
                                                            key={idx}
                                                            className="transition hover:bg-slate-50/60"
                                                        >
                                                            <td className="w-12 px-4 py-3 font-semibold text-slate-400">
                                                                {idx + 1}
                                                            </td>
                                                            <td className="px-4 py-3 font-bold text-slate-900">
                                                                {member.name}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <span className="inline-block rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-800">
                                                                    {member.role ||
                                                                        'Anggota'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-500">
                                    Daftar pengurus/anggota rinci belum
                                    diinputkan oleh pengurus.
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="flex justify-end border-t border-slate-100 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer rounded-xl bg-slate-800 px-7 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-900 active:scale-95"
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
