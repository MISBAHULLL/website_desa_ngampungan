<?php

namespace App\Http\Requests\Admin;

use Illuminate\Validation\Rules\File;

class UpdateApbdesDocumentRequest extends StoreApbdesDocumentRequest
{
    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['document'] = ['nullable', File::types(['pdf', 'xls', 'xlsx'])->max('10mb')];

        return $rules;
    }
}
