<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ward extends Model
{
    protected $fillable = [
        'name',
        'type',
        'capacity',
        'occupied_beds',
        'floor',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function admissions(): HasMany
    {
        return $this->hasMany(Admission::class);
    }

    public function availableBeds(): int
    {
        return max(0, $this->capacity - $this->occupied_beds);
    }
}
