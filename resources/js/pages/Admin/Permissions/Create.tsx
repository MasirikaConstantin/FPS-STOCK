// resources/js/Pages/Admin/Permissions/Create.tsx
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Props {
    models: string[];
    defaultPermissions: Record<string, string>;
}

export default function CreatePermission({ models, defaultPermissions }: Props) {
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        model: '',
        permissions: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.permissions.store'), {
            onSuccess: () => {
                toast.success('Permission créée avec succès');
                router.visit(route('admin.permissions.index'));
            },
            onError: () => 
                toast.error('Une erreur est survenue lors de la création'),
        });
    };

    const generatePermissions = () => {
      if (!selectedModel) return [];
      
      // Convertit le modèle en format de table (minuscules avec 's')
      const tableName = selectedModel.toLowerCase() + 's';
      
      return Object.entries(defaultPermissions).map(([action, label]) => ({
          name: `${tableName}.${action}`,
          description: `${label} ${tableName}`,
          action,
          module: tableName
      }));
  };
    const breadcrumbs: BreadcrumbItem[] = [
      {
        title: 'Accueil',
        href: route('dashboard'),
      },
      {
        title: 'Gestion des Permissions',
        href: route('admin.permissions.index'),
      },
      {
        title: 'Créer des Permissions',
        href: route('admin.permissions.create'),
      },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer des Permissions" />
            
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nouvelles Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="">
                  <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                          <Label htmlFor="model">Modèle</Label>
                          <Select 
                              onValueChange={(value) => {
                                  setSelectedModel(value);
                                  setData('model', value);
                              }}
                              value={selectedModel}
                          >
                              <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez un modèle" />
                              </SelectTrigger>
                              <SelectContent>
                                  {(Array.isArray(models) ? models : Object.values(models)).map(model => (
                                    <SelectItem key={model} value={model}>
                                      {model}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>

                      {selectedModel && (
                          <div className="space-y-4">
                              <Label>Permissions à générer</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {generatePermissions().map(permission => (
                                      <div key={permission.name} className="flex items-center space-x-2 p-3 border rounded">
                                          <input
                                              type="checkbox"
                                              id={`perm-${permission.name}`}
                                              checked={selectedPermissions.includes(permission.name)}
                                              onChange={(e) => {
                                                  const newPermissions = e.target.checked
                                                      ? [...selectedPermissions, permission.name]
                                                      : selectedPermissions.filter(p => p !== permission.name);
                                                  setSelectedPermissions(newPermissions);
                                                  setData('permissions', newPermissions);
                                              }}
                                              className="rounded text-indigo-600"
                                          />
                                          <label htmlFor={`perm-${permission.name}`} className="text-sm">
                                              <span className="font-medium block">{permission.name}</span>
                                              <span className="text-gray-500">{permission.description}</span>
                                          </label>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      <Button type="submit" disabled={processing || !selectedModel || selectedPermissions.length === 0}>
                          {processing ? 'Création...' : 'Créer les Permissions'}
                      </Button>
                  </form>
                  </div>
                </CardContent>
              </Card>
            </div>
        </AppLayout>
    );
}