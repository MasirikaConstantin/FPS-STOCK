import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Stock, User } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RecentActivities from '@/components/RecentActivities';
import { QuickActions } from '@/components/Actions';
import Index from './Index';
import { App, PageProps, StockMouvement } from '@/types/types';
import Mouvements from '../Stock/Mouvements';

interface MouvementsProps extends PageProps {
  mouvements: {
    ref: string;
    data: StockMouvement[];
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
}
export default function LesSTocks({ stocks, produits, hopitals, auth, mouvements }: { stocks: Stock[], produits: App.MedicalProduit[], hopitals: App.Hopital[], auth: User, mouvements: StockMouvement[] }) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Stocks',
      href: route('stocks.index'),
    },
  ];

  const recentActivities = [
    {
      title: 'Stocks',
      href: route('stocks.index'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Les stocks" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8"> 
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Les stocks</CardTitle>
          <Link href={route('stocks.create')} className="text-white">
            <Button>Nouveau stock</Button>
          </Link>
        </CardHeader>
        <CardContent>
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <Index stocks={stocks} produits={produits} hopitals={hopitals} auth={auth}/>
                        <Mouvements mouvements={mouvements} auth={auth}/>
                    </div>
                    <div className="flex-1">
                        
                    </div>
                    </div>
                </div>
        </CardContent>
      </Card>
        </div>
      </div>

     
    </AppLayout>
  );
}
