<?php

namespace App\Http\Requests;

use App\Support\VillageServiceCatalog;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

class StoreServiceApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(VillageServiceCatalog $serviceCatalog): bool
    {
        return $serviceCatalog->exists((string) $this->route('slug'));
    }

    protected function failedAuthorization(): void
    {
        throw new \Illuminate\Http\Exceptions\HttpResponseException(
            redirect()->route('services.index')
        );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(VillageServiceCatalog $serviceCatalog): array
    {
        $documents = $serviceCatalog->documents(
            (string) $this->route('slug'),
        );
        $documentKeys = array_keys($documents);
        $rules = [
            'applicant_name' => ['required', 'string', 'min:3', 'max:100'],
            'national_id' => ['required', 'string', 'regex:/^\d{16}$/'],
            'phone' => [
                'required',
                'string',
                'regex:/^(\+62|62|0)\d{8,13}$/',
            ],
            'address' => ['required', 'string', 'min:10', 'max:1000'],
            'purpose' => ['required', 'string', 'min:10', 'max:2000'],
            'documents' => [
                'present',
                'array:'.implode(',', $documentKeys),
            ],
            'privacy_consent' => ['accepted'],
            'website' => ['nullable', 'string', 'max:0'],
        ];

        foreach ($documents as $documentKey => $document) {
            $rules["documents.{$documentKey}"] = [
                $document['required'] ? 'required' : 'nullable',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'mimetypes:application/pdf,image/jpeg,image/png',
                'max:10240',
            ];
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'applicant_name.required' => 'Nama lengkap wajib diisi.',
            'applicant_name.min' => 'Nama lengkap minimal 3 karakter.',
            'national_id.required' => 'NIK wajib diisi.',
            'national_id.regex' => 'NIK harus terdiri dari 16 angka.',
            'phone.required' => 'Nomor telepon wajib diisi.',
            'phone.regex' => 'Format nomor telepon tidak valid.',
            'address.required' => 'Alamat wajib diisi.',
            'address.min' => 'Alamat minimal 10 karakter.',
            'purpose.required' => 'Tujuan pengajuan wajib diisi.',
            'purpose.min' => 'Tujuan pengajuan minimal 10 karakter.',
            'documents.present' => 'Daftar dokumen wajib dikirim.',
            'documents.array' => 'Dokumen yang dikirim tidak dikenali.',
            'documents.*.required' => 'Dokumen ini wajib diunggah.',
            'documents.*.file' => 'Dokumen harus berupa berkas.',
            'documents.*.mimes' => 'Format dokumen harus PDF, JPG, JPEG, atau PNG.',
            'documents.*.mimetypes' => 'Isi dokumen tidak sesuai format yang diizinkan.',
            'documents.*.max' => 'Ukuran setiap dokumen maksimal 10 MB.',
            'privacy_consent.accepted' => 'Persetujuan penyimpanan data wajib diberikan.',
            'website.max' => 'Pengajuan tidak dapat diproses.',
        ];
    }

    /**
     * @return array{
     *     applicant_name: string,
     *     national_id: string,
     *     phone: string,
     *     address: string,
     *     purpose: string,
     *     documents: array<string, UploadedFile>
     * }
     */
    public function applicationData(
        VillageServiceCatalog $serviceCatalog,
    ): array {
        $this->validated();

        $documents = [];

        foreach (
            array_keys(
                $serviceCatalog->documents((string) $this->route('slug')),
            ) as $documentKey
        ) {
            $uploadedDocument = $this->file(
                "documents.{$documentKey}",
            );

            if ($uploadedDocument instanceof UploadedFile) {
                $documents[$documentKey] = $uploadedDocument;
            }
        }

        return [
            'applicant_name' => $this->string('applicant_name')->toString(),
            'national_id' => $this->string('national_id')->toString(),
            'phone' => $this->string('phone')->toString(),
            'address' => $this->string('address')->toString(),
            'purpose' => $this->string('purpose')->toString(),
            'documents' => $documents,
        ];
    }
}
