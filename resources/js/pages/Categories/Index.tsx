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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Index({  categories }: PageProps<{ categories: App.Category[] }>) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<App.Category | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Catégories',
            href: '/categories',
        },
    ];

    const handleDelete = (category: App.Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
        setOpenDropdownId(null); // Ferme le dropdown immédiatement
    };

    const confirmDelete = () => {
        if (!categoryToDelete) return;

        router.delete(route('categories.destroy', categoryToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Catégorie supprimée avec succès');
                setDeleteDialogOpen(false);
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression');
            },
            onFinish: () => {
                setOpenDropdownId(null); // S'assure que le dropdown est fermé
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Catégories" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-xl font-semibold">Gestion des Catégories</CardTitle>
                            <Button className="mb-3">
                                <Link href={route('categories.create')}>Créer une Catégorie</Link>
                            </Button>
                            </CardHeader>
                            <CardContent>
                            <div className="p-6">
                            
                            <Table className="dark:text-gray-400cell w-full text-left text-sm text-gray-500 rtl:text-right">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Créé par</TableHead>
                                        <TableHead>Date de création</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories && categories.length > 0 ? (
                                        categories.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-medidum text-black dark:text-white">{category.nom}</TableCell>
                                                <TableCell>{category.description?.slice(0, 30) || '-'}
                                                    
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={category.is_active ? 'default' : 'destructive'}>
                                                        {category.is_active ? 'Actif' : 'Inactif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{category.creator?.name || 'Système'}</TableCell>
                                                <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu
                                                        open={openDropdownId === category.id}
                                                        onOpenChange={(open) => {
                                                            // Fermer les autres dropdowns quand on en ouvre un nouveau
                                                            setOpenDropdownId(open ? category.id : null);
                                                        }}
                                                    >
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                                onClick={(e) => e.stopPropagation()} // Empêche la propagation
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            onInteractOutside={() => setOpenDropdownId(null)} // Ferme quand on clique ailleurs
                                                        >
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={route('categories.show', category.ref)}
                                                                    className="flex items-center"
                                                                    onClick={() => setOpenDropdownId(null)} // Ferme après clic
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Voir
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={route('categories.edit', category.ref)}
                                                                    className="flex items-center"
                                                                    onClick={() => setOpenDropdownId(null)} // Ferme après clic
                                                                >
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Modifier
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleDelete(category);
                                                                    setOpenDropdownId(null); // Ferme immédiatement
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
                                            <TableCell colSpan={6} className="py-4 text-center">
                                                <div className="text-gray-500">Aucune catégorie trouvée.</div>
                                                <Button asChild variant="link" className="mt-2">
                                                    <Link href={route('categories.create')}>Créer une catégorie</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                            </CardContent>
                        </Card>
                        
                    </div>
                </div>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action supprimera définitivement la catégorie "{categoryToDelete?.nom}" et ne pourra pas être annulée.
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
