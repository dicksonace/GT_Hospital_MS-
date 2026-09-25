<?php

namespace App\Models;

use App\Enums\BillStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bill extends Model
{
    protected $fillable = [
        'bill_number',
        'patient_id',
        'appointment_id',
        'total_amount',
        'paid_amount',
        'status',
        'issued_at',
        'due_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'status' => BillStatus::class,
            'issued_at' => 'datetime',
            'due_at' => 'datetime',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(BillItem::class);
    }

    public function recalculateTotals(?BillStatus $requestedStatus = null): void
    {
        $total = (float) $this->items()->sum('total');
        $paid = (float) $this->paid_amount;
        $this->total_amount = $total;

        $status = $requestedStatus ?? $this->status;

        if ($status === BillStatus::Cancelled) {
            $this->status = BillStatus::Cancelled;
        } elseif ($status === BillStatus::Paid || ($total > 0 && $paid >= $total)) {
            $this->paid_amount = max($paid, $total);
            $this->status = BillStatus::Paid;
        } elseif ($paid > 0) {
            $this->status = BillStatus::Partial;
        } else {
            $this->status = BillStatus::Pending;
        }

        $this->save();
    }

    public function getBalanceAttribute(): float
    {
        return max(0, (float) $this->total_amount - (float) $this->paid_amount);
    }
}
