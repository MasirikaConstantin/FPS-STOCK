<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/auth', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'verifyMessage' => $request->session()->get('verifyMessage'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        try {
            $request->authenticate();
            $user = Auth::user();
    
            if (!$user->is_active) {
                Auth::logout();
                return Inertia::render('auth/auth', [
                    'errors' => ['email' => 'Votre compte est désactivé. Veuillez contacter l\'administrateur.'],
                    'flash' => ['error' => 'Compte désactivé']
                ]);
            }
    
            if (is_null($user->email_verified_at)) {
                Auth::logout();
                return Inertia::render('auth/auth', [
                    'errors' => ['email' => 'Email non vérifié'],
                    'flash' => ['error' => 'Vous devez vérifier votre email'],
                    'verifyMessage' => 'Veillez vérifier votre email pour activer votre compte.'
                ]);
            }
    
            // Mise à jour des informations de connexion
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip()
            ]);
    
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard'));
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Erreur de validation');
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}