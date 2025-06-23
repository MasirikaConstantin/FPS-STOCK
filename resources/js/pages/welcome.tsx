import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center ">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-3 pb-6  leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 font-medium">Bienvenue à la plateforme de Gestion de FPS</h1>
                            
                            <div >
                            {auth.user ? (
                                <>
                                <p>Vous êtes connecté en tant que {auth.user.name}</p>
                                <br />
                                <Button asChild variant={'secondary'}>
                                    <Link
                                        href={route('dashboard')}
                                        className=""
                                    >
                                        Tableau de bord
                                    </Link>
                                </Button>
                                </>
                            
                        ) : (
                            <div className="flex gap-2 mt-6">
                            
                                <Button asChild variant={'secondary'}>
                                    <Link
                                        href={route('login')}
                                        className=""
                                    >
                                        Se connecter
                                    </Link>
                                </Button>
                                <Button asChild variant={'outline'}>
                                    <Link
                                        href={route('register')}
                                        className=""
                                    >
                                        S'inscrire
                                    </Link>
                                </Button>
                            </div>
                        )}
                            </div>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg  lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg bg-amber-100">
                            
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                            <img src="/images/logo.png" alt="" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
