<!DOCTYPE html>
<html data-theme="dracula">
<head>
    <!-- CDN Tailwind + daisyUI -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
    <title>Accès refusé (403)</title>
    <script src="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/themes.js"></script>
    <link rel="icon" href="{{ asset('images/favicon.ico') }}" sizes="any">
    <link rel="icon" href="{{ asset('images/favicon.svg') }}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{{ asset('images/logo.png') }}">

</head>
<body>
    <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <!-- Icône d'erreur (utilisation de Heroicons via CDN) -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-error mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                
                <h1 class="text-5xl font-bold">403</h1>
                <p class="py-6 text-xl">
                    {{ $exception->getMessage() ?: 'Accès non autorisé' }}
                </p>
                
                <!-- Bouton de retour -->
                <button onclick="window.history.back()" class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour
                </button>
            </div>
        </div>
    </div>
</body>
</html>