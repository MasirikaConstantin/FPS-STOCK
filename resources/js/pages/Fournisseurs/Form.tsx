import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { BadgeCheckIcon, CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FournisseurFormProps {
    fournisseur?: {
        id?: number;
        ref?: string;
        nom: string;
        contact_person: string;
        phone: string;
        email: string;
        address: string;
        specialties: string[];
        is_active: boolean;
        contract_start_date: string;
        contract_end_date: string;
    };
}

const specialtiesOptions = [
    { value: 'medicaments', label: 'Médicaments' },
    { value: 'equipements', label: 'Équipements médicaux' },
    { value: 'consommables', label: 'Consommables médicaux' },
    { value: 'mobilier', label: 'Mobilier médical' },
    { value: 'services', label: 'Services médicaux' },
    { value: 'logiciels', label: 'Logiciels médicaux' },
];

export default function Form({ fournisseur }: PageProps<FournisseurFormProps>) {
    const { data, setData, errors, post, put, processing } = useForm({
        nom: fournisseur?.nom || '',
        contact_person: fournisseur?.contact_person || '',
        phone: fournisseur?.phone || '',
        email: fournisseur?.email || '',
        address: fournisseur?.address || '',
        specialties: fournisseur?.specialties || [],
        is_active: fournisseur?.is_active ?? true,
        contract_start_date: fournisseur?.contract_start_date || null,
        contract_end_date: fournisseur?.contract_end_date || null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Fournisseurs',
            href: '/fournisseurs',
        },
        {
            href: fournisseur ? `/fournisseurs/${fournisseur.ref}` : '',
            title: fournisseur ? 'Modifier Fournisseur' : 'Créer Fournisseur',
        },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (fournisseur) {
            put(route('fournisseurs.update', fournisseur.ref));
        } else {
            post(route('fournisseurs.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={fournisseur ? 'Modifier Fournisseur' : 'Créer Fournisseur'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">{fournisseur ? 'Modifier Fournisseur' : 'Créer Fournisseur'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nom">Nom *</Label>
                                        <Input
                                            id="nom"
                                            value={data.nom}
                                            onChange={(e) => setData('nom', e.target.value)}
                                            placeholder="Nom du fournisseur"
                                        />
                                        {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_person">Personne de contact</Label>
                                        <Input
                                            id="contact_person"
                                            value={data.contact_person}
                                            onChange={(e) => setData('contact_person', e.target.value)}
                                            placeholder="Nom du contact"
                                        />
                                        {errors.contact_person && (
                                            <p className="text-sm text-red-500">{errors.contact_person}</p>
                                        )}
                                    </div>

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
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Email"
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Adresse</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Adresse complète"
                                        />
                                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="specialties">Spécialités</Label>
                                        <Select
                                            value=""
                                            onValueChange={(value) => {
                                                if (value && !data.specialties.includes(value)) {
                                                    setData('specialties', [...data.specialties, value]);
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Ajouter une spécialité" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {specialtiesOptions.map((option) => (
                                                    <SelectItem 
                                                        key={option.value} 
                                                        value={option.value}
                                                        disabled={data.specialties.includes(option.value)}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {data.specialties.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {data.specialties.map((specialty) => {
                                                    const option = specialtiesOptions.find(opt => opt.value === specialty);
                                                    return (
                                                        <Badge key={specialty} variant="secondary" className="px-3 py-1">
                                                            {option?.label || specialty}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setData('specialties', data.specialties.filter(s => s !== specialty));
                                                                }}
                                                                className="ml-2 text-xs"
                                                            >
                                                                ×
                                                            </button>
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Date de début de contrat</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {data.contract_start_date
                                                        ? new Date(data.contract_start_date).toLocaleDateString()
                                                        : 'Sélectionner une date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={data.contract_start_date ? new Date(data.contract_start_date) : undefined}
                                                    onSelect={(date) =>
                                                        setData('contract_start_date', date?.toISOString() || null)
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.contract_start_date && (
                                            <p className="text-sm text-red-500">{errors.contract_start_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Date de fin de contrat</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {data.contract_end_date
                                                        ? new Date(data.contract_end_date).toLocaleDateString()
                                                        : 'Sélectionner une date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={data.contract_end_date ? new Date(data.contract_end_date) : undefined}
                                                    onSelect={(date) =>
                                                        setData('contract_end_date', date?.toISOString() || null)
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.contract_end_date && (
                                            <p className="text-sm text-red-500">{errors.contract_end_date}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                                        />
                                        <Label htmlFor="is_active">Actif</Label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button asChild variant="outline">
                                        <Link href={route('fournisseurs.index')}>Annuler</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {fournisseur ? 'Mettre à jour' : 'Créer'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                            </CardContent>
                        </Card>
                        
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}