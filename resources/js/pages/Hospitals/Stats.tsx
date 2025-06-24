import { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HospitalStatsProps {
  hospital: {
    id: number;
    nom: string;
    type?: string;
  };
  movements?: {
    type: string;
    count: number;
  }[];
  productDistribution?: {
    category: string;
    count: number;
  }[];
  alerts?: {
    type: string;
    count: number;
  }[];
  stockData?: {
    date: string;
    quantity: number;
  }[];
  transactionHistory?: {
    date: string;
    amount: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function HospitalStatsDashboard({
  hospital,
  movements = [],
  productDistribution = [],
  alerts = [],
  stockData = [],
  transactionHistory = []
}: HospitalStatsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Utiliser useMemo pour éviter des recalculs inutiles
  const formattedData = useMemo(() => {
    // S'assurer que les données sont valides avant de les transformer
    const safeMovements = Array.isArray(movements) ? movements : [];
    const safeProductDistribution = Array.isArray(productDistribution) ? productDistribution : [];
    const safeAlerts = Array.isArray(alerts) ? alerts : [];
    const safeTransactionHistory = Array.isArray(transactionHistory) ? transactionHistory : [];
    const safeStockData = Array.isArray(stockData) ? stockData : [];

    // Format data for charts with safe access
    const movementChartData = safeMovements.map(mov => ({
      name: mov?.type ? (mov.type.charAt(0).toUpperCase() + mov.type.slice(1)) : 'Inconnu',
      value: mov?.count || 0
    }));

    const productChartData = safeProductDistribution.map(prod => ({
      name: prod?.category || 'Inconnu',
      value: prod?.count || 0
    }));

    const alertChartData = safeAlerts.map(alert => ({
      name: alert?.type ? (alert.type.charAt(0).toUpperCase() + alert.type.slice(1)) : 'Inconnu',
      value: alert?.count || 0
    }));

    // Ensure transaction history has proper format for the AreaChart
    const formattedTransactionHistory = safeTransactionHistory.map(item => ({
      date: item?.date || '',
      amount: item?.amount || 0
    }));

    // Ensure stock data has proper format
    const formattedStockData = safeStockData.map(item => ({
      date: item?.date || '',
      quantity: item?.quantity || 0
    }));

    // Calculate summary metrics
    const totalProducts = safeProductDistribution.reduce((sum, item) => sum + (item?.count || 0), 0);
    const totalMovements = safeMovements.reduce((sum, item) => sum + (item?.count || 0), 0);
    const totalAlerts = safeAlerts.reduce((sum, item) => sum + (item?.count || 0), 0);
    const pendingTransfers = safeMovements.find(m => m?.type === 'transfert')?.count || 0;

    return {
      movementChartData,
      productChartData,
      alertChartData,
      formattedTransactionHistory,
      formattedStockData,
      totalProducts,
      totalMovements,
      totalAlerts,
      pendingTransfers
    };
  }, [movements, productDistribution, alerts, transactionHistory, stockData]);

  const {
    movementChartData,
    productChartData,
    alertChartData,
    formattedTransactionHistory,
    formattedStockData,
    totalProducts,
    totalMovements,
    totalAlerts,
    pendingTransfers
  } = formattedData;

  // Vérifier si les données sont vides pour chaque graphique
  const hasMovements = movementChartData.length > 0;
  const hasProducts = productChartData.length > 0;
  const hasAlerts = alertChartData.length > 0;
  const hasTransactions = formattedTransactionHistory.length > 0;
  const hasStockData = formattedStockData.length > 0;

  // Render empty state component
  const EmptyState = ({ message = "Aucune donnée disponible" }) => (
    <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md">
      <p className="text-gray-500">{message}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Statistiques de {hospital.nom}</h1>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="rounded-md border border-gray-300 p-2 text-sm"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="all">Tout</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Produits en stock
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  {productDistribution.length} catégories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mouvements ce mois
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMovements}</div>
                <p className="text-xs text-muted-foreground">
                  {movements.length} types de mouvements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Alertes actives
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAlerts}</div>
                <p className="text-xs text-muted-foreground">
                  {alerts.length} types d'alertes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Transferts en attente
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTransfers}</div>
                <p className="text-xs text-muted-foreground">
                  En attente de traitement
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Historique des transactions</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  {hasTransactions ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={formattedTransactionHistory}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip labelClassName='text-xs text-gray-500' contentStyle={{ backgroundColor: 'black', color: 'white' }} />
                        <Area type="monotone" dataKey="amount" stroke="#8824d8" fill="#84d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState message="Aucune transaction à afficher" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Types de mouvements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {hasMovements ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={movementChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {movementChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState message="Aucun mouvement à afficher" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stocks" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Niveaux de stock</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  {hasStockData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={formattedStockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }} />
                        <Legend />
                        <Bar dataKey="quantity" fill="#8884d8" name="Quantité" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState message="Aucune donnée de stock disponible" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Répartition des produits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {hasProducts ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {productChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }}  />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState message="Aucune répartition de produit disponible" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Détail des mouvements</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                {hasMovements ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={movementChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }} />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Nombre" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="Aucun mouvement à afficher" />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Alertes récentes</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  {hasAlerts ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={alertChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }} />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Nombre d'alertes" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState message="Aucune alerte à afficher" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Types d'alertes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {hasAlerts ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={alertChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {alertChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip labelClassName='text-xs text-gray-500' itemStyle={{ backgroundColor: 'black', color: 'white' }} contentStyle={{ backgroundColor: 'black', color: 'white' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState message="Aucune alerte à afficher" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}