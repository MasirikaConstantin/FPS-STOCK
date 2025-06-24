<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
    public function editContact(){
        return Inertia::render('settings/contact',[
            "user"=>Auth::user()
        ]);
    }
    public function updateContact(Request $request)
    {
        $request->validate([
            "phone" => "nullable|numeric",
            "address" => "nullable|string",
            "avatar" => "nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096",
        ]);
        
        $user = Auth::user();
        
        // Chargez explicitement le profil ou créez-en un nouveau si inexistant
        $profil = $user->profil()->firstOrNew([]);
        
        $profil->phone = $request->phone;
        $profil->address = $request->address;
        
        if ($request->hasFile('avatar')) {
            // Stockage selon les normes Laravel (dans storage/app/public)
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $avatarPath;
            $user->save();

        }
        
        $profil->save();
        
        return redirect()->route('profile.autres');
    }
}
