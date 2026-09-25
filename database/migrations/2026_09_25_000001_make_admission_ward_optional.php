<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('admissions', function (Blueprint $table) {
            $table->dropForeign(['ward_id']);
        });

        Schema::table('admissions', function (Blueprint $table) {
            $table->unsignedBigInteger('ward_id')->nullable()->change();
            $table->string('bed_number')->nullable()->change();
            $table->foreign('ward_id')->references('id')->on('wards')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('admissions', function (Blueprint $table) {
            $table->dropForeign(['ward_id']);
        });

        Schema::table('admissions', function (Blueprint $table) {
            $table->unsignedBigInteger('ward_id')->nullable(false)->change();
            $table->string('bed_number')->nullable(false)->change();
            $table->foreign('ward_id')->references('id')->on('wards')->cascadeOnDelete();
        });
    }
};
