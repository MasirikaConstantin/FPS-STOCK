import StatsCard from '@/components/dashboard-stat';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertCircle, Car, Hospital, Package } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stocks_total,hopitaux_connectes,alertes_avertissement_expiration,transferts_en_attente }: { stocks_total: number,hopitaux_connectes: number,alertes_avertissement_expiration: number,transferts_en_attente: number }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    
                    <StatsCard  title="Stocks" value={stocks_total} icon={Package} variant="destructive" />
                    <StatsCard  title="Hopitaux Connectés" value={hopitaux_connectes} icon={Hospital} variant="destructive" />
                    <StatsCard  title="Alertes" value={alertes_avertissement_expiration} icon={AlertCircle} variant="destructive" />
                    <StatsCard  title="Transferts En Attente" value={transferts_en_attente} icon={Car} variant="destructive" />
                    
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
