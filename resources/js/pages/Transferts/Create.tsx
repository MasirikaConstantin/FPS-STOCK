import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {  X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

export default function TransfertCreate({ produits, hopitals }: { produits: any[], hopitals: any[] }) {
  const [selectedProduits, setSelectedProduits] = useState<Record<string, any>>({});
  const [availableStocks, setAvailableStocks] = useState<Record<number, any[]>>({});
  const [formData, setFormData] = useState({
    to_hospital_id: null as number | null,
    to_central: false,
    priorite: 'moyen',
    from_central : false,
    notes: '',
  });
  const [processing, setProcessing] = useState(false);

  // Charger les stocks disponibles avec les relations
  useEffect(() => {
    const stocksByProduit: Record<number, any[]> = {};
    
    produits.forEach(produit => {
      stocksByProduit[produit.id] = produit.stocks
        .filter(stock => stock.quantite > 0)
        .map(stock => ({
          ...stock,
          hopital_nom: stock.hopital?.nom || 'Stock Central'
        }));
    });

    setAvailableStocks(stocksByProduit);
  }, [produits]);

  const handleAddItem = (produitId: string) => {
    const produit = produits.find(p => p.id.toString() === produitId);
    if (produit && !selectedProduits[produitId]) {
      const centralStock = availableStocks[produit.id]?.find(s => s.hopital_id === null);
      
      setSelectedProduits(prev => ({
        ...prev,
        [produitId]: {
          medical_produit_id: produit.id,
          name: produit.name,
          stocks: availableStocks[produit.id] || [],
          quantite: 1,
          from_central: !!centralStock,
          stock_source_id: centralStock?.id || null,
          max_quantite: centralStock?.quantite || 0
        }
      }));
    }
  };

  const handleRemoveItem = (produitId: string) => {
    const newSelected = { ...selectedProduits };
    delete newSelected[produitId];
    setSelectedProduits(newSelected);
  };

  const handleStockChange = (produitId: string, stockId: string) => {
    const stock = availableStocks[parseInt(produitId)]?.find(s => s.id.toString() === stockId);
    
    setSelectedProduits(prev => ({
      ...prev,
      [produitId]: {
        ...prev[produitId],
        stock_source_id: stock?.id || null,
        from_central: stock?.hopital_id === null,
        max_quantite: stock?.quantite || 0,
        quantite: Math.min(prev[produitId].quantite, stock?.quantite || 1)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    const items = Object.values(selectedProduits).map(item => ({
      medical_produit_id: item.medical_produit_id,
      quantite: item.quantite,
      from_central: item.from_central,
      stock_source_id: item.stock_source_id
    }));

    const payload = {
      to_hospital_id: formData.to_hospital_id,
      to_central: formData.to_central,
        from_central: formData.from_central,
      priorite: formData.priorite,
      notes: formData.notes,
      items: items
    };

    console.log('Payload:', payload);

    router.post(route('transferts.store'), payload, {
      onSuccess: () => {
        toast.success('Transfert créé avec succès');
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
        toast.error('Veuillez corriger les erreurs dans le formulaire');
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Transfert de stock',
      href: '/transferts',
    },
    {
      title: 'Nouveau Transfert',
      href: '/transferts/create',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nouveau Transfert" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Nouveau Transfert</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="to_hospital_id">Destination</Label>
                <Select
                  value={formData.to_central ? 'central' : formData.to_hospital_id?.toString() || ''}
                  onValueChange={(value) => {
                    if (value === 'central') {
                      setFormData({
                        ...formData,
                        to_hospital_id: null,
                        to_central: true,
                        from_central: false,
                      });
                    } else {
                      setFormData({
                        ...formData,
                        to_hospital_id: parseInt(value),
                        to_central: false,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central">Stock Central</SelectItem>
                    {hopitals.map((hopital) => (
                      <SelectItem key={hopital.id} value={hopital.id.toString()}>
                        {hopital.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priorite">Priorité</Label>
                <Select
                  value={formData.priorite}
                  onValueChange={(value) => setFormData({...formData, priorite: value})}
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
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Informations supplémentaires..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Articles à transférer</h2>
                <Select onValueChange={handleAddItem}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Ajouter un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {produits.map((produit) => (
                      <SelectItem 
                        key={produit.id} 
                        value={produit.id.toString()}
                        disabled={!!selectedProduits[produit.id] || availableStocks[produit.id]?.length === 0}
                      >
                        {produit.name}
                        {availableStocks[produit.id]?.length === 0 && ' (Stock indisponible)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {Object.values(selectedProduits).length > 0 ? (
                <div className="space-y-4">
                  {Object.values(selectedProduits).map((item) => (
                    <div key={item.medical_produit_id} className="p-4 border rounded-lg relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                        onClick={() => handleRemoveItem(item.medical_produit_id.toString())}
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <h3 className="font-medium">{item.name}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                        <div className="space-y-1">
                          <Label>Quantité</Label>
                          <Input
                            type="number"
                            min="1"
                            max={item.max_quantite}
                            value={item.quantite}
                            onChange={(e) => {
                              const newQuantite = Math.min(
                                parseInt(e.target.value) || 1,
                                item.max_quantite
                              );
                              setSelectedProduits(prev => ({
                                ...prev,
                                [item.medical_produit_id]: {
                                  ...prev[item.medical_produit_id],
                                  quantite: newQuantite
                                }
                              }));
                            }}
                          />
                          <p className="text-xs text-gray-500">
                            Disponible: {item.max_quantite}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <Label>Source</Label>
                          <Select
                            value={item.from_central ? 'central' : 'hospital'}
                            onValueChange={(value) => {
                              const fromCentral = value === 'central';
                              const centralStock = availableStocks[item.medical_produit_id]?.find(s => s.hopital_id === null);
                              
                              setSelectedProduits(prev => ({
                                ...prev,
                                [item.medical_produit_id]: {
                                  ...prev[item.medical_produit_id],
                                  from_central: fromCentral,
                                  stock_source_id: fromCentral ? centralStock?.id : null,
                                  max_quantite: fromCentral ? centralStock?.quantite : 0
                                }
                              }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="central">Stock Central</SelectItem>
                              <SelectItem value="hospital">Hôpital</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {!item.from_central && (
                          <div className="space-y-1">
                            <Label>Stock Source</Label>
                            <Select
                              value={item.stock_source_id?.toString() || ''}
                              onValueChange={(value) => handleStockChange(
                                item.medical_produit_id.toString(), 
                                value
                              )}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un stock" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableStocks[item.medical_produit_id]
                                  ?.filter(stock => stock.hopital_id !== null && stock.quantite > 0)
                                  .map((stock) => (
                                    <SelectItem 
                                      key={stock.id} 
                                      value={stock.id.toString()}
                                    >
                                      {stock.hopital_nom} - 
                                      Lot: {stock.numero_lot || 'N/A'} - 
                                      Qte: {stock.quantite}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg ">
                  <p className="text-gray-500">Aucun produit sélectionné</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href={route('transferts.index')}>Annuler</Link>
              </Button>
              <Button 
                type="submit" 
                disabled={processing || Object.values(selectedProduits).length === 0}
              >
                {processing ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}