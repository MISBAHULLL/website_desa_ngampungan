import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    FileText,
    Info,
    RotateCcw,
    ShieldAlert,
    Upload,
    UserRound,
} from 'lucide-react';
import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import InputError from '@/components/input-error';
import type {
    VillageService,
    VillageServiceApplicationDetail,
} from '@/lib/dummy-village-services';

type ApplicationFormProps = {
    service: VillageService;
    detail: VillageServiceApplicationDetail;
};

type ApplicantData = {
    fullName: string;
    nationalId: string;
    phone: string;
    address: string;
    purpose: string;
};

type FieldErrors = Partial<Record<keyof ApplicantData | string, string>>;

const initialApplicantData: ApplicantData = {
    fullName: '',
    nationalId: '',
    phone: '',
    address: '',
    purpose: '',
};

const maximumFileSize = 2 * 1024 * 1024;

const formSteps = [
    {
        number: 1,
        label: 'Data Pemohon',
        description: 'Identitas dan keperluan',
        icon: UserRound,
    },
    {
        number: 2,
        label: 'Dokumen',
        description: 'Berkas persyaratan',
        icon: Upload,
    },
    {
        number: 3,
        label: 'Periksa',
        description: 'Konfirmasi pengajuan',
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
}: ApplicationFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [applicantData, setApplicantData] =
        useState<ApplicantData>(initialApplicantData);
    const [documents, setDocuments] = useState<Record<string, File | null>>({});
    const [errors, setErrors] = useState<FieldErrors>({});
    const [hasAcceptedSimulation, setHasAcceptedSimulation] = useState(false);
    const [simulationReference, setSimulationReference] = useState<
        string | null
    >(null);

    const updateApplicantData = (field: keyof ApplicantData, value: string) => {
        setApplicantData((currentData) => ({
            ...currentData,
            [field]: value,
        }));
        setErrors((currentErrors) => ({
            ...currentErrors,
            [field]: undefined,
        }));
    };

    const validateApplicantData = (): boolean => {
        const nextErrors: FieldErrors = {};

        if (applicantData.fullName.trim().length < 3) {
            nextErrors.fullName = 'Nama lengkap minimal 3 karakter.';
        }

        if (!/^\d{16}$/.test(applicantData.nationalId)) {
            nextErrors.nationalId = 'NIK simulasi harus terdiri dari 16 angka.';
        }

        if (!/^(\+62|62|0)\d{8,13}$/.test(applicantData.phone)) {
            nextErrors.phone = 'Masukkan nomor telepon Indonesia yang valid.';
        }

        if (applicantData.address.trim().length < 10) {
            nextErrors.address = 'Alamat minimal 10 karakter.';
        }

        if (applicantData.purpose.trim().length < 10) {
            nextErrors.purpose = 'Tujuan pengajuan minimal 10 karakter.';
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const validateDocuments = (): boolean => {
        const nextErrors: FieldErrors = {};

        detail.requiredDocuments.forEach((document) => {
            if (document.required && !documents[document.key]) {
                nextErrors[`document-${document.key}`] =
                    `${document.label} wajib dipilih.`;
            }
        });

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleDocumentChange = (
        documentKey: string,
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0] ?? null;
        const errorKey = `document-${documentKey}`;

        if (file && file.size > maximumFileSize) {
            setDocuments((currentDocuments) => ({
                ...currentDocuments,
                [documentKey]: null,
            }));
            setErrors((currentErrors) => ({
                ...currentErrors,
                [errorKey]: 'Ukuran berkas maksimal 2 MB.',
            }));
            event.target.value = '';

            return;
        }

        setDocuments((currentDocuments) => ({
            ...currentDocuments,
            [documentKey]: file,
        }));
        setErrors((currentErrors) => ({
            ...currentErrors,
            [errorKey]: undefined,
        }));
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
        setErrors({});
        setCurrentStep((step) => Math.max(step - 1, 1));
    };

    const submitSimulation = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!hasAcceptedSimulation) {
            setErrors({
                simulationConsent:
                    'Konfirmasi pemahaman simulasi sebelum melanjutkan.',
            });

            return;
        }

        const referenceSuffix = service.slug
            .split('-')
            .map((word) => word.charAt(0))
            .join('')
            .slice(0, 4)
            .toUpperCase();

        setSimulationReference(`SIM-${referenceSuffix}-0001`);
        setErrors({});
    };

    const resetSimulation = () => {
        formRef.current?.reset();
        setApplicantData(initialApplicantData);
        setDocuments({});
        setErrors({});
        setHasAcceptedSimulation(false);
        setSimulationReference(null);
        setCurrentStep(1);
    };

    if (simulationReference) {
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
                        Pratinjau Berhasil Dibuat
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">
                        Simulasi pengajuan sudah lengkap
                    </h3>
                    <p className="mt-3 max-w-2xl leading-7 text-village-muted">
                        Nomor simulasi{' '}
                        <strong className="text-village-ink">
                            {simulationReference}
                        </strong>
                        . Data dan dokumen tidak disimpan, tidak diunggah, dan
                        tidak masuk ke sistem admin.
                    </p>

                    <div className="mt-6 flex items-start gap-3 border border-[#efdcae] bg-[#fff8ea] p-4 text-sm leading-6 text-[#755018]">
                        <Info
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                        Nomor ini hanya contoh tampilan dan tidak dapat dipakai
                        untuk melacak layanan.
                    </div>

                    <button
                        type="button"
                        onClick={resetSimulation}
                        className="mt-6 inline-flex min-h-11 items-center gap-2 border border-village-border bg-white px-5 py-3 text-sm font-bold text-village-primary transition hover:border-village-primary"
                    >
                        <RotateCcw aria-hidden="true" className="size-4" />
                        Ulangi simulasi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form ref={formRef} noValidate onSubmit={submitSimulation}>
            <ol
                aria-label="Tahapan formulir pengajuan"
                className="grid border border-village-border bg-white md:grid-cols-3"
            >
                {formSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === step.number;
                    const isComplete = currentStep > step.number;

                    return (
                        <li
                            key={step.number}
                            aria-current={isActive ? 'step' : undefined}
                            className={`relative flex items-center gap-4 p-4 md:p-5 ${
                                index < formSteps.length - 1
                                    ? 'border-b border-village-border md:border-r md:border-b-0'
                                    : ''
                            } ${isActive ? 'bg-village-primary-light' : ''}`}
                        >
                            <span
                                className={`flex size-10 shrink-0 items-center justify-center ${
                                    isComplete || isActive
                                        ? 'bg-village-primary text-white'
                                        : 'bg-village-surface-muted text-village-muted'
                                }`}
                            >
                                {isComplete ? (
                                    <Check
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                ) : (
                                    <StepIcon
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                )}
                            </span>
                            <span>
                                <span className="block text-xs font-bold tracking-[0.12em] text-village-muted uppercase">
                                    Tahap {step.number}
                                </span>
                                <span className="mt-1 block text-sm font-bold text-village-ink">
                                    {step.label}
                                </span>
                            </span>
                        </li>
                    );
                })}
            </ol>

            <div className="mt-5 border border-village-border bg-white p-5 md:p-8">
                <div className="flex items-start gap-3 border border-village-info/25 bg-[#f3f8fd] p-4 text-sm leading-6 text-[#315f7a]">
                    <ShieldAlert
                        aria-hidden="true"
                        className="mt-0.5 size-5 shrink-0"
                    />
                    <p>
                        <strong>Mode simulasi frontend.</strong> Gunakan data
                        dan berkas contoh. Jangan masukkan NIK, alamat, nomor
                        telepon, atau dokumen pribadi asli.
                    </p>
                </div>

                {Object.values(errors).some(Boolean) && (
                    <div
                        role="alert"
                        className="mt-5 border-l-4 border-village-error bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
                    >
                        Periksa kembali bagian yang ditandai sebelum
                        melanjutkan.
                    </div>
                )}

                {currentStep === 1 && (
                    <fieldset className="mt-8">
                        <legend className="text-2xl font-bold">
                            Data pemohon
                        </legend>
                        <p className="mt-2 text-sm leading-6 text-village-muted">
                            Isikan data contoh untuk melihat alur validasi
                            formulir.
                        </p>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="applicant-name"
                                    className="text-sm font-bold"
                                >
                                    Nama lengkap{' '}
                                    <span className="text-village-error">
                                        *
                                    </span>
                                </label>
                                <input
                                    id="applicant-name"
                                    value={applicantData.fullName}
                                    onChange={(event) =>
                                        updateApplicantData(
                                            'fullName',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={Boolean(errors.fullName)}
                                    aria-describedby="applicant-name-error"
                                    autoComplete="off"
                                    placeholder="Contoh: Budi Santoso"
                                    className="mt-2 min-h-12 w-full border border-village-border px-4 py-3 outline-hidden transition focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                />
                                <InputError
                                    id="applicant-name-error"
                                    message={errors.fullName}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="applicant-national-id"
                                    className="text-sm font-bold"
                                >
                                    NIK simulasi{' '}
                                    <span className="text-village-error">
                                        *
                                    </span>
                                </label>
                                <input
                                    id="applicant-national-id"
                                    inputMode="numeric"
                                    maxLength={16}
                                    value={applicantData.nationalId}
                                    onChange={(event) =>
                                        updateApplicantData(
                                            'nationalId',
                                            event.target.value.replace(
                                                /\D/g,
                                                '',
                                            ),
                                        )
                                    }
                                    aria-invalid={Boolean(errors.nationalId)}
                                    aria-describedby="applicant-national-id-error"
                                    autoComplete="off"
                                    placeholder="16 angka contoh"
                                    className="mt-2 min-h-12 w-full border border-village-border px-4 py-3 outline-hidden transition focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                />
                                <InputError
                                    id="applicant-national-id-error"
                                    message={errors.nationalId}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="applicant-phone"
                                    className="text-sm font-bold"
                                >
                                    Nomor telepon simulasi{' '}
                                    <span className="text-village-error">
                                        *
                                    </span>
                                </label>
                                <input
                                    id="applicant-phone"
                                    type="tel"
                                    value={applicantData.phone}
                                    onChange={(event) =>
                                        updateApplicantData(
                                            'phone',
                                            event.target.value.replace(
                                                /[^\d+]/g,
                                                '',
                                            ),
                                        )
                                    }
                                    aria-invalid={Boolean(errors.phone)}
                                    aria-describedby="applicant-phone-error"
                                    autoComplete="off"
                                    placeholder="Contoh: 081234567890"
                                    className="mt-2 min-h-12 w-full border border-village-border px-4 py-3 outline-hidden transition focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                />
                                <InputError
                                    id="applicant-phone-error"
                                    message={errors.phone}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="applicant-address"
                                    className="text-sm font-bold"
                                >
                                    Alamat simulasi{' '}
                                    <span className="text-village-error">
                                        *
                                    </span>
                                </label>
                                <textarea
                                    id="applicant-address"
                                    rows={3}
                                    value={applicantData.address}
                                    onChange={(event) =>
                                        updateApplicantData(
                                            'address',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={Boolean(errors.address)}
                                    aria-describedby="applicant-address-error"
                                    autoComplete="off"
                                    placeholder="Contoh alamat, bukan alamat asli"
                                    className="mt-2 w-full resize-y border border-village-border px-4 py-3 outline-hidden transition focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                />
                                <InputError
                                    id="applicant-address-error"
                                    message={errors.address}
                                    className="mt-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="application-purpose"
                                    className="text-sm font-bold"
                                >
                                    Tujuan pengajuan{' '}
                                    <span className="text-village-error">
                                        *
                                    </span>
                                </label>
                                <textarea
                                    id="application-purpose"
                                    rows={4}
                                    value={applicantData.purpose}
                                    onChange={(event) =>
                                        updateApplicantData(
                                            'purpose',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={Boolean(errors.purpose)}
                                    aria-describedby="application-purpose-error"
                                    placeholder="Jelaskan kebutuhan layanan secara ringkas"
                                    className="mt-2 w-full resize-y border border-village-border px-4 py-3 outline-hidden transition focus:border-village-primary focus:ring-2 focus:ring-village-primary/20"
                                />
                                <InputError
                                    id="application-purpose-error"
                                    message={errors.purpose}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </fieldset>
                )}

                {currentStep === 2 && (
                    <fieldset className="mt-8">
                        <legend className="text-2xl font-bold">
                            Dokumen persyaratan
                        </legend>
                        <p className="mt-2 text-sm leading-6 text-village-muted">
                            Pilih berkas contoh berformat PDF, JPG, JPEG, atau
                            PNG dengan ukuran maksimal 2 MB.
                        </p>

                        <div className="mt-6 grid gap-4">
                            {detail.requiredDocuments.map((document) => {
                                const errorKey = `document-${document.key}`;
                                const selectedFile = documents[document.key];

                                return (
                                    <div
                                        key={document.key}
                                        className="border border-village-border bg-village-canvas p-4 md:p-5"
                                    >
                                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                            <div>
                                                <label
                                                    htmlFor={`document-${document.key}`}
                                                    className="font-bold"
                                                >
                                                    {document.label}
                                                    {document.required ? (
                                                        <span className="text-village-error">
                                                            {' '}
                                                            *
                                                        </span>
                                                    ) : (
                                                        <span className="ml-2 text-xs font-semibold text-village-muted">
                                                            Opsional
                                                        </span>
                                                    )}
                                                </label>
                                                <p className="mt-1 text-sm leading-6 text-village-muted">
                                                    {document.description}
                                                </p>
                                            </div>
                                            <label
                                                htmlFor={`document-${document.key}`}
                                                className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 border border-village-border bg-white px-4 py-3 text-sm font-bold text-village-primary transition hover:border-village-primary"
                                            >
                                                <Upload
                                                    aria-hidden="true"
                                                    className="size-4"
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
                                                errors[errorKey],
                                            )}
                                            aria-describedby={`${errorKey}-status ${errorKey}-error`}
                                            className="sr-only"
                                        />
                                        <p
                                            id={`${errorKey}-status`}
                                            className="mt-3 text-xs font-semibold text-village-muted"
                                        >
                                            {selectedFile
                                                ? `${selectedFile.name} · ${formatFileSize(selectedFile.size)}`
                                                : 'Belum ada berkas dipilih'}
                                        </p>
                                        <InputError
                                            id={`${errorKey}-error`}
                                            message={errors[errorKey]}
                                            className="mt-2"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </fieldset>
                )}

                {currentStep === 3 && (
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold">
                            Periksa simulasi pengajuan
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-village-muted">
                            Pastikan data contoh dan nama berkas sudah sesuai.
                        </p>

                        <div className="mt-6 grid gap-5 lg:grid-cols-2">
                            <section
                                aria-labelledby="applicant-review-heading"
                                className="border border-village-border p-5"
                            >
                                <h4
                                    id="applicant-review-heading"
                                    className="font-bold"
                                >
                                    Data pemohon
                                </h4>
                                <dl className="mt-4 grid gap-4 text-sm">
                                    {[
                                        ['Nama', applicantData.fullName],
                                        [
                                            'NIK simulasi',
                                            maskNationalId(
                                                applicantData.nationalId,
                                            ),
                                        ],
                                        ['Telepon', applicantData.phone],
                                        ['Alamat', applicantData.address],
                                        ['Tujuan', applicantData.purpose],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="border-t border-village-border pt-3"
                                        >
                                            <dt className="text-village-muted">
                                                {label}
                                            </dt>
                                            <dd className="mt-1 font-semibold break-words">
                                                {value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>

                            <section
                                aria-labelledby="document-review-heading"
                                className="border border-village-border p-5"
                            >
                                <h4
                                    id="document-review-heading"
                                    className="font-bold"
                                >
                                    Dokumen dipilih
                                </h4>
                                <ul className="mt-4 grid gap-3 text-sm">
                                    {detail.requiredDocuments.map(
                                        (document) => (
                                            <li
                                                key={document.key}
                                                className="flex items-start gap-3 border-t border-village-border pt-3"
                                            >
                                                <FileText
                                                    aria-hidden="true"
                                                    className="mt-0.5 size-4 shrink-0 text-village-primary"
                                                />
                                                <span>
                                                    <strong className="block">
                                                        {document.label}
                                                    </strong>
                                                    <span className="mt-1 block text-village-muted">
                                                        {documents[document.key]
                                                            ?.name ??
                                                            'Tidak dipilih (opsional)'}
                                                    </span>
                                                </span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </section>
                        </div>

                        <label className="mt-6 flex cursor-pointer items-start gap-3 border border-village-border bg-village-canvas p-4">
                            <input
                                type="checkbox"
                                checked={hasAcceptedSimulation}
                                onChange={(event) => {
                                    setHasAcceptedSimulation(
                                        event.target.checked,
                                    );
                                    setErrors((currentErrors) => ({
                                        ...currentErrors,
                                        simulationConsent: undefined,
                                    }));
                                }}
                                aria-invalid={Boolean(errors.simulationConsent)}
                                aria-describedby="simulation-consent-error"
                                className="mt-1 size-4 accent-village-primary"
                            />
                            <span className="text-sm leading-6 text-village-muted">
                                Saya memahami bahwa ini hanya simulasi frontend.
                                Data tidak disimpan dan tidak dikirim kepada
                                Pemerintah Desa Ngampungan.
                            </span>
                        </label>
                        <InputError
                            id="simulation-consent-error"
                            message={errors.simulationConsent}
                            className="mt-2"
                        />
                    </div>
                )}

                <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-village-border pt-6 sm:flex-row">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={returnToPreviousStep}
                            className="inline-flex min-h-11 items-center justify-center gap-2 border border-village-border bg-white px-5 py-3 text-sm font-bold text-village-primary transition hover:border-village-primary"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Kembali
                        </button>
                    ) : (
                        <span />
                    )}

                    {currentStep < 3 ? (
                        <button
                            type="button"
                            onClick={continueToNextStep}
                            className="inline-flex min-h-11 items-center justify-center gap-2 bg-village-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-village-primary-dark"
                        >
                            Lanjutkan
                            <ArrowRight aria-hidden="true" className="size-4" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="inline-flex min-h-11 items-center justify-center gap-2 bg-village-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-village-primary-dark"
                        >
                            <CheckCircle2
                                aria-hidden="true"
                                className="size-4"
                            />
                            Selesaikan simulasi
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}
