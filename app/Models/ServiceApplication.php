<?php

namespace App\Models;

use App\ServiceApplicationStatus;
use Database\Factories\ServiceApplicationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $reference_number
 * @property string $service_slug
 * @property string $service_title
 * @property string $applicant_name
 * @property string $national_id
 * @property string $phone
 * @property string $address
 * @property string $purpose
 * @property ServiceApplicationStatus $status
 * @property string|null $admin_notes
 * @property int|null $reviewed_by
 * @property Carbon|null $reviewed_at
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property Carbon $submitted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'reference_number',
    'service_slug',
    'service_title',
    'applicant_name',
    'national_id',
    'phone',
    'address',
    'purpose',
    'status',
    'admin_notes',
    'reviewed_by',
    'reviewed_at',
    'ip_address',
    'user_agent',
    'submitted_at',
])]
class ServiceApplication extends Model
{
    /** @use HasFactory<ServiceApplicationFactory> */
    use HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'status' => ServiceApplicationStatus::Submitted->value,
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'applicant_name',
        'national_id',
        'phone',
        'address',
        'purpose',
        'admin_notes',
        'ip_address',
        'user_agent',
    ];

    /**
     * @return HasMany<ServiceApplicationDocument, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(ServiceApplicationDocument::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'applicant_name' => 'encrypted',
            'national_id' => 'encrypted',
            'phone' => 'encrypted',
            'address' => 'encrypted',
            'purpose' => 'encrypted',
            'admin_notes' => 'encrypted',
            'status' => ServiceApplicationStatus::class,
            'submitted_at' => 'immutable_datetime',
            'reviewed_at' => 'immutable_datetime',
        ];
    }
}
