<?php

namespace Tests\Feature;

use App\Enums\AdmissionStatus;
use App\Enums\BillStatus;
use App\Enums\Gender;
use App\Enums\UserRole;
use App\Models\Admission;
use App\Models\Bill;
use App\Models\BillItem;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdmissionAndBillingFixTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_admissions_include_checkup_as_a_status(): void
    {
        $user = User::factory()->create(['role' => UserRole::Receptionist]);

        $this->actingAs($user)
            ->get(route('admissions.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admissions/Create')
                ->has('statuses')
                ->where('statuses', fn ($statuses) => collect($statuses)->contains('value', 'checkup')));
    }

    public function test_a_checkup_can_be_saved_from_admissions_without_a_ward(): void
    {
        $user = User::factory()->create(['role' => UserRole::Receptionist]);
        $doctor = $this->makeDoctor();
        $patient = $this->makePatient();

        $this->actingAs($user)
            ->post(route('admissions.store'), [
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'status' => AdmissionStatus::Checkup->value,
                'admission_date' => now()->toDateString(),
                'diagnosis' => 'Routine checkup',
            ])
            ->assertRedirect(route('admissions.index'));

        $this->assertDatabaseHas('admissions', [
            'patient_id' => $patient->id,
            'status' => AdmissionStatus::Checkup->value,
            'ward_id' => null,
        ]);
    }

    public function test_changing_a_pending_bill_to_paid_stays_paid(): void
    {
        $user = User::factory()->create(['role' => UserRole::Receptionist]);
        $patient = $this->makePatient();
        $bill = $this->makePendingBill($patient);

        $this->actingAs($user)
            ->put(route('bills.update', $bill), [
                'patient_id' => $patient->id,
                'paid_amount' => 0,
                'status' => BillStatus::Paid->value,
                'issued_at' => now()->toDateString(),
                'items' => [
                    ['description' => 'Consultation', 'quantity' => 1, 'unit_price' => 50],
                ],
            ])
            ->assertRedirect(route('bills.show', $bill));

        $bill->refresh();
        $this->assertSame(BillStatus::Paid, $bill->status);
        $this->assertEquals(50, (float) $bill->paid_amount);
    }

    public function test_mark_as_paid_sets_the_bill_to_paid(): void
    {
        $user = User::factory()->create(['role' => UserRole::Receptionist]);
        $patient = $this->makePatient();
        $bill = $this->makePendingBill($patient);

        $this->actingAs($user)
            ->post(route('bills.mark-paid', $bill))
            ->assertRedirect(route('bills.show', $bill));

        $bill->refresh();
        $this->assertSame(BillStatus::Paid, $bill->status);
        $this->assertEquals(50, (float) $bill->paid_amount);
    }

    private function makeDoctor(): Doctor
    {
        $department = Department::create(['name' => 'General', 'is_active' => true]);
        $user = User::factory()->create(['role' => UserRole::Doctor]);

        return Doctor::create([
            'user_id' => $user->id,
            'department_id' => $department->id,
            'specialization' => 'General',
            'license_number' => 'LIC-FIX-1',
            'is_available' => true,
        ]);
    }

    private function makePatient(): Patient
    {
        return Patient::create([
            'patient_number' => 'PAT00999',
            'first_name' => 'Ama',
            'last_name' => 'Owusu',
            'gender' => Gender::Female,
            'date_of_birth' => '1992-03-04',
            'phone' => '555-3001',
        ]);
    }

    private function makePendingBill(Patient $patient): Bill
    {
        $bill = Bill::create([
            'bill_number' => 'BIL00999',
            'patient_id' => $patient->id,
            'paid_amount' => 0,
            'status' => BillStatus::Pending,
            'issued_at' => now(),
        ]);

        BillItem::create([
            'bill_id' => $bill->id,
            'description' => 'Consultation',
            'quantity' => 1,
            'unit_price' => 50,
            'total' => 50,
        ]);

        $bill->recalculateTotals();

        $this->assertSame(BillStatus::Pending, $bill->fresh()->status);

        return $bill->fresh();
    }
}
