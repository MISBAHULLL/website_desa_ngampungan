<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'contact' => ['required', 'string', 'min:6', 'max:150'],
            'category' => [
                'required',
                'string',
                Rule::in([
                    'general',
                    'service_complaint',
                    'development_proposal',
                ]),
            ],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
            'consent' => ['accepted'],
            'website' => ['nullable', 'string', 'max:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.min' => 'Nama lengkap minimal 3 karakter.',
            'contact.required' => 'Nomor WhatsApp atau email wajib diisi.',
            'category.required' => 'Kategori pesan wajib dipilih.',
            'category.in' => 'Kategori pesan tidak dikenali.',
            'message.required' => 'Isi pesan wajib diisi.',
            'message.min' => 'Isi pesan minimal 10 karakter.',
            'message.max' => 'Isi pesan maksimal 3.000 karakter.',
            'consent.accepted' => 'Persetujuan penyimpanan data wajib diberikan.',
            'website.max' => 'Pesan tidak dapat diproses.',
        ];
    }
}
