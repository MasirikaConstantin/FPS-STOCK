import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Head, Link ,router} from "@inertiajs/react";
import { Permission, UserPermission } from "@/types/permissions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DialogDescription } from "@radix-ui/react-dialog";
import { toast } from "sonner";

interface Props {
    permissions: {
      id: number;
      name: string;
      description: string;
      module: string;
      action: string;
      ref:string;
      users?: {
        id: number;
        name: string;
        email: string;
      }[];
    }[];
    userPermissions?: {
      user_id: number;
      permission_id: number;
      user: {
        id: number;
        name: string;
        email: string;
      };
    }[];
  }
  
export default function Accueil({ permissions, userPermissions }: Props) {
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Accueil',
      href: route('dashboard'),
    },
    {
      title: 'Gestion des Permissions',
      href: route('admin.permissions.index'),
    },
  ];

  const getUsersForPermission = (permissionId: number) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission?.users || [];
  };

  // Version 2: Si vous utilisez userPermissions séparés
  const getUsersForPermissionAlt = (permissionId: number) => {
    if (!userPermissions) return [];
    return userPermissions
      .filter(up => up.permission_id === permissionId)
      .map(up => up.user)
      .filter(Boolean);
  };
  const openUserModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDialogOpen(true);
  };

  const handleDelete = (permissionId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette permission ?')) {
      router.delete(route('admin.permissions.destroy', permissionId), {
        preserveScroll: true,
        onSuccess: () => {
          // Vous pouvez ajouter une notification ici si besoin
          toast.success('Permission supprimée avec succès');
        },
        onError: () => {
          alert('Une erreur est survenue lors de la suppression');
        }
      });
    }
  };
  const getUsers = userPermissions ? getUsersForPermissionAlt : getUsersForPermission;


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestion des Permissions" />


      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button asChild>
                <Link href={route('admin.permissions.create')}>Ajouter une Permission</Link>
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Utilisateurs</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => {
                    const permissionUsers = getUsers(permission.id);
                    return (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">{permission.name}</TableCell>
                      <TableCell>{permission.description}</TableCell>
                      <TableCell>
                        {permissionUsers.length > 0 ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openUserModal(permission)}
                            >
                            Voir {permissionUsers.length} utilisateur(s)
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">Aucun utilisateur</span>
                        )}
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={route('admin.permissions.edit', permission.ref)}>
                            Modifier 
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm"
                              onClick={() => handleDelete(permission.id)}>
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal pour afficher les utilisateurs */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>
                    Utilisateurs avec la permission: {selectedPermission?.name}
                </DialogTitle>
                {/* Ajoutez ce composant Description */}
                <DialogDescription>
                    Liste des utilisateurs ayant cette permission
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                {selectedPermission && getUsersForPermission(selectedPermission.id).map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant="outline">ID: {user.id}</Badge>
                    </div>
                ))}
                </div>
            </DialogContent>
            </Dialog>
      </div>
    </AppLayout>
  );
}