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
use App\Http\Controllers\StockController;
use App\Http\Controllers\StockEntreeController;
use App\Http\Controllers\TransfertController;
use App\Http\Controllers\StockMouvementController;
use App\Models\Stock;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
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
    Route::get('/coc', [CocController::class, 'index'])
         ->name('coc');
    // Stocks Hôpitaux
    Route::prefix('hospital-stocks')->group(function () {
        Route::get('/', [HospitalStockController::class, 'index'])
             ->name('hospital-stocks.index');
    });
    // Transferts
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

Route::post('/transfert-gest/{letransfert}/approve', [TransfertController::class, 'approve'])->name('approve-transfert.approve');
Route::post('/transfert-gesta/{letransferta}/complete', [TransfertController::class, 'complete'])->name('complete.transferts.complete');
Route::post('/transfert-gestb/{letransfertb}/cancel', [TransfertController::class, 'cancel'])->name('cancel.transferts.cancel');

Route::middleware('auth')->group(function () {
    Route::get('/transferts', [TransfertController::class, 'index'])->name('transferts.index');
    Route::get('/transferts/create', [TransfertController::class, 'create'])->name('transferts.create');
    Route::post('/transferts', [TransfertController::class, 'store'])->name('transferts.store');
    Route::get('/transferts/{transfert}', [TransfertController::class, 'show'])->name('transferts.show');
    Route::get('/transferts/{transfert}/edit', [TransfertController::class, 'show'])->name('transferts.edit');
    
});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('alerts', \App\Http\Controllers\AlertController::class)
        ->except(['edit', 'update']); // On utilise notre propre logique pour edit/update
    
    Route::get('alerts/{alert}/edit', [\App\Http\Controllers\AlertController::class, 'edit'])
        ->name('alerts.edit');
    Route::put('alerts/{alert}', [\App\Http\Controllers\AlertController::class, 'update'])
        ->name('alerts.update');
    Route::post('alerts-les/{cetalert}/resolve', [\App\Http\Controllers\AlertController::class, 'resolve'])
        ->name('alerts.resolve');
});


Route::middleware(['auth', 'verified'])->group(function () {
    // Mouvements de stock
    Route::prefix('stock/mouvements')->group(function () {
        Route::get('/', [StockMouvementController::class, 'index'])
            ->name('stock.mouvements.index');
            
        Route::get('/direct-out', [StockMouvementController::class, 'createDirectOut'])
            ->name('stock.mouvements.direct-out.create');

        Route::get('/mouvements/direct-out', [StockMouvementController::class, 'index'])
            ->name('stock.mouvements.direct-out.index');
            
        Route::post('/direct-out', [StockMouvementController::class, 'storeDirectOut'])
            ->name('stock.mouvements.direct-out');
    });
});


Route::middleware(['auth', 'verified'])->group(function () {
    // Entrées de stock
    Route::prefix('stock/entree')->group(function () {
        Route::get('/', [StockEntreeController::class, 'create'])
            ->name('stock.entree.create');
            
        Route::post('/', [StockEntreeController::class, 'store'])
            ->name('stock.entree.store');
            
        Route::get('/activite', function () {
            return Inertia::render('Stock/Activite', [
                'stocks' => Stock::with('medicalProduit')
                    ->whereNull('hopital_id')
                    ->orderBy('created_at', 'desc')
                    ->get()
            ]);
        })->name('stock.entree.activite');

        Route::get('/activite/{id}', [StockEntreeController::class, 'show'])
        ->name('stock.entree.show');
    });
    
    Route::get('/lesstocks', [StockController::class, 'lesstocks'])
    ->name('stock.lesstocks');
});

Route::fallback(function () {
    return inertia('Error/404');
});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
