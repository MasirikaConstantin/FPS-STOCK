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
import { Eye, MoreHorizontal, Pencil, Trash2, Snowflake } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Index({ produits, categories, fournisseurs  , auth }: PageProps<{ 
    produits: App.MedicalProduit[], 
    categories: App.Categorie[],
    fournisseurs: App.Fournisseur[],
    auth: User
}>) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [produitToDelete, setProduitToDelete] = useState<App.MedicalProduit | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Produits Médicaux',
            href: '/medical-produits',
        },
    ];

    const handleDelete = (produit: App.MedicalProduit) => {
        setProduitToDelete(produit);
        setDeleteDialogOpen(true);
        setOpenDropdownId(null);
    };

    const confirmDelete = () => {
        if (!produitToDelete) return;

        router.delete(route('medical-produits.destroy', produitToDelete.ref), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Produit supprimé avec succès');
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
        return new Date(dateString).toLocaleDateString();
    };

    const getCategoryName = (id: number) => {
        return categories.find(c => c.id === id)?.nom || 'Inconnue';
    };

    const getFournisseurName = (id: number | null) => {
        if (!id) return '-';
        return fournisseurs.find(f => f.id === id)?.nom || 'Inconnu';
    };
    const canCreateProduit = auth.user.permissions.some(p => p.action === 'create' && p.module === 'medical-produits');
    const isAdminCentral = auth.user.role === 'admin_central';
    const isAdmin = auth.user.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Produits Médicaux" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                        <div className="flex justify-between items-center mb-6">

                        <h1 className="text-2xl font-bold">Gestion des Produits Médicaux</h1>

                            {canCreateProduit && (  
                                <Button className="mb-3">
                                    <Link href={route('medical-produits.create')}>Ajouter un Produit</Link>
                                </Button>
                            )}
                            {isAdminCentral && (
                                <Button className="mb-3">
                                    <Link href={route('medical-produits.create')}>Ajouter un Produit</Link>
                                </Button>
                            )}
                                
                            </div>
                            <Table className="dark:text-gray-400cell w-full text-left text-sm text-gray-500 rtl:text-right">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Catégorie</TableHead>
                                        <TableHead>Sous-catégorie</TableHead>
                                        <TableHead>Unité</TableHead>
                                        <TableHead>Fabricant</TableHead>
                                        <TableHead>Fournisseur</TableHead>
                                        <TableHead>Prix</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {produits && produits.length > 0 ? (
                                        produits.map((produit) => (
                                            <TableRow key={produit.id}>
                                                
                                                <TableCell className="font-medium text-black dark:text-white">
                                                    {produit.name}
                                                </TableCell>
                                                <TableCell>
                                                    {getCategoryName(produit.categorie_id)}
                                                </TableCell>
                                                <TableCell>
                                                    {produit.sous_category || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {produit.unite}
                                                </TableCell>
                                                <TableCell>
                                                    {produit.fabrican || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {getFournisseurName(produit.fournisseur_id)}
                                                </TableCell>
                                                <TableCell>
                                                    {produit.prix_unitaire ? parseFloat(produit.prix_unitaire).toFixed(2) : '0.00'}FC
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={produit.seuil_min > 0 ? 'default' : 'secondary'}>
                                                        {produit.seuil_min} min
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={produit.is_active ? 'default' : 'destructive'}>
                                                            {produit.is_active ? 'Actif' : 'Inactif'}
                                                        </Badge>
                                                        {produit.requires_refrigeration === 1 && (
                                                            <Snowflake className="h-4 w-4 text-blue-500" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu
                                                        open={openDropdownId === produit.ref}
                                                        onOpenChange={(open) => {
                                                            setOpenDropdownId(open ? produit.ref : null);
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
                                                                    href={route('medical-produits.show', produit.ref)}
                                                                    className="flex items-center"
                                                                    onClick={() => setOpenDropdownId(null)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Voir
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={route('medical-produits.edit', produit.ref)}
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
                                                                    handleDelete(produit);
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
                                            <TableCell colSpan={11} className="py-4 text-center">
                                                <div className="text-gray-500">Aucun produit médical trouvé.</div>
                                                <Button asChild variant="link" className="mt-2">
                                                    <Link href={route('medical-produits.create')}>Ajouter un produit</Link>
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
                            Cette action supprimera définitivement le produit "{produitToDelete?.name}" et ne pourra pas être annulée.
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