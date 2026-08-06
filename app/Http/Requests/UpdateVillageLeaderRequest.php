<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateVillageLeaderRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:3072'],
            'remove_photo' => ['sometimes', 'boolean'],
            'started_at' => ['required', 'date'],
            'ended_at' => ['nullable', 'date', 'after:started_at'],
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
            'name.required' => 'Nama kepala desa wajib diisi.',
            'name.string' => 'Nama kepala desa harus berupa teks.',
            'name.max' => 'Nama kepala desa maksimal 255 karakter.',
            'position.required' => 'Jabatan wajib diisi.',
            'position.string' => 'Jabatan harus berupa teks.',
            'position.max' => 'Jabatan maksimal 255 karakter.',
            'photo.image' => 'File foto harus berupa gambar.',
            'photo.mimes' => 'Foto harus berformat JPEG, JPG, PNG, atau WEBP.',
            'photo.max' => 'Ukuran foto maksimal 3 MB.',
            'started_at.required' => 'Tanggal mulai menjabat wajib diisi.',
            'started_at.date' => 'Tanggal mulai menjabat harus berupa tanggal yang valid.',
            'ended_at.date' => 'Tanggal selesai menjabat harus berupa tanggal yang valid.',
            'ended_at.after' => 'Tanggal selesai menjabat harus setelah tanggal mulai menjabat.',
            'is_active.boolean' => 'Status aktif harus berupa nilai boolean.',
        ];
    }
}
