import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Snowflake } from 'lucide-react';

export default function Show({ produit, categories, fournisseurs }: PageProps<{ 
    produit: App.MedicalProduit, 
    categories: App.Categorie[],
    fournisseurs: App.Fournisseur[]
}>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Produits Médicaux',
            href: '/medical-produits',
        },
        {
            title: produit.name,
            href: `/medical-produits/${produit.ref}`,
        },
    ];

    const getCategoryName = (id: number) => {
        return categories.find(c => c.id === id)?.name || 'Inconnue';
    };

    const getFournisseurName = (id: number | null) => {
        if (!id) return 'Aucun';
        return fournisseurs.find(f => f.id === id)?.nom || 'Inconnu';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={produit.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">{produit.name}</h2>
                                <div className="flex space-x-2">
                                    <Button variant="outline" asChild>
                                        <Link href={route('medical-produits.index')}>Retour</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('medical-produits.edit', produit.ref)}>Modifier</Link>
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
                                            <p className="text-sm text-gray-500">Référence</p>
                                            <p>{produit.ref}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Catégorie</p>
                                            <p>{getCategoryName(produit.categorie_id)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Sous-catégorie</p>
                                            <p>{produit.sous_category || 'Aucune'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Unité</p>
                                            <p>{produit.unite}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Statut</p>
                                            <Badge variant={produit.is_active ? 'default' : 'destructive'}>
                                                {produit.is_active ? 'Actif' : 'Inactif'}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Détails techniques</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Fabricant</p>
                                            <p>{produit.fabrican || 'Inconnu'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Fournisseur</p>
                                            <p>{getFournisseurName(produit.fournisseur_id)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Prix unitaire</p>
                                            <p>{produit.prix_unitaire.toFixed(2)} €</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Seuil minimum</p>
                                            <p>{produit.seuil_min}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Durée de vie</p>
                                            <p>{produit.duree_vie} mois</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Conditions de stockage</p>
                                            <div className="flex items-center gap-2">
                                                {produit.requires_refrigeration ? (
                                                    <>
                                                        <Snowflake className="h-4 w-4 text-blue-500" />
                                                        <span>Réfrigération nécessaire</span>
                                                    </>
                                                ) : (
                                                    <span>Température ambiante</span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {produit.description ? (
                                        <p className="whitespace-pre-line">{produit.description}</p>
                                    ) : (
                                        <p className="text-gray-500">Aucune description disponible</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}