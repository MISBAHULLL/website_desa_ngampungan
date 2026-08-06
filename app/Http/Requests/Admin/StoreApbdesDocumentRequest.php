<?php

namespace App\Http\Requests\Admin;

use App\Models\ApbdesSummary;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StoreApbdesDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'year' => ['required', 'digits:4', Rule::exists(ApbdesSummary::class, 'year')],
            'document_date' => ['required', 'date'],
            'document' => ['required', File::types(['pdf', 'xls', 'xlsx'])->max('10mb')],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'year.exists' => 'Buat data APBDes untuk tahun tersebut terlebih dahulu.',
            'document.required' => 'Pilih dokumen PDF atau Excel yang akan dipublikasikan.',
            'document.mimes' => 'Dokumen harus berformat PDF, XLS, atau XLSX.',
            'document.max' => 'Ukuran dokumen maksimal 10 MB.',
        ];
    }
}
