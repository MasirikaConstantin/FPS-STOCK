import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const statusColors = {
  en_attente: 'bg-amber-100 text-amber-800',
  preleve: 'bg-blue-100 text-blue-800',
  livre: 'bg-green-100 text-green-800',
  annule: 'bg-red-100 text-red-800',
};

export default function Show({ auth, transfert }: { auth: any; transfert: any }) {
  const canApprove = transfert.status === 'en_attente';
  const canComplete = transfert.status === 'approuve';
  const canCancel = ['en_attente', 'approuve'].includes(transfert.status);
    console.log(auth);
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Gestion des Transferts',
      href: '/transferts',
    },
    {
      title: `Transfert #${transfert.id}`,
      href: `/transferts/${transfert.ref}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Détails du Transfert ${transfert.ref}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Transfert #{transfert.id}</h1>
            <div className="flex gap-2">
              <Badge className={statusColors[transfert.status]}>
                {transfert.status}
              </Badge>
              <Badge variant="outline">
                Priorité: {transfert.priorite}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            {canApprove && (
              <Button asChild>
                <a href={route('transferts.approve', transfert.ref)}>Approuver</a>
              </Button>
            )}
            {canComplete && (
              <Button variant="secondary" asChild>
                <a href={route('transferts.complete', transfert.ref)}>Marquer comme Livré</a>
              </Button>
            )}
            {canCancel && auth.user.role === 'admin_central' && (
                <Button variant="destructive" asChild>
                    <a href={route('transferts.cancel', transfert.ref)}>Annuler</a>
                </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du Transfert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="font-medium">{transfert.from_central ? 'Stock Central' : transfert.from_hospital?.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{transfert.to_central ? 'Stock Central' : transfert.to_hospital?.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Demandeur</p>
                  <p className="font-medium">{transfert.demandeur?.name}</p>
                </div>
                {transfert.approbateur && (
                  <div>
                    <p className="text-sm text-muted-foreground">Approbateur</p>
                    <p className="font-medium">{transfert.approbateur?.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Date de création</p>
                  <p className="font-medium">{new Date(transfert.created_at).toLocaleString()}</p>
                </div>
                {transfert.approuve_le && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'approbation</p>
                    <p className="font-medium">{new Date(transfert.approuve_le).toLocaleString()}</p>
                  </div>
                )}
                {transfert.livre_le && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date de livraison</p>
                    <p className="font-medium">{new Date(transfert.livre_le).toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {transfert.notes || 'Aucune note disponible'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Articles Transférés</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfert.items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.medical_produit.name}</TableCell>
                      <TableCell>{item.quantite}</TableCell>
                      <TableCell>
                        {item.from_central 
                          ? 'Stock Central' 
                          : item.stock_source 
                            ? `${item.stock_source.hopital?.nom} (Lot: ${item.stock_source.numero_lot})` 
                            : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[item.status]}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}