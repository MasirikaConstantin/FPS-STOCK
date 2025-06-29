import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart3,
    Building2,
    CassetteTape,
    Hospital,
    LayoutGrid,
    Package,
    Pill,
    Settings,
    Truck,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        role : ["admin"]
    },
    {
        title: 'Stocks Central',
        href: '/central-stocks',
        icon: Package,
    },
    {
        title: 'Stocks Hôpitaux',
        href: '/stocks',
        icon: Building2,
    },
    {
        title: 'Hôpitaux',
        href: '/hopitals',
        icon: Hospital,
    },
    {
        title: 'Médicaments',
        href: '/medical-produits',
        icon: Pill,
    },

    {
        title: 'Fournisseurs',
        href: '/fournisseurs',
        icon: Building2,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: CassetteTape,
    },
    {
        title: 'Transferts',
        href: '/transferts',
        icon: Truck,
    },
    {
        title: 'Alertes',
        href: '/alerts',
        icon: AlertTriangle,
    },
    {
        title: 'Kits',
        href: '/kits',
        icon: Package,
    },
    {
        title: 'Utilisateurs',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Rapports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Paramètres',
        href: '/settings',
        icon: Settings,
    },
];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="xl" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} classtitle="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
