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
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Index({ fournisseurs }: PageProps<{ fournisseurs: App.Fournisseur[] }>) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [fournisseurToDelete, setFournisseurToDelete] = useState<App.Fournisseur | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Fournisseurs',
            href: '/fournisseurs',
        },
    ];

    const handleDelete = (fournisseur: App.Fournisseur) => {
        setFournisseurToDelete(fournisseur);
        setDeleteDialogOpen(true);
        setOpenDropdownId(null);
    };

    const confirmDelete = () => {
        if (!fournisseurToDelete) return;

        router.delete(route('fournisseurs.destroy', fournisseurToDelete.ref), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Fournisseur supprimé avec succès');
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Fournisseurs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <Button className="mb-3">
                                <Link href={route('fournisseurs.create')}>Créer un Fournisseur</Link>
                            </Button>
                            <Table className="dark:text-gray-400cell w-full text-left text-sm text-gray-500 rtl:text-right">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Spécialités</TableHead>
                                        <TableHead>Contrat</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Créé par</TableHead>
                                        <TableHead>Date de création</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fournisseurs && fournisseurs.length > 0 ? (
                                        fournisseurs.map((fournisseur) => (
                                            <TableRow key={fournisseur.id}>
                                                <TableCell className="font-medidum text-black dark:text-white">
                                                    {fournisseur.nom}
                                                </TableCell>
                                                <TableCell>
                                                    {fournisseur.contact_person || '-'}
                                                    {fournisseur.phone && (
                                                        <div className="text-sm text-gray-500">{fournisseur.phone}</div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {Array.isArray(fournisseur.specialties) && fournisseur.specialties.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                        {fournisseur.specialties.map((specialty, index) => (
                                                            <Badge key={index} variant="outline">
                                                            {specialty}
                                                            </Badge>
                                                        ))}
                                                        </div>
                                                    ) : (
                                                        '-'
                                                    )}
                                                    </TableCell>
                                                <TableCell>
                                                    {formatDate(fournisseur.contract_start_date)} -{' '}
                                                    {formatDate(fournisseur.contract_end_date)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={fournisseur.is_active ? 'default' : 'destructive'}>
                                                        {fournisseur.is_active ? 'Actif' : 'Inactif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{fournisseur.creator?.name || 'Système'}</TableCell>
                                                <TableCell>{formatDate(fournisseur.created_at)}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu
                                                        open={openDropdownId === fournisseur.ref}
                                                        onOpenChange={(open) => {
                                                            setOpenDropdownId(open ? fournisseur.ref : null);
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
                                                                    href={route('fournisseurs.show', fournisseur.ref)}
                                                                    className="flex items-center"
                                                                    onClick={() => setOpenDropdownId(null)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Voir
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={route('fournisseurs.edit', fournisseur.ref)}
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
                                                                    handleDelete(fournisseur);
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
                                            <TableCell colSpan={8} className="py-4 text-center">
                                                <div className="text-gray-500">Aucun fournisseur trouvé.</div>
                                                <Button asChild variant="link" className="mt-2">
                                                    <Link href={route('fournisseurs.create')}>Créer un fournisseur</Link>
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
                            Cette action supprimera définitivement le fournisseur "{fournisseurToDelete?.nom}" et ne pourra pas être annulée.
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