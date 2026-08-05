<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
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
            'summary' => ['required', 'string', 'max:300'],
            'content' => ['nullable', 'array'],
            'content.*' => ['nullable', 'string', 'max:10000'],
            'priority' => ['required', 'string', 'in:normal,important,emergency'],
            'status' => ['required', 'string', 'in:active,archived'],
            'is_pinned' => ['sometimes', 'boolean'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'summary.max' => 'Ringkasan pengumuman maksimal 300 karakter.',
            'ends_at.after_or_equal' => 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.',
        ];
    }
}
