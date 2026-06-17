<?php

namespace App\Enums;

enum AdmissionStatus: string
{
    case Admitted = 'admitted';
    case Discharged = 'discharged';
    case Transferred = 'transferred';

    public function label(): string
    {
        return match ($this) {
            self::Admitted => 'Admitted',
            self::Discharged => 'Discharged',
            self::Transferred => 'Transferred',
        };
    }
}
