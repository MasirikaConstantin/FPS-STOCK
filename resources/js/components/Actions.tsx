import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, FileText, Search, Package, AlertTriangle } from 'lucide-react';
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export const QuickActions = () => {
    const { auth } = usePage().props;
    const userRole = auth.user.role;
    const getItemActions = (userRole: string) => {
    const Allactions = [
      {
        title: 'Entrée de stock',
        description: 'Enregistrer une livraison',
        icon: Plus,
        roles : ["admin_central"],

        color: 'bg-green-500/90 hover:bg-green-600 text-white',
        action: () => router.visit('/stocks/create')
      },
      {
        title: 'Sortie de stock',
        description: 'Consommation/vente',
        roles : ["admin_central", 'admin', 'medecin', 'pharmacien','magasinier'],
        icon: Minus,
        color: 'bg-red-500/90 hover:bg-red-600 text-white',
        action: () => router.visit('/stock/mouvements/')
      },
      {
        title: 'Stock',
        roles : ["admin_central", 'admin', 'medecin', 'pharmacien','magasinier'],
        description: 'Compter les stocks',
        icon: Package,
        color: 'bg-blue-500/90 hover:bg-blue-600 text-white',
        action: () => auth.user.role === 'admin_central' ? router.visit('/stock/entree/activite') : router.visit('/stocks')
      },
      {
        title: 'Rechercher',
        description: 'Trouver un article',
        roles : ["admin_central", 'admin', 'medecin', 'pharmacien','magasinier'],
        icon: Search,
        color: 'bg-slate-500/90 hover:bg-slate-600 text-white',
        action: () => console.log('Rechercher')
      },
      {
        title: 'Rapport',
        description: 'Générer un rapport',
        roles : ["admin_central", 'admin', 'medecin', 'pharmacien','magasinier'],
        icon: FileText,
        color: 'bg-purple-500/90 hover:bg-purple-600 text-white',
        action: () => console.log('Rapport')
      },
      {
        title: 'Alertes',
        description: 'Gérer les alertes',
        icon: AlertTriangle,
        roles : ["admin_central", 'admin', 'medecin', 'pharmacien','magasinier'],
        color: 'bg-orange-500/90 hover:bg-orange-600 text-white',
        action: () => router.visit('/alerts/')
      }
    ];
return Allactions.filter(item => item.roles?.includes(userRole));

  }
  

const actions = getItemActions(userRole);

  return (
    
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all border border-border/30 hover:border-primary/30"
                onClick={action.action}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left space-y-0.5">
                    <div className="font-medium text-foreground">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};