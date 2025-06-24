import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { MedicalProduit, StockMouvement } from "@/types/models";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Box, CarFrontIcon, Eraser } from "lucide-react";

interface Props extends PageProps {
  produit: MedicalProduit & {
    mouvements: StockMouvement[];
    stocks: {
      total: number;
      disponible: number;
      reservee: number;
      expirer: number;
      endommage: number;
    };
    transferts: {
      total: number;
      en_attente: number;
      preleve: number;
      livre: number;
      annule: number;
    };
    alerts: {
      total: number;
      stock_faible: number;
      avertissement_expiration: number;
      expire: number;
    };
  };
}

export default function MedicamentStats({ auth, produit }: Props) {
  // Préparer les données pour les graphiques
  const mouvementsParMois = produit.mouvements.reduce((acc, mouvement) => {
    const date = new Date(mouvement.created_at);
    const mois = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    if (!acc[mois]) {
      acc[mois] = { date: mois, entree: 0, sortie: 0, transfert: 0, ajustement: 0 };
    }

    acc[mois][mouvement.type] += mouvement.quantite;

    return acc;
  }, {} as Record<string, { date: string; entree: number; sortie: number; transfert: number; ajustement: number }>);

  const mouvementsData = Object.values(mouvementsParMois);

  const stocksData = [
    { name: "Disponible", value: produit.stocks.disponible, fill: "#10B981" },
    { name: "Réservé", value: produit.stocks.reservee, fill: "#FBBF24" },
    { name: "Expiré", value: produit.stocks.expirer, fill: "#EF4444" },
    { name: "Endommagé", value: produit.stocks.endommage, fill: "#6B7280" },
  ];

  const transfertsData = [
    { name: "En attente", value: produit.transferts.en_attente, fill: "#3B82F6" },
    { name: "Prélevé", value: produit.transferts.preleve, fill: "#8B5CF6" },
    { name: "Livré", value: produit.transferts.livre, fill: "#10B981" },
    { name: "Annulé", value: produit.transferts.annule, fill: "#EF4444" },
  ];

  const alertsData = [
    { name: "Stock faible", value: produit.alerts.stock_faible, fill: "#F97316" },
    { name: "Avertissement", value: produit.alerts.avertissement_expiration, fill: "#FBBF24" },
    { name: "Expiré", value: produit.alerts.expire, fill: "#EF4444" },
    { name: "Demande Transfert", value: produit.alerts.demande_transfert, fill: "#EA44" },
    { name: "Systeme", value: produit.alerts.systeme, fill: "#fff" },
  ];
  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-semibold text-xl  leading-tight">
                Statistiques du médicament: {produit.name}
            </CardTitle>
        </CardHeader>
      
        <CardContent>
          <div className=" overflow-hidden shadow-sm sm:rounded-lg ">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader  className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Stock Total</CardTitle>
                        <Box/>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{produit.stocks.total}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader  className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Transferts Total</CardTitle>
                        <CarFrontIcon/>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{produit.transferts.total}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader  className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Alertes Total</CardTitle>
                        <AlertCircle/>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{produit.alerts.total}</p>
                    </CardContent>
                </Card>
             
              
            </div>

            {/* Mouvements par mois */}
            <Card>
                <CardHeader>
                    <CardTitle>
                    Mouvements de stock par mois
                    </CardTitle>
                </CardHeader>
                <CardContent>
                        <div className="mt-6 h-80">
                            <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mouvementsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black' }} contentStyle={{ backgroundColor: 'black', color: 'white' }}
                                formatter={(value) => [`${value} unités`, 
                                    { 
                                    entree: "Entrée", 
                                    sortie: "Sortie", 
                                    transfert: "Transfert", 
                                    ajustement: "Ajustement" 
                                    }[value as string]
                                ]}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="entree" stroke="#10B981" fill="#10B981" />
                                <Area type="monotone" dataKey="sortie" stroke="#EF4444" fill="#EF4444" />
                                <Area type="monotone" dataKey="transfert" stroke="#3B82F6" fill="#3B82F6" />
                                <Area type="monotone" dataKey="ajustement" stroke="#F59E0B" fill="#F59E0B" />
                            </AreaChart>
                            </ResponsiveContainer>
                        </div>
                </CardContent>
            </Card>

            {/* Stocks et Transferts */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>
                        État des stocks
                    </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Stocks */}
                    <div className=" p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">État des stocks</h3>
                        <div className="mt-6 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stocksData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value} unités`]} labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }} />
                            <Legend />
                            <Bar dataKey="value" name="Quantité" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Transferts */}
                    <div className=" p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Statut des transferts</h3>
                        <div className="mt-6 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={transfertsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value} transferts`]} labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }} />
                            <Legend />
                            <Bar dataKey="value" name="Quantité" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                    </div>
                        </CardContent>
                    </Card>

                    {/* Alertes */}
                    <Card className="mt-6 rounded-lg shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium ">
                            Alertes
                            </CardTitle>
                        </CardHeader>
                    <div className="mt-6 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={alertsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis  />
                            <Tooltip formatter={(value) => [`${value} alertes`]} labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }}  />
                            <Legend />
                            <Bar dataKey="value" name="Quantité" radius={[4, 4, 0, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                    </Card>
                </div>
        </CardContent>
      
    </Card>
  );
}