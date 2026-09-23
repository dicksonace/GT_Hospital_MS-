<?php

namespace App\Providers;

use App\Enums\AppointmentType;
use App\Models\Appointment;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Route::bind('checkup', function (string $value) {
            return Appointment::query()
                ->where('type', AppointmentType::Checkup)
                ->whereKey($value)
                ->firstOrFail();
        });
    }
}
