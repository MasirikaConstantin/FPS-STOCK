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
                role : string
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

export type MedicalProduit = {
    id: number;
    ref: string;
    name: string;
    categorie_id: number;
    sous_category: string | null;
    unite: string;
    description: string | null;
    fabrican: string | null;
    fournisseur_id: number | null;
    requires_refrigeration: boolean;
    duree_vie: number;
    seuil_min: number;
    prix_unitaire: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by?: User | null;
    updated_by?: User | null;
    categorie?: Categorie;
    fournisseur?: Fournisseur | null;
};



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
export interface Hopital {
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


    export type Transfert = {
        id: number;
        ref: string;
        from_hospital_id: number;
        to_hospital_id: number;
        status: 'en_attente' | 'approuve' | 'en_transit' | 'livre' | 'annule';
        priorite: 'faible' | 'moyen' | 'eleve' | 'urgent';
        notes: string | null;
        demandeur_id: number | null;
        approbateur_id: number | null;
        approuve_le: string | null;
        livre_le: string | null;
        created_at: string;
        updated_at: string;
        created_by?: User | null;
        updated_by?: User | null;
        from_hospital_id: number | null;
        to_hospital_id: number | null;
        from_central: boolean;
        to_central: boolean;
        demandeur?: User;
        approbateur?: User;
        articles?: ArticleTransfert[];
    };
    
    export type ArticleTransfert = {
        id: number;
        ref: string;
        transfert_id: number;
        stock_id: number;
        medical_produit_id: number;
        quantite: number;
        from_central: boolean;
        status: 'en_attente' | 'preleve' | 'livre' | 'annule';
        created_at: string;
        updated_at: string;
        created_by?: User | null;
        updated_by?: User | null;
        stock?: Stock & { medical_produit: MedicalProduit };
    };
    
    
    export type Kit = {
        id: number;
        ref: string;
        nom: string;
        description: string | null;
        categorie_id: number;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        created_by?: User | null;
        updated_by?: User | null;
        categorie?: Categorie;
        articles?: ArticleKit[];
    };
      export type ArticleKit = {
        id: number;
        ref: string;
        kit_id: number;
        medical_produit_id: number;
        quantite: number;
        created_at: string;
        updated_at: string;
        created_by?: User | null;
        updated_by?: User | null;
        medical_produit?: MedicalProduit;
    };
    export interface Hopital {
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

export type MedicalProduit = {
    id: number;
    ref: string;
    name: string;
    categorie_id: number;
    sous_category: string | null;
    unite: string;
    description: string | null;
    fabrican: string | null;
    fournisseur_id: number | null;
    requires_refrigeration: boolean;
    duree_vie: number;
    seuil_min: number;
    prix_unitaire: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by?: User | null;
    updated_by?: User | null;
    categorie?: Categorie;
    fournisseur?: Fournisseur | null;
};
export type Stock = {
    id: number;
    ref: string;
    quantite: number;
    numero_lot: string | null;
    date_expiration: string | null;
    prix_unitaire: number | null;
    received_date: string;
    status: 'disponible' | 'reservee' | 'expirer' | 'endommage';
    medical_produit_id: number;
    hopital_id: number | null;
    created_at: string;
    updated_at: string;
    created_by?: User | null;
    updated_by?: User | null;
    medical_produit?: MedicalProduit;
    hopital?: Hopital | null;
};
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
    
    export type Categorie = {
        id: number;
        nom: string;
        description?: string | null;  
    };
}

// Exportez le type PageProps pour l'utiliser dans vos composants
export interface PageProps<T extends Record<string, unknown> = {}> extends Page<T> {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            permissions: {
                id: number;
                name: string;
                action: string;
                module: string;
            }[];
            role?: string;
        };
        
    };
    
    props: T;
    categories?: T; // Add the optional categories property
    fournisseurs?: T; // Add the optional categories property
    kit?: {
        nom: string;
        ref: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        created_by?: App.User | null;
        updated_by?: App.User | null;
        articles?: App.ArticleKit[];
        categorie_id?: number;
        description?: string | null;
    }; // Add the optional categories property
    stats?: {
       
        active_kits:number;
        inactive_kits:number;
        total_items:number;
        unique_types:number;
    };
    hopitals?: T;
    roles?: T;
    user?: User;
    stocks?: T;
    produits?: T; 
}
