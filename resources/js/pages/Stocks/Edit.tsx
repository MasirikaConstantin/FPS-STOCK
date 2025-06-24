import AppLayout from '@/layouts/app-layout';
import { fr } from 'date-fns/locale';
import { BreadcrumbItem } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FormEventHandler } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Edit({ stock, produits, hopitals }: PageProps<{ 
    stock: App.Stock,
    produits: App.MedicalProduit[],
    hopitals: App.Hopital[]
}>) {
    const { data, setData, put, processing, errors } = useForm({
        medical_produit_id: stock.medical_produit_id.toString(),
        quantite: stock.quantite,
        numero_lot: stock.numero_lot || '',
        date_expiration: stock.date_expiration ? new Date(stock.date_expiration) : null,
        prix_unitaire: stock.prix_unitaire,
        received_date: new Date(stock.received_date),
        status: stock.status,
        hopital_id: stock.hopital_id?.toString() || null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Gestion des Stocks',
            href: '/stocks',
        },
        {
            title: `Modifier l'entrée ${stock.id}`,
            href: `/stocks/${stock.ref}/edit`,
        },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Formatage des dates pour MySQL
        const formattedData = {
            ...data,
            date_expiration: data.date_expiration ? format(data.date_expiration, 'yyyy-MM-dd') : null,
            received_date: format(data.received_date, 'yyyy-MM-dd')
        };

        put(route('stocks.update', stock.ref), {
            data: formattedData,
            onSuccess: () => {
                toast.success('Entrée de stock mise à jour avec succès');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la mise à jour');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier l'entrée de stock`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modification d'un Stock</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Produit */}
                                    <div className="space-y-2">
                                        <Label htmlFor="medical_produit_id">Produit*</Label>
                                        <Select
                                            value={data.medical_produit_id || undefined}
                                            onValueChange={(value) => setData('medical_produit_id', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un produit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {produits.map((produit) => (
                                                    <SelectItem key={produit.id} value={produit.id.toString()}>
                                                        {produit.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.medical_produit_id && <p className="text-sm text-red-500">{errors.medical_produit_id}</p>}
                                    </div>

                                    {/* Quantité */}
                                    <div className="space-y-2">
                                        <Label htmlFor="quantite">Quantité*</Label>
                                        <Input
                                            id="quantite"
                                            type="number"
                                            min="1"
                                            value={data.quantite}
                                            onChange={(e) => setData('quantite', parseInt(e.target.value))}
                                            required
                                        />
                                        {errors.quantite && <p className="text-sm text-red-500">{errors.quantite}</p>}
                                    </div>

                                    {/* Numéro de lot */}
                                    <div className="space-y-2">
                                        <Label htmlFor="numero_lot">Numéro de lot</Label>
                                        <Input
                                            id="numero_lot"
                                            value={data.numero_lot}
                                            onChange={(e) => setData('numero_lot', e.target.value)}
                                            placeholder="Optionnel"
                                        />
                                        {errors.numero_lot && <p className="text-sm text-red-500">{errors.numero_lot}</p>}
                                    </div>

                                    {/* Prix unitaire */}
                                    <div className="space-y-2">
                                        <Label htmlFor="prix_unitaire">Prix unitaire (FC)</Label>
                                        <Input
                                            id="prix_unitaire"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.prix_unitaire || ''}
                                            onChange={(e) => setData('prix_unitaire', e.target.value ? parseFloat(e.target.value) : null)}
                                            placeholder="Optionnel"
                                        />
                                        {errors.prix_unitaire && <p className="text-sm text-red-500">{errors.prix_unitaire}</p>}
                                    </div>

                                    {/* Date de réception */}
                                    <div className="space-y-2">
                                        <Label htmlFor="received_date">Date de réception*</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !data.received_date && 'text-muted-foreground'
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {data.received_date ? format(data.received_date, 'PPP') : <span>Choisir une date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={data.received_date}
                                                    onSelect={(date) => {
                                                    if (date) {
                                                        // Ajoute 1 heure pour compenser le décalage du fuseau horaire
                                                        const adjustedDate = new Date(date);
                                                        adjustedDate.setHours(adjustedDate.getHours() + 1);
                                                        setData('received_date', adjustedDate);
                                                    }
                                                    }}
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                        </Popover>
                                        {errors.received_date && <p className="text-sm text-red-500">{errors.received_date}</p>}
                                    </div>

                                    {/* Date d'expiration */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date_expiration">Date d'expiration</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !data.date_expiration && 'text-muted-foreground'
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {data.date_expiration ? format(data.date_expiration, 'PPP') : <span>Choisir une date</span>}
                                                </Button>
                                            </PopoverTrigger>

                                            
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={data.date_expiration || undefined}
                                                    onSelect={(date) => {
                                                    if (date) {
                                                        // Ajoute 1 heure pour compenser le décalage du fuseau horaire
                                                        const adjustedDate = new Date(date);
                                                        adjustedDate.setHours(adjustedDate.getHours() + 1);
                                                        setData('date_expiration', adjustedDate);
                                                    } else {
                                                        setData('date_expiration', null);
                                                    }}}
                                                    
                                                    initialFocus
                                                />
                                            </PopoverContent>

                                           
                                        </Popover>
                                        {errors.date_expiration && <p className="text-sm text-red-500">{errors.date_expiration}</p>}
                                    </div>

                                    {/* Emplacement - Corrigé */}
                                    <div className="space-y-2">
                                        <Label htmlFor="hopital_id">Emplacement</Label>
                                        <Select
                                            value={data.hopital_id === null ? "null" : data.hopital_id || undefined}
                                            onValueChange={(value) => setData('hopital_id', value === "null" ? null : value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Stock central" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null">Stock central</SelectItem>
                                                {hopitals.map((hopital) => (
                                                    <SelectItem key={hopital.id} value={hopital.id.toString()}>
                                                        {hopital.nom}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.hopital_id && <p className="text-sm text-red-500">{errors.hopital_id}</p>}
                                    </div>

                                    {/* Statut - Corrigé */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Statut*</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un statut" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="disponible">Disponible</SelectItem>
                                                <SelectItem value="reservee">Réservée</SelectItem>
                                                <SelectItem value="expirer">Expiré</SelectItem>
                                                <SelectItem value="endommage">Endommagé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button variant="outline" asChild>
                                        <Link href={route('stocks.index')}>Annuler</Link>
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