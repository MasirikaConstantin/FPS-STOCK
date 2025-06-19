<?php

use App\Http\Controllers\EmailVerificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CocController;
use App\Http\Controllers\CentralStockController;
use App\Http\Controllers\HospitalStockController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\KitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;

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



// Route group avec middleware d'authentification
Route::middleware(['auth', 'verified'])->group(function () {
    
   
    
    // COCO
    Route::get('/coc', [CocController::class, 'index'])
         ->name('coc');
    
    // Stocks Central
    Route::prefix('central-stocks')->group(function () {
        Route::get('/', [CentralStockController::class, 'index'])
             ->name('central-stocks.index');
        // Ajoutez d'autres routes CRUD si nécessaire
    });
    
    // Stocks Hôpitaux
    Route::prefix('hospital-stocks')->group(function () {
        Route::get('/', [HospitalStockController::class, 'index'])
             ->name('hospital-stocks.index');
    });
    
    // Hôpitaux
    Route::resource('hospitals', HospitalController::class)
         ->except(['show']); // Exclure la route show si non utilisée
    
    // Médicaments
    Route::resource('medicines', MedicineController::class);
    
    // Transferts
    Route::resource('transfers', TransferController::class);
    
    // Alertes
    Route::get('/alerts', [AlertController::class, 'index'])
         ->name('alerts.index');
    
    // Kits
    Route::resource('kits', KitController::class);
    
    // Utilisateurs
    Route::resource('users', UserController::class)
         ->middleware('can:manage-users'); // Exemple de permission
    
    // Rapports
    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportController::class, 'index'])
             ->name('reports.index');
        // Routes spécifiques pour différents rapports
    });
    
    // Paramètres
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])
             ->name('settings.index');
        // Autres routes de paramètres
    });
});

// Pour les besoins d'Inertia.js - route de fallback
Route::fallback(function () {
    return inertia('Error/404');
});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
