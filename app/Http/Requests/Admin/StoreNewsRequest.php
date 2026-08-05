<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content' => ['required', 'array', 'min:1'],
            'content.*' => ['required', 'string', 'max:10000'],
            'author' => ['nullable', 'string', 'max:100'],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:3072',
            ],
            'image_url' => ['nullable', 'url:http,https', 'max:500'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'category.required' => 'Pilih kategori atau isi kategori lainnya.',
            'image.image' => 'File yang dipilih harus berupa gambar.',
            'image.mimes' => 'Gambar harus berformat JPG, JPEG, PNG, atau WebP.',
            'image.mimetypes' => 'Isi file tidak sesuai dengan format gambar yang didukung.',
            'image.max' => 'Ukuran gambar maksimal 3 MB.',
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
