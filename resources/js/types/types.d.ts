// resources/js/types.d.ts

import { Page } from '@inertiajs/core';
export type Role = 'admin_central' | 'admin' | 'medecin' | 'pharmacien' | 'magasinier';
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

   

    export interface User {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        role: Role;
        is_active: boolean;
        last_login_at?: string;
        last_login_ip?: string;
        created_at: string;
        updated_at: string;
        profile?: {
            phone?: string;
            address?: string;
            hospital?: {
                id: number;
                name: string;
            };
        };
        permissions?: Permission[];
    }

   
    
    
}

export interface DivisionAdministrative {
    id: number;
    nom: string;
    type: 'province' | 'territoire' | 'ville' | 'commune' ;
    code?: string;
    is_active: boolean;
    ref: string;
    parent_id?: number;
    created_by?: number;
    created_at: string;
    updated_at: string;
    parent?: {
        id: number;
        nom: string;
        type: string;
    };
    children?: Array<{
        id: number;
        nom: string;
        type: string;
    }>;
    creator?: {
        id: number;
        name: string;
    };
}

export interface Fournisseur {
    id: number;
    ref: string;
    nom: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    specialties: string[];
    is_active: boolean;
    contract_start_date: string | null;
    contract_end_date: string | null;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    creator?: User;
    updater?: User;
}

export interface Hospital {
    id: number;
    ref: string;
    nom: string;
    type: 'central' | 'general' | 'reference' | 'centre_sante' | null;
    province: string;
    ville: string;
    address: string | null;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    capacite: number;
    is_active: boolean;
    coordonees: {
        latitude: number;
        longitude: number;
    } | null;
    division_administrative_id: number | null;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    divisionAdministrative?: DivisionAdministrative;
    creator?: User;
    updater?: User;
}

export interface Permission {
    id: number;
    name: string;
    description?: string;
    module: string;
    action: string;
}
export interface Hospital {
    id: number;
    name: string;
    address?: string;
    phone?: string;
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
