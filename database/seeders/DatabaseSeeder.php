<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use App\Enums\BillStatus;
use App\Enums\Gender;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\Bill;
use App\Models\BillItem;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\LabTest;
use App\Models\Medicine;
use App\Models\Patient;
use App\Models\User;
use App\Models\Ward;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Core staff accounts (one per role)
        $admin = User::create([
            'name' => 'Hospital Admin',
            'email' => 'admin@hospital.test',
            'password' => Hash::make('password'),
            'role' => UserRole::Admin,
            'phone' => '555-0100',
        ]);

        User::create([
            'name' => 'Reception Desk',
            'email' => 'reception@hospital.test',
            'password' => Hash::make('password'),
            'role' => UserRole::Receptionist,
            'phone' => '555-0101',
        ]);

        User::create([
            'name' => 'Nancy Nurse',
            'email' => 'nurse@hospital.test',
            'password' => Hash::make('password'),
            'role' => UserRole::Nurse,
            'phone' => '555-0102',
        ]);

        User::create([
            'name' => 'Phil Pharmacist',
            'email' => 'pharmacist@hospital.test',
            'password' => Hash::make('password'),
            'role' => UserRole::Pharmacist,
            'phone' => '555-0103',
        ]);

        User::create([
            'name' => 'Larry Lab',
            'email' => 'lab@hospital.test',
            'password' => Hash::make('password'),
            'role' => UserRole::LabTechnician,
            'phone' => '555-0104',
        ]);

        // Departments
        $departments = collect([
            ['name' => 'General Medicine', 'description' => 'Outpatient general care'],
            ['name' => 'Cardiology', 'description' => 'Heart and vascular care'],
            ['name' => 'Pediatrics', 'description' => 'Child healthcare'],
            ['name' => 'Orthopedics', 'description' => 'Bones and joints'],
            ['name' => 'Emergency', 'description' => 'Emergency and trauma'],
        ])->map(fn ($d) => Department::create($d));

        // Doctors (each gets a user login)
        $doctorData = [
            ['name' => 'Dr. Alice Carter', 'spec' => 'Internal Medicine', 'dept' => 0],
            ['name' => 'Dr. Brian Lee', 'spec' => 'Cardiologist', 'dept' => 1],
            ['name' => 'Dr. Carol Smith', 'spec' => 'Pediatrician', 'dept' => 2],
            ['name' => 'Dr. David Nguyen', 'spec' => 'Orthopedic Surgeon', 'dept' => 3],
        ];

        $doctors = collect($doctorData)->map(function ($d, $i) use ($departments) {
            $user = User::create([
                'name' => $d['name'],
                'email' => 'doctor'.($i + 1).'@hospital.test',
                'password' => Hash::make('password'),
                'role' => UserRole::Doctor,
                'phone' => '555-02'.str_pad((string) $i, 2, '0', STR_PAD_LEFT),
            ]);

            return Doctor::create([
                'user_id' => $user->id,
                'department_id' => $departments[$d['dept']]->id,
                'specialization' => $d['spec'],
                'license_number' => 'LIC-'.str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT),
                'phone' => $user->phone,
                'is_available' => true,
            ]);
        });

        // Wards
        Ward::insert([
            ['name' => 'General Ward A', 'type' => 'general', 'capacity' => 20, 'occupied_beds' => 3, 'floor' => '1', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'ICU', 'type' => 'icu', 'capacity' => 8, 'occupied_beds' => 2, 'floor' => '2', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Maternity', 'type' => 'maternity', 'capacity' => 12, 'occupied_beds' => 1, 'floor' => '3', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Private Rooms', 'type' => 'private', 'capacity' => 10, 'occupied_beds' => 0, 'floor' => '4', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Medicines
        Medicine::insert([
            ['name' => 'Paracetamol 500mg', 'generic_name' => 'Acetaminophen', 'category' => 'Analgesic', 'unit' => 'tablet', 'stock_quantity' => 500, 'reorder_level' => 50, 'unit_price' => 0.10, 'expiry_date' => now()->addYear()->toDateString(), 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Amoxicillin 250mg', 'generic_name' => 'Amoxicillin', 'category' => 'Antibiotic', 'unit' => 'capsule', 'stock_quantity' => 30, 'reorder_level' => 40, 'unit_price' => 0.25, 'expiry_date' => now()->addMonths(8)->toDateString(), 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Ibuprofen 400mg', 'generic_name' => 'Ibuprofen', 'category' => 'NSAID', 'unit' => 'tablet', 'stock_quantity' => 200, 'reorder_level' => 30, 'unit_price' => 0.15, 'expiry_date' => now()->addYear()->toDateString(), 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Omeprazole 20mg', 'generic_name' => 'Omeprazole', 'category' => 'PPI', 'unit' => 'capsule', 'stock_quantity' => 120, 'reorder_level' => 25, 'unit_price' => 0.30, 'expiry_date' => now()->addMonths(10)->toDateString(), 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Lab tests
        LabTest::insert([
            ['name' => 'Complete Blood Count', 'code' => 'CBC', 'category' => 'Hematology', 'price' => 25.00, 'normal_range' => '4.5-11.0', 'unit' => 'x10^9/L', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Blood Glucose (Fasting)', 'code' => 'FBS', 'category' => 'Biochemistry', 'price' => 15.00, 'normal_range' => '70-100', 'unit' => 'mg/dL', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Lipid Profile', 'code' => 'LIPID', 'category' => 'Biochemistry', 'price' => 40.00, 'normal_range' => '<200', 'unit' => 'mg/dL', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Urinalysis', 'code' => 'UA', 'category' => 'Pathology', 'price' => 12.00, 'normal_range' => 'Normal', 'unit' => '', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Patients
        $patients = collect([
            ['first_name' => 'John', 'last_name' => 'Doe', 'gender' => Gender::Male, 'dob' => '1985-04-12', 'blood' => 'O+', 'phone' => '555-1001'],
            ['first_name' => 'Jane', 'last_name' => 'Roberts', 'gender' => Gender::Female, 'dob' => '1990-09-23', 'blood' => 'A+', 'phone' => '555-1002'],
            ['first_name' => 'Michael', 'last_name' => 'Brown', 'gender' => Gender::Male, 'dob' => '1978-01-05', 'blood' => 'B-', 'phone' => '555-1003'],
            ['first_name' => 'Emily', 'last_name' => 'Davis', 'gender' => Gender::Female, 'dob' => '2015-07-19', 'blood' => 'AB+', 'phone' => '555-1004'],
            ['first_name' => 'Robert', 'last_name' => 'Wilson', 'gender' => Gender::Male, 'dob' => '1965-11-30', 'blood' => 'O-', 'phone' => '555-1005'],
        ])->map(function ($p, $i) {
            return Patient::create([
                'patient_number' => 'PAT'.str_pad((string) ($i + 1), 5, '0', STR_PAD_LEFT),
                'first_name' => $p['first_name'],
                'last_name' => $p['last_name'],
                'gender' => $p['gender'],
                'date_of_birth' => $p['dob'],
                'blood_group' => $p['blood'],
                'phone' => $p['phone'],
                'email' => strtolower($p['first_name'].'.'.$p['last_name']).'@example.com',
                'address' => '123 Main St, Springfield',
                'emergency_contact_name' => 'Next of Kin',
                'emergency_contact_phone' => '555-9999',
            ]);
        });

        // Appointments + bills
        $statuses = [AppointmentStatus::Scheduled, AppointmentStatus::Completed, AppointmentStatus::Confirmed];

        foreach ($patients as $i => $patient) {
            $doctor = $doctors[$i % $doctors->count()];
            $status = $statuses[$i % count($statuses)];

            $appointment = Appointment::create([
                'appointment_number' => 'APT'.str_pad((string) ($i + 1), 5, '0', STR_PAD_LEFT),
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'department_id' => $doctor->department_id,
                'appointment_date' => now()->addDays($i - 1)->toDateString(),
                'appointment_time' => sprintf('%02d:00', 9 + $i),
                'type' => AppointmentType::Opd,
                'status' => $status,
                'reason' => 'Routine consultation',
            ]);

            $bill = Bill::create([
                'bill_number' => 'BIL'.str_pad((string) ($i + 1), 5, '0', STR_PAD_LEFT),
                'patient_id' => $patient->id,
                'appointment_id' => $appointment->id,
                'paid_amount' => $i % 2 === 0 ? 50 : 0,
                'status' => BillStatus::Pending,
                'issued_at' => now()->subDays($i),
            ]);

            BillItem::create([
                'bill_id' => $bill->id,
                'description' => 'Consultation Fee',
                'quantity' => 1,
                'unit_price' => 50.00,
                'total' => 50.00,
            ]);

            BillItem::create([
                'bill_id' => $bill->id,
                'description' => 'Medication',
                'quantity' => 2,
                'unit_price' => 10.00,
                'total' => 20.00,
            ]);

            $bill->recalculateTotals();
        }
    }
}
