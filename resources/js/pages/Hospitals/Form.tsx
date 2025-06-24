import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface HospitalFormProps {
    hopital?: {
        id?: number;
        ref?: string;
        nom: string;
        type: string;
        province: string;
        ville: string;
        address: string;
        contact_person: string;
        phone: string;
        email: string;
        capacite: number;
        is_active: boolean;
        coordonees: any;
        division_administrative_id: number;
    };
    divisions: any[];
    types: string[];
}

export default function Form({ hopital, divisions, types }: PageProps<HospitalFormProps>) {
    const { data, setData, errors, post, put, processing } = useForm({
        nom: hopital?.nom || '',
        type: hopital?.type || '',
        province: hopital?.province || '',
        ville: hopital?.ville || '',
        address: hopital?.address || '',
        contact_person: hopital?.contact_person || '',
        phone: hopital?.phone || '',
        email: hopital?.email || '',
        capacite: hopital?.capacite || 0,
        is_active: hopital?.is_active || true,
        coordonees: hopital?.coordonees || null,
        division_administrative_id: hopital?.division_administrative_id || null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Hôpitaux',
            href: '/hopitals',
        },
        {
            title: hopital ? 'Modifier Hôpital' : 'Créer Hôpital',
            href: '/hopitals',

        },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hopital) {
            put(route('hopitals.update', hopital.ref),
            {
                onSuccess: () => {
                    toast.success('Hôpital mis à jour avec succès');
                },
                onError: () => {
                    toast.error('Une erreur est survenue');
                },
            }
        
        );
        } else {
            post(route('hopitals.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={hopital ? 'Modifier Hôpital' : 'Créer Hôpital'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-xl font-semibold">{hopital ? 'Modifier Hôpital' : 'Créer Hôpital'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-6">
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nom">Nom *</Label>
                                            <Input
                                                id="nom"
                                                value={data.nom}
                                                onChange={(e) => setData('nom', e.target.value)}
                                                placeholder="Nom de l'hôpital"
                                            />
                                            {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="type">Type</Label>
                                            <Select
                                                value={data.type}
                                                onValueChange={(value) => setData('type', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {types.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type === 'central' && 'Central'}
                                                            {type === 'general' && 'Général'}
                                                            {type === 'reference' && 'Référence'}
                                                            {type === 'centre_sante' && 'Centre de Santé'}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="province">Province *</Label>
                                            <Input
                                                id="province"
                                                value={data.province}
                                                onChange={(e) => setData('province', e.target.value)}
                                                placeholder="Province"
                                            />
                                            {errors.province && <p className="text-sm text-red-500">{errors.province}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="ville">Ville *</Label>
                                            <Input
                                                id="ville"
                                                value={data.ville}
                                                onChange={(e) => setData('ville', e.target.value)}
                                                placeholder="Ville"
                                            />
                                            {errors.ville && <p className="text-sm text-red-500">{errors.ville}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Adresse</Label>
                                            <Input
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                placeholder="Adresse complète"
                                            />
                                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="division_administrative_id">Division Administrative</Label>
                                            <Select
                                                value={data.division_administrative_id?.toString() || ''}
                                                onValueChange={(value) => setData('division_administrative_id', parseInt(value) || null)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner une division" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {divisions.map((division) => (
                                                        <SelectItem key={division.id} value={division.id.toString()}>
                                                            {division.nom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.division_administrative_id && (
                                                <p className="text-sm text-red-500">{errors.division_administrative_id}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="contact_person">Personne de contact</Label>
                                            <Input
                                                id="contact_person"
                                                value={data.contact_person}
                                                onChange={(e) => setData('contact_person', e.target.value)}
                                                placeholder="Nom du contact"
                                            />
                                            {errors.contact_person && (
                                                <p className="text-sm text-red-500">{errors.contact_person}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="Numéro de téléphone"
                                            />
                                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="Email"
                                            />
                                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="capacite">Capacité</Label>
                                            <Input
                                                id="capacite"
                                                type="number"
                                                min="0"
                                                value={data.capacite}
                                                onChange={(e) => setData('capacite', parseInt(e.target.value) || 0)}
                                                placeholder="Capacité d'accueil"
                                            />
                                            {errors.capacite && <p className="text-sm text-red-500">{errors.capacite}</p>}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                                            />
                                            <Label htmlFor="is_active">Actif</Label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Button asChild variant="outline">
                                            <Link href={route('hopitals.index')}>Annuler</Link>
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {hopital ? 'Mettre à jour' : 'Créer'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                            </CardContent>
                        </Card>
                        
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}