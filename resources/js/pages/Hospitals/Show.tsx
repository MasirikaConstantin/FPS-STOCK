import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { MapPin, Phone, Mail, User, Building, Bed, Activity } from 'lucide-react';

export default function Show({ hopital }: PageProps<{ hopital: App.Hospital }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Hôpitaux',
            href: '/hospitals',
        },
        {
            title: hopital.nom,
        },
    ];

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            central: 'Central',
            general: 'Général',
            reference: 'Référence',
            centre_sante: 'Centre de Santé',
        };
        return labels[type] || type;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={hopital.nom} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">{hopital.nom}</h1>
                        <Button asChild>
                            <Link href={route('hopitals.edit', {hopital:hopital.ref})}>Modifier </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    <span>Informations Générales</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Badge variant={hopital.is_active ? 'default' : 'destructive'}>
                                        {hopital.is_active ? 'Actif' : 'Inactif'}
                                    </Badge>
                                    {hopital.type && (
                                        <Badge variant="secondary">{getTypeLabel(hopital.type)}</Badge>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Province/Ville</h3>
                                    <p>
                                        {hopital.province} / {hopital.ville}
                                    </p>
                                </div>

                                {hopital.divisionAdministrative && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Division Administrative</h3>
                                        <p>{hopital.divisionAdministrative.nom}</p>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Capacité</h3>
                                    <p>{hopital.capacite} lits</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    <span>Localisation</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {hopital.address && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                                        <p>{hopital.address}</p>
                                    </div>
                                )}
                                {hopital.coordonees && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Coordonnées</h3>
                                        <p>
                                            Lat: {hopital.coordonees.latitude}, Long: {hopital.coordonees.longitude}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <span>Contact</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {hopital.contact_person && (
                                    <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span>{hopital.contact_person}</span>
                                    </div>
                                )}
                                {hopital.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span>{hopital.phone}</span>
                                    </div>
                                )}
                                {hopital.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span>{hopital.email}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    <span>Métadonnées</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Créé par</h3>
                                    <p>{hopital.creator?.name || 'Système'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                                    <p>{new Date(hopital.created_at).toLocaleDateString()}</p>
                                </div>
                                {hopital.updater && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Dernière modification par</h3>
                                        <p>{hopital.updater.name}</p>
                                    </div>
                                )}
                                {hopital.updated_at && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Date de modification</h3>
                                        <p>{new Date(hopital.updated_at).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}