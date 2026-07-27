<?php

namespace App\Models;

use Database\Factories\ServiceApplicationDocumentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $service_application_id
 * @property string $document_key
 * @property string $document_label
 * @property string $original_name
 * @property string $storage_disk
 * @property string $storage_path
 * @property string $mime_type
 * @property int $size
 */
#[Fillable([
    'document_key',
    'document_label',
    'original_name',
    'storage_disk',
    'storage_path',
    'mime_type',
    'size',
])]
class ServiceApplicationDocument extends Model
{
    /** @use HasFactory<ServiceApplicationDocumentFactory> */
    use HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'storage_disk' => 'local',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'original_name',
        'storage_path',
    ];

    /**
     * @return BelongsTo<ServiceApplication, $this>
     */
    public function serviceApplication(): BelongsTo
    {
        return $this->belongsTo(ServiceApplication::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'original_name' => 'encrypted',
            'size' => 'integer',
        ];
    }
}
