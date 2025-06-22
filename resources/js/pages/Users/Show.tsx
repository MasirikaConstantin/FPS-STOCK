import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { CheckCircle2Icon, PencilIcon, TrashIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';
import DeleteUserDialog from '@/components/DeleteUserDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ShowProps extends PageProps {
    user: User;
    canEdit: boolean;
    createdBy: User;
    updatedBy: User;
}

export default function Show({ user, canEdit }: ShowProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    console.log(user);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Utilisateurs',
            href: route('users.index'),
        },
        {
            title: user.name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={user.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="h-24 w-24 rounded-full"
                                            />
                                        ) : (
                                            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                                                <UserIcon className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                        <Badge
                                            variant={user.is_active ? 'default' : 'destructive'}
                                            className="absolute -bottom-2 -right-2"
                                        >
                                            {user.is_active ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </div>
                                    <div className="text-center">
                                        <CardTitle>{user.name}</CardTitle>
                                        <CardDescription>{user.email}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex justify-center space-x-2">
                                {canEdit && (
                                    <>
                                        <Button variant="outline" asChild>
                                            <Link href={route('users.edit', user.ref)}>
                                                <PencilIcon className="mr-2 h-4 w-4" />
                                                Modifier
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => setDeleteDialogOpen(true)}
                                        >
                                            <TrashIcon className="mr-2 h-4 w-4" />
                                            Supprimer
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Informations</CardTitle>
                                <CardDescription>Détails du profil utilisateur</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Rôle</h4>
                                            <Badge variant={user.role === 'admin_central' ? 'default' : 'outline'}>
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Hôpital</h4>
                                            <p>{user.profile?.hopital?.nom || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Téléphone</h4>
                                            <p>{user.profile?.phone || '-'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Dernière connexion</h4>
                                            <p>
                                                {user.last_login_at
                                                    ? new Date(user.last_login_at).toLocaleString()
                                                    : 'Jamais'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Adresse</h4>
                                        <p>{user.profile?.address || '-'}</p>
                                    </div>
                                    {user.created_by ? (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Créé par</h4>
                                            <p>{user.created_by?.name}</p>
                                            {user.created_by?.avatar ?(
                                                <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                                <AvatarFallback>CN</AvatarFallback>
                                              </Avatar>
                                            )
                                            : (
                                                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <UserIcon className="h-3 w-3 text-gray-400" />
                                                </div>
                                            )
                                            } 
                                        </div>
                                    ) : null}
                                    {user.updated_by ?  (
                                        <div>
                                        <h4 className="text-sm font-medium text-gray-500">Modifier par</h4>
                                        <p>{user.updated_by?.name}</p>
                                        {user.updated_by?.avatar ?(
                                            <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                          </Avatar>
                                        )
                                        : (
                                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                <UserIcon className="h-3 w-3 text-gray-400" />
                                            </div>
                                        )
                                        } 
                                    </div>
                                    ) : null}
                                </div>
                            </CardContent>
                        </Card>

                        {!user.email_verified_at && (
                            <Alert>
                                <CheckCircle2Icon />
                                <AlertTitle>Vérification requise</AlertTitle>
                                <AlertDescription>
                                    Veuillez vérifier votre adresse e-mail pour activer votre compte. Un lien de confirmation vous a été envoyé.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>

            <DeleteUserDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                user={user}
            />
        </AppLayout>
    );
}