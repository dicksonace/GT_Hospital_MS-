<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use App\Enums\Gender;
use App\Enums\NurseNoteType;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Nurse;
use App\Models\NurseNote;
use App\Models\Patient;
use App\Models\User;
use App\Notifications\PatientAssignedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ClinicalWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_nurse_cannot_open_admin_or_billing_pages(): void
    {
        $nurse = $this->makeNurseUser();

        $this->actingAs($nurse)->get(route('staff.index'))->assertForbidden();
        $this->actingAs($nurse)->get(route('nurses.index'))->assertForbidden();
        $this->actingAs($nurse)->get(route('bills.index'))->assertForbidden();
    }

    public function test_nurse_can_record_a_note_and_the_assigned_doctor_can_read_it(): void
    {
        $nurseUser = $this->makeNurseUser();
        $doctorUser = $this->makeDoctorUser();
        $patient = $this->makePatient();

        $this->actingAs($nurseUser)
            ->post(route('nurse-notes.store'), [
                'patient_id' => $patient->id,
                'doctor_id' => $doctorUser->doctor->id,
                'note_type' => NurseNoteType::Vitals->value,
                'blood_pressure' => '118/76',
                'temperature' => 36.7,
                'pulse' => 70,
                'respiratory_rate' => 16,
                'oxygen_saturation' => 99,
                'notes' => 'Pre-checkup vitals recorded.',
            ])
            ->assertRedirect(route('nurse-notes.index'));

        $note = NurseNote::first();
        $this->assertNotNull($note);
        $this->assertSame($nurseUser->nurse->id, $note->nurse_id);

        $this->actingAs($doctorUser)
            ->get(route('nurse-notes.show', $note))
            ->assertOk();

        $this->actingAs($doctorUser)
            ->get(route('nurse-notes.create'))
            ->assertForbidden();
    }

    public function test_assigning_a_checkup_emails_the_doctor(): void
    {
        Notification::fake();

        $receptionist = User::factory()->create(['role' => UserRole::Receptionist]);
        $doctorUser = $this->makeDoctorUser();
        $patient = $this->makePatient();

        $this->actingAs($receptionist)
            ->post(route('checkups.store'), [
                'patient_id' => $patient->id,
                'doctor_id' => $doctorUser->doctor->id,
                'department_id' => $doctorUser->doctor->department_id,
                'appointment_date' => now()->toDateString(),
                'appointment_time' => '09:30',
                'status' => AppointmentStatus::Scheduled->value,
                'reason' => 'Annual checkup',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('appointments', [
            'type' => AppointmentType::Checkup->value,
            'patient_id' => $patient->id,
            'doctor_id' => $doctorUser->doctor->id,
        ]);

        Notification::assertSentTo($doctorUser, PatientAssignedNotification::class);
    }

    public function test_pharmacist_cannot_open_checkups(): void
    {
        $pharmacist = User::factory()->create(['role' => UserRole::Pharmacist]);

        $this->actingAs($pharmacist)->get(route('checkups.index'))->assertForbidden();
        $this->actingAs($pharmacist)->get(route('patients.index'))->assertForbidden();
    }

    public function test_clinical_pages_render_for_the_right_roles(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $nurse = $this->makeNurseUser();
        $doctor = $this->makeDoctorUser();

        $this->actingAs($admin)->get(route('nurses.index'))->assertOk();
        $this->actingAs($admin)->get(route('checkups.index'))->assertOk();
        $this->actingAs($nurse)->get(route('nurse-notes.index'))->assertOk();
        $this->actingAs($nurse)->get(route('checkups.index'))->assertOk();
        $this->actingAs($doctor)->get(route('nurse-notes.index'))->assertOk();
        $this->actingAs($doctor)->get(route('checkups.create'))->assertOk();
    }

    public function test_admin_can_create_a_nurse_login(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $department = Department::create(['name' => 'Nursing', 'is_active' => true]);

        $this->actingAs($admin)
            ->post(route('nurses.store'), [
                'name' => 'Ama Nurse',
                'email' => 'ama.nurse@hospital.test',
                'password' => 'password1',
                'department_id' => $department->id,
                'license_number' => 'NRS-0099',
                'shift' => 'morning',
                'is_available' => true,
            ])
            ->assertRedirect(route('nurses.index'));

        $this->assertDatabaseHas('users', [
            'email' => 'ama.nurse@hospital.test',
            'role' => UserRole::Nurse->value,
        ]);
        $this->assertDatabaseHas('nurses', [
            'license_number' => 'NRS-0099',
        ]);
    }

    public function test_appointment_assignment_emails_the_doctor(): void
    {
        Notification::fake();

        $receptionist = User::factory()->create(['role' => UserRole::Receptionist]);
        $doctorUser = $this->makeDoctorUser();
        $patient = $this->makePatient();

        $this->actingAs($receptionist)
            ->post(route('appointments.store'), [
                'patient_id' => $patient->id,
                'doctor_id' => $doctorUser->doctor->id,
                'department_id' => $doctorUser->doctor->department_id,
                'appointment_date' => now()->toDateString(),
                'appointment_time' => '11:00',
                'type' => AppointmentType::Opd->value,
                'status' => AppointmentStatus::Scheduled->value,
                'reason' => 'Consultation',
            ])
            ->assertRedirect(route('appointments.index'));

        Notification::assertSentTo($doctorUser, PatientAssignedNotification::class);
        $this->assertInstanceOf(Appointment::class, Appointment::first());
    }

    private function makeNurseUser(): User
    {
        $user = User::factory()->create([
            'role' => UserRole::Nurse,
            'email' => 'nurse.workflow@hospital.test',
        ]);

        Nurse::create([
            'user_id' => $user->id,
            'license_number' => 'NRS-TEST-1',
            'is_available' => true,
        ]);

        return $user->fresh();
    }

    private function makeDoctorUser(): User
    {
        $department = Department::create(['name' => 'General Medicine', 'is_active' => true]);
        $user = User::factory()->create([
            'name' => 'Dr. Test',
            'role' => UserRole::Doctor,
            'email' => 'doctor.workflow@hospital.test',
        ]);

        Doctor::create([
            'user_id' => $user->id,
            'department_id' => $department->id,
            'specialization' => 'Internal Medicine',
            'license_number' => 'LIC-TEST-1',
            'is_available' => true,
        ]);

        return $user->fresh();
    }

    private function makePatient(): Patient
    {
        return Patient::create([
            'patient_number' => 'PAT00099',
            'first_name' => 'Kojo',
            'last_name' => 'Boateng',
            'gender' => Gender::Male,
            'date_of_birth' => '1990-01-01',
            'phone' => '555-2001',
        ]);
    }
}
