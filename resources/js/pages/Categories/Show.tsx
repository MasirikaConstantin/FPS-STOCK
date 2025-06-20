// resources/js/Pages/Categories/Show.tsx

import AppLayout from '@/layouts/app-layout';

import { Head, Link } from '@inertiajs/react';
import { App, PageProps } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { BreadcrumbItem } from '@/types';

export default function Show({ auth, category }: PageProps<{ category: App.Category }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Catégories',
            href: route('categories.index'),
        },
        {
            title: 'Détails de la catégorie',
            href: '#',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}

        >
            <Head title={`Détails - ${category.nom}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{category.nom}</span>
                                <Badge variant={category.is_active ? 'default' : 'destructive'}>
                                    {category.is_active ? 'Actif' : 'Inactif'}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Référence</h3>
                                <p className="mt-1 text-sm ">{category.ref}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                <p className="mt-1 text-sm ">
                                    {category.description || 'Aucune description'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Créé par</h3>
                                <p className="mt-1 text-sm ">
                                    {category.creator?.name || 'Système'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                                <p className="mt-1 text-sm ">
                                    {new Date(category.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Dernière mise à jour</h3>
                                <p className="mt-1 text-sm ">
                                    {new Date(category.updated_at).toLocaleString()}
                                </p>
                            </div>
                            {category.updater && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Mis à jour par</h3>
                                    <p className="mt-1 text-sm ">
                                        {category.updater.name}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={route('categories.edit', category.ref)}>Modifier</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}