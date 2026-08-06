<?php

namespace App\Actions;

use App\Models\ApbdesSummary;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class UpsertApbdesSummary
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function execute(array $attributes, ?ApbdesSummary $summary = null): ApbdesSummary
    {
        return DB::transaction(function () use ($attributes, $summary): ApbdesSummary {
            $summary ??= new ApbdesSummary;
            $summary->fill(Arr::only($attributes, ['year', 'updated_date', 'net_financing']));
            $summary->save();

            $summary->incomeSources()->delete();
            $summary->activities()->delete();
            $summary->incomeSources()->createMany($attributes['income_sources']);
            $summary->activities()->createMany($attributes['activities']);

            return $summary->load(['incomeSources', 'activities']);
        });
    }
}
