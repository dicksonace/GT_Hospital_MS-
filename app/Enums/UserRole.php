<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Doctor = 'doctor';
    case Nurse = 'nurse';
    case Receptionist = 'receptionist';
    case Pharmacist = 'pharmacist';
    case LabTechnician = 'lab_technician';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Doctor => 'Doctor',
            self::Nurse => 'Nurse',
            self::Receptionist => 'Receptionist',
            self::Pharmacist => 'Pharmacist',
            self::LabTechnician => 'Lab Technician',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
