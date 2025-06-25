import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Progress } from '@radix-ui/react-progress';

export default function Profile() {
    const { auth } = usePage().props;
    const fileInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, errors, progress, reset } = useForm({
        avatar: null as File | null,
        phone: auth.user.profile?.phone || '',
        address: auth.user.profile?.address || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('phone', data.phone);
        formData.append('address', data.address);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        post(route('profile.autres.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => reset('avatar'),
            onSuccess: () => toast.success('Informations mises à jour avec succès'),
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('avatar', e.target.files[0]);
        }
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Paramètres de profil',
            href: '/settings/profile',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Paramètres de profil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informations de profil" description="Mise à jour de vos informations personnelles" />

                    <div className="space-y-6">
                        <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                            {/* Avatar Upload */}
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage 
                                        src={data.avatar 
                                            ? URL.createObjectURL(data.avatar)
                                            : auth.user?.avatar_url
                                                ? auth.user.avatar_url
                                                : undefined
                                        } 
                                    />
                                    <AvatarFallback>
                                        {auth.user.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInput.current?.click()}
                                    >
                                        Changer la photo
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInput}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <InputError message={errors.avatar} className="mt-2" />
                                    {progress && (
                                        <>
                                            <Progress value={progress.percentage} maxWidth="200px" className="mt-2"/>
                                            {progress.percentage}%
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="address">Adresse</Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>
                            </div>

                            <Button type="submit" variant={'outline'}>Enregistrer</Button>
                        </form>
                    </div>
                </div>

            </SettingsLayout>
        </AppLayout>
    );
}