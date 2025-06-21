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
import { FormEventHandler } from 'react';

export default function Edit({ kit, categories, produits }: PageProps<{ 
    kit: App.Kit,
    categories: App.Categorie[],
    produits: App.MedicalProduit[]
}>) {
    const { data, setData, put, processing, errors } = useForm({
        nom: kit?.nom,
        description: kit.description || '',
        categorie_id: kit.categorie_id.toString(),
        is_active: kit.is_active,
        articles: kit.articles?.map(article => ({
            medical_produit_id: article.medical_produit_id.toString(),
            quantite: article.quantite,
            ref: article.ref,
        })) || [],
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Gestion des Kits',
            href: '/kits',
        },
        {
            title: `Modifier ${kit?.nom}`,
            href: `/kits/${kit?.ref}/edit`,
        },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('kits.update', kit?.ref), {
            onSuccess: () => {
                toast.success('Kit mis à jour avec succès');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la mise à jour');
            },
        });
    };

    const addArticle = () => {
        setData('articles', [
            ...data.articles,
            { medical_produit_id: '', quantite: 1 },
        ]);
    };

    const removeArticle = (index: number) => {
        const newArticles = [...data.articles];
        newArticles.splice(index, 1);
        setData('articles', newArticles);
    };

    const updateArticle = (index: number, field: string, value: any) => {
        const newArticles = [...data.articles];
        newArticles[index] = { ...newArticles[index], [field]: value };
        setData('articles', newArticles);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier ${kit.nom}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nom">Nom du Kit*</Label>
                                        <Input
                                            id="nom"
                                            value={data.nom}
                                            onChange={(e) => setData('nom', e.target.value)}
                                            placeholder="Nom du kit"
                                            required
                                        />
                                        {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="categorie_id">Catégorie*</Label>
                                        <Select
                                            value={data.categorie_id}
                                            onValueChange={(value) => setData('categorie_id', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((categorie) => (
                                                    <SelectItem key={categorie.id} value={categorie.id.toString()}>
                                                        {categorie.nom}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.categorie_id && <p className="text-sm text-red-500">{errors.categorie_id}</p>}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                        <Label htmlFor="is_active">Kit actif</Label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Description du kit (optionnel)"
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Articles du Kit</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addArticle}>
                                            Ajouter un article
                                        </Button>
                                    </div>

                                    {data.articles.length > 0 ? (
                                        <div className="space-y-4">
                                            {data.articles.map((article, index) => (
                                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                                    <div className="space-y-2">
                                                        <Label>Produit*</Label>
                                                        <Select
                                                            value={article.medical_produit_id}
                                                            onValueChange={(value) => updateArticle(index, 'medical_produit_id', value)}
                                                            required
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner un produit" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {produits.map((produit) => (
                                                                    <SelectItem key={produit.id} value={produit.id.toString()}>
                                                                        {produit.name} ({produit.unite})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors[`articles.${index}.medical_produit_id`] && (
                                                            <p className="text-sm text-red-500">{errors[`articles.${index}.medical_produit_id`]}</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Quantité*</Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={article.quantite}
                                                            onChange={(e) => updateArticle(index, 'quantite', parseInt(e.target.value))}
                                                            required
                                                        />
                                                        {errors[`articles.${index}.quantite`] && (
                                                            <p className="text-sm text-red-500">{errors[`articles.${index}.quantite`]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeArticle(index)}
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 py-4">
                                            Aucun article ajouté au kit
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button variant="outline" asChild>
                                        <Link href={route('kits.index')}>Annuler</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}