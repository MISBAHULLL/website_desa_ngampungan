<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApbdesDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'year',
        'document_date',
        'file_path',
        'file_format',
        'original_name',
        'mime_type',
        'file_size',
    ];

    protected function casts(): array
    {
        return [
            'document_date' => 'date',
        ];
    }

    /** @return array<string, mixed> */
    public function toPublicData(): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'year' => (string) $this->year,
            'documentDate' => $this->document_date->format('Y-m-d'),
            'documentDateLabel' => $this->document_date->translatedFormat('d F Y'),
            'format' => $this->file_format,
            'fileSize' => $this->file_size,
            'downloadUrl' => route('transparency.documents.download', $this),
        ];
    }
}
