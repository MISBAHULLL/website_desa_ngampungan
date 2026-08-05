<?php

namespace App\Http\Requests\Admin;

class UpdateVillageOfficialRequest extends StoreVillageOfficialRequest
{
    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return array_replace(parent::rules(), [
            'remove_photo' => ['sometimes', 'boolean'],
        ]);
    }
}
