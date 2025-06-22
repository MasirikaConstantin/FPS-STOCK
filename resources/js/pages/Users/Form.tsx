import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { App, PageProps } from '@/types/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {  Role } from '@/types/types';

interface FormProps extends PageProps {
    user?: {
        id: number;
        name: string;
        email: string;
        role: Role;
        is_active: boolean;
        profile?: {
            phone?: string;
            address?: string;
            hopital_id?: number;
        };
    };
    hopitals: App.Hopital[];
    roles: Role[];
}

export default function Form({ user, hopitals, roles }: FormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role: user?.role || 'admin',
        phone: user?.profile?.phone || '',
        address: user?.profile?.address || '',
        hopital_id: user?.profile?.hopital_id || undefined,
        is_active: user?.is_active ?? true,
    });
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            put(route('users.update', user.id), {
                onSuccess: () => toast.success('Utilisateur mis à jour avec succès'),
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => toast.success('Utilisateur créé avec succès'),
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Utilisateurs',
            href: route('users.index'),
        },
        {
            title: user ? 'Modifier utilisateur' : 'Nouvel utilisateur',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={user ? 'Modifier utilisateur' : 'Nouvel utilisateur'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{user ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}</CardTitle>
                            <CardDescription>
                                Remplissez les champs ci-dessous pour {user ? 'modifier' : 'créer'} un utilisateur
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={onSubmit}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom complet</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Nom complet"
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Email"
                                            required
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                    </div>
                                </div>

                                {!user && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Mot de passe</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Mot de passe"
                                                required={!user}
                                            />
                                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirmation</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirmez le mot de passe"
                                                required={!user}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Rôle</Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={(value) => setData('role', value as Role)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez un rôle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {role}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hopital_id">Hôpital</Label>
                                        <Select
                                            value={data.hopital_id?.toString() || ''}
                                            onValueChange={(value) => setData('hopital_id', value ? parseInt(value) : undefined)}
                                            disabled={data.role === 'admin_central'}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez un hôpital" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hopitals.map((hopital) => (
                                                    <SelectItem key={hopital.id} value={hopital.id.toString()}>
                                                        {hopital.nom}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.hopital_id && <p className="text-sm text-red-500">{errors.hopital_id}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="Numéro de téléphone"
                                        />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Adresse</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Adresse"
                                        />
                                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Actif</Label>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between mt-4">
                                <Button variant="outline" asChild>
                                    <Link href={route('users.index')}>Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {user ? 'Mettre à jour' : 'Créer'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}