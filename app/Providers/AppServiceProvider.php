<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

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
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        RateLimiter::for('contact-messages', fn (Request $request): array => [
            Limit::perMinute(3)->by('minute:'.$request->ip()),
            Limit::perHour(10)->by('hour:'.$request->ip()),
        ]);

        RateLimiter::for('service-applications', fn (Request $request): array => [
            Limit::perMinute(2)->by('minute:'.$request->ip()),
            Limit::perHour(8)->by('hour:'.$request->ip()),
        ]);

        RateLimiter::for('service-application-tracking', fn (Request $request): array => [
            Limit::perMinute(10)->by('minute:'.$request->ip()),
            Limit::perHour(40)->by('hour:'.$request->ip()),
        ]);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
