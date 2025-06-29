<?php

namespace App\Providers;

use App\Models\DivisionAdministrative;
use App\Models\User;
use App\Policies\DivisionAdministrativePolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        DivisionAdministrative::class => DivisionAdministrativePolicy::class,
    ];
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
        //
    }
}
