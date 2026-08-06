<?php

namespace App\Http\Requests\Admin;

use App\Models\ApbdesSummary;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApbdesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        return [
            'year' => ['required', 'digits:4', Rule::unique(ApbdesSummary::class, 'year')],
            'updated_date' => ['nullable', 'date'],
            'net_financing' => ['required', 'integer', 'between:-999999999999999,999999999999999'],
            'income_sources' => ['required', 'array', 'min:1', 'max:30'],
            'income_sources.*.code' => ['required', 'string', 'max:10', 'distinct:ignore_case'],
            'income_sources.*.label' => ['required', 'string', 'max:255'],
            'income_sources.*.amount' => ['required', 'integer', 'min:0', 'max:999999999999999'],
            'income_sources.*.description' => ['nullable', 'string', 'max:500'],
            'activities' => ['required', 'array', 'min:1', 'max:100'],
            'activities.*.code' => ['required', 'string', 'max:20', 'distinct:ignore_case'],
            'activities.*.name' => ['required', 'string', 'max:255'],
            'activities.*.category' => ['required', Rule::in(['pemerintahan', 'pembangunan', 'pembinaan', 'pemberdayaan', 'darurat'])],
            'activities.*.budget' => ['required', 'integer', 'min:0', 'max:999999999999999'],
            'activities.*.realized' => ['required', 'integer', 'min:0', 'max:999999999999999'],
            'activities.*.location' => ['required', 'string', 'max:255'],
            'activities.*.status' => ['required', Rule::in(['selesai', 'berjalan', 'direncanakan'])],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'year.unique' => 'Tahun anggaran tersebut sudah memiliki data APBDes.',
            'income_sources.min' => 'Tambahkan minimal satu sumber pendapatan.',
            'income_sources.*.code.distinct' => 'Kode sumber pendapatan tidak boleh sama.',
            'activities.min' => 'Tambahkan minimal satu kegiatan atau belanja.',
            'activities.*.code.distinct' => 'Kode kegiatan tidak boleh sama.',
        ];
    }
}
