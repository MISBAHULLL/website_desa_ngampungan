<?php

namespace App\Http\Requests\Admin;

use App\Models\VillageOfficial;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateOrganizationStructureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'updates' => ['required', 'array', 'min:1'],
            'updates.*.id' => [
                'required',
                'integer',
                'distinct',
                'exists:village_officials,id',
            ],
            'updates.*.parent_id' => ['nullable', 'integer', 'exists:village_officials,id'],
            'updates.*.sort_order' => ['required', 'integer', 'min:0'],
        ];
    }

    /** @return array<int, callable> */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $parentIds = VillageOfficial::query()
                    ->pluck('parent_id', 'id')
                    ->map(fn (mixed $parentId): ?int => $parentId === null ? null : (int) $parentId)
                    ->all();

                foreach ($this->array('updates') as $update) {
                    $parentIds[(int) $update['id']] = isset($update['parent_id'])
                        ? (int) $update['parent_id']
                        : null;
                }

                if (VillageOfficial::hierarchyContainsCycle($parentIds)) {
                    $validator->errors()->add(
                        'updates',
                        'Perubahan ditolak karena menghasilkan hubungan atasan-bawahan yang melingkar.',
                    );
                }
            },
        ];
    }
}
