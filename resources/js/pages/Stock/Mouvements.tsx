import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Eye, Minus, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PageProps, StockMouvement } from '@/types/types';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export default function Mouvements({ mouvements, auth }: MouvementsProps) {
  const breadcrumbs: BreadcrumbItem[]  = [
    {
        title: 'Stock',
        href: route('stocks.index'),
    },
    {
        title: 'Mouvements',
        href: route('stock.mouvements.index'),
    },
]
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mouvements de Stock" />

      <div className=" py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                          <CardTitle className="text-2xl font-bold">Mouvements de Stock</CardTitle>
                          <div className="flex space-x-2">
                          <Link className="mr-2" href={route('stock.mouvements.direct-out.create')}>
                            <Button variant="outline" className="gap-2">
                              <Minus className="h-4 w-4" />
                              Sortie Directe
                            </Button>
                          </Link>
                          {auth.user.role === 'admin_central' && (
                            <Link href={route('stock.entree.create')}>
                              <Button variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Entrée Stock
                              </Button>
                            </Link>
                          )}
                          </div>
                        </CardHeader>
                      

                      <CardContent >
                      <div className="p-6">
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Produit</TableHead>
                              <TableHead>Hôpital</TableHead>
                              <TableHead>Quantité</TableHead>
                              <TableHead>Raison</TableHead>
                              <TableHead>Par</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mouvements.data.map((mouvement) => (
                              <TableRow key={mouvement.id}>
                                <TableCell>
                                  {new Date(mouvement.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    mouvement.type === 'entree' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {mouvement.type === 'entree' ? 'Entrée' : 'Sortie'}
                                  </span>
                                </TableCell>
                                <TableCell>{mouvement.medical_produit.name}</TableCell>
                                <TableCell>{mouvement.hopital ? mouvement.hopital.nom : 'Entrepôt central'}</TableCell>
                                <TableCell>{mouvement.quantite}</TableCell>
                                <TableCell>{mouvement.raison}</TableCell>
                                <TableCell>{mouvement.created_by.name}</TableCell>
                                <TableCell>
                                  <Link href={route('stock.entree.show', mouvement.ref)} className="text-primary hover:underline flex items-center">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Voir
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        </div>
                      </CardContent>

                      {mouvements.links.length > 3 && (
                        <div className="mt-4 flex justify-center">
                          <Pagination>
                            <PaginationContent>
                              {mouvements.links.map((link, index) => {
                                // Gérer le bouton "Previous"
                                if (index === 0) {
                                  return (
                                    <PaginationItem key={index}>
                                      <PaginationPrevious 
                                        href={link.url || '#'} 
                                        className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                      />
                                    </PaginationItem>
                                  );
                                }
                                
                                // Gérer le bouton "Next"
                                if (index === mouvements.links.length - 1) {
                                  return (
                                    <PaginationItem key={index}>
                                      <PaginationNext 
                                        href={link.url || '#'} 
                                        className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                      />
                                    </PaginationItem>
                                  );
                                }
                                
                                // Gérer les points de suspension si le label est "..."
                                if (link.label === '...') {
                                  return (
                                    <PaginationItem key={index}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                }
                                
                                // Gérer les numéros de page
                                return (
                                  <PaginationItem key={index}>
                                    <PaginationLink 
                                      href={link.url || '#'}
                                      isActive={link.active}
                                    >
                                      {link.label}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              })}
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                      </Card>  
                    </div>
                </div>
    </AppLayout>
  );
}