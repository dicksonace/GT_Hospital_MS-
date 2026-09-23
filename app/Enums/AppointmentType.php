<?php

namespace App\Enums;

enum AppointmentType: string
{
    case Checkup = 'checkup';
    case Opd = 'opd';
    case FollowUp = 'follow_up';
    case Emergency = 'emergency';

    public function label(): string
    {
        return match ($this) {
            self::Checkup => 'Checkup',
            self::Opd => 'OPD',
            self::FollowUp => 'Follow-up',
            self::Emergency => 'Emergency',
        };
    }
}
