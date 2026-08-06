<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVillageServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'short_description' => ['required', 'string', 'max:500'],
            'category' => ['required', 'string', Rule::in(['administration', 'population', 'agriculture', 'reports'])],
            'audience' => ['required', 'string', 'max:150'],
            'channel' => ['required', 'string', 'max:150'],
            'estimated_duration' => ['required', 'string', 'max:100'],
            'fee' => ['nullable', 'string', 'max:50'],
            'service_contact' => ['nullable', 'string', 'max:150'],
            'service_hours' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'array', 'max:10'],
            'notes.*' => ['required', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'requirements' => ['nullable', 'array', 'max:20'],
            'requirements.*.description' => ['required', 'string', 'max:500'],
            'documents' => ['nullable', 'array', 'max:20'],
            'documents.*.key' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', 'distinct'],
            'documents.*.label' => ['required', 'string', 'max:150'],
            'documents.*.description' => ['nullable', 'string', 'max:500'],
            'documents.*.is_required' => ['required', 'boolean'],
            'documents.*.accepted_formats' => ['nullable', 'string', 'max:200'],
        ];
    }
}
