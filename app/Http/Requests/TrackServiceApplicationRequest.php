<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class TrackServiceApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reference' => [
                'sometimes',
                'required',
                'string',
                'regex:/\ANGP-\d{8}-[A-Z0-9]{8}\z/',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'reference.required' => 'Masukkan nomor pengajuan terlebih dahulu.',
            'reference.regex' => 'Format nomor pengajuan tidak sesuai.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('reference')) {
            $this->merge([
                'reference' => Str::of($this->input('reference'))
                    ->trim()
                    ->upper()
                    ->toString(),
            ]);
        }
    }
}
