import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DivisionForm } from '@/components/DivisionForm';

interface EditProps {
    division: {
        id: number;
        nom: string;
        type: string;
        code?: string;
        parent_id?: number;
        is_active: boolean;
    };
    types: string[];
    parents: Array<{
        id: number;
        nom: string;
        type: string;
    }>;
}

export default function Edit({ division, types, parents }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisions Administratives',
            href: route('divisions.index'),
        },
        {
            title: 'Modifier division',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modifier division" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Modifier la division</CardTitle>
                            <CardDescription>
                                Modifiez les champs ci-dessous pour mettre à jour la division administrative
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DivisionForm division={division} types={types} parents={parents} isEdit />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" asChild>
                                <Link href={route('divisions.index')}>Annuler</Link>
                            </Button>
                            <Button type="submit" form="division-form">
                                Mettre à jour
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}