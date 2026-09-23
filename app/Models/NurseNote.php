<?php

namespace App\Models;

use App\Enums\NurseNoteType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NurseNote extends Model
{
    protected $fillable = [
        'patient_id',
        'nurse_id',
        'doctor_id',
        'note_type',
        'blood_pressure',
        'temperature',
        'pulse',
        'respiratory_rate',
        'oxygen_saturation',
        'notes',
        'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'note_type' => NurseNoteType::class,
            'temperature' => 'decimal:1',
            'recorded_at' => 'datetime',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function nurse(): BelongsTo
    {
        return $this->belongsTo(Nurse::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }
}
