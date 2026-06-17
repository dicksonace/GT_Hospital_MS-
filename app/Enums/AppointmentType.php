<?php

namespace App\Enums;

enum AppointmentType: string
{
    case Opd = 'opd';
    case FollowUp = 'follow_up';
    case Emergency = 'emergency';

    public function label(): string
    {
        return match ($this) {
            self::Opd => 'OPD',
            self::FollowUp => 'Follow-up',
            self::Emergency => 'Emergency',
        };
    }
}
