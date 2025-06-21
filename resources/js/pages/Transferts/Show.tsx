

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Truck, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Show({ transfert }: PageProps<{ 
    transfert: App.Transfert & { 
        articles: Array<App.ArticleTransfert & { 
            stock: App.Stock & { medical_produit: App.MedicalProduit } 
        }>,
        from_hospital: App.Hopital,
        to_hospital: App.Hopital,
        demandeur: App.User,
        approbateur?: App.User,
        created_by?: App.User,
        updated_by?: App.User
    } 
}>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Transferts de Stock',
            href: '/transferts',
        },
        {
            title: transfert.ref,
            href: `/transferts/${transfert.ref}`,
        },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Non spécifié';
        return format(new Date(dateString), 'PPPpp', { locale: fr });
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
            <Head title={`Détails du transfert ${transfert.ref}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Transfert {transfert.ref}</h1>
                                <div className="flex space-x-2">
                                    <Button variant="outline" asChild>
                                        <Link href={route('transferts.index')}>Retour</Link>
                                    </Button>
                                    {transfert.status === 'en_attente' && (
                                        <Button asChild>
                                            <Link href={route('transferts.edit', transfert.ref)}>Modifier</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informations du transfert</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">De</p>
                                            <p>{transfert.from_hospital.nom}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">Vers</p>
                                            <p>{transfert.to_hospital.nom}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">Statut</p>
                                            {getStatusBadge(transfert.status)}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">Priorité</p>
                                            {getPriorityBadge(transfert.priorite)}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">Demandé par</p>
                                            <p>{transfert.demandeur.name}</p>
                                        </div>
                                        {transfert.approbateur && (
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-500">Approuvé par</p>
                                                <p>{transfert.approbateur.name}</p>
                                            </div>
                                        )}
                                        {transfert.approuve_le && (
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-500">Approuvé le</p>
                                                <p>{formatDate(transfert.approuve_le)}</p>
                                            </div>
                                        )}
                                        {transfert.livre_le && (
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-500">Livré le</p>
                                                <p>{formatDate(transfert.livre_le)}</p>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">Créé le</p>
                                            <p>{formatDate(transfert.created_at)}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">Dernière modification</p>
                                            <p>{formatDate(transfert.updated_at)}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Articles transférés</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Produit</TableHead>
                                                    <TableHead>Quantité</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {transfert.articles.map((article) => (
                                                    <TableRow key={article.ref}>
                                                        <TableCell>
                                                            {article.stock.medical_produit.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {article.quantite}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={
                                                                article.status === 'livre' ? 'default' :
                                                                article.status === 'annule' ? 'destructive' :
                                                                'secondary'
                                                            }>
                                                                {article.status === 'en_attente' ? 'En attente' :
                                                                 article.status === 'preleve' ? 'Prélevé' :
                                                                 article.status === 'livre' ? 'Livré' : 'Annulé'}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                {transfert.notes && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Notes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="whitespace-pre-line">{transfert.notes}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}