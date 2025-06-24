import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { FormEventHandler } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Edit({ produit, categories, fournisseurs }: PageProps<{ 
    produit: App.MedicalProduit, 
    categories: App.Categorie[],
    fournisseurs: App.Fournisseur[]
}>) {
    const { data, setData, put, processing, errors } = useForm({
        name: produit.name,
        categorie_id: produit.categorie_id.toString(),
        sous_category: produit.sous_category || '',
        unite: produit.unite,
        description: produit.description || '',
        fabrican: produit.fabrican || '',
        fournisseur_id: produit.fournisseur_id?.toString() || '',
        requires_refrigeration: produit.requires_refrigeration,
        duree_vie: produit.duree_vie,
        seuil_min: produit.seuil_min,
        prix_unitaire: produit.prix_unitaire,
        is_active: produit.is_active,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Produits Médicaux',
            href: '/medical-produits',
        },
        {
            title: 'Modifier ' + produit.name,
            href: `/medical-produits/${produit.ref}/edit`,
        },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('medical-produits.update', produit.id), {
            onSuccess: () => {
                toast.success('Produit mis à jour avec succès');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la mise à jour');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier ${produit.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modifier {produit.name}</CardTitle>
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
                                            value={data.categorie_id || undefined} // Convertit "" en undefined pour le placeholder
                                            onValueChange={(value) => setData('categorie_id', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            {categories.map((categorie) => (
                                                <SelectItem 
                                                key={categorie.id} 
                                                value={categorie.id?.toString() || "undefined"} // Garantit une valeur non-vide
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
                                            value={data.fournisseur_id || "null"} // "null" est utilisé pour représenter "Aucun fournisseur"
                                            onValueChange={(value) => setData('fournisseur_id', value === "null" ? null : value)}
                                        >
                                            <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un fournisseur" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            <SelectItem value="null">Aucun fournisseur</SelectItem> {/* Valeur spéciale */}
                                            {fournisseurs.map((fournisseur) => (
                                                <SelectItem 
                                                key={fournisseur.id} 
                                                value={fournisseur.id.toString()}
                                                >
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