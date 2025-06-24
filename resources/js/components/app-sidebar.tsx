import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart3,
    Building2,
    CarFront,
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
const getMainNavItems = (userRole: string): NavItem[] => {
    const allItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        roles : ["admin_central", 'admin', 'medecin', 'pharmacien','magasinier'],
    },
    {
        title: 'Stocks Mouvement',
        href: '/stock/mouvements',
        icon: CarFront,
        roles : ["admin_central"],
    },
    {
        title: 'Stocks Central',
        href: '/central-stocks',
        icon: Package,
        roles : ["admin_central"],

    },
    {
        title: 'Stocks Hôpital',
        href: '/stocks',
        icon: Building2,
        roles : ["admin_central", 'admin', 'medecin', 'pharmacien','magasinier'],
    },
    {
        title: 'Hôpitaux',
        href: '/hopitals',
        icon: Hospital,
        roles : ["admin_central"],
    },
    {
        title: 'Médicaments',
        href: '/medical-produits',
        icon: Pill,
        roles : ["admin_central"],
    },

    {
        title: 'Fournisseurs',
        href: '/fournisseurs',
        icon: Building2,
        roles : ["admin_central"],
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: CassetteTape,
        roles : ["admin_central"],
    },
    {
        title: 'Transferts',
        href: '/transferts',
        icon: Truck,
        roles : ["admin_central", 'admin','magasinier'],
    },
    {
        title: 'Alertes',
        href: '/alerts',
        icon: AlertTriangle,
        roles : ["admin_central", 'admin', 'magasinier'],
    },
    {
        title: 'Kits',
        href: '/kits',
        icon: Package,
        roles : ["admin_central"],
    },
    {
        title: 'Utilisateurs',
        href: '/users',
        icon: Users,
        roles : ["admin_central", 'admin'],
    },
    {
        title: 'Rapports',
        href: '/reports',
        icon: BarChart3,
        roles : ["admin_central", 'admin', 'medecin', 'pharmacien','magasinier'],
    },
    {
        title: 'Paramètres',
        href: '/settings',
        icon: Settings,
        roles : ["admin_central"],
    },
];
return allItems.filter(item => item.roles?.includes(userRole));
}


export function AppSidebar() {
    const { auth } = usePage().props;
    const userRole = auth.user.role;
    const filteredNavItems = getMainNavItems(userRole);
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
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} classtitle="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
