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
        'file_size',
    ];

    protected function casts(): array
    {
        return [
            'document_date' => 'date',
        ];
    }
}
