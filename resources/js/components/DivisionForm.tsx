// resources/js/Components/DivisionForm.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface DivisionFormProps {
    division?: {
        id: number;
        nom: string;
        type: string;
        code?: string;
        parent_id?: number;
        is_active: boolean;
    };
    types: string[];
    parents: Array<{
        id: number;
        nom: string;
        type: string;
    }>;
    isEdit?: boolean;
}

export function DivisionForm({ division, types, parents, isEdit = false }: DivisionFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        nom: division?.nom || '',
        type: division?.type || 'province',
        code: division?.code || '',
        parent_id: division?.parent_id || null,
        is_active: division?.is_active ?? true,
    });

    const getParentTypesFor = (childType: string): string[] => {
        const hierarchy: Record<string, string[]> = {
            province: [],
            territoire: ['province'],
            ville: ['province', 'territoire'], // Ville peut appartenir à province OU territoire
            commune: ['ville'],
            quartier: ['commune']
        };
        
        return hierarchy[childType] || [];
    };

    const filteredParents = parents.filter(parent => {
        const allowedParentTypes = getParentTypesFor(data.type);
        return allowedParentTypes.includes(parent.type);
    });

    const shouldDisableParentSelect = data.type === 'province' || filteredParents.length === 0;

    const getParentPlaceholder = () => {
        if (data.type === 'province') return 'Les provinces n\'ont pas de parent';
        if (filteredParents.length === 0) return 'Aucun parent disponible pour ce type';
        return 'Sélectionnez une division parente';
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && division) {
            put(route('divisions.update', division.id), {
                onSuccess: () => toast.success('Division mise à jour avec succès'),
            });
        } else {
            post(route('division.store'), {
                onSuccess: () => toast.success('Division créée avec succès'),
            });
        }
    };

    return (
        <form onSubmit={onSubmit} id="division-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                        id="nom"
                        value={data.nom}
                        onChange={(e) => setData('nom', e.target.value)}
                        placeholder="Nom de la division"
                        required
                    />
                    {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                        value={data.type}
                        onValueChange={(value) => setData('type', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                            {types.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input
                        id="code"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        placeholder="Code unique (optionnel)"
                    />
                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="parent_id">Division parente</Label>
                    <Select
                        value={data.parent_id?.toString() || ''}
                        onValueChange={(value) => setData('parent_id', value ? parseInt(value) : null)}
                        disabled={shouldDisableParentSelect}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={getParentPlaceholder()} />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredParents.map((parent) => (
                                <SelectItem key={parent.id} value={parent.id.toString()}>
                                    {parent.nom} ({parent.type})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.parent_id && <p className="text-sm text-red-500">{errors.parent_id}</p>}
                </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
                <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked)}
                />
                <Label htmlFor="is_active">Actif</Label>
            </div>
        </form>
    );
}