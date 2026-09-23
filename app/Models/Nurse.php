<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Nurse extends Model
{
    protected $fillable = [
        'user_id',
        'department_id',
        'license_number',
        'phone',
        'shift',
        'is_available',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(NurseNote::class);
    }

    public function getFullNameAttribute(): string
    {
        return $this->user?->name ?? 'Unknown Nurse';
    }
}
