<?php

use App\Http\Controllers\Admin\PermissionAssignmentController;
use App\Http\Controllers\EmailVerificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CocController;
use App\Http\Controllers\CentralStockController;
use App\Http\Controllers\HospitalStockController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\DivisionAdministrativeController;
use App\Http\Controllers\KitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StockCentalController;
use App\Http\Controllers\TransfertController;
use App\Models\DivisionAdministrave;

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
    
   
    
    // Stocks Hôpitaux
    Route::prefix('hospital-stocks')->group(function () {
        Route::get('/', [HospitalStockController::class, 'index'])
             ->name('hospital-stocks.index');
    });
    
   
    // Transferts
    Route::resource('transferts', TransfertController::class);

    Route::post('/transferts/{transfert}/approve', [TransfertController::class, 'approve'])
    ->name('transferts.approve')
    ->middleware(['auth', 'verified']);

Route::post('/transferts/{transfert}/deliver', [TransfertController::class, 'deliver'])
    ->name('transferts.deliver')
    ->middleware(['auth', 'verified']);

Route::post('/transferts/{transfert}/cancel', [TransfertController::class, 'cancel'])
    ->name('transferts.cancel')
    ->middleware(['auth', 'verified']);

    Route::get('/categories', [CategorieController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategorieController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategorieController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}', [CategorieController::class, 'show'])->name('categories.show');
    Route::get('/categories/{category}/edit', [CategorieController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [CategorieController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategorieController::class, 'destroy'])->name('categories.destroy');
    



    Route::prefix('users')->middleware('can:viewAny,App\Models\User')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('users.index');
        Route::get('/{user}', [UserController::class, 'show'])->name('users.show');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy');


        Route::get('users/create', [UserController::class, 'create'])
        ->name('users.create')
        ->middleware('can:create,App\Models\User');
        
        Route::post('users', [UserController::class, 'store'])
            ->name('users.store')
            ->middleware('can:create,App\Models\User');
    });
    
    // Alertes
    Route::get('/alerts', [AlertController::class, 'index'])
         ->name('alerts.index');
    
    // Kits
    Route::resource('kits', KitController::class);
    
 
    
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

    Route::get('/settings', [DivisionAdministrativeController::class, 'index'])
         ->name('settings.index');
});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('divisions', [DivisionAdministrativeController::class, 'index'])->name('divisions.index');
    Route::get('divisions/{division}', [DivisionAdministrativeController::class, 'show'])->name('divisions.show');
    Route::get('divisions/{division}/edit', [DivisionAdministrativeController::class, 'edit'])->name('divisions.edit');
    Route::put('divisions/{division}', [DivisionAdministrativeController::class, 'update'])->name('divisions.update');
    Route::delete('divisions/{division}', [DivisionAdministrativeController::class, 'destroy'])->name('divisions.destroy');
    
    Route::get('division/create', [DivisionAdministrativeController::class, 'create'])
        ->name('division.create');
        
    Route::post('division', [DivisionAdministrativeController::class, 'store'])
        ->name('division.store')
        ->middleware('can:create,App\Models\DivisionAdministrative');
        
    Route::get('divisions/by-type', [DivisionAdministrativeController::class, 'getByType'])
        ->name('divisions.by-type');
});



Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/permissions/assign', [PermissionAssignmentController::class, 'index'])
         ->name('admin.permissions.assign');
         Route::get('/permissions', [PermissionAssignmentController::class, 'accueil'])
         ->name('admin.permissions.index');
         
         Route::get('/permissions/create', [PermissionAssignmentController::class, 'create'])
         ->name('admin.permissions.create');

         Route::post('/permissions/create', [PermissionAssignmentController::class, 'storePermission'])
         ->name('admin.permissions.store');

         Route::get('/permissions/{permission}/edit', [PermissionAssignmentController::class, 'edit'])
         ->name('admin.permissions.edit');
            Route::put('/permissions/{permission}', [PermissionAssignmentController::class, 'update'])
            ->name('admin.permissions.update');
    Route::delete('/permissions/{permission}', [PermissionAssignmentController::class, 'destroy'])->name('admin.permissions.destroy');

    Route::post('/permissions/assign', [PermissionAssignmentController::class, 'store']);
});

Route::prefix('hopitals')->group(function () {
    Route::get('/', [HospitalController::class, 'index'])
        ->name('hopitals.index');

    Route::get('/create', [HospitalController::class, 'create'])
        ->name('hopitals.create');

    Route::post('/', [HospitalController::class, 'store'])
        ->name('hopitals.store');

    Route::get('/{hopital}', [HospitalController::class, 'show'])
        ->name('hopitals.show');

    Route::get('/{hopital}/edit', [HospitalController::class, 'edit'])
        ->name('hopitals.edit');

    Route::put('/{hopital}', [HospitalController::class, 'update'])
        ->name('hopitals.update');

    Route::delete('/{hopital}', [HospitalController::class, 'destroy'])
        ->name('hopitals.destroy');
});

Route::resource('fournisseurs', \App\Http\Controllers\FournisseurController::class)
    ->middleware(['auth', 'verified']);



Route::resource('medical-produits', \App\Http\Controllers\MedicalProduitController::class)
    ->middleware(['auth', 'verified']);
Route::resource('stocks', \App\Http\Controllers\StockController::class)
    ->middleware(['auth', 'verified']);

Route::resource('central-stocks', StockCentalController::class)->middleware(['auth', 'verified']);
// Pour les besoins d'Inertia.js - route de fallback
Route::fallback(function () {
    return inertia('Error/404');
});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
