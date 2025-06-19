<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class EmailVerificationController extends Controller
{
    // Affiche le formulaire
    public function show()
    {
        return Inertia::render('EmailVerification');
    }

    // Envoie le lien de vérification
    public function send(Request $request)
{
    // Validation avec message personnalisé
    $request->validate([
        'email' => 'required|email|exists:users,email'
    ], [
        'email.exists' => 'Aucun compte trouvé avec cette adresse email.'
    ]);

    // Récupération de l'utilisateur (inutile de faire ->first() car la validation exists garantit qu'il existe)
    $user = User::where('email', $request->email)->firstOrFail();

    // Vérification si déjà vérifié
    if ($user->hasVerifiedEmail()) {
        return back()
               ->withInput()
               ->with('error', 'Cet email est déjà vérifié.');
    }

    try {
        // Envoi de la notification
        $user->sendEmailVerificationNotification();
        
        return back()
               ->with('success', 'Un nouveau lien de vérification a été envoyé à votre adresse email.');
    
    } catch (\Exception $e) {
        // Log l'erreur pour le débogage
        \Log::error('Erreur envoi email vérification: ' . $e->getMessage());
        
        return back()
               ->withInput()
               ->with('error', 'Une erreur est survenue lors de l\'envoi du lien. Veuillez réessayer plus tard.');
    }
}

    // Traite la vérification
    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
            abort(403, 'Lien de vérification invalide.');
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        return redirect()->route('login')
            ->with('status', 'Email vérifié avec succès! Vous pouvez maintenant vous connecter.');
    }
}