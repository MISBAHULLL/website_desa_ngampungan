<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $title
 * @property string $category
 * @property string $year
 * @property CarbonImmutable $document_date
 * @property string|null $file_path
 * @property string $file_format
 * @property string $original_name
 * @property string|null $mime_type
 * @property string $file_size
 */
class ApbdesDocument extends Model
{
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
