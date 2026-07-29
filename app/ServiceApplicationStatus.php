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

    public function publicDescription(): string
    {
        return match ($this) {
            self::Submitted => 'Pengajuan sudah diterima sistem dan menunggu pemeriksaan petugas.',
            self::InReview => 'Petugas sedang memeriksa data dan dokumen persyaratan.',
            self::NeedsRevision => 'Warga perlu memperbaiki data atau dokumen sesuai petunjuk petugas.',
            self::Approved => 'Pengajuan telah disetujui dan dokumen layanan sedang disiapkan.',
            self::Rejected => 'Pengajuan belum dapat diproses lebih lanjut.',
            self::Completed => 'Proses layanan telah selesai. Ikuti petunjuk pengambilan dari petugas desa.',
        };
    }
}
