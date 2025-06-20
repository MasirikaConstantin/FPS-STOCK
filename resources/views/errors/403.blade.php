<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 - Accès Refusé</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md  dark:bg-gray-900">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-900">
            <div class="p-6 text-center space-y-4">
                <h1 class="text-6xl font-bold text-red-600">403</h1>
                
                <div class="space-y-2">
                    <h2 class="text-2xl font-semibold text-gray-900">Accès refusé</h2>
                    <p class="text-gray-600">
                        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
                    </p>
                </div>

                <div class="pt-4">
                    <a 
                        href="{{ url('/') }}" 
                        class="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>