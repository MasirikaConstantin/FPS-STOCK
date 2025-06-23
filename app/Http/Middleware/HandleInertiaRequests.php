<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        $user = $request->user()->loadMissing([
            'profile' => fn ($query) => $query->select('id', 'user_id', 'hopital_id'),
            'profile.hopital' => fn ($query) => $query->select('id', 'nom', 'ville'),
            'permissions' => fn ($query) => $query->select(
                                'permissions.id',
                                'permissions.name',
                                'permissions.module',
                                'permissions.action'
                            ),        ]);
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'profil'=>  $user->profile 
                ? [
                    'hopital' => $user->profile->hopital
                        ? $user->profile->hopital->only('id', 'nom')
                        : null
                ]
                : null,
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'error' => fn () => $request->session()->get('error'),
                'success' => fn () => $request->session()->get('success'),
                'message' => fn () => $request->session()->get('message'),
            ],
            'errors' => fn () => $request->session()->get('errors') 
                ? $request->session()->get('errors')->getBag('default')->getMessages()
                : (object) [],
        ];
    }
}
