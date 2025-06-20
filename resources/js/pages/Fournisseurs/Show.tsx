import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { MapPin, Phone, Mail, User, FileText, Calendar as CalendarIcon } from 'lucide-react';

export default function Show({ fournisseur }: PageProps<{ fournisseur: App.Fournisseur }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Fournisseurs',
            href: '/fournisseurs',
        },
        {
            href: route('fournisseurs.show', fournisseur.ref),
            title: fournisseur.nom,
        },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={fournisseur.nom} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">{fournisseur.nom}</h1>
                        <Button asChild>
                            <Link href={route('fournisseurs.edit', fournisseur.ref)}>Modifier</Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <span>Informations Générales</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Badge variant={fournisseur.is_active ? 'default' : 'destructive'}>
                                        {fournisseur.is_active ? 'Actif' : 'Inactif'}
                                    </Badge>
                                </div>

                                {fournisseur.contact_person && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Personne de contact</h3>
                                        <p>{fournisseur.contact_person}</p>
                                    </div>
                                )}

                                {fournisseur.specialties && fournisseur.specialties.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Spécialités</h3>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {fournisseur.specialties.map((specialty, index) => (
                                            <Badge key={index} variant="outline" className='p-1 bg-blue-500 text-white dark:bg-blue-600'>
                                                    {specialty}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                {fournisseur.address && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                                        <p>{fournisseur.address}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    <span>Contact</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {fournisseur.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span>{fournisseur.phone}</span>
                                    </div>
                                )}
                                {fournisseur.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span>{fournisseur.email}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    <span>Contrat</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Période du contrat</h3>
                                    <p>
                                        {formatDate(fournisseur.contract_start_date)} -{' '}
                                        {formatDate(fournisseur.contract_end_date)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5" />
                                    <span>Métadonnées</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Créé par</h3>
                                    <p>{fournisseur.creator?.name || 'Système'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                                    <p>{formatDate(fournisseur.created_at)}</p>
                                </div>
                                {fournisseur.updater && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Dernière modification par</h3>
                                        <p>{fournisseur.updater.name}</p>
                                    </div>
                                )}
                                {fournisseur.updated_at && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Date de modification</h3>
                                        <p>{formatDate(fournisseur.updated_at)}</p>
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