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
import { BreadcrumbItem } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Trash2, PackagePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { KitsStatsCards } from './KitsStatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Index({ kits, categories, stats }: PageProps<{ 
    kits: App.Kit[],
    categories: App.Categorie[]
}>) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [kitToDelete, setKitToDelete] = useState<App.Kit | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Gestion des Kits',
            href: '/kits',
        },
    ];

    const handleDelete = (kit: App.Kit) => {
        setKitToDelete(kit);
        setDeleteDialogOpen(true);
        setOpenDropdownId(null);
    };

    const confirmDelete = () => {
        if (!kitToDelete) return;

        router.delete(route('kits.destroy', kitToDelete.ref), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Kit supprimé avec succès');
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

    const getCategoryName = (id: number) => {
        return categories.find(c => c.id === id)?.nom || 'Inconnue';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Kits" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-2">
                        <KitsStatsCards stats={stats || { active_kits: 0, inactive_kits: 0, total_items: 0, unique_types: 0 }} />
                    </div>
                    <Card className='mt-4'>
                        <CardHeader className="flex justify-between items-center mb-6">
                            <CardTitle className="text-2xl font-bold">
                                Kits Médicaux Configurés
                            </CardTitle>
                                        <Button asChild>
                                            <Link href={route('kits.create')}>
                                                <PackagePlus className="mr-2 h-4 w-4" />
                                                Créer un Kit
                                            </Link>
                                        </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">

                                    <Table className="dark:text-gray-400cell w-full text-left text-sm text-gray-500 rtl:text-right">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Catégorie</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Créé par</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {kits && kits.length > 0 ? (
                                                kits.map((kit) => (
                                                    <TableRow key={kit.id}>
                                                        <TableCell className="font-medium text-black dark:text-white">
                                                            {kit.nom}
                                                        </TableCell>
                                                        <TableCell>
                                                            {getCategoryName(kit.categorie_id)}
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate">
                                                            {kit.description || 'Aucune description'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={kit.is_active ? 'default' : 'destructive'}>
                                                                {kit.is_active ? 'Actif' : 'Inactif'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {kit.created_by?.name || 'Système'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu
                                                                open={openDropdownId === kit.ref}
                                                                onOpenChange={(open) => {
                                                                    setOpenDropdownId(open ? kit.ref : null);
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
                                                                            href={route('kits.show', kit.ref)}
                                                                            className="flex items-center"
                                                                            onClick={() => setOpenDropdownId(null)}
                                                                        >
                                                                            <Eye className="mr-2 h-4 w-4" />
                                                                            Voir
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem asChild>
                                                                        <Link
                                                                            href={route('kits.edit', kit.ref)}
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
                                                                            handleDelete(kit);
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
                                                    <TableCell colSpan={6} className="py-4 text-center">
                                                        <div className="text-gray-500">Aucun kit trouvé.</div>
                                                        <Button asChild variant="link" className="mt-2">
                                                            <Link href={route('kits.create')}>Créer un kit</Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action supprimera définitivement le kit "{kitToDelete?.nom}" et ne pourra pas être annulée.
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