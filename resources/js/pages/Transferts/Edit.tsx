import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FormEventHandler } from 'react';

export default function Edit({ transfert, hopitals, stocks }: PageProps<{ 
    transfert: App.Transfert & { articles: Array<App.ArticleTransfert & { stock: App.Stock }> },
    hopitals: App.Hopital[],
    stocks: App.Stock[]
}>) {
    const { data, setData, put, processing, errors } = useForm({
        from_hospital_id: transfert.from_hospital_id.toString(),
        to_hospital_id: transfert.to_hospital_id.toString(),
        priorite: transfert.priorite,
        notes: transfert.notes || '',
        articles: transfert.articles.map(article => ({
            stock_id: article.stock_id.toString(),
            medical_produit_id: article.medical_produit_id.toString(),
            quantite: article.quantite,
            ref: article.ref,
        })),
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Transferts de Stock',
            href: '/transferts',
        },
        {
            title: `Modifier ${transfert.ref}`,
            href: `/transferts/${transfert.ref}/edit`,
        },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('transferts.update', transfert.ref), {
            onSuccess: () => {
                toast.success('Transfert mis à jour avec succès');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la mise à jour');
            },
        });
    };

    const addArticle = () => {
        setData('articles', [
            ...data.articles,
            { stock_id: '', medical_produit_id: '', quantite: 1 },
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

    const filteredStocks = stocks.filter(stock => 
        stock.hopital_id?.toString() === data.from_hospital_id
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier ${transfert.ref}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="from_hospital_id">Hôpital source*</Label>
                                        <Select
                                            value={data.from_hospital_id}
                                            onValueChange={(value) => setData('from_hospital_id', value)}
                                            required
                                        >
                                            <SelectTrigger>
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
                                        {errors.from_hospital_id && <p className="text-sm text-red-500">{errors.from_hospital_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="to_hospital_id">Hôpital destination*</Label>
                                        <Select
                                            value={data.to_hospital_id}
                                            onValueChange={(value) => setData('to_hospital_id', value)}
                                            required
                                        >
                                            <SelectTrigger>
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

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Informations supplémentaires (optionnel)"
                                        rows={3}
                                    />
                                    {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Articles à transférer*</Label>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={addArticle}
                                            disabled={!data.from_hospital_id}
                                        >
                                            Ajouter un article
                                        </Button>
                                    </div>

                                    {data.articles.length > 0 ? (
                                        <div className="space-y-4">
                                            {data.articles.map((article, index) => (
                                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                                    <div className="space-y-2">
                                                        <Label>Stock source*</Label>
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
                                                                <SelectValue placeholder="Sélectionner un stock" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {filteredStocks.map((stock) => (
                                                                    <SelectItem key={stock.id} value={stock.id.toString()}>
                                                                        {stock.medical_produit?.name} (Quantité: {stock.quantite})
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
                                            {data.from_hospital_id 
                                                ? "Aucun article ajouté au transfert" 
                                                : "Veuillez d'abord sélectionner un hôpital source"}
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