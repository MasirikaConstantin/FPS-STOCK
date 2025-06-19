<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use DragonCode\Contracts\Cashier\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request, $id, $hash): RedirectResponse
    {
        $user = User::findOrFail($id);

        // 1. Vérifie si l'email est déjà vérifié
        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')
                ->with('status', 'Votre email est déjà vérifié.');
        }

        // 2. Vérifie la signature et le hash
        if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
            abort(403, 'Lien de vérification invalide.');
        }

        // 3. Marque comme vérifié et déclenche l'événement
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // 4. Redirection avec message
        return redirect()->route('login')
            ->with('verified', true)
            ->with('status', 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.');
    }
}
