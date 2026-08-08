<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreVillagePotentialRequest extends FormRequest
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
            'category' => ['required', 'string', 'in:umkm,agriculture,tourism,culture,culinary,services'],
            'image' => ['nullable', 'image', 'max:5120'], // max 5MB
            'image_alt' => ['nullable', 'string', 'max:255'],
            'short_description' => ['required', 'string', 'max:500'],
            'description' => ['required', 'array', 'min:1'],
            'description.*' => ['required', 'string', 'max:2000'],
            'manager_label' => ['required', 'string', 'max:255'],
            'manager_name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'phone' => ['required', 'string', 'max:50'],
            'phone_label' => ['nullable', 'string', 'max:50'],
            'opening_hours' => ['nullable', 'string', 'max:500'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'location_label' => ['nullable', 'string', 'max:500'],
            'offerings' => ['nullable', 'array'],
            'offerings.*.name' => ['required', 'string', 'max:255'],
            'offerings.*.description' => ['required', 'string', 'max:1000'],
            'offerings.*.image' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
