import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem, User } from '@/types';
import { Eye, PencilIcon, PlusIcon, TrashIcon, UserCheck, UserPlusIcon } from 'lucide-react';
import { useState } from 'react';
import DeleteUserDialog from '@/components/DeleteUserDialog';
//import DeleteUserDialog from '@/components/delete-user-dialog';

interface IndexProps extends PageProps {
    users: User[];
    canCreate: boolean;
}

export default function Index({ users, canCreate }: IndexProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Utilisateurs',
            href: route('users.index'),
        },
    ];

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Utilisateurs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Utilisateurs</CardTitle>
                                    <CardDescription>Liste de tous les utilisateurs du système</CardDescription>
                                </div>
                                {canCreate && (
                                    <div className="flex gap-2">
                                        <Button asChild>
                                            <Link href={route('users.create')}>
                                                <UserPlusIcon className="mr-2 h-4 w-4" />
                                                Nouvel utilisateur
                                            </Link>
                                        </Button>

                                        <Button asChild>
                                            <Link href={route('admin.permissions.create')}>
                                                <PlusIcon className="mr-2 h-4 w-4" />
                                                Nouvelle permission
                                            </Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href={route('admin.permissions.assign')}>
                                                <UserCheck className="mr-2 h-4 w-4" />
                                                Assigner des Permissions
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rôle</TableHead>
                                        <TableHead>Hôpital</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-3">
                                                    {user.avatar && (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            className="h-8 w-8 rounded-full"
                                                        />
                                                    )}
                                                    <span>{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 'admin_central' ? 'default' : 'outline'}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.profile?.hopital?.nom || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                                    {user.is_active ? 'Actif' : 'Inactif'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={route('users.edit', user.ref as string)}>
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button size="sm"  variant="link" asChild>
                                                    <Link href={route('users.show', user.ref as string)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDeleteClick(user)}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DeleteUserDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                user={selectedUser}
            />
        </AppLayout>
    );
}