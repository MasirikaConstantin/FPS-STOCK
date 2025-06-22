import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    profil: Profil | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Profil {
    id: number;
    phone?: string;
    address?: string;
    hopital_id?: number;
    hopital?: {
        id: number;
        nom: string;
    };
}
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    last_login_at: string;
    updated_at: string;
    profil : Profil | null; 
    created_at: string;
        updated_at: string;
        profile?: {
            phone?: string;
            address?: string;
            hopital?: {
                id: number;
                nom: string;
            };
        };
        permissions?: Permission[];
        createdBy?: User;
        updatedBy?: User;
    [key: string]: unknown; // This allows for additional properties...
}
