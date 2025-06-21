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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function Create({ produits, hopitals }: PageProps<{ 
    produits: App.MedicalProduit[],
    hopitals: App.Hopital[]
}>) {
    const { data, setData, post, processing, errors } = useForm({
        medical_produit_id: '',
        quantite: 1,
        numero_lot: '',
        date_expiration: null as Date | null,
        prix_unitaire: null as number | null,
        received_date: new Date(),
        status: 'disponible',
        hopital_id: null as string | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Gestion des Stocks',
            href: '/stocks',
        },
        {
            title: 'Ajouter une entrée',
            href: '/stocks/create',
        },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('stocks.store'), {
            onSuccess: () => {
                toast.success('Entrée de stock créée avec succès');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la création');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajouter une entrée de stock" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Produit (obligatoire) */}
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

                                    {/* Quantité (gardé tel quel) */}
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

                                    {/* Numéro de lot (gardé tel quel) */}
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

                                    {/* Prix unitaire (gardé tel quel) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="prix_unitaire">Prix unitaire (€)</Label>
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

                                    {/* Date de réception (gardé tel quel) */}
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

                                    {/* Date d'expiration (gardé tel quel) */}
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

                                    {/* Emplacement (corrigé) */}
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

                                    {/* Statut (corrigé) */}
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
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}