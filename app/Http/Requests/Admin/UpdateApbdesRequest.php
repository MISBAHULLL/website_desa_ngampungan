<?php

namespace App\Http\Requests\Admin;

use App\Models\ApbdesSummary;
use Illuminate\Validation\Rule;

class UpdateApbdesRequest extends StoreApbdesRequest
{
    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        $rules = parent::rules();
        $apbdes = $this->route('apbdes');

        $rules['year'] = [
            'required',
            'digits:4',
            Rule::unique(ApbdesSummary::class, 'year')->ignore($apbdes),
        ];

        return $rules;
    }
}
