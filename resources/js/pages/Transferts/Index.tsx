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
import { Eye, MoreHorizontal, Pencil, Trash2, Truck, Check, X, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Index({ transferts, hopitals }: PageProps<{ 
    transferts: App.Transfert[],
    hopitals: App.Hopital[]
}>) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [transfertToDelete, setTransfertToDelete] = useState<App.Transfert | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Transferts de Stock',
            href: '/transferts',
        },
    ];

    const handleDelete = (transfert: App.Transfert) => {
        setTransfertToDelete(transfert);
        setDeleteDialogOpen(true);
        setOpenDropdownId(null);
    };

    const confirmDelete = () => {
        if (!transfertToDelete) return;

        router.delete(route('transferts.destroy', transfertToDelete.ref), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Transfert supprimé avec succès');
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
        return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: fr });
    };

    const getHopitalName = (id: number) => {
        return hopitals.find(h => h.id === id)?.nom || 'Inconnu';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'en_attente':
                return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> En attente</Badge>;
            case 'approuve':
                return <Badge variant="default"><Check className="mr-1 h-3 w-3" /> Approuvé</Badge>;
            case 'en_transit':
                return <Badge variant="default"><Truck className="mr-1 h-3 w-3" /> En transit</Badge>;
            case 'livre':
                return <Badge variant="default">Livré</Badge>;
            case 'annule':
                return <Badge variant="destructive"><X className="mr-1 h-3 w-3" /> Annulé</Badge>;
            default:
                return <Badge variant="outline">Inconnu</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'faible':
                return <Badge variant="outline">Faible</Badge>;
            case 'moyen':
                return <Badge variant="default">Moyen</Badge>;
            case 'eleve':
                return <Badge variant="secondary">Élevé</Badge>;
            case 'urgent':
                return <Badge variant="destructive">Urgent</Badge>;
            default:
                return <Badge variant="outline">Inconnu</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Transferts" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Transferts entre Hôpitaux</h1>
                                <Button asChild>
                                    <Link href={route('transferts.create')}>
                                        <Truck className="mr-2 h-4 w-4" />
                                        Nouveau Transfert
                                    </Link>
                                </Button>
                            </div>

                            <Table className="dark:text-gray-400cell w-full text-left text-sm text-gray-500 rtl:text-right">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Référence</TableHead>
                                        <TableHead>De</TableHead>
                                        <TableHead>Vers</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Priorité</TableHead>
                                        <TableHead>Demandé par</TableHead>
                                        <TableHead>Créé le</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transferts && transferts.length > 0 ? (
                                        transferts.map((transfert) => (
                                            <TableRow key={transfert.id}>
                                                <TableCell className="font-medium text-gray-500">
                                                    {transfert.ref}
                                                </TableCell>
                                                <TableCell>
                                                    {getHopitalName(transfert.from_hospital_id)}
                                                </TableCell>
                                                <TableCell>
                                                    {getHopitalName(transfert.to_hospital_id)}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(transfert.status)}
                                                </TableCell>
                                                <TableCell>
                                                    {getPriorityBadge(transfert.priorite)}
                                                </TableCell>
                                                <TableCell>
                                                    {transfert.demandeur?.name || 'Système'}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(transfert.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu
                                                        open={openDropdownId === transfert.ref}
                                                        onOpenChange={(open) => {
                                                            setOpenDropdownId(open ? transfert.ref : null);
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
                                                                    href={route('transferts.show', transfert.ref)}
                                                                    className="flex items-center"
                                                                    onClick={() => setOpenDropdownId(null)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Voir
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {transfert.status === 'en_attente' && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        href={route('transferts.edit', transfert.ref)}
                                                                        className="flex items-center"
                                                                        onClick={() => setOpenDropdownId(null)}
                                                                    >
                                                                        <Pencil className="mr-2 h-4 w-4" />
                                                                        Modifier
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {transfert.status === 'en_attente' && (
                                                                <DropdownMenuItem
                                                                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDelete(transfert);
                                                                        setOpenDropdownId(null);
                                                                    }}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Supprimer
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-4 text-center">
                                                <div className="text-gray-500">Aucun transfert trouvé.</div>
                                                <Button asChild variant="link" className="mt-2">
                                                    <Link href={route('transferts.create')}>Créer un transfert</Link>
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
                            Cette action supprimera définitivement ce transfert et ne pourra pas être annulée.
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
