import { Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Copy,
    ExternalLink,
    Eye,
    FileText,
    Image as ImageIcon,
    Info,
    LoaderCircle,
    LockKeyhole,
    RefreshCw,
    ShieldAlert,
    Trash2,
    Upload,
    UserRound,
} from 'lucide-react';
import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import ServiceApplicationController from '@/actions/App/Http/Controllers/Public/ServiceApplicationController';
import InputError from '@/components/input-error';
import type {
    VillageService,
    VillageServiceApplicationDetail,
} from '@/lib/dummy-village-services';
import { track as trackServiceApplication } from '@/routes/service-applications';

export type ServiceApplicationSuccess = {
    referenceNumber: string;
    serviceTitle: string;
    submittedAt: string;
};

type ApplicationFormProps = {
    service: VillageService;
    detail: VillageServiceApplicationDetail;
    submissionSuccess: ServiceApplicationSuccess | null;
};

type ServiceApplicationFormData = {
    applicant_name: string;
    national_id: string;
    phone: string;
    address: string;
    purpose: string;
    documents: Record<string, File | null>;
    privacy_consent: boolean;
    website: string;
};

type ClientErrors = Record<string, string | undefined>;

const maximumFileSize = 10 * 1024 * 1024;

const formSteps = [
    {
        number: 1,
        label: 'Data Pemohon',
        icon: UserRound,
    },
    {
        number: 2,
        label: 'Dokumen',
        icon: Upload,
    },
    {
        number: 3,
        label: 'Periksa',
        icon: FileText,
    },
] as const;

function formatFileSize(bytes: number): string {
    return `${(bytes / 1024 / 1024).toLocaleString('id-ID', {
        maximumFractionDigits: 2,
    })} MB`;
}

function maskNationalId(nationalId: string): string {
    if (nationalId.length < 8) {
        return nationalId;
    }

    return `${nationalId.slice(0, 4)} •••• •••• ${nationalId.slice(-4)}`;
}

export function VillageServiceApplicationForm({
    service,
    detail,
    submissionSuccess,
}: ApplicationFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [clientErrors, setClientErrors] = useState<ClientErrors>({});
    const [isSuccessDismissed, setIsSuccessDismissed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [deletingDocumentKey, setDeletingDocumentKey] = useState<
        string | null
    >(null);

    const handleCopyReference = (refNo: string) => {
        if (!refNo) return;
        navigator.clipboard.writeText(refNo);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const form = useForm<ServiceApplicationFormData>({
        applicant_name: '',
        national_id: '',
        phone: '',
        address: '',
        purpose: '',
        documents: Object.fromEntries(
            detail.requiredDocuments.map((document) => [document.key, null]),
        ),
        privacy_consent: false,
        website: '',
    });

    const serverErrors = form.errors as Record<string, string | undefined>;
    const visibleSuccess = isSuccessDismissed ? null : submissionSuccess;

    const clearFieldError = (field: string) => {
        setClientErrors((currentErrors) => ({
            ...currentErrors,
            [field]: undefined,
        }));
        form.clearErrors();
    };

    const fieldError = (
        clientField: string,
        serverField = clientField,
    ): string | undefined =>
        clientErrors[clientField] ?? serverErrors[serverField];

    const validateApplicantData = (): boolean => {
        const nextErrors: ClientErrors = {};

        if (form.data.applicant_name.trim().length < 3) {
            nextErrors.applicant_name = 'Nama lengkap minimal 3 karakter.';
        }

        if (!/^\d{16}$/.test(form.data.national_id)) {
            nextErrors.national_id = 'NIK harus terdiri dari 16 angka.';
        }

        if (!/^(\+62|62|0)\d{8,13}$/.test(form.data.phone)) {
            nextErrors.phone = 'Masukkan nomor telepon Indonesia yang valid.';
        }

        if (form.data.address.trim().length < 10) {
            nextErrors.address = 'Alamat minimal 10 karakter.';
        }

        if (form.data.purpose.trim().length < 10) {
            nextErrors.purpose = 'Tujuan pengajuan minimal 10 karakter.';
        }

        setClientErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const validateDocuments = (): boolean => {
        const nextErrors: ClientErrors = {};

        detail.requiredDocuments.forEach((document) => {
            if (document.required && !form.data.documents[document.key]) {
                nextErrors[`document-${document.key}`] =
                    `${document.label} wajib dipilih.`;
            }
        });

        setClientErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const confirmDeleteDocument = () => {
        if (!deletingDocumentKey) return;

        form.setData('documents', {
            ...form.data.documents,
            [deletingDocumentKey]: null,
        });
        clearFieldError(`document-${deletingDocumentKey}`);

        const fileInput = document.getElementById(
            `document-${deletingDocumentKey}`,
        ) as HTMLInputElement | null;
        if (fileInput) {
            fileInput.value = '';
        }

        setDeletingDocumentKey(null);
    };

    const previewUploadedDocument = (file: File | null) => {
        if (!file || typeof window === 'undefined') {
            return;
        }

        try {
            const objectUrl = URL.createObjectURL(file);
            const previewWindow = window.open(objectUrl, '_blank');

            if (!previewWindow) {
                alert(
                    'Pop-up diblokir oleh browser. Harap izinkan pop-up pada browser Anda untuk melihat pratinjau berkas.',
                );
            }
        } catch (error) {
            console.error('Gagal membuka pratinjau berkas:', error);
        }
    };

    const handleDocumentChange = (
        documentKey: string,
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0] ?? null;
        const errorKey = `document-${documentKey}`;

        if (file) {
            if (file.size > maximumFileSize) {
                form.setData('documents', {
                    ...form.data.documents,
                    [documentKey]: null,
                });
                setClientErrors((currentErrors) => ({
                    ...currentErrors,
                    [errorKey]: 'Ukuran berkas melebihi batas maksimal 10 MB.',
                }));
                event.target.value = '';

                return;
            }

            const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
            const targetDoc = detail.requiredDocuments.find(
                (d) => d.key === documentKey,
            );
            const acceptedList =
                targetDoc?.acceptedFormats
                    .split(',')
                    .map((f) => f.trim().toLowerCase()) ?? [];

            if (acceptedList.length > 0 && !acceptedList.includes(extension)) {
                form.setData('documents', {
                    ...form.data.documents,
                    [documentKey]: null,
                });
                setClientErrors((currentErrors) => ({
                    ...currentErrors,
                    [errorKey]: `Format berkas tidak didukung. Format yang diizinkan: ${targetDoc?.acceptedFormats}`,
                }));
                event.target.value = '';

                return;
            }
        }

        form.setData('documents', {
            ...form.data.documents,
            [documentKey]: file,
        });
        clearFieldError(errorKey);
    };

    const continueToNextStep = () => {
        if (currentStep === 1 && !validateApplicantData()) {
            return;
        }

        if (currentStep === 2 && !validateDocuments()) {
            return;
        }

        setCurrentStep((step) => Math.min(step + 1, 3));
    };

    const returnToPreviousStep = () => {
        setClientErrors({});
        form.clearErrors();
        setCurrentStep((step) => Math.max(step - 1, 1));
    };

    const submitApplication = (
        event?: FormEvent<HTMLFormElement> | React.MouseEvent,
    ) => {
        if (event) {
            event.preventDefault();
        }

        if (!form.data.privacy_consent) {
            setClientErrors({
                privacy_consent:
                    'Persetujuan penyimpanan data wajib diberikan.',
            });

            return;
        }

        form.post(ServiceApplicationController.url(service.slug), {
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => {
                const errorKeys = Object.keys(errors);

                if (
                    errorKeys.some((key) =>
                        [
                            'applicant_name',
                            'national_id',
                            'phone',
                            'address',
                            'purpose',
                        ].includes(key),
                    )
                ) {
                    setCurrentStep(1);
                } else if (
                    errorKeys.some((key) => key.startsWith('documents'))
                ) {
                    setCurrentStep(2);
                }
            },
            onSuccess: () => {
                formRef.current?.reset();
                form.reset();
                setClientErrors({});
                setCurrentStep(1);
                setIsSuccessDismissed(false);
            },
        });
    };

    const startAnotherApplication = () => {
        setIsSuccessDismissed(true);
        form.reset();
        setCurrentStep(1);
    };

    if (visibleSuccess) {
        const waMessage = `Halo Admin Desa Ngampungan, saya telah mengirim pengajuan *${visibleSuccess.serviceTitle}* melalui website desa.\n\n*Rincian Pengajuan:*\n• Kode Resi: *${visibleSuccess.referenceNumber}*\n• Waktu: ${visibleSuccess.submittedAt} WIB\n\nMohon untuk dapat diproses. Terima kasih!`;
        const villageWaNumber =
            import.meta.env.VITE_VILLAGE_WHATSAPP_NUMBER || '6281234567890';
        const waUrl = `https://wa.me/${villageWaNumber}?text=${encodeURIComponent(waMessage)}`;

        return (
            <div
                role="status"
                className="overflow-hidden rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl md:p-8"
            >
                <div className="flex flex-col items-start gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner">
                        <CheckCircle2 aria-hidden="true" className="size-8" />
                    </div>
                    <div className="w-full">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-black tracking-wider text-emerald-800 uppercase">
                            Pengajuan Berhasil Diterima
                        </span>
                        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                            Pengajuan {visibleSuccess.serviceTitle} Berhasil
                        </h3>

                        <div className="mt-4 rounded-2xl border border-emerald-200/90 bg-emerald-50/60 p-4 sm:p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <span className="text-[11px] font-extrabold tracking-wider text-emerald-800 uppercase">
                                        Nomor Resi Referensi Anda
                                    </span>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                                        <code className="rounded-xl border border-emerald-300 bg-white px-3.5 py-1.5 font-mono text-base font-black tracking-widest text-emerald-950 shadow-2xs">
                                            {visibleSuccess.referenceNumber}
                                        </code>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopyReference(
                                                    visibleSuccess.referenceNumber,
                                                )
                                            }
                                            title="Salin Kode Resi"
                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3.5 py-1.5 text-xs font-extrabold text-emerald-800 shadow-2xs transition-all hover:bg-emerald-100 hover:text-emerald-900 active:scale-95"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="size-4 text-emerald-600" />
                                                    <span className="font-bold text-emerald-700">
                                                        Resi Tersalin!
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-4 text-emerald-700" />
                                                    <span>Salin Resi</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-emerald-900/80">
                                📌 <strong>Penting:</strong> Silakan salin atau
                                simpan nomor resi di atas. Nomor resi ini
                                digunakan untuk memantau perkembangan pengajuan
                                layanan Anda secara mandiri di menu{' '}
                                <strong>Lacak Pengajuan</strong> tanpa harus
                                datang langsung ke balai desa.
                            </p>
                        </div>
                    </div>

                    <div className="mt-2 flex w-full flex-wrap gap-3">
                        <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-extrabold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                        >
                            <svg
                                className="size-4 fill-current"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.486 1.332 5.006L2 22l5.127-1.341c1.465.8 3.118 1.222 4.88 1.223h.005c5.507 0 9.991-4.478 9.992-9.985.001-2.666-1.033-5.172-2.918-7.058C17.199 3.033 14.685 2 12.012 2zm5.836 14.195c-.244.688-1.427 1.314-1.968 1.397-.541.082-1.227.118-3.522-.81-2.73-1.107-4.484-3.87-4.62-4.053-.135-.183-1.11-1.477-1.11-2.817 0-1.34.704-1.996.955-2.261.25-.265.545-.331.727-.331.183 0 .365.002.523.01.168.007.395-.064.618.472.228.548.775 1.892.842 2.03.068.138.114.301.023.485-.092.184-.138.3-.274.458-.137.158-.288.353-.412.474-.137.135-.28.283-.12.557.16.273.71 1.173 1.526 1.9 1.05.937 1.936 1.227 2.21 1.363.273.136.434.114.594-.069.16-.183.684-.798.867-1.072.183-.273.365-.228.616-.136.251.092 1.597.753 1.871.89.274.137.456.205.524.319.068.114.068.664-.176 1.352z" />
                            </svg>
                            Konfirmasi via WA Desa
                        </a>

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 active:scale-[0.98]"
                        >
                            Cetak Bukti Resi
                        </button>

                        <Link
                            href={trackServiceApplication.url({
                                query: {
                                    reference: visibleSuccess.referenceNumber,
                                },
                            })}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-emerald-700 shadow-2xs transition-all hover:bg-emerald-50 active:scale-[0.98]"
                        >
                            Lacak Status Pengajuan
                        </Link>

                        <button
                            type="button"
                            onClick={startAnotherApplication}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-[0.98]"
                        >
                            Buat Pengajuan Baru
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form ref={formRef} noValidate onSubmit={submitApplication}>
            {/* Modernized Stepper Header */}
            <ol
                aria-label="Tahapan formulir pengajuan"
                className="grid grid-cols-1 gap-2.5 rounded-2xl border border-slate-200/60 bg-slate-100/80 p-2 md:grid-cols-3"
            >
                {formSteps.map((step) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === step.number;
                    const isComplete = currentStep > step.number;

                    return (
                        <li
                            key={step.number}
                            aria-current={isActive ? 'step' : undefined}
                            className={`relative flex items-center gap-3.5 rounded-xl p-3.5 transition-all duration-200 ${
                                isActive
                                    ? 'bg-white shadow-xs ring-1 ring-slate-900/5'
                                    : isComplete
                                      ? 'bg-white/60 text-slate-700'
                                      : 'text-slate-500'
                            }`}
                        >
                            <span
                                className={`flex size-9 shrink-0 items-center justify-center rounded-xl font-bold transition-colors ${
                                    isComplete
                                        ? 'bg-emerald-700 text-white shadow-xs'
                                        : isActive
                                          ? 'bg-emerald-700 text-white shadow-xs'
                                          : 'bg-slate-200/70 text-slate-600'
                                }`}
                            >
                                {isComplete ? (
                                    <Check
                                        aria-hidden="true"
                                        className="size-4.5 stroke-[2.5]"
                                    />
                                ) : (
                                    <StepIcon
                                        aria-hidden="true"
                                        className="size-4.5"
                                    />
                                )}
                            </span>
                            <div>
                                <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                    Tahap {step.number}
                                </span>
                                <span
                                    className={`block text-xs leading-tight font-bold ${
                                        isActive
                                            ? 'text-slate-900'
                                            : 'text-slate-700'
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>

            {/* Main Form Container */}
            <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-9">
                {(Object.values(clientErrors).some(Boolean) ||
                    Object.values(serverErrors).some(Boolean)) && (
                    <div
                        role="alert"
                        className="mb-6 rounded-2xl border-l-4 border-rose-500 bg-rose-50/80 p-4 text-xs font-semibold text-rose-800 shadow-2xs"
                    >
                        Pengajuan belum dapat dikirim. Periksa kembali bagian
                        yang ditandai.
                    </div>
                )}

                <div
                    aria-hidden="true"
                    className="absolute -left-[10000px] size-px overflow-hidden"
                >
                    <label htmlFor="application-website">Website</label>
                    <input
                        id="application-website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.data.website}
                        onChange={(event) =>
                            form.setData('website', event.target.value)
                        }
                    />
                </div>

                {currentStep === 1 && (
                    <fieldset className="mt-2">
                        <legend className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                            Data pemohon
                        </legend>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                            Data ini digunakan petugas untuk memverifikasi dan
                            menghubungi pemohon.
                        </p>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="applicant-name"
                                    className="text-xs font-bold text-slate-800"
                                >
                                    Nama lengkap{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="applicant-name"
                                    value={form.data.applicant_name}
                                    onChange={(event) => {
                                        form.setData(
                                            'applicant_name',
                                            event.target.value,
                                        );
                                        clearFieldError('applicant_name');
                                    }}
                                    aria-invalid={Boolean(
                                        fieldError('applicant_name'),
                                    )}
                                    aria-describedby="applicant-name-error"
                                    autoComplete="name"
                                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-600 focus:bg-white focus:shadow-xs focus:ring-4 focus:ring-emerald-600/10"
                                />
                                <InputError
                                    id="applicant-name-error"
                                    message={fieldError('applicant_name')}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="applicant-national-id"
                                    className="text-xs font-bold text-slate-800"
                                >
                                    NIK <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="applicant-national-id"
                                    inputMode="numeric"
                                    maxLength={16}
                                    value={form.data.national_id}
                                    onChange={(event) => {
                                        form.setData(
                                            'national_id',
                                            event.target.value.replace(
                                                /\D/g,
                                                '',
                                            ),
                                        );
                                        clearFieldError('national_id');
                                    }}
                                    aria-invalid={Boolean(
                                        fieldError('national_id'),
                                    )}
                                    aria-describedby="applicant-national-id-error"
                                    autoComplete="off"
                                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-600 focus:bg-white focus:shadow-xs focus:ring-4 focus:ring-emerald-600/10"
                                />
                                <InputError
                                    id="applicant-national-id-error"
                                    message={fieldError('national_id')}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="applicant-phone"
                                    className="text-xs font-bold text-slate-800"
                                >
                                    Nomor telepon{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="applicant-phone"
                                    type="tel"
                                    value={form.data.phone}
                                    onChange={(event) => {
                                        form.setData(
                                            'phone',
                                            event.target.value.replace(
                                                /[^\d+]/g,
                                                '',
                                            ),
                                        );
                                        clearFieldError('phone');
                                    }}
                                    aria-invalid={Boolean(fieldError('phone'))}
                                    aria-describedby="applicant-phone-error"
                                    autoComplete="tel"
                                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-600 focus:bg-white focus:shadow-xs focus:ring-4 focus:ring-emerald-600/10"
                                />
                                <InputError
                                    id="applicant-phone-error"
                                    message={fieldError('phone')}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="applicant-address"
                                    className="text-xs font-bold text-slate-800"
                                >
                                    Alamat{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    id="applicant-address"
                                    rows={3}
                                    value={form.data.address}
                                    onChange={(event) => {
                                        form.setData(
                                            'address',
                                            event.target.value,
                                        );
                                        clearFieldError('address');
                                    }}
                                    aria-invalid={Boolean(
                                        fieldError('address'),
                                    )}
                                    aria-describedby="applicant-address-error"
                                    autoComplete="street-address"
                                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-600 focus:bg-white focus:shadow-xs focus:ring-4 focus:ring-emerald-600/10"
                                />
                                <InputError
                                    id="applicant-address-error"
                                    message={fieldError('address')}
                                    className="mt-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="application-purpose"
                                    className="text-xs font-bold text-slate-800"
                                >
                                    Tujuan pengajuan{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    id="application-purpose"
                                    rows={4}
                                    value={form.data.purpose}
                                    onChange={(event) => {
                                        form.setData(
                                            'purpose',
                                            event.target.value,
                                        );
                                        clearFieldError('purpose');
                                    }}
                                    aria-invalid={Boolean(
                                        fieldError('purpose'),
                                    )}
                                    aria-describedby="application-purpose-error"
                                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-600 focus:bg-white focus:shadow-xs focus:ring-4 focus:ring-emerald-600/10"
                                />
                                <InputError
                                    id="application-purpose-error"
                                    message={fieldError('purpose')}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </fieldset>
                )}

                {currentStep === 2 && (
                    <fieldset className="mt-2">
                        <legend className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                            Dokumen persyaratan
                        </legend>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                            Format yang diizinkan: PDF, JPG, JPEG, atau PNG.
                            Maksimal 10 MB per berkas.
                        </p>

                        <div className="mt-6 grid gap-4">
                            {detail.requiredDocuments.map((docItem) => {
                                const clientErrorKey = `document-${docItem.key}`;
                                const serverErrorKey = `documents.${docItem.key}`;
                                const selectedFile =
                                    form.data.documents[docItem.key];
                                const hasError = Boolean(
                                    fieldError(clientErrorKey, serverErrorKey),
                                );
                                const isSelected = Boolean(
                                    selectedFile &&
                                    (selectedFile instanceof File ||
                                        selectedFile instanceof Blob),
                                );

                                return (
                                    <div
                                        key={docItem.key}
                                        className={`rounded-2xl border p-4 transition-all md:p-5 ${
                                            hasError
                                                ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-500/20'
                                                : isSelected
                                                  ? 'border-emerald-300/80 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                                                  : 'border-slate-200/80 bg-slate-50/60 hover:border-emerald-200 hover:bg-emerald-50/20'
                                        }`}
                                    >
                                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <label
                                                        htmlFor={`document-${docItem.key}`}
                                                        className="text-xs font-bold text-slate-900"
                                                    >
                                                        {docItem.label}
                                                        {docItem.required ? (
                                                            <span className="text-rose-500">
                                                                {' '}
                                                                *
                                                            </span>
                                                        ) : (
                                                            <span className="ml-2 rounded-md bg-slate-200/70 px-2 py-0.5 text-[10px] font-extrabold text-slate-600 uppercase">
                                                                Opsional
                                                            </span>
                                                        )}
                                                    </label>
                                                    {isSelected && (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                                                            <Check className="size-3 stroke-[3]" />
                                                            Berkas Terpilih
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                                    {docItem.description}
                                                </p>
                                            </div>

                                            {!isSelected && (
                                                <label
                                                    htmlFor={`document-${docItem.key}`}
                                                    className="inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-2xs transition-all hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.98]"
                                                >
                                                    <Upload
                                                        aria-hidden="true"
                                                        className="size-4 text-emerald-700"
                                                    />
                                                    Pilih berkas
                                                </label>
                                            )}
                                        </div>

                                        <input
                                            id={`document-${docItem.key}`}
                                            type="file"
                                            accept={docItem.acceptedFormats}
                                            onChange={(event) =>
                                                handleDocumentChange(
                                                    docItem.key,
                                                    event,
                                                )
                                            }
                                            aria-invalid={hasError}
                                            aria-describedby={`${clientErrorKey}-status ${clientErrorKey}-error`}
                                            className="sr-only"
                                        />

                                        {isSelected && selectedFile ? (
                                            <div className="mt-3.5 flex flex-col justify-between gap-3 rounded-xl border border-emerald-200/80 bg-white p-3 shadow-2xs sm:flex-row sm:items-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        previewUploadedDocument(
                                                            selectedFile,
                                                        )
                                                    }
                                                    className="group flex min-w-0 cursor-pointer items-center gap-3 text-left transition-all hover:opacity-95"
                                                    title="Klik untuk membuka & melihat pratinjau berkas"
                                                >
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100/70 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                                                        {selectedFile.type.includes(
                                                            'image',
                                                        ) ? (
                                                            <ImageIcon className="size-4.5" />
                                                        ) : (
                                                            <FileText className="size-4.5" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="truncate text-xs font-bold text-slate-800 group-hover:text-emerald-700 group-hover:underline">
                                                                {
                                                                    selectedFile.name
                                                                }
                                                            </p>
                                                            <ExternalLink className="size-3 shrink-0 text-emerald-600 opacity-75 group-hover:opacity-100" />
                                                        </div>
                                                        <p className="text-[11px] font-semibold text-slate-500">
                                                            {formatFileSize(
                                                                selectedFile.size,
                                                            )}
                                                        </p>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeletingDocumentKey(
                                                            docItem.key,
                                                        )
                                                    }
                                                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition-all hover:border-rose-300 hover:bg-rose-100 active:scale-[0.98]"
                                                >
                                                    <Trash2
                                                        aria-hidden="true"
                                                        className="size-3.5 text-rose-600"
                                                    />
                                                    Hapus berkas
                                                </button>
                                            </div>
                                        ) : (
                                            <p
                                                id={`${clientErrorKey}-status`}
                                                className="mt-3 text-xs font-semibold text-slate-500"
                                            >
                                                Belum ada berkas dipilih
                                            </p>
                                        )}

                                        <InputError
                                            id={`${clientErrorKey}-error`}
                                            message={fieldError(
                                                clientErrorKey,
                                                serverErrorKey,
                                            )}
                                            className="mt-2"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </fieldset>
                )}

                {currentStep === 3 && (
                    <div className="mt-2">
                        <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                            Periksa pengajuan
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                            Periksa kembali data sebelum dikirim ke server.
                        </p>

                        <div className="mt-6 grid gap-5 lg:grid-cols-2">
                            <section
                                aria-labelledby="applicant-review-heading"
                                className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5"
                            >
                                <h4
                                    id="applicant-review-heading"
                                    className="text-xs font-bold tracking-wider text-slate-900 uppercase"
                                >
                                    Data pemohon
                                </h4>
                                <dl className="mt-4 grid gap-3 text-xs">
                                    {[
                                        ['Nama', form.data.applicant_name],
                                        [
                                            'NIK',
                                            maskNationalId(
                                                form.data.national_id,
                                            ),
                                        ],
                                        ['Telepon', form.data.phone],
                                        ['Alamat', form.data.address],
                                        ['Tujuan', form.data.purpose],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="border-t border-slate-200/70 pt-2.5"
                                        >
                                            <dt className="text-[11px] font-semibold text-slate-500">
                                                {label}
                                            </dt>
                                            <dd className="mt-0.5 font-bold break-words text-slate-800">
                                                {value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>

                            <section
                                aria-labelledby="document-review-heading"
                                className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5"
                            >
                                <h4
                                    id="document-review-heading"
                                    className="text-xs font-bold tracking-wider text-slate-900 uppercase"
                                >
                                    Dokumen dipilih
                                </h4>
                                <ul className="mt-4 grid gap-3 text-xs">
                                    {detail.requiredDocuments.map(
                                        (document) => (
                                            <li
                                                key={document.key}
                                                className="flex items-start gap-3 border-t border-slate-200/70 pt-2.5"
                                            >
                                                <FileText
                                                    aria-hidden="true"
                                                    className="mt-0.5 size-4 shrink-0 text-emerald-700"
                                                />
                                                <span>
                                                    <strong className="block font-bold text-slate-800">
                                                        {document.label}
                                                    </strong>
                                                    <span className="mt-0.5 block text-slate-500">
                                                        {form.data.documents[
                                                            document.key
                                                        ]?.name ??
                                                            'Tidak dipilih (opsional)'}
                                                    </span>
                                                </span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </section>
                        </div>

                        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all hover:bg-slate-100/60">
                            <input
                                type="checkbox"
                                checked={form.data.privacy_consent}
                                onChange={(event) => {
                                    form.setData(
                                        'privacy_consent',
                                        event.target.checked,
                                    );
                                    clearFieldError('privacy_consent');
                                }}
                                aria-invalid={Boolean(
                                    fieldError('privacy_consent'),
                                )}
                                aria-describedby="privacy-consent-error"
                                className="mt-1 size-4 rounded-md border-slate-300 text-emerald-700 accent-emerald-700 focus:ring-emerald-600"
                            />
                            <span className="text-xs leading-relaxed text-slate-600">
                                Saya menyetujui penyimpanan dan pemrosesan data
                                serta dokumen untuk keperluan layanan yang saya
                                pilih.
                            </span>
                        </label>
                        <InputError
                            id="privacy-consent-error"
                            message={fieldError('privacy_consent')}
                            className="mt-2"
                        />
                    </div>
                )}

                {/* Modernized Bottom Action Bar */}
                <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={returnToPreviousStep}
                            disabled={form.processing}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <ArrowLeft
                                aria-hidden="true"
                                className="size-4 text-emerald-700"
                            />
                            Kembali
                        </button>
                    ) : (
                        <span />
                    )}

                    {currentStep < 3 ? (
                        <button
                            type="button"
                            onClick={continueToNextStep}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-800/15 transition-all hover:bg-emerald-800 hover:shadow-lg active:scale-[0.98]"
                        >
                            Lanjutkan
                            <ArrowRight aria-hidden="true" className="size-4" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            onClick={submitApplication}
                            disabled={form.processing}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-800/15 transition-all hover:bg-emerald-800 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {form.processing ? (
                                <LoaderCircle
                                    aria-hidden="true"
                                    className="size-4 animate-spin"
                                />
                            ) : (
                                <CheckCircle2
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            )}
                            {form.processing
                                ? 'Mengirim pengajuan...'
                                : 'Kirim pengajuan'}
                        </button>
                    )}
                </div>
            </div>

            {deletingDocumentKey && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-modal-title"
                    className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs duration-200 fade-in"
                >
                    <div className="w-full max-w-md animate-in rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl duration-200 zoom-in-95">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                            <Trash2 className="size-6" />
                        </div>
                        <h3
                            id="delete-modal-title"
                            className="mt-4 text-lg font-black tracking-tight text-slate-900"
                        >
                            Hapus Dokumen?
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                            Apakah Anda yakin ingin menghapus berkas{' '}
                            <strong className="font-bold text-slate-900">
                                {
                                    detail.requiredDocuments.find(
                                        (d) => d.key === deletingDocumentKey,
                                    )?.label
                                }
                            </strong>
                            ? Anda perlu memilih berkas baru jika dokumen ini
                            diperlukan.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingDocumentKey(null)}
                                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 active:scale-[0.98]"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteDocument}
                                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-[0.98]"
                            >
                                <Trash2 className="size-3.5" />
                                Ya, Hapus Dokumen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
