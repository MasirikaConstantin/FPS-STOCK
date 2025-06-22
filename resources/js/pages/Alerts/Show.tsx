import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { AlertTriangle, Bell, Check, Clock, CircleAlert, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const typeIcons = {
  stock_faible: <AlertTriangle className="h-5 w-5" />,
  avertissement_expiration: <Clock className="h-5 w-5" />,
  expire: <CircleAlert className="h-5 w-5" />,
  demande_transfert: <Bell className="h-5 w-5" />,
  systeme: <Info className="h-5 w-5" />,
};

const typeColors = {
  stock_faible: 'bg-amber-100 text-amber-800',
  avertissement_expiration: 'bg-blue-100 text-blue-800',
  expire: 'bg-red-100 text-red-800',
  demande_transfert: 'bg-purple-100 text-purple-800',
  systeme: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  faible: 'bg-gray-100 text-gray-800',
  moyen: 'bg-blue-100 text-blue-800',
  eleve: 'bg-amber-100 text-amber-800',
  critique: 'bg-red-100 text-red-800',
};

export default function Show({ alert, types, priorities, auth }: any) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Gestion des Alertes',
      href: '/alerts',
    },
    {
      title: `Alerte ${alert.ref}`,
      href: `/alerts/${alert.ref}`,
    },
  ];
const handleResolve = () => {
    router.post(
      route('alerts.resolve', alert.ref),
      { preserveScroll: true },
      {
        onSuccess: () => {
          toast.success('Alerte marquée comme résolue avec succès.');
        },
      }
    );
}


const confirmDelete = () => {
    router.delete(route('alerts.destroy', alert.ref), {
        preserveScroll: true,
        onSuccess: () => {
            toast.success('Alerte supprimée avec succès');
            setDeleteDialogOpen(false);
        },
        onError: () => {
            toast.error('Une erreur est survenue lors de la suppression');
        },
        onFinish: () => {},
    });
};
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Détails de l'Alerte ${alert.ref}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Alerte {alert.ref}</h1>
            <div className="flex gap-2">
              <Badge className={typeColors[alert.type]}>
                {types[alert.type]}
              </Badge>
              <Badge className={priorityColors[alert.priorite]}>
                {priorities[alert.priorite]}
              </Badge>
              {alert.is_resolved ? (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="h-4 w-4 mr-1" /> Résolue
                </Badge>
              ) : (
                <Badge variant="destructive">En attente</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Détails de l'Alerte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${typeColors[alert.type]}`}>
                    {typeIcons[alert.type]}
                  </div>
                  <div>
                    <h3 className="font-medium">{alert.titre}</h3>
                    <p className="text-sm text-muted-foreground">
                      Créée le {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="whitespace-pre-line">{alert.message}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations supplémentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hôpital</p>
                  <p>{alert.hopital.nom}</p>
                </div>

                {alert.medical_produit && (
                  <div>
                    <p className="text-sm text-muted-foreground">Produit Médical</p>
                    <p>{alert.medical_produit.name}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Créée par</p>
                  <p>{alert.user.name}</p>
                </div>

                {alert.is_resolved && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Résolue par</p>
                      <p>{alert.resolved_by.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date de résolution</p>
                      <p>{new Date(alert.resolved_at).toLocaleString()}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={route('alerts.index')}>Retour à la liste</Link>
            </Button>
            {!alert.is_resolved && (
<>

            <Button asChild>
              <Link href={route('alerts.edit', alert.ref)}>Modifier</Link>
            </Button>
              <Button variant="secondary" onClick={handleResolve}>
                Marquer comme résolue
              </Button>
              {
                (alert.user_id == auth.user.id) && (
                  <Button variant="destructive" onClick={confirmDelete}>
                    Annuler le transfert
                  </Button>
                )
              }
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}