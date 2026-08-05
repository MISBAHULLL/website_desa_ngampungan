<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreAgendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'summary' => ['required', 'string', 'max:1000'],
            'details' => ['nullable', 'array'],
            'details.*' => ['nullable', 'string', 'max:500'],
            'event_date' => ['required', 'date'],
            'time_label' => ['required', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
            'organizer' => ['required', 'string', 'max:255'],
            'contact' => ['nullable', 'string', 'max:100'],
            'registration_required' => ['sometimes', 'boolean'],
            'status' => ['required', 'string', 'in:upcoming,completed'],
            'is_featured' => ['sometimes', 'boolean'],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:3072',
            ],
            'image_url' => ['nullable', 'url:http,https', 'max:500'],
            'image_alt' => ['nullable', 'string', 'max:255'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'category.required' => 'Pilih kategori atau isi kategori lainnya.',
            'image.image' => 'File yang dipilih harus berupa gambar.',
            'image.mimes' => 'Gambar agenda harus berformat JPG, JPEG, PNG, atau WebP.',
            'image.mimetypes' => 'Isi file tidak sesuai dengan format gambar yang didukung.',
            'image.max' => 'Ukuran gambar agenda maksimal 3 MB.',
            'image_url.url' => 'URL gambar harus berupa alamat HTTP atau HTTPS yang valid.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'category' => Str::squish($this->string('category')->toString()),
        ]);
    }
}
