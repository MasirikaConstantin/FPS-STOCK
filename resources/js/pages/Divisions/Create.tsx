// resources/js/Pages/Divisions/Create.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DivisionForm } from '@/components/DivisionForm';

interface CreateProps {
    types: string[];
    parents: Array<{
        id: number;
        nom: string;
        type: string;
    }>;
}

export default function Create({ types, parents }: CreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisions Administratives',
            href: route('divisions.index'),
        },
        {
            title: 'Nouvelle division',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouvelle division" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Créer une nouvelle division</CardTitle>
                            <CardDescription>
                                Remplissez les champs ci-dessous pour créer une division administrative
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DivisionForm types={types} parents={parents} />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" asChild>
                                <Link href={route('divisions.index')}>Annuler</Link>
                            </Button>
                            <Button type="submit" form="division-form">
                                Créer
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}