<?php

namespace App\Http\Requests\Admin;

use App\Models\VillageOfficial;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreOrganizationBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'parent_id' => ['required', 'integer', 'exists:village_officials,id'],
            'member_id' => [
                'required',
                'integer',
                'different:parent_id',
                'exists:village_officials,id',
            ],
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

                $parentIds[$this->integer('member_id')] = $this->integer('parent_id');

                if (VillageOfficial::hierarchyContainsCycle($parentIds)) {
                    $validator->errors()->add(
                        'parent_id',
                        'Atasan yang dipilih berada di bawah perangkat ini. Pilih atasan lain agar struktur tidak membentuk lingkaran.',
                    );
                }
            },
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'parent_id.required' => 'Pilih atasan langsung untuk cabang ini.',
            'member_id.required' => 'Pilih perangkat yang menjadi anggota cabang.',
            'member_id.different' => 'Perangkat tidak dapat menjadi atasan bagi dirinya sendiri.',
        ];
    }
}
