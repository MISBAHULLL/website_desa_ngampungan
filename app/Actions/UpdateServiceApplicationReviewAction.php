<?php

namespace App\Actions;

use App\Models\ServiceApplication;
use App\Models\User;
use App\ServiceApplicationStatus;
use Illuminate\Support\Facades\DB;

class UpdateServiceApplicationReviewAction
{
    public function handle(
        ServiceApplication $serviceApplication,
        ServiceApplicationStatus $status,
        ?string $adminNotes,
        ?string $publicNotes,
        User $reviewer,
    ): void {
        DB::transaction(function () use (
            $adminNotes,
            $publicNotes,
            $reviewer,
            $serviceApplication,
            $status,
        ): void {
            $shouldCreateTimelineEntry = $serviceApplication->status !== $status
                || $serviceApplication->public_notes !== $publicNotes;

            $serviceApplication->update([
                'status' => $status,
                'admin_notes' => $adminNotes,
                'public_notes' => $publicNotes,
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
            ]);

            if ($shouldCreateTimelineEntry) {
                $serviceApplication->statusHistories()->create([
                    'status' => $status,
                    'public_notes' => $publicNotes,
                    'changed_by' => $reviewer->id,
                ]);
            }
        });
    }
}
