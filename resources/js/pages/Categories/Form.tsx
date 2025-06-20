
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PageProps } from '@/types/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { App } from '@/types/types';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface FormProps {
    auth: PageProps['auth'];
    category?: App.Category;
}

export default function Form({ auth, category }: FormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        nom: category?.nom || '',
        description: category?.description || '',
        is_active: category?.is_active ?? true,
    });

    console.log('Category data:', data);
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitAction = category
            ? () => put(route('categories.update', category.id))
            : () => post(route('categories.store'));

        submitAction();
        toast.success(`Catégorie ${category ? 'mise à jour' : 'créée'} avec succès`);
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Catégories',
            href: route('categories.index'),
        },
        {
            title: category ? 'Modifier catégorie' : 'Nouvelle catégorie',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}
            
        >

            <Head title={category ? 'Modifier catégorie' : 'Nouvelle catégorie'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{category ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie'}</CardTitle>
                            <CardDescription>
                                Remplissez les champs ci-dessous pour {category ? 'modifier' : 'créer'} une catégorie
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={onSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Nom</Label>
                                    <Input
                                        id="nom"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        placeholder="Nom de la catégorie"
                                        required
                                    />
                                    {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Description de la catégorie"
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="flex items-center space-x-2 mb-2">
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
                                    <Link href={route('categories.index')}>Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {category ? 'Mettre à jour' : 'Créer'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}