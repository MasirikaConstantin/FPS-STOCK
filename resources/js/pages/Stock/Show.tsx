import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, BreadcrumbItem } from '@/types';
import { Stock, StockMouvement } from '@/types/stock';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Calendar,
  Hash,
  DollarSign,
  User,
  Warehouse,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ShowProps extends PageProps {
  stock: Stock;
  mouvements: StockMouvement[];
}

export default function Show({ stock, mouvements, auth }: ShowProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock', href: route('stocks.index') },
    { title: 'Activité des entrées', href: route('stock.entree.activite') },
    { title: 'Détails', href: '#' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Détails du stock - ${stock.medical_produit.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold">
                    {stock.medical_produit.name}
                  </h1>
                  <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Warehouse className="h-4 w-4 mr-2" />
                    <span>Stock au dépôt central</span>
                  </div>
                </div>

                <Badge className="mt-2 md:mt-0">
                  Quantité actuelle: {stock.quantite} {stock.medical_produit.unite}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Hash className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Numéro de lot</p>
                      <p className="font-medium">
                        {stock.numero_lot || 'Non spécifié'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date d'expiration</p>
                      <p className="font-medium">
                        {stock.date_expiration 
                          ? format(new Date(stock.date_expiration), 'PP', { locale: fr })
                          : 'Non spécifiée'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Prix unitaire</p>
                      <p className="font-medium">
                        {stock.prix_unitaire 
                          ? parseFloat(stock.prix_unitaire).toFixed(2) + ' $' 
                          : 'Non spécifié'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Dernière mise à jour par</p>
                      <p className="font-medium">
                        {stock.updated_by?.name || 'Système'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">Historique des mouvements</h2>
              
              {mouvements.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Responsable</TableHead>
                        <TableHead>Raison</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mouvements.map((mouvement) => (
                        <TableRow key={mouvement.id}>
                          <TableCell>
                            {format(new Date(mouvement.created_at), 'PPp', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={mouvement.type === 'entree' ? 'default' : 'destructive'}
                              className="flex items-center gap-1"
                            >
                              {mouvement.type === 'entree' ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                              {mouvement.type === 'entree' ? 'Entrée' : 'Sortie'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {mouvement.quantite} {stock.medical_produit.unite}
                          </TableCell>
                          <TableCell>
                            {mouvement.hopital?.nom || 'Dépôt central'}
                          </TableCell>
                          <TableCell>
                            {mouvement.created_by?.name || 'Système'}
                          </TableCell>
                          <TableCell>
                            {mouvement.raison || 'Non spécifiée'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Aucun mouvement enregistré pour ce stock
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}