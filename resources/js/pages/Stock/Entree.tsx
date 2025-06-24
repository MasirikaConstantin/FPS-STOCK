import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, BreadcrumbItem } from '@/types';
import { MedicalProduit } from '@/types/stock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EntreeProps extends PageProps {
  products: MedicalProduit[];
}

export default function Entree({ products, auth }: EntreeProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    medical_produit_id: '',
    quantite: 1,
    numero_lot: '',
    date_expiration: '',
    prix_unitaire: '',
    notes: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('stock.entree.store'));
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock', href: route('stocks.index') },
    
  {
      title: 'Mouvements',
      href: route('stock.mouvements.index'),
  },
    { title: 'Entrée de stock', href: route('stock.entree.create') },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Entrée de stock" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden  sm:rounded-lg">
            <Card>
              <CardHeader>
                <CardTitle className="mb-6 text-2xl font-bold">
                Nouvelle Entrée de Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
                
                <form onSubmit={submit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="product">Produit</Label>
                      <Select
                        onValueChange={(value) => setData('medical_produit_id', value)}
                        value={data.medical_produit_id}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantite">Quantité</Label>
                      <Input
                        id="quantite"
                        type="number"
                        min="1"
                        value={data.quantite}
                        onChange={(e) => setData('quantite', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="numero_lot">Numéro de lot (optionnel)</Label>
                      <Input
                        id="numero_lot"
                        value={data.numero_lot}
                        onChange={(e) => setData('numero_lot', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_expiration">Date d'expiration (optionnel)</Label>
                      <Input
                        id="date_expiration"
                        type="date"
                        value={data.date_expiration}
                        onChange={(e) => setData('date_expiration', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="prix_unitaire">Prix unitaire (optionnel)</Label>
                      <Input
                        id="prix_unitaire"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.prix_unitaire}
                        onChange={(e) => setData('prix_unitaire', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <Input
                      id="notes"
                      value={data.notes}
                      onChange={(e) => setData('notes', e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={processing} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Enregistrer l'entrée
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