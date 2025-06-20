import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface FormProps extends PageProps {
    division?: {
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

export default function Form({ division, types, parents }: FormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        nom: division?.nom || '',
        type: division?.type || 'province',
        code: division?.code || '',
        parent_id: division?.parent_id || null,
        is_active: division?.is_active ?? true,
    });

    const filteredParents = parents.filter(parent => {
        if (data.type === 'territoire') return parent.type === 'province';
        if (data.type === 'ville') return parent.type === 'territoire';
        return false;
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (division) {
            put(route('divisions.update', division.id), {
                onSuccess: () => toast.success('Division mise à jour avec succès'),
            });
        } else {
            post(route('divisions.store'), {
                onSuccess: () => toast.success('Division créée avec succès'),
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisions Administratives',
            href: route('divisions.index'),
        },
        {
            title: division ? 'Modifier division' : 'Nouvelle division',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={division ? 'Modifier division' : 'Nouvelle division'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{division ? 'Modifier la division' : 'Créer une nouvelle division'}</CardTitle>
                            <CardDescription>
                                Remplissez les champs ci-dessous pour {division ? 'modifier' : 'créer'} une division administrative
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={onSubmit}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nom">Nom</Label>
                                        <Input
                                            id="nom"
                                            value={data.nom}
                                            onChange={(e) => setData('nom', e.target.value)}
                                            placeholder="Nom de la division"
                                            required
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
                                                <SelectValue placeholder="Sélectionnez un type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {types.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Code</Label>
                                        <Input
                                            id="code"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder="Code unique (optionnel)"
                                        />
                                        {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="parent_id">Division parente</Label>
                                        <Select
                                            value={data.parent_id?.toString() || ''}
                                            onValueChange={(value) => setData('parent_id', value ? parseInt(value) : null)}
                                            disabled={data.type === 'province'}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez une division parente" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredParents.map((parent) => (
                                                    <SelectItem key={parent.id} value={parent.id.toString()}>
                                                        {parent.nom} ({parent.type})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.parent_id && <p className="text-sm text-red-500">{errors.parent_id}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Actif</Label>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" asChild>
                                    <Link href={route('divisions.index')}>Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {division ? 'Mettre à jour' : 'Créer'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}