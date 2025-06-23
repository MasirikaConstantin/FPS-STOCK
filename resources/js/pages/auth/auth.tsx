import { Head, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLayout from '@/layouts/auth-layout';
import { toast } from 'sonner';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function AuthCombined() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    //const { toast } = Toaster();
    const { errors: pageErrors, flash, verifyMessage } = usePage<{ flash: { error?: string }; auth: { user: { id: number; name: string; email: string } } }>().props;
    // Gestion des erreurs spécifiques

    useEffect(() => {
        if (flash?.error) {
            //console.log(flash.error);
            //toast("Erreur de connexion");
        }
        const handleResendVerification = () => {
            router.get(route('verification-mail'));
        };

        if (verifyMessage) {
            toast('Email non vérifié', {
                description: typeof verifyMessage === 'string' ? verifyMessage : String(verifyMessage),
                action: {
                    label: 'Vérifier',
                    onClick: handleResendVerification,
                },
            });
        }
    }, [flash, toast]);

    // Login form
    const {
        data: loginData,
        setData: setLoginData,
        post: loginPost,
        processing: loginProcessing,
        errors: loginErrors,
        reset: resetLogin,
    } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    // Register form
    const {
        data: registerData,
        setData: setRegisterData,
        post: registerPost,
        processing: registerProcessing,
        errors: registerErrors,
        reset: resetRegister,
    } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleLogin: FormEventHandler = (e) => {
        e.preventDefault();
        loginPost(route('login'), {
            onFinish: () => resetLogin('password'),
            onError: () => {
             
                if (pageErrors.email) {
                    //toast( "Erreur : " +pageErrors.email);
                }
            },
        });
    };

    const handleResendVerification = () => {
        router.post(
            route('verification.send-to'),
            { email: registerData.email },
            {
                onSuccess: () => toast.success('Un lien de vérification a été envoyé !'),
                onError: (errors) => {
                    if (errors.email) {
                        toast.error(errors.email);
                    } else {
                        toast.error("Erreur lors de l'envoi du email de vérification");
                    }
                },
            },
        );
    };
    const handleRegister: FormEventHandler = (e) => {
        e.preventDefault();
        registerPost(route('register'), {
            onFinish: () => resetRegister('password', 'password_confirmation'),
            onSuccess: () => {
                handleResendVerification();
            },
        });
    };

    return (
        <AuthLayout
            title={activeTab === 'login' ? 'Connexion' : 'Inscription'}
            description={
                activeTab === 'login' ? 'Entrez votre email et mot de passe pour vous connecter' : 'Créez votre compte en remplissant le formulaire'
            }
        >
            <Head title={activeTab === 'login' ? 'Connexion' : 'Inscription'} />
            {flash?.verifyMessage && <InputError message={pageErrors.verifyMessage} />}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Connexion</TabsTrigger>
                    <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="pt-4">
                    <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData('email', e.target.value)}
                                    placeholder="email@exemple.com"
                                    disabled={loginProcessing}
                                />
                                <InputError message={loginErrors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="login-password">Mot de passe</Label>
                                    <TextLink href={route('password.request')} className="ml-auto text-sm">
                                        Mot de passe oublié ?
                                    </TextLink>
                                </div>
                                <Input
                                    id="login-password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData('password', e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loginProcessing}
                                />
                                <InputError message={loginErrors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={loginData.remember}
                                    onClick={() => setLoginData('remember', !loginData.remember)}
                                    disabled={loginProcessing}
                                />
                                <Label htmlFor="remember">Se souvenir de moi</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full" disabled={loginProcessing}>
                                {loginProcessing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Se connecter
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                <TabsContent value="register" className="pt-4">
                    <form className="flex flex-col gap-6" onSubmit={handleRegister}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="register-name">Nom complet</Label>
                                <Input
                                    id="register-name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    value={registerData.name}
                                    onChange={(e) => setRegisterData('name', e.target.value)}
                                    disabled={registerProcessing}
                                    placeholder="Votre nom complet"
                                />
                                <InputError message={registerErrors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                    id="register-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData('email', e.target.value)}
                                    disabled={registerProcessing}
                                    placeholder="email@exemple.com"
                                />
                                <InputError message={registerErrors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="register-password">Mot de passe</Label>
                                <Input
                                    id="register-password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData('password', e.target.value)}
                                    disabled={registerProcessing}
                                    placeholder="••••••••"
                                />
                                <InputError message={registerErrors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="register-password-confirmation">Confirmer le mot de passe</Label>
                                <Input
                                    id="register-password-confirmation"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={registerData.password_confirmation}
                                    onChange={(e) => setRegisterData('password_confirmation', e.target.value)}
                                    disabled={registerProcessing}
                                    placeholder="••••••••"
                                />
                                <InputError message={registerErrors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" disabled={registerProcessing}>
                                {registerProcessing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                S'inscrire
                            </Button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>

            <div className="mt-4 text-center text-sm text-muted-foreground">
                {activeTab === 'login' ? (
                    <>
                        Pas encore de compte ? <TextLink href={route('register')} onClick={() => setActiveTab('register')}>S'inscrire</TextLink>
                    </>
                ) : (
                    <>
                        Déjà un compte ? <TextLink href={route('login')} onClick={() => setActiveTab('login')}>Se connecter</TextLink>
                    </>
                )}
            </div>
        </AuthLayout>
    );
}
