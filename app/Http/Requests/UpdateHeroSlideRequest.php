<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHeroSlideRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'primary_cta_text' => ['nullable', 'string', 'max:100'],
            'primary_cta_url' => ['nullable', 'string', 'max:500'],
            'secondary_cta_text' => ['nullable', 'string', 'max:100'],
            'secondary_cta_url' => ['nullable', 'string', 'max:500'],
            'background_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:3072'],
            'order' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
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
            'order.required' => 'Urutan slide wajib diisi.',
            'order.integer' => 'Urutan slide harus berupa angka.',
            'order.min' => 'Urutan slide minimal bernilai 0.',
            'is_active.boolean' => 'Status aktif harus berupa nilai boolean.',
        ];
    }
}
