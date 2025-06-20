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

export default function Index({ hospitals }: PageProps<{ hospitals: App.Hospital[] }>) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [hospitalToDelete, setHospitalToDelete] = useState<App.Hospital | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Hôpitaux',
            href: '/hospitals',
        },
    ];

    const handleDelete = (hospital: App.Hospital) => {
        setHospitalToDelete(hospital);
        setDeleteDialogOpen(true);
        setOpenDropdownId(null);
    };

    const confirmDelete = () => {
        if (!hospitalToDelete) return;

        router.delete(route('hopitals.destroy', hospitalToDelete.ref), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Hôpital supprimé avec succès');
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

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            central: 'Central',
            general: 'Général',
            reference: 'Référence',
            centre_sante: 'Centre de Santé',
        };
        return labels[type] || type;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Hôpitaux" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <Button className="mb-3">
                                <Link href={route('hopitals.create')}>Créer un Hôpital</Link>
                            </Button>
                            <Table className="dark:text-gray-400cell w-full text-left text-sm text-gray-500 rtl:text-right">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Province/Ville</TableHead>
                                        <TableHead>Capacité</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Créé par</TableHead>
                                        <TableHead>Date de création</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hospitals && hospitals.length > 0 ? (
                                        hospitals.map((hospital) => (
                                            <TableRow key={hospital.id}>
                                                <TableCell className="font-medidum text-black dark:text-white">
                                                    {hospital.nom}
                                                </TableCell>
                                                <TableCell>
                                                    {hospital.type ? (
                                                        <Badge variant="secondary">
                                                            {getTypeLabel(hospital.type)}
                                                        </Badge>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {hospital.province} / {hospital.ville}
                                                </TableCell>
                                                <TableCell>{hospital.capacite}</TableCell>
                                                <TableCell>
                                                    <Badge variant={hospital.is_active ? 'default' : 'destructive'}>
                                                        {hospital.is_active ? 'Actif' : 'Inactif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{hospital.creator?.name || 'Système'}</TableCell>
                                                <TableCell>{new Date(hospital.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu
                                                        open={openDropdownId === hospital.ref}
                                                        onOpenChange={(open) => {
                                                            setOpenDropdownId(open ? hospital.ref : null);
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
                                                                    href={route('hopitals.show', hospital.ref)}
                                                                    className="flex items-center"
                                                                    onClick={() => setOpenDropdownId(null)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Voir
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={route('hopitals.edit', hospital.ref)}
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
                                                                    handleDelete(hospital);
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
                                                <div className="text-gray-500">Aucun hôpital trouvé.</div>
                                                <Button asChild variant="link" className="mt-2">
                                                    <Link href={route('hopitals.create')}>Créer un hôpital</Link>
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
                            Cette action supprimera définitivement l'hôpital "{hospitalToDelete?.nom}" et ne pourra pas être annulée.
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