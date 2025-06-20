import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface Permission {
    id: number;
    name: string;
    action: string;
    description: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    users: User[];
    permissions: Record<string, Permission[]>;
    current_permissions: Record<string, { permission_id: number }[]>;
}

export default function PermissionAssignment({ users, permissions, current_permissions }: Props) {
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    const { data, setData, post, processing } = useForm({
        user_id: null as number | null,
        permissions: [] as number[],
    });

    // Synchroniser les données du formulaire avec l'état local
    useEffect(() => {
        setData({
            user_id: selectedUser,
            permissions: selectedPermissions,
        });
    }, [selectedUser, selectedPermissions]);

    const handleUserChange = (userId: string) => {
        const id = userId ? parseInt(userId) : null;
        setSelectedUser(id);

        if (id) {
            const userPerms = current_permissions[id] || [];
            setSelectedPermissions(userPerms.map(p => p.permission_id));
        } else {
            setSelectedPermissions([]);
        }
    };

    const handlePermissionToggle = (permissionId: number) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedUser) {
            // Afficher une erreur si aucun utilisateur n'est sélectionné
            return;
        }

        post(route('admin.permissions.assign'), {
            preserveScroll: true,
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
            title: 'Attribuer des Permissions',
            href: route('admin.permissions.assign'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Permissions" />

            <div className="py-12 space-y-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sélectionner un Utilisateur</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select 
                                onValueChange={handleUserChange} 
                                value={selectedUser?.toString() || ''}
                                required
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner un utilisateur" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name} <Badge variant="secondary" className="ml-2">{user.email}</Badge>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {selectedUser && (
                        <form onSubmit={handleSubmit}>
                            <Card className='mt-6'>
                                <CardHeader>
                                    <CardTitle>Permissions Disponibles</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {Object.entries(permissions).map(([module, modulePermissions]) => (
                                        <div key={module} className="space-y-4">
                                            <Label className="text-lg capitalize">{module}</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {modulePermissions.map(permission => (
                                                    <div key={permission.id} className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={`perm-${permission.id}`}
                                                            checked={selectedPermissions.includes(permission.id)}
                                                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                        />
                                                        <Label htmlFor={`perm-${permission.id}`} className="space-y-1">
                                                            <div className="font-medium capitalize">{permission.action}</div>
                                                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="submit"
                                        disabled={processing || selectedPermissions.length === 0}
                                        className="w-full sm:w-auto"
                                    >
                                        {processing ? 'Enregistrement...' : 'Enregistrer les Permissions'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}