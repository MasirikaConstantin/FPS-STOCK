import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function VerifyEmail() {
    const [showAlert, setShowAlert] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    const { flash } = usePage<{ props: { flash: { success?: string } } }>().props as unknown as { flash: { success?: string } };
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
            setShowAlert(true);
        }
    }, [flash.success]);

    return (
        <AuthLayout title="Vérification d'email" description="Entrez votre email pour recevoir un lien de vérification">
            <Head title="Vérification d'email" />
            {errors.email && (
                <Alert variant="destructive">
                    <AlertTitle>Erreur compte mail</AlertTitle>
                    <AlertDescription>L'adresse email que vous avez fournie n'existe pas.</AlertDescription>
                </Alert>
            )}

            {showAlert && (
                <Alert className="green-600">
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>
                        Adresse email envoyé avec success
                        <br />
                        Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification.
                        <br />
                        Ou vérifier votre dossier spam.
                    </AlertDescription>
                </Alert>
            )}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    post(route('verification.send-to'), {
                        onError: () => {
                            if (errors.email) {
                                toast.error(errors.email);
                            }
                        },
                    });
                }}
                className="space-y-4"
            >
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="votre@email.com"
                    />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    Envoyer le lien de vérification
                </Button>
            </form>

            <div className="mt-4 text-center text-sm">
                Déjà vérifié?{' '}
                <a href={route('login')} className="text-primary underline">
                    Se connecter
                </a>
            </div>
        </AuthLayout>
    );
}
