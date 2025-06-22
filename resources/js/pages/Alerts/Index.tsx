import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { AlertTriangle, Bell, Check, CircleAlert, Clock,  Info } from 'lucide-react';

const typeIcons = {
  stock_faible: <AlertTriangle className="h-4 w-4" />,
  avertissement_expiration: <Clock className="h-4 w-4" />,
  expire: <CircleAlert className="h-4 w-4" />,
  demande_transfert: <Bell className="h-4 w-4" />,
  systeme: <Info className="h-4 w-4" />,
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Gestion des Alertes',
    href: '/alerts',
  },
];

export default function Index({ alerts, filters, types, priorities }: any) {
  const handleFilter = (field: string, value: string | boolean) => {
    router.get('/alerts', { ...filters, [field]: value }, { preserveState: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestion des Alertes" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-2xl font-bold">Liste des Alertes</CardTitle>
              <Button asChild>
                <Link href={route('alerts.create')}>Créer une Alerte</Link>
              </Button>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Input
                  placeholder="Rechercher..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilter('search', e.target.value)}
                />
                <Select
                    value={filters.type || undefined}  // Use undefined instead of empty string
                    onValueChange={(value) => handleFilter('type', value)}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Type d'alerte" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>  {/* Changed from "" to "all" */}
                        {Object.entries(types).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <Select
                        value={filters.priorite || undefined}
                        onValueChange={(value) => handleFilter('priorite', value)}
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Priorité" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les priorités</SelectItem>  {/* Changed from "" to "all" */}
                            {Object.entries(priorities).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <Select
                            value={filters.is_resolved === undefined ? undefined : filters.is_resolved.toString()}
                            onValueChange={(value) => handleFilter('is_resolved', value === 'true')}
                            >
                            <SelectTrigger>
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>  {/* Changed from "" to "all" */}
                                <SelectItem value="false">Non résolues</SelectItem>
                                <SelectItem value="true">Résolues</SelectItem>
                            </SelectContent>
                            </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Hôpital</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.data.map((alert: any) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={typeColors[alert.type]}>
                            {typeIcons[alert.type]}
                          </span>
                          <span>{types[alert.type]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{alert.titre}</TableCell>
                      <TableCell>{alert.hopital.nom}</TableCell>
                      <TableCell>
                        <Badge className={priorityColors[alert.priorite]}>
                          {priorities[alert.priorite]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {alert.is_resolved ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="h-4 w-4 mr-1" /> Résolue
                          </Badge>
                        ) : (
                          <Badge variant="destructive">En attente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(alert.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={route('alerts.show', alert.ref)}>Détails</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            {alerts.links && (
              <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Affichage de {alerts.from} à {alerts.to} sur {alerts.total} alertes
                </div>
                <div className="flex space-x-2">
                  {alerts.links.map((link: any, index: number) => (
                    <Button
                      key={index}
                      variant={link.active ? 'default' : 'outline'}
                      size="sm"
                      asChild
                      disabled={!link.url}
                    >
                      <Link href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                    </Button>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}