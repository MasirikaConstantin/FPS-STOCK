import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const statusColors = {
  en_attente: 'bg-amber-100 text-amber-800',
  approuve: 'bg-blue-100 text-blue-800',
  en_transit: 'bg-purple-100 text-purple-800',
  livre: 'bg-green-100 text-green-800',
  annule: 'bg-red-100 text-red-800',
};

const priorityColors = {
  faible: 'bg-gray-100 text-gray-800',
  moyen: 'bg-blue-100 text-blue-800',
  eleve: 'bg-amber-100 text-amber-800',
  urgent: 'bg-red-100 text-red-800',
};
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestion des Stocks',
        href: '/stocks',
    },
    {
        title: 'Transferts de Stock',
        href: '/transferts',
    },
];

export default function Index({ transferts }: { transferts: any }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Transferts de Stock" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6">

            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Transferts de Stock</h1>
            <Button asChild>
                <Link href={route('transferts.create')}>Nouveau Transfert</Link>
            </Button>
            </div>

            <div className=" rounded-lg shadow">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {transferts.data.map((transfert: any) => (
                    <TableRow key={transfert.id}>
                    <TableCell>
                        {transfert.from_central ? 'Stock Central' : transfert.from_hospital?.nom}
                    </TableCell>
                    <TableCell>
                        {transfert.to_central ? 'Stock Central' : transfert.to_hospital?.nom}
                    </TableCell>
                    <TableCell>
                        <Badge className={priorityColors[transfert.priorite]}>
                        {transfert.priorite}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge className={statusColors[transfert.status]}>
                        {transfert.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{new Date(transfert.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Button variant="outline" size="sm" asChild>
                        <Link href={route('transferts.show', transfert.ref)}>Détails</Link>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
            </div>
        </div>
        </div>
        </div>
    </AppLayout>
  );
}