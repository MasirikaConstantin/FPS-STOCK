import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Show({ kit, categories }: PageProps<{ 
    kit: App.Kit & { articles: Array<App.ArticleKit & { medical_produit: App.MedicalProduit }> },
    categories: App.Categorie[]
}>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Gestion des Kits',
            href: '/kits',
        },
        {
            title: `Kit - ${kit.nom}`,
            href: `/kits/${kit.ref}`,
        },
    ];

    const getCategoryName = (id: number) => {
        return categories.find(c => c.id === id)?.nom || 'Inconnue';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={kit?.nom} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">{kit.nom}</h1>
                                <div className="flex space-x-2">
                                    <Button variant="outline" asChild>
                                        <Link href={route('kits.index')}>Retour</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('kits.edit', kit.ref)}>Modifier</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informations de base</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        
                                        <div>
                                            <p className="text-sm text-gray-500">Catégorie</p>
                                            <p>{getCategoryName(kit.categorie_id)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Statut</p>
                                            <Badge variant={kit.is_active ? 'default' : 'destructive'}>
                                                {kit.is_active ? 'Actif' : 'Inactif'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Description</p>
                                            <p className="whitespace-pre-line">{kit.description || 'Aucune description'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Articles du Kit</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {kit.articles && kit.articles.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Produit</TableHead>
                                                        <TableHead>Quantité</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {kit.articles.map((article) => (
                                                        <TableRow key={article.ref}>
                                                            <TableCell className="font-medium">
                                                                {article.medical_produit.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {article.quantite}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="text-center text-gray-500 py-4">
                                                Aucun article dans ce kit
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Historique</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Créé le</p>
                                            <p>{new Date(kit.created_at).toLocaleDateString()} par {kit.created_by?.name || 'Système'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Dernière modification</p>
                                            <p>{new Date(kit.updated_at).toLocaleDateString()} par {kit.updated_by?.name || 'Système'}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}