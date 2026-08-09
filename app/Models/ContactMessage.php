<?php

namespace App\Models;

use App\ContactMessageStatus;
use Carbon\CarbonImmutable;
use Database\Factories\ContactMessageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $contact
 * @property string $category
 * @property string $message
 * @property ContactMessageStatus $status
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property CarbonImmutable|null $read_at
 * @property CarbonImmutable|null $resolved_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable([
    'name',
    'contact',
    'category',
    'message',
    'status',
    'ip_address',
    'user_agent',
    'read_at',
    'resolved_at',
])]
class ContactMessage extends Model
{
    /** @use HasFactory<ContactMessageFactory> */
    use HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'status' => ContactMessageStatus::Unread->value,
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ContactMessageStatus::class,
            'read_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }
}
