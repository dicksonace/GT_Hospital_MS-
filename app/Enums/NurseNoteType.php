<?php

namespace App\Enums;

enum NurseNoteType: string
{
    case Vitals = 'vitals';
    case Observation = 'observation';
    case Medication = 'medication';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Vitals => 'Vitals',
            self::Observation => 'Observation',
            self::Medication => 'Medication',
            self::Other => 'Other',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
