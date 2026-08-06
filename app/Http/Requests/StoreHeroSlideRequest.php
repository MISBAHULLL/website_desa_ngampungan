<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreHeroSlideRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'primary_cta_text' => ['nullable', 'string', 'max:100'],
            'primary_cta_url' => ['nullable', 'string', 'max:500'],
            'secondary_cta_text' => ['nullable', 'string', 'max:100'],
            'secondary_cta_url' => ['nullable', 'string', 'max:500'],
            'background_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:3072'],
            'remove_background_image' => ['sometimes', 'boolean'],
            'order' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }

    /** @return array<int, callable(Validator): void> */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $this->validateCtaPair($validator, 'primary');
                $this->validateCtaPair($validator, 'secondary');
            },
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
            'title.required' => 'Judul slide wajib diisi.',
            'title.string' => 'Judul slide harus berupa teks.',
            'title.max' => 'Judul slide maksimal 255 karakter.',
            'subtitle.string' => 'Subjudul harus berupa teks.',
            'subtitle.max' => 'Subjudul maksimal 255 karakter.',
            'description.required' => 'Deskripsi slide wajib diisi.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 1.000 karakter.',
            'primary_cta_text.string' => 'Teks tombol utama harus berupa teks.',
            'primary_cta_text.max' => 'Teks tombol utama maksimal 100 karakter.',
            'primary_cta_url.string' => 'URL tombol utama harus berupa teks.',
            'primary_cta_url.max' => 'URL tombol utama maksimal 500 karakter.',
            'secondary_cta_text.string' => 'Teks tombol sekunder harus berupa teks.',
            'secondary_cta_text.max' => 'Teks tombol sekunder maksimal 100 karakter.',
            'secondary_cta_url.string' => 'URL tombol sekunder harus berupa teks.',
            'secondary_cta_url.max' => 'URL tombol sekunder maksimal 500 karakter.',
            'background_image.image' => 'File gambar latar harus berupa gambar.',
            'background_image.mimes' => 'Gambar latar harus berformat JPEG, JPG, PNG, atau WebP.',
            'background_image.max' => 'Ukuran gambar latar maksimal 3 MB.',
            'remove_background_image.boolean' => 'Pilihan hapus gambar tidak valid.',
            'order.required' => 'Urutan slide wajib diisi.',
            'order.integer' => 'Urutan slide harus berupa angka.',
            'order.min' => 'Urutan slide minimal bernilai 0.',
            'is_active.boolean' => 'Status aktif harus berupa nilai boolean.',
        ];
    }

    private function validateCtaPair(Validator $validator, string $prefix): void
    {
        $textField = "{$prefix}_cta_text";
        $urlField = "{$prefix}_cta_url";
        $text = trim((string) $this->input($textField, ''));
        $url = trim((string) $this->input($urlField, ''));

        if ($text !== '' && $url === '') {
            $validator->errors()->add($urlField, 'Tujuan tombol wajib diisi ketika teks tombol digunakan.');
        }

        if ($url !== '' && $text === '') {
            $validator->errors()->add($textField, 'Teks tombol wajib diisi ketika tujuan tombol digunakan.');
        }

        if ($url !== '' && ! $this->isAllowedCtaUrl($url)) {
            $validator->errors()->add($urlField, 'Tujuan tombol harus berupa tautan internal, anchor, atau URL HTTP/HTTPS yang valid.');
        }
    }

    private function isAllowedCtaUrl(string $url): bool
    {
        if (str_starts_with($url, '#')) {
            return strlen($url) > 1;
        }

        if (str_starts_with($url, '/') && ! str_starts_with($url, '//')) {
            return true;
        }

        if (filter_var($url, FILTER_VALIDATE_URL) === false) {
            return false;
        }

        return in_array(parse_url($url, PHP_URL_SCHEME), ['http', 'https'], true);
    }
}
