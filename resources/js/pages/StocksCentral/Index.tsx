import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Trash2, Box, PackageCheck, PackageX } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Index({ stocks, produits, hopitals, auth }: PageProps<{ 
    stocks: App.Stock[],
    produits: App.MedicalProduit[],
    hopitals: App.Hopital[],
    auth: User
}>) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [stockToDelete, setStockToDelete] = useState<App.Stock | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Gestion des Stocks Central Central',
            href: '/stocks',
        },
    ];

    const handleDelete = (stock: App.Stock) => {
        setStockToDelete(stock);
        setDeleteDialogOpen(true);
        setOpenDropdownId(null);
    };

    const confirmDelete = () => {
        if (!stockToDelete) return;

        router.delete(route('central-stocks.destroy', stockToDelete.ref), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Entrée de stock supprimée avec succès');
                setDeleteDialogOpen(false);
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression');
            },
            onFinish: () => {
                setOpenDropdownId(null);
            },
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    };

    const getProduitName = (id: number) => {
        return produits.find(p => p.id === id)?.name || 'Inconnu';
    };

    const getHopitalName = (id: number | null) => {
        if (!id) return 'Stock central';
        return hopitals.find(h => h.id === id)?.nom || 'Inconnu';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'disponible':
                return <Badge variant="default"><PackageCheck className="mr-1 h-3 w-3" /> Disponible</Badge>;
            case 'reservee':
                return <Badge variant="secondary"><Box className="mr-1 h-3 w-3" /> Réservée</Badge>;
            case 'expirer':
                return <Badge variant="destructive"><PackageX className="mr-1 h-3 w-3" /> Expiré</Badge>;
            case 'endommage':
                return <Badge variant="destructive">Endommagé</Badge>;
            default:
                return <Badge variant="outline">Inconnu</Badge>;
        }
    };
    const canCreateStock = auth.user.permissions.some(p => p.action === 'create' && p.module === 'stocks');
    const isAdminCentral = auth.user.role === 'admin_central';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Stocks Central" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Gestion des Stocks Central</h1>
                                {canCreateStock ? (
                                    <Button asChild>
                                        <Link href={route('central-stocks.create')}>Ajouter une entrée</Link>
                                    </Button>
                                ):
                                isAdminCentral ? (
                                    <div className="text-red-500 text-sm font-bold w-1/2">
                                        <p>Vous êtes connecté en tant qu'admin central, Mais ne pouvez pas créer des stocks, vous devez ajouter des permissions pour y accéder</p>
                                    </div>
                                ):null}
                            </div>

                            <Table className="dark:text-gray-400cell w-full text-left text-sm text-gray-500 rtl:text-right">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produit</TableHead>
                                        <TableHead>Quantité</TableHead>
                                        <TableHead>Numéro de lot</TableHead>
                                        <TableHead>Date expiration</TableHead>
                                        <TableHead>Prix unitaire</TableHead>
                                        <TableHead>Date réception</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stocks && stocks.length > 0 ? (
                                        stocks.map((stock) => (
                                            <TableRow key={stock.id}>
                                                <TableCell className="font-medium text-black dark:text-white">
                                                    {getProduitName(stock.medical_produit_id)}
                                                </TableCell>
                                                <TableCell>
                                                    {stock.quantite}
                                                </TableCell>
                                                <TableCell>
                                                    {stock.numero_lot || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(stock.date_expiration)}
                                                </TableCell>
                                                <TableCell>
                                                    {stock.prix_unitaire ? parseFloat(stock.prix_unitaire).toFixed(2) : '0.00'} FC

                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(stock.received_date)}
                                                </TableCell>
                                                
                                                <TableCell>
                                                    {getStatusBadge(stock.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu
                                                        open={openDropdownId === stock.ref}
                                                        onOpenChange={(open) => {
                                                            setOpenDropdownId(open ? stock.ref : null);
                                                        }}
                                                    >
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            onInteractOutside={() => setOpenDropdownId(null)}
                                                        >
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={route('central-stocks.show', stock.ref)}
                                                                    className="flex items-center"
                                                                    onClick={() => setOpenDropdownId(null)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Voir
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={route('central-stocks.edit', stock.ref)}
                                                                    className="flex items-center"
                                                                    onClick={() => setOpenDropdownId(null)}
                                                                >
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Modifier
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleDelete(stock);
                                                                    setOpenDropdownId(null);
                                                                }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Supprimer
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="py-4 text-center">
                                                <div className="text-gray-500">Aucune entrée de stock trouvée.</div>
                                                <Button asChild variant="link" className="mt-2">
                                                    <Link href={route('central-stocks.create')}>Ajouter une entrée</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action supprimera définitivement cette entrée de stock et ne pourra pas être annulée.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}