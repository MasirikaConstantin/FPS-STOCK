// resources/js/types.d.ts

import { Page } from '@inertiajs/core';

// Étendez les types globaux d'Inertia
declare module '@inertiajs/core' {
    interface PageProps {
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                // Ajoutez d'autres propriétés utilisateur si nécessaire
            };
        };
        // Ajoutez d'autres propriétés globales partagées par toutes les pages
    }
}

// Types spécifiques à votre application
declare namespace App {
    interface PaginatedData<T> {
        data: T[];
        links: {
            first: string | null;
            last: string | null;
            prev: string | null;
            next: string | null;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: {
                url: string | null;
                label: string;
                active: boolean;
            }[];
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    }

    interface Category {
        id: number;
        nom: string;
        description: string | null;
        is_active: boolean;
        ref: string;
        created_by: number | null;
        created_at: string;
        updated_at: string;
        creator?: {
            id: number;
            name: string;
            email: string;
        } | null;
    }
    

    interface User {
        id: number;
        name: string;
        email: string;
        created_at: string;
        updated_at: string;
    }
}

// Exportez le type PageProps pour l'utiliser dans vos composants
export interface PageProps<T extends Record<string, unknown> = {}> extends Page<T> {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    props: T;
    categories?: T; // Add the optional categories property

}