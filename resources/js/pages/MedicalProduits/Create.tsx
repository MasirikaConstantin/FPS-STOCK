import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { FormEventHandler, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal,     useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Create({ categories, fournisseurs }: { 
    categories: App.Categorie[], 
    fournisseurs: App.Fournisseur[] 
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        categorie_id: '',
        sous_category: '',
        unite: '',
        description: '',
        fabrican: '',
        fournisseur_id: null as string | null,
        requires_refrigeration: false,
        duree_vie: 36,
        seuil_min: 0,
        prix_unitaire: 0,
        is_active: true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Produits Médicaux',
            href: '/medical-produits',
        },
        {
            title: 'Ajouter un produit',
            href: '/medical-produits/create',
        },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('medical-produits.store'), {
            onSuccess: () => {
                toast.success('Produit créé avec succès');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la création');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajouter un produit médical" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ajouter un produit médical</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom du produit*</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Nom du produit"
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="categorie_id">Catégorie*</Label>
                                        <Select
                                            value={data.categorie_id || undefined} // Use undefined instead of empty string
                                            onValueChange={(value) => setData('categorie_id', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            {categories?.map((categorie: { id: Key | null | undefined; nom: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                                                // Ensure the value is never an empty string
                                                <SelectItem 
                                                key={categorie.id} 
                                                value={categorie.id?.toString() || String(categorie.id)} // Fallback to String() if toString() fails
                                                >
                                                {categorie.nom}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.categorie_id && <p className="text-sm text-red-500">{errors.categorie_id}</p>}
                                        </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sous_category">Sous-catégorie</Label>
                                        <Input
                                            id="sous_category"
                                            value={data.sous_category}
                                            onChange={(e) => setData('sous_category', e.target.value)}
                                            placeholder="Sous-catégorie (optionnel)"
                                        />
                                        {errors.sous_category && <p className="text-sm text-red-500">{errors.sous_category}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="unite">Unité*</Label>
                                        <Input
                                            id="unite"
                                            value={data.unite}
                                            onChange={(e) => setData('unite', e.target.value)}
                                            placeholder="Unité (ex: boite, flacon, etc.)"
                                            required
                                        />
                                        {errors.unite && <p className="text-sm text-red-500">{errors.unite}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fabrican">Fabricant</Label>
                                        <Input
                                            id="fabrican"
                                            value={data.fabrican}
                                            onChange={(e) => setData('fabrican', e.target.value)}
                                            placeholder="Fabricant (optionnel)"
                                        />
                                        {errors.fabrican && <p className="text-sm text-red-500">{errors.fabrican}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fournisseur_id">Fournisseur</Label>
                                        <Select
                                            value={data.fournisseur_id || undefined} // Utilisez `undefined` pour le placeholder
                                            onValueChange={(value) => setData('fournisseur_id', value === "null" ? null : value)}
                                        >
                                            <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un fournisseur" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            <SelectItem value="null">Aucun fournisseur</SelectItem> {/* ← "null" au lieu de "" */}
                                            {fournisseurs.map((fournisseur: { id: Key | null | undefined; nom: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                                                <SelectItem key={fournisseur.id} value={fournisseur.id ? fournisseur.id.toString() : 'null'}>
                                                {fournisseur.nom}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.fournisseur_id && <p className="text-sm text-red-500">{errors.fournisseur_id}</p>}
                                        </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="prix_unitaire">Prix unitaire (FC)*</Label>
                                        <Input
                                            id="prix_unitaire"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.prix_unitaire}
                                            onChange={(e) => setData('prix_unitaire', parseFloat(e.target.value))}
                                            placeholder="0.00"
                                            required
                                        />
                                        {errors.prix_unitaire && <p className="text-sm text-red-500">{errors.prix_unitaire}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="seuil_min">Seuil minimum de stock*</Label>
                                        <Input
                                            id="seuil_min"
                                            type="number"
                                            min="0"
                                            value={data.seuil_min}
                                            onChange={(e) => setData('seuil_min', parseInt(e.target.value))}
                                            placeholder="0"
                                            required
                                        />
                                        {errors.seuil_min && <p className="text-sm text-red-500">{errors.seuil_min}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duree_vie">Durée de vie (mois)*</Label>
                                        <Input
                                            id="duree_vie"
                                            type="number"
                                            min="1"
                                            value={data.duree_vie}
                                            onChange={(e) => setData('duree_vie', parseInt(e.target.value))}
                                            placeholder="36"
                                            required
                                        />
                                        {errors.duree_vie && <p className="text-sm text-red-500">{errors.duree_vie}</p>}
                                    </div>

                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id="requires_refrigeration"
                                            checked={data.requires_refrigeration}
                                            onCheckedChange={(checked) => setData('requires_refrigeration', !!checked)}
                                        />
                                        <Label htmlFor="requires_refrigeration">Nécessite réfrigération</Label>
                                    </div>

                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                        <Label htmlFor="is_active">Produit actif</Label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Description du produit (optionnel)"
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button variant="outline" asChild>
                                        <Link href={route('medical-produits.index')}>Annuler</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Enregistrement...' : 'Enregistrer'}
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