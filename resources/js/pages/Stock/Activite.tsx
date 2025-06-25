import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {  BreadcrumbItem, Auth } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Stock } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActiviteProps {
  stocks: Stock[];
  auth: Auth;
}

export default function Activite({ stocks, auth }: ActiviteProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stocks Central', href: '/central-stocks' },
    { title: 'Activité des entrées', href: '/stock/activite' },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Activité des entrées" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-2 mt-6">
              <CardTitle className="text-2xl font-bold">Activité des entrées</CardTitle>
              {auth.user.role === 'admin_central' && (
                <Button asChild>
                  <Link href={route('stock.entree.create')}>Nouveau Transfert</Link>
                </Button>
              )}
            </CardHeader>

            <CardContent>
            <div className="p-6">
              
              
              <div className="overflow-x-auto">
                <Table className="dark:text-gray-400cell w-full text-left text-sm text-gray-500 rtl:text-right">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Numéro de lot</TableHead>
                      <TableHead>Date expiration</TableHead>
                      <TableHead>Date réception</TableHead>
                      <TableHead>Prix unitaire</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocks.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium text-black dark:text-white">{stock.medical_produit?.name}</TableCell>
                        <TableCell>{stock.quantite}</TableCell>
                        <TableCell>{stock.numero_lot || 'N/A'}</TableCell>
                        <TableCell>
                          {stock.date_expiration 
                            ? new Date(stock.date_expiration).toLocaleDateString() 
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {new Date(stock.received_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {stock.prix_unitaire 
                            ? parseFloat(stock.prix_unitaire).toFixed(2) + ' FC'
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {stocks.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  Aucune entrée de stock enregistrée
                </div>
              )}
            </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}