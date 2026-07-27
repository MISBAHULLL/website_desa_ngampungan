<?php

namespace App;

enum ServiceApplicationStatus: string
{
    case Submitted = 'submitted';
    case InReview = 'in_review';
    case NeedsRevision = 'needs_revision';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Submitted => 'Pengajuan masuk',
            self::InReview => 'Sedang diperiksa',
            self::NeedsRevision => 'Perlu perbaikan',
            self::Approved => 'Disetujui',
            self::Rejected => 'Ditolak',
            self::Completed => 'Selesai',
        };
    }
}
