<?php

use App\Http\Controllers\EmailVerificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/auth', function () {
    return Inertia::render('auth/auth', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
        'verifyMessage' => session('verifyMessage'),
    ]);
})->name('auth');

Route::get('/email/verification', [EmailVerificationController::class, 'show'])
    ->name('verification-mail');
Route::post('/email/verification-resend', [EmailVerificationController::class, 'resend'])
    ->name('verification.resend');



    // Route pour traiter la demande de vérification
Route::post('/verify-email/send', [EmailVerificationController::class, 'send'])
->name('verification.send-to');

// Route de vérification (sans auth)
Route::get('/verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])
->name('verification.verify');
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
