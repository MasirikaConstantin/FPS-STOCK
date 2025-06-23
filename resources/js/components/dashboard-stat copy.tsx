
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardsProps {
  data: any[];
}

const StatsCard = ({ data }: StatsCardsProps) => {
  const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = data.filter(item => item.quantity <= item.minThreshold).length;
  const expiringItems = data.filter(item => {
    const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 30 && daysToExpiry > 0;
  }).length;
  const totalValue = data.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const stats = [
    {
      title: 'Articles en stock',
      value: totalItems.toLocaleString(),
      icon: Package,
      change: '+12%',
      changeType: 'positive' as const,
      description: 'vs mois dernier'
    },
    {
      title: 'Stock faible',
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      change: '-5%',
      changeType: 'negative' as const,
      description: 'articles sous seuil'
    },
    {
      title: 'Expire sous 30j',
      value: expiringItems.toString(),
      icon: TrendingDown,
      change: '+3',
      changeType: 'neutral' as const,
      description: 'nécessite attention'
    },
    {
      title: 'Valeur totale',
      value: `${(totalValue / 1000000).toFixed(1)}M FC`,
      icon: TrendingUp,
      change: '+8%',
      changeType: 'positive' as const,
      description: 'francs congolais'
    }
  ];

  return (
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <Icon className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <span 
                  className={`font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-slate-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-slate-500">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCard;

