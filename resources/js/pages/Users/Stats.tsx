import { Card } from "@/components/ui/card";
import { PageProps } from "@/types/types";
import { Head, Link } from "@inertiajs/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserStats {
    id: number;
    name: string;
    email: string;
    total_alertes_crees: number;
    alertes_resolues: number;
    mouvements_stock_crees: number;
    transferts_inities: number;
    produits_ajoutes: number;
    alertes_par_type: Record<string, number>;
    mouvements_par_type: Record<string, number>;
}

interface Props extends PageProps {
    user?: UserStats;
    users?: UserStats[];
}

export default function UserStats({ auth, user, users }: Props) {
    // Si on affiche les stats d'un seul utilisateur
    if (user) {
        const alertesData = Object.entries(user.alertes_par_type).map(([name, value]) => ({ name, value }));
        const mouvementsData = Object.entries(user.mouvements_par_type).map(([name, value]) => ({ name, value }));

        return (
            <Card>
                
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className=" overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-6">Statistiques de {user.name}</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className=" p-6 rounded-lg shadow-2xl  border-2">
                                    <h3 className="text-lg font-semibold mb-4">Activité Globale</h3>
                                    <div className="space-y-2">
                                        <p>Alertes créées: <span className="font-bold">{user.total_alertes_crees}</span></p>
                                        <p>Alertes résolues: <span className="font-bold">{user.alertes_resolues}</span></p>
                                        <p>Mouvements de stock: <span className="font-bold">{user.mouvements_stock_crees}</span></p>
                                        <p>Transferts initiés: <span className="font-bold">{user.transferts_inities}</span></p>
                                        <p>Produits ajoutés: <span className="font-bold">{user.produits_ajoutes}</span></p>
                                    </div>
                                </div>
                                
                                <div className="border-2 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">Répartition des Alertes</h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={alertesData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }} cursor={false} />
                                                <Legend />
                                                <Bar dataKey="value" fill="#8884d8" name="Nombre d'alertes" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-2 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Types de Mouvements</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={mouvementsData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip cursor={false} labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }} />
                                            <Legend />
                                            <Bar dataKey="value" fill="#82ca9d" name="Nombre de mouvements" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    
}