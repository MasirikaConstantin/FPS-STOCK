import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Auth, BreadcrumbItem } from '@/types';

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

export default function Index({ auth, transferts }: { auth: Auth, transferts: any }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Transferts de Stock" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-2xl font-bold">Transferts de Stock</CardTitle>
              {(auth.user.role === 'admin_central' || auth.user.role === 'admin') && (
                <Button asChild>
                  <Link href={route('transferts.create')}>Nouveau Transfert</Link>
                </Button>
              )}
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destination</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transferts.data.map((transfert: any) => (
                    <TableRow key={transfert.id}>
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
                      <TableCell>
                        {new Date(transfert.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={route('transferts.show', transfert.ref)}>Détails</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            {transferts.links && (
              <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Affichage de {transferts.from} à {transferts.to} sur {transferts.total} transferts
                </div>
                <div className="flex space-x-2">
                  {transferts.links.map((link: any, index: number) => (
                    <Button
                      key={index}
                      variant={link.active ? 'default' : 'outline'}
                      size="sm"
                      asChild
                      disabled={!link.url}
                    >
                      <Link href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                    </Button>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}