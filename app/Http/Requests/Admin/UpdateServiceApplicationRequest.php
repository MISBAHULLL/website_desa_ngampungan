<?php

namespace App\Http\Requests\Admin;

use App\Models\ServiceApplication;
use App\ServiceApplicationStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $serviceApplication = $this->route('serviceApplication');

        return $serviceApplication instanceof ServiceApplication
            && ($this->user()?->can('update', $serviceApplication) ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(ServiceApplicationStatus::class)],
            'admin_notes' => ['nullable', 'string', 'max:3000'],
            'public_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
