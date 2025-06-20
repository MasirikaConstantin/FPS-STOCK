import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import { PlusIcon } from 'lucide-react';
import { DivisionAdministrative } from '@/types/types';

interface IndexProps extends PageProps {
    provinces: DivisionAdministrative[];
    territoires: DivisionAdministrative[];
    villes: DivisionAdministrative[];
    communes: DivisionAdministrative[];
    canCreate: boolean;
}


export default function Index({ provinces, territoires, villes,communes, canCreate }: IndexProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisions Administratives',
            href: route('divisions.index'),
        },
    ];


    const renderTable = (title: string, items: DivisionAdministrative[], type: string) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Parent</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.nom}</TableCell>
                                <TableCell>{item.code || '-'}</TableCell>
                                <TableCell>{item.parent?.nom || '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={item.is_active ? 'default' : 'destructive'}>
                                        {item.is_active ? 'Actif' : 'Inactif'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={route('divisions.show', item.ref)}>
                                            Détails
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Divisions Administratives" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-end gap-2">
                        {canCreate && (
                            <Button asChild>
                                <Link href={route('division.create')}>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Ajouter une division
                                </Link>
                            </Button>
                        )}

                            <Button asChild>
                                <Link href={route('admin.permissions.assign')}>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Assigner des Permissions
                                </Link>
                            </Button>
                    </div>

                    <div className="space-y-6">
                        {renderTable('Provinces', provinces, 'province')}
                        {renderTable('Territoires', territoires, 'territoire')}
                        {renderTable('Villes', villes, 'ville')}
                        {renderTable('Communes', communes, 'commune')}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}