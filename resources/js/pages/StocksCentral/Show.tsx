import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Box, PackageCheck, PackageX } from 'lucide-react';

export default function Show({ stock, produits, hopitals }: PageProps<{ 
    stock: App.Stock,
    produits: App.MedicalProduit[],
    hopitals: App.Hopital[]
}>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Gestion des Stocks',
            href: '/stocks',
        },
        {
            title: `Entrée ${stock.id}`,
            href: `/stocks/${stock.ref}`,
        },
    ];

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

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Non spécifiée';
        return format(new Date(dateString), 'PPP', { locale: fr });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Détails de l'entrée de stock`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Entrée de stock #{stock.id}</h1>
                                <div className="flex space-x-2">
                                    <Button variant="outline" asChild>
                                        <Link href={route('stocks.index')}>Retour</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('stocks.edit', stock.ref)}>Modifier</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('stock.entree.show', stock.ref)}>Voir plus</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informations de base</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Produit</p>
                                            <p>{getProduitName(stock.medical_produit_id)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Quantité</p>
                                            <p>{stock.quantite}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Numéro de lot</p>
                                            <p>{stock.numero_lot || 'Non spécifié'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Statut</p>
                                            {getStatusBadge(stock.status)}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Détails supplémentaires</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Prix unitaire</p>
                                            <p>{stock.prix_unitaire ? `${parseFloat(stock.prix_unitaire).toFixed(2)}  FC` : 'Non spécifié'} </p>

                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date de réception</p>
                                            <p>{formatDate(stock.received_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date d'expiration</p>
                                            <p>{formatDate(stock.date_expiration)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Emplacement</p>
                                            <p>{getHopitalName(stock.hopital_id)}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Historique</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Créé le</p>
                                            <p>{formatDate(stock.created_at)} par {stock.created_by?.name || 'Système'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Dernière modification</p>
                                            <p>{formatDate(stock.updated_at)} par {stock.updated_by?.name || 'Système'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}