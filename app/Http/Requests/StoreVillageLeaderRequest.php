<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreVillageLeaderRequest extends FormRequest
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
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png', 'max:2048'],
            'welcome_message' => ['required', 'string', 'max:5000'],
            'vision' => ['nullable', 'string', 'max:3000'],
            'mission' => ['nullable', 'string', 'max:3000'],
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
            'photo.mimes' => 'Foto harus berformat JPEG, JPG, atau PNG.',
            'photo.max' => 'Ukuran foto maksimal 2 MB.',
            'welcome_message.required' => 'Sambutan kepala desa wajib diisi.',
            'welcome_message.string' => 'Sambutan kepala desa harus berupa teks.',
            'welcome_message.max' => 'Sambutan kepala desa maksimal 5.000 karakter.',
            'vision.string' => 'Visi harus berupa teks.',
            'vision.max' => 'Visi maksimal 3.000 karakter.',
            'mission.string' => 'Misi harus berupa teks.',
            'mission.max' => 'Misi maksimal 3.000 karakter.',
            'started_at.required' => 'Tanggal mulai menjabat wajib diisi.',
            'started_at.date' => 'Tanggal mulai menjabat harus berupa tanggal yang valid.',
            'ended_at.date' => 'Tanggal selesai menjabat harus berupa tanggal yang valid.',
            'ended_at.after' => 'Tanggal selesai menjabat harus setelah tanggal mulai menjabat.',
            'is_active.boolean' => 'Status aktif harus berupa nilai boolean.',
        ];
    }
}
