import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Gestion des Alertes',
    href: '/alerts',
  },
  {
    title: 'Créer une Alerte',
    href: '/alerts/create',
  },
];

export default function Create({ hopitals, medicalProduits, types, priorities }: any) {
  const { data, setData, post, processing, errors } = useForm({
    type: 'stock_faible',
    priorite: 'moyen',
    titre: '',
    message: '',
    hopital_id: '',
    medical_produit_id: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('alerts.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Créer une Alerte" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Créer une Alerte</CardTitle>
            </CardHeader>
            <form onSubmit={submit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'alerte</Label>
                    <Select
                      value={data.type}
                      onValueChange={(value) => setData('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(types).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priorite">Priorité</Label>
                    <Select
                      value={data.priorite}
                      onValueChange={(value) => setData('priorite', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(priorities).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.priorite && <p className="text-sm text-red-500">{errors.priorite}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="titre">Titre</Label>
                    <Input
                      id="titre"
                      value={data.titre}
                      onChange={(e) => setData('titre', e.target.value)}
                    />
                    {errors.titre && <p className="text-sm text-red-500">{errors.titre}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hopital_id">Hôpital</Label>
                    <Select
                        value={data.hopital_id?.toString()}  // Convert to string if it's a number
                        onValueChange={(value) => setData('hopital_id', value)}
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un hôpital">
                            {data.hopital_id 
                                ? hopitals.find(h => h.id.toString() === data.hopital_id.toString())?.nom
                                : null}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {hopitals.map((hopital: any) => (
                            <SelectItem key={hopital.id} value={hopital.id.toString()}>  {/* Ensure string value */}
                                {hopital.nom}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medical_produit_id">Produit Médical (Optionnel)</Label>
                    <Select
                        value={data.medical_produit_id?.toString()}
                        onValueChange={(value) => setData('medical_produit_id', value)}
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un produit">
                            {data.medical_produit_id
                                ? medicalProduits.find(p => p.id.toString() === data.medical_produit_id.toString())?.name
                                : null}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {medicalProduits.map((produit: any) => (
                            <SelectItem key={produit.id} value={produit.id.toString()}>
                                {produit.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={data.message}
                      onChange={(e) => setData('message', e.target.value)}
                      rows={5}
                    />
                    {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-2">
                <Button variant="outline" asChild>
                  <Link href={route('alerts.index')}>Annuler</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  Créer l'Alerte
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}