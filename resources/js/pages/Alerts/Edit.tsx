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
    title: 'Modifier une Alerte',
    href: '#',
  },
];

export default function Edit({ alert, hopitals, medicalProduits, types, priorities }: any) {
  const { data, setData, put, processing, errors } = useForm({
    type: alert.type,
    priorite: alert.priorite,
    titre: alert.titre,
    message: alert.message,
    hopital_id: alert.hopital_id,
    medical_produit_id: alert.medical_produit_id,
    is_resolved: alert.is_resolved,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('alerts.update', alert.ref));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Modifier une Alerte" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Modifier l'Alerte {alert.ref}</CardTitle>
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
                      value={data.hopital_id}
                      onValueChange={(value) => setData('hopital_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un hôpital" />
                      </SelectTrigger>
                      <SelectContent>
                        {hopitals.map((hopital: any) => (
                          <SelectItem key={hopital.id} value={hopital.id}>
                            {hopital.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.hopital_id && <p className="text-sm text-red-500">{errors.hopital_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medical_produit_id">Produit Médical (Optionnel)</Label>
                    <Select
                      value={data.medical_produit_id}
                      onValueChange={(value) => setData('medical_produit_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicalProduits.map((produit: any) => (
                          <SelectItem key={produit.id} value={produit.id}>
                            {produit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.medical_produit_id && (
                      <p className="text-sm text-red-500">{errors.medical_produit_id}</p>
                    )}
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

                  <div className="space-y-2">
                    <Label htmlFor="is_resolved">Statut</Label>
                    <Select
                      value={data.is_resolved ? 'true' : 'false'}
                      onValueChange={(value) => setData('is_resolved', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">En attente</SelectItem>
                        <SelectItem value="true">Résolue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={route('alerts.show', alert.ref)}>Annuler</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  Enregistrer les modifications
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}