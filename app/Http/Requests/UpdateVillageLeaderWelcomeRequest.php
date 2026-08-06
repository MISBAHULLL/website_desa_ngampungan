<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateVillageLeaderWelcomeRequest extends FormRequest
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
            'welcome_title' => ['required', 'string', 'max:160'],
            'welcome_message' => ['required', 'string', 'max:5000'],
            'vision' => ['nullable', 'string', 'max:3000'],
            'mission' => ['nullable', 'string', 'max:3000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'welcome_title.required' => 'Judul sambutan wajib diisi.',
            'welcome_title.max' => 'Judul sambutan maksimal 160 karakter.',
            'welcome_message.required' => 'Isi sambutan kepala desa wajib diisi.',
            'welcome_message.max' => 'Isi sambutan maksimal 5.000 karakter.',
            'vision.max' => 'Visi maksimal 3.000 karakter.',
            'mission.max' => 'Misi maksimal 3.000 karakter.',
        ];
    }
}
