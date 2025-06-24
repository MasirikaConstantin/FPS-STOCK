import { useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Minus, AlertCircle, Warehouse } from 'lucide-react';
import { MedicalProduit, Allocation, DirectOutFormData } from '@/types/stock';
import { PageProps } from '@/types/types';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface DirectOutProps extends PageProps {
  products: MedicalProduit[];
}

export default function DirectOut({ products, auth }: DirectOutProps) {
  const [selectedProduct, setSelectedProduct] = useState<MedicalProduit | null>(null);
  const [quantityNeeded, setQuantityNeeded] = useState<number>(0);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [remaining, setRemaining] = useState<number>(0);
  const [noStockError, setNoStockError] = useState<string | null>(null);
  const { flash, error } = usePage<{ flash?: { error?: string }; verifyMessage?: string }>().props;
  const { data, setData, post, processing, errors, reset } = useForm<DirectOutFormData>({
    product_id: '',
    allocations: [],
    raison: '',
    notes: '',
  });

  useEffect(() => {
    if (selectedProduct && quantityNeeded > 0) {
      calculateAllocations();
    }
  }, [selectedProduct, quantityNeeded]);

  const calculateAllocations = () => {
    if (!selectedProduct) return;

    // Stocks disponibles (quantité > 0)
    const availableStocks = selectedProduct.stocks?.filter(s => s.quantite > 0) || [];
    
    if (availableStocks.length === 0) {
      setNoStockError("Ce produit n'a aucun stock disponible");
      setAllocations([]);
      setRemaining(quantityNeeded);
      return;
    } else {
      setNoStockError(null);
    }

    let remainingQty = quantityNeeded;
    const newAllocations: Allocation[] = [];

    // Trier par: 1. Dépôt central d'abord, 2. Date d'expiration (plus proche en premier)
    const sortedStocks = [...availableStocks].sort((a, b) => {
      // Priorité au dépôt central
      if (!a.hopital && b.hopital) return -1;
      if (a.hopital && !b.hopital) return 1;
      
      // Ensuite par date d'expiration
      const dateA = a.date_expiration ? new Date(a.date_expiration).getTime() : Number.MAX_SAFE_INTEGER;
      const dateB = b.date_expiration ? new Date(b.date_expiration).getTime() : Number.MAX_SAFE_INTEGER;
      return dateA - dateB;
    });

    for (const stock of sortedStocks) {
      if (remainingQty <= 0) break;

      const allocatable = Math.min(stock.quantite, remainingQty);
      newAllocations.push({
        stock_id: stock.id,
        quantity: allocatable,
        hopital: stock.hopital,
        numero_lot: stock.numero_lot,
        date_expiration: stock.date_expiration,
        max: stock.quantite,
        isDepotCentral: !stock.hopital // Ajout d'un flag pour dépôt central
      });
      remainingQty -= allocatable;
    }

    setAllocations(newAllocations);
    setRemaining(remainingQty);
    setData('allocations', newAllocations);
  };

  const handleAllocationChange = (index: number, value: string) => {
    const newValue = parseInt(value) || 0;
    const stock = selectedProduct?.stocks?.find(s => s.id === allocations[index].stock_id);
    
    if (!stock) return;

    if (newValue > stock.quantite) {
      alert(`La quantité ne peut pas dépasser ${stock.quantite} pour ce stock`);
      return;
    }

    const newAllocations = [...allocations];
    newAllocations[index].quantity = newValue;
    setAllocations(newAllocations);

    const totalAllocated = newAllocations.reduce((sum, item) => sum + item.quantity, 0);
    setRemaining(quantityNeeded - totalAllocated);
    setData('allocations', newAllocations);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (remaining > 0) {
      alert("Vous devez répartir toute la quantité demandée avant de soumettre");
      return;
    }

    post(route('stock.mouvements.direct-out'), {
      onSuccess: () => reset(),
      onError : () => toast.error("Le texte de raison ne peut pas contenir plus de 255 caractères.")
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Stock',
      href: route('stocks.index'),
    },
    {
      title :'Mouvement Stock',
      href: route('stock.mouvements.index'),
    },
    {
      title: 'Sortie Directe',
      href: route('stock.mouvements.direct-out.index'),
    },
    
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sortie Directe de Stock" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-2xl font-bold">Sortie Directe de Stock</CardTitle>
              </CardHeader>
              <CardContent>
                
                <form onSubmit={submit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="product">Produit</Label>
                      <Select
                        onValueChange={(value) => {
                          const product = products.find(p => p.id.toString() === value);
                          setSelectedProduct(product || null);
                          setData('product_id', value);
                          setAllocations([]);
                          setRemaining(0);
                          setNoStockError(null);
                        }}
                        value={data.product_id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem 
                              key={product.id} 
                              value={product.id.toString()}
                              disabled={!product.stocks?.some(s => s.quantite > 0)}
                            >
                              {product.name}
                              {!product.stocks?.some(s => s.quantite > 0) && ' (Stock épuisé)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantité nécessaire</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantityNeeded}
                        onChange={(e) => setQuantityNeeded(Math.max(0, parseInt(e.target.value) || 0))}
                        disabled={!selectedProduct}
                      />
                    </div>
                  </div>

                  {noStockError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{noStockError}</AlertDescription>
                    </Alert>
                  )}

                  {selectedProduct && quantityNeeded > 0 && (
                    <div className="space-y-4">
                      {allocations.length > 0 ? (
                        <>
                          <div className="space-y-2">
                            <Label>Répartition des stocks</Label>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Source</TableHead>
                                  <TableHead>Lot</TableHead>
                                  <TableHead>Expiration</TableHead>
                                  <TableHead>Disponible</TableHead>
                                  <TableHead>À prélever</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {allocations.map((allocation, index) => (
                                  <TableRow key={allocation.stock_id}>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        {allocation.hopital ? (
                                          allocation.hopital.nom
                                        ) : (
                                          <>
                                            <Warehouse className="h-4 w-4 text-blue-500" />
                                            <span>Dépôt central</span>
                                            <Badge variant="outline" className="ml-2">
                                              Central
                                            </Badge>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>{allocation.numero_lot || 'N/A'}</TableCell>
                                    <TableCell>
                                      {allocation.date_expiration 
                                        ? new Date(allocation.date_expiration).toLocaleDateString() 
                                        : 'N/A'}
                                    </TableCell>
                                    <TableCell>{allocation.max}</TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        min="0"
                                        max={allocation.max}
                                        value={allocation.quantity}
                                        onChange={(e) => handleAllocationChange(index, e.target.value)}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              Restant à prélever: <span className="font-bold">{remaining}</span>
                            </div>
                            {remaining === 0 && (
                              <div className="text-sm text-green-600">
                                Quantité totalement allouée
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Pas assez de stock disponible pour ce produit. Stock total: {
                              selectedProduct.stocks?.reduce((sum, stock) => sum + stock.quantite, 0) || 0
                            }
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="reason">Raison</Label>
                          <Input
                            id="reason"
                            value={data.raison}
                            max={255}
                            maxLength={254}
                            onChange={(e) => setData('raison', e.target.value)}
                            placeholder="Raison de la sortie"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Input
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Informations supplémentaires"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={remaining > 0 || processing || allocations.length === 0}
                        className="gap-2"
                      >
                        <Minus className="h-4 w-4" />
                        Enregistrer la sortie
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}