import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { DivisionAdministrative } from '@/types/types';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import {Dialog,  DialogHeader } from '@/components/ui/dialog';
import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';

interface ShowProps extends PageProps {
    division: DivisionAdministrative;
    hierarchy: string;
    canEdit: boolean;
}

export default function Show({ division, hierarchy, canEdit }: ShowProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);
console.log(canEdit)
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisions Administratives',
            href: route('divisions.index'),
        },
        {
            title: division.nom,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={division.nom} />

            <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                <div className="flex justify-end space-x-2">
                {canEdit && (
                    <>
                    <Button variant="outline" asChild>
                        <Link href={route('divisions.edit', division.ref)}>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Modifier
                        </Link>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                        <Button variant="destructive">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Supprimer
                        </Button>
                        </DialogTrigger>
                        <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Supprimer la division</DialogTitle>
                            <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer la division {division.nom} ? Cette action est irréversible.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                            Annuler
                            </Button>
                            <Button
                            variant="destructive"
                            onClick={() => {
                                route('divisions.destroy', division.id);
                                setDeleteOpen(false);
                            }}
                            >
                            Supprimer
                            </Button>
                        </div>
                        </DialogContent>
                    </Dialog>
                    </>
                )}
                </div>

                <Card>
                <CardHeader>
                    <CardTitle>Détails de la division</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Nom</h4>
                        <p>{division.nom}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Type</h4>
                        <Badge>{division.type}</Badge>
                    </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Code</h4>
                        <p>{division.code || '-'}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Statut</h4>
                        <Badge variant={division.is_active ? 'default' : 'destructive'}>
                        {division.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                    </div>
                    </div>

                    <div>
                    <h4 className="text-sm font-medium text-gray-500">Hiérarchie</h4>
                    <p>{hierarchy}</p>
                    </div>

                    {division.parent && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Division parente</h4>
                        <p>
                        <Link href={route('divisions.show', division.parent.id)} className="text-primary hover:underline">
                            {division.parent.nom} ({division.parent.type})
                        </Link>
                        </p>
                    </div>
                    )}

                    {division.children.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Subdivisions</h4>
                        <ul className="space-y-1">
                        {division.children.map((child) => (
                            <li key={child.id}>
                            <Link href={route('divisions.show', child.id)} className="text-primary hover:underline">
                                {child.nom} ({child.type})
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}
                </CardContent>
                </Card>
            </div>
            </div>
        </AppLayout>
    );
}