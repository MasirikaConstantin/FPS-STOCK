import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FormEventHandler, useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export default function Create({ hopitals, stocks }: PageProps<{ 
    hopitals: App.Hopital[],
    stocks: App.Stock[]
}>) {
    const { data, setData, post, processing, errors } = useForm({
        from_hospital_id: '',
        to_hospital_id: '',
        from_central: false,
        to_central: false,
        priorite: 'moyen',
        notes: '',
        articles: [] as Array<{
            stock_id: string;
            medical_produit_id: string;
            quantite: number;
            from_central: boolean;
        }>,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Transferts de Stock',
            href: '/transferts',
        },
        {
            title: 'Nouveau Transfert',
            href: '/transferts/create',
        },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('transferts.store'), {
            onSuccess: () => {
                toast.success('Transfert créé avec succès');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la création');
            },
        });
    };

    const addArticle = () => {
        setData('articles', [
            ...data.articles,
            { 
                stock_id: '', 
                medical_produit_id: '', 
                quantite: 1,
                from_central: data.from_central
            },
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

    // Filtrer les stocks selon la source sélectionnée
    const filteredStocks = data.from_central 
        ? stocks.filter(stock => stock.hopital_id === null)
        : stocks.filter(stock => stock.hopital_id?.toString() === data.from_hospital_id);

    // Effet pour mettre à jour from_central dans les articles quand la source change
    useEffect(() => {
        setData('articles', data.articles.map(article => ({
            ...article,
            from_central: data.from_central
        })));
    }, [data.from_central]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouveau Transfert" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Source*</Label>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="from_central"
                                                    checked={data.from_central}
                                                    onCheckedChange={(checked) => {
                                                        setData('from_central', !!checked);
                                                        setData('from_hospital_id', '');
                                                    }}
                                                />
                                                <Label htmlFor="from_central">Dépôt Central</Label>
                                            </div>
                                            {!data.from_central && (
                                                <Select
                                                    value={data.from_hospital_id}
                                                    onValueChange={(value) => setData('from_hospital_id', value)}
                                                    required={!data.from_central}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Sélectionner un hôpital" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {hopitals.map((hopital) => (
                                                            <SelectItem key={hopital.id} value={hopital.id.toString()}>
                                                                {hopital.nom}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                        {errors.from_hospital_id && <p className="text-sm text-red-500">{errors.from_hospital_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Destination*</Label>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="to_central"
                                                    checked={data.to_central}
                                                    onCheckedChange={(checked) => {
                                                        setData('to_central', !!checked);
                                                        setData('to_hospital_id', '');
                                                    }}
                                                />
                                                <Label htmlFor="to_central">Dépôt Central</Label>
                                            </div>
                                            {!data.to_central && (
                                                <Select
                                                    value={data.to_hospital_id}
                                                    onValueChange={(value) => setData('to_hospital_id', value)}
                                                    required={!data.to_central}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Sélectionner un hôpital" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {hopitals.map((hopital) => (
                                                            <SelectItem key={hopital.id} value={hopital.id.toString()}>
                                                                {hopital.nom}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                        {errors.to_hospital_id && <p className="text-sm text-red-500">{errors.to_hospital_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="priorite">Priorité*</Label>
                                        <Select
                                            value={data.priorite}
                                            onValueChange={(value) => setData('priorite', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une priorité" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="faible">Faible</SelectItem>
                                                <SelectItem value="moyen">Moyen</SelectItem>
                                                <SelectItem value="eleve">Élevé</SelectItem>
                                                <SelectItem value="urgent">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.priorite && <p className="text-sm text-red-500">{errors.priorite}</p>}
                                    </div>
                                </div>

                                {/* ... reste du formulaire inchangé ... */}

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Articles à transférer*</Label>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={addArticle}
                                            disabled={!data.from_hospital_id && !data.from_central}
                                        >
                                            Ajouter un article
                                        </Button>
                                    </div>

                                    {data.articles.length > 0 ? (
                                        <div className="space-y-4">
                                            {data.articles.map((article, index) => (
                                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                                    <div className="space-y-2">
                                                        <Label>Produit*</Label>
                                                        <Select
                                                            value={article.stock_id}
                                                            onValueChange={(value) => {
                                                                const selectedStock = stocks.find(s => s.id.toString() === value);
                                                                updateArticle(index, 'stock_id', value);
                                                                if (selectedStock) {
                                                                    updateArticle(index, 'medical_produit_id', selectedStock.medical_produit_id.toString());
                                                                }
                                                            }}
                                                            required
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner un produit" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {filteredStocks.map((stock) => (
                                                                    <SelectItem 
                                                                        key={stock.id} 
                                                                        value={stock.id.toString()}
                                                                        disabled={stock.quantite <= 0}
                                                                    >
                                                                        {stock.medical_produit?.name} 
                                                                        ({stock.quantite} disponible)
                                                                        {stock.quantite <= 0 && ' - Stock épuisé'}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors[`articles.${index}.stock_id`] && (
                                                            <p className="text-sm text-red-500">{errors[`articles.${index}.stock_id`]}</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Quantité*</Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={article.quantite}
                                                            onChange={(e) => {
                                                                const max = filteredStocks.find(s => s.id.toString() === article.stock_id)?.quantite || 1;
                                                                const value = Math.min(parseInt(e.target.value) || 1, max);
                                                                updateArticle(index, 'quantite', value);
                                                            }}
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
                                            {(!data.from_hospital_id && !data.from_central) 
                                                ? "Veuillez d'abord sélectionner une source" 
                                                : "Aucun article ajouté au transfert"}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button variant="outline" asChild>
                                        <Link href={route('transferts.index')}>Annuler</Link>
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing || data.articles.length === 0}
                                    >
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