<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreVillageOfficialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'initials' => ['required', 'string', 'max:5'],
            'position' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:255'],
            'group' => ['required', 'string', 'in:leadership,secretariat,technical,territorial'],
            'photo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:3072',
            ],
            'term' => ['nullable', 'string', 'max:100'],
            'employee_id' => ['nullable', 'string', 'max:50'],
            'summary' => ['required', 'string', 'max:1000'],
            'about' => ['nullable', 'string', 'max:2000'],
            'responsibilities' => ['nullable', 'array'],
            'responsibilities.*' => ['nullable', 'string', 'max:500'],
            'service_focus' => ['nullable', 'array'],
            'service_focus.*' => ['nullable', 'string', 'max:100'],
            'education' => ['nullable', 'array'],
            'education.*' => ['nullable', 'string', 'max:300'],
            'career' => ['nullable', 'array'],
            'career.*.period' => ['nullable', 'string', 'max:100'],
            'career.*.role' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'parent_id' => ['nullable', 'integer', 'exists:village_officials,id'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'photo.image' => 'File yang dipilih harus berupa gambar.',
            'photo.mimes' => 'Foto perangkat harus berformat JPG, JPEG, PNG, atau WebP.',
            'photo.mimetypes' => 'Isi file tidak sesuai dengan format gambar yang didukung.',
            'photo.max' => 'Ukuran foto perangkat maksimal 3 MB.',
        ];
    }
}
