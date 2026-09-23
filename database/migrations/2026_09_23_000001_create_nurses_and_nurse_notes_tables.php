<?php

use App\Enums\UserRole;
use App\Models\Nurse;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nurses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->string('license_number')->unique();
            $table->string('phone')->nullable();
            $table->string('shift')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        Schema::create('nurse_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('nurse_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained()->nullOnDelete();
            $table->string('note_type')->default('observation');
            $table->string('blood_pressure')->nullable();
            $table->decimal('temperature', 4, 1)->nullable();
            $table->unsignedSmallInteger('pulse')->nullable();
            $table->unsignedSmallInteger('respiratory_rate')->nullable();
            $table->unsignedTinyInteger('oxygen_saturation')->nullable();
            $table->text('notes');
            $table->timestamp('recorded_at');
            $table->timestamps();
        });

        User::query()
            ->where('role', UserRole::Nurse->value)
            ->whereDoesntHave('nurse')
            ->get()
            ->each(function (User $user) {
                Nurse::create([
                    'user_id' => $user->id,
                    'license_number' => 'NRS-'.str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
                    'phone' => $user->phone,
                    'is_available' => true,
                ]);
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('nurse_notes');
        Schema::dropIfExists('nurses');
    }
};
