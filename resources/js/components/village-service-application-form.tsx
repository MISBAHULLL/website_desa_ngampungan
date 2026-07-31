import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    FileText,
    Info,
    LoaderCircle,
    LockKeyhole,
    ShieldAlert,
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

const maximumFileSize = 2 * 1024 * 1024;

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

    const handleDocumentChange = (
        documentKey: string,
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0] ?? null;
        const errorKey = `document-${documentKey}`;

        if (file && file.size > maximumFileSize) {
            form.setData('documents', {
                ...form.data.documents,
                [documentKey]: null,
            });
            setClientErrors((currentErrors) => ({
                ...currentErrors,
                [errorKey]: 'Ukuran berkas maksimal 2 MB.',
            }));
            event.target.value = '';

            return;
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

    const submitApplication = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.data.privacy_consent) {
            setClientErrors({
                privacy_consent:
                    'Persetujuan penyimpanan data wajib diberikan.',
            });

            return;
        }

        form.submit(ServiceApplicationController(service.slug), {
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
        return (
            <div
                role="status"
                className="border border-village-primary/25 bg-white"
            >
                <div className="border-l-4 border-village-primary p-6 md:p-8">
                    <span className="flex size-12 items-center justify-center bg-village-primary-light text-village-primary">
                        <CheckCircle2 aria-hidden="true" className="size-6" />
                    </span>
                    <p className="mt-6 text-xs font-bold tracking-[0.16em] text-village-primary uppercase">
                        Pengajuan Tersimpan
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">
                        Pengajuan berhasil diterima sistem
                    </h3>
                    <p className="mt-3 max-w-2xl leading-7 text-village-muted">
                        Nomor referensi{' '}
                        <strong className="text-village-ink">
                            {visibleSuccess.referenceNumber}
                        </strong>{' '}
                        untuk {visibleSuccess.serviceTitle} telah dibuat pada{' '}
                        {visibleSuccess.submittedAt} WIB.
                    </p>

                    <div className="mt-6 flex items-start gap-3 border border-village-primary/20 bg-village-primary-light p-4 text-sm leading-6 text-village-primary-dark">
                        <LockKeyhole
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                        Data tersimpan terenkripsi dan dokumen berada di
                        penyimpanan privat. Simpan nomor referensi ini. Fitur
                        pelacakan sudah tersedia melalui tombol di bawah.
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={startAnotherApplication}
                            className="inline-flex min-h-11 items-center gap-2 bg-village-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-village-primary-dark"
                        >
                            Ajukan layanan lagi
                        </button>
                        <Link
                            href={trackServiceApplication({
                                query: {
                                    reference: visibleSuccess.referenceNumber,
                                },
                            })}
                            className="inline-flex min-h-11 items-center gap-2 border border-village-border bg-white px-5 py-3 text-sm font-bold text-village-primary transition hover:border-village-primary"
                        >
                            Lacak pengajuan
                        </Link>
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
                className="grid grid-cols-1 gap-2.5 rounded-2xl bg-slate-100/80 p-2 md:grid-cols-3 border border-slate-200/60"
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
                                    className={`block text-xs font-bold leading-tight ${
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
                        Pengajuan belum dapat dikirim. Periksa kembali bagian yang ditandai.
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
                            Data ini digunakan petugas untuk memverifikasi dan menghubungi pemohon.
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
                                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 focus:shadow-xs"
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
                                    NIK{' '}
                                    <span className="text-rose-500">*</span>
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
                                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 focus:shadow-xs"
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
                                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 focus:shadow-xs"
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
                                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 focus:shadow-xs"
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
                                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 focus:shadow-xs"
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
                            PDF, JPG, JPEG, atau PNG. Maksimal 2 MB per berkas.
                        </p>

                        <div className="mt-6 grid gap-4">
                            {detail.requiredDocuments.map((document) => {
                                const clientErrorKey = `document-${document.key}`;
                                const serverErrorKey = `documents.${document.key}`;
                                const selectedFile =
                                    form.data.documents[document.key];

                                return (
                                    <div
                                        key={document.key}
                                        className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/20 md:p-5"
                                    >
                                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                            <div>
                                                <label
                                                    htmlFor={`document-${document.key}`}
                                                    className="text-xs font-bold text-slate-800"
                                                >
                                                    {document.label}
                                                    {document.required ? (
                                                        <span className="text-rose-500">
                                                            {' '}
                                                            *
                                                        </span>
                                                    ) : (
                                                        <span className="ml-2 rounded-md bg-slate-200/60 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-600">
                                                            Opsional
                                                        </span>
                                                    )}
                                                </label>
                                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                                    {document.description}
                                                </p>
                                            </div>
                                            <label
                                                htmlFor={`document-${document.key}`}
                                                className="inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-2xs transition-all hover:bg-emerald-50 hover:border-emerald-300 active:scale-[0.98]"
                                            >
                                                <Upload
                                                    aria-hidden="true"
                                                    className="size-4 text-emerald-700"
                                                />
                                                Pilih berkas
                                            </label>
                                        </div>
                                        <input
                                            id={`document-${document.key}`}
                                            type="file"
                                            accept={document.acceptedFormats}
                                            onChange={(event) =>
                                                handleDocumentChange(
                                                    document.key,
                                                    event,
                                                )
                                            }
                                            aria-invalid={Boolean(
                                                fieldError(
                                                    clientErrorKey,
                                                    serverErrorKey,
                                                ),
                                            )}
                                            aria-describedby={`${clientErrorKey}-status ${clientErrorKey}-error`}
                                            className="sr-only"
                                        />
                                        <p
                                            id={`${clientErrorKey}-status`}
                                            className="mt-3 text-xs font-semibold text-slate-500"
                                        >
                                            {selectedFile
                                                ? `✓ ${selectedFile.name} · ${formatFileSize(selectedFile.size)}`
                                                : 'Belum ada berkas dipilih'}
                                        </p>
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
                                    className="text-xs font-bold text-slate-900 uppercase tracking-wider"
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
                                            <dd className="mt-0.5 font-bold text-slate-800 break-words">
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
                                    className="text-xs font-bold text-slate-900 uppercase tracking-wider"
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

                {form.progress && (
                    <div
                        aria-live="polite"
                        className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-2xs"
                    >
                        <div className="flex items-center justify-between gap-4 text-xs font-bold text-emerald-950">
                            <span>Mengunggah dokumen</span>
                            <span>{form.progress.percentage}%</span>
                        </div>
                        <progress
                            value={form.progress.percentage}
                            max={100}
                            className="mt-3 h-2 w-full accent-emerald-700"
                        >
                            {form.progress.percentage}%
                        </progress>
                    </div>
                )}

                {/* Modernized Bottom Action Bar */}
                <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={returnToPreviousStep}
                            disabled={form.processing}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4 text-emerald-700" />
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
                            disabled={form.processing}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-800/15 transition-all hover:bg-emerald-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
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
        </form>
    );
}
