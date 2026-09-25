<?php

namespace App\Enums;

enum AdmissionStatus: string
{
    case Admitted = 'admitted';
    case Checkup = 'checkup';
    case Discharged = 'discharged';
    case Transferred = 'transferred';

    public function label(): string
    {
        return match ($this) {
            self::Admitted => 'Admitted',
            self::Checkup => 'Checkup',
            self::Discharged => 'Discharged',
            self::Transferred => 'Transferred',
        };
    }

    public function occupiesBed(): bool
    {
        return $this === self::Admitted;
    }
}
