<?php

namespace App\Models;

use App\Enums\LabOrderStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LabOrder extends Model
{
    protected $fillable = [
        'order_number',
        'patient_id',
        'doctor_id',
        'appointment_id',
        'lab_test_id',
        'status',
        'result',
        'notes',
        'ordered_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => LabOrderStatus::class,
            'ordered_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function labTest(): BelongsTo
    {
        return $this->belongsTo(LabTest::class);
    }
}
