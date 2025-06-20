import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BreadcrumbItem } from "@/types";

export default function EditPermissionManual({ permission }) {
  const { data, setData, put, processing, errors } = useForm({
    name: permission.name,
    description: permission.description || "",
    module: permission.module,
    action: permission.action,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("admin.permissions.update", permission.id),{
        onSuccess: () => {
            toast.success("Permission modifiée avec succès !");
        }
    });
    
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
        title: 'Modifier La Permission',
        href: route('admin.permissions.edit', permission.id),
    },
];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Modifier Permission" />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Modifier la Permission</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ Nom */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la permission</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="ex: create-user"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Champ Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              placeholder="Décrivez cette permission..."
              className="resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Champs Module et Action */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="module">Module</Label>
              <Input
                id="module"
                value={data.module}
                onChange={(e) => setData("module", e.target.value)}
                placeholder="ex: users"
              />
              {errors.module && (
                <p className="text-sm text-red-500">{errors.module}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Input
                id="action"
                value={data.action}
                onChange={(e) => setData("action", e.target.value)}
                placeholder="ex: create"
              />
              {errors.action && (
                <p className="text-sm text-red-500">{errors.action}</p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={processing}>
            {processing ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}