import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/types/types';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
}

export default function DeleteUserDialog({ open, onOpenChange, user }: DeleteUserDialogProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (!user) return;
        
        destroy(route('users.destroy', user.id), {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Supprimer l'utilisateur</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer l'utilisateur {user?.name} ? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                        Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}