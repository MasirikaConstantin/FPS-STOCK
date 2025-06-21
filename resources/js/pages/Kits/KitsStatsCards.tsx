import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'info';
}

const StatsCard = ({ title, value, icon: Icon, variant = 'default' }: StatsCardProps) => {
  const variantClasses = {
    default: 'bg-background text-foreground',
    success: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    destructive: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    info: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${variantClasses[variant].split(' ')[1]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

interface KitsStatsCardsProps {
  stats: {
    active_kits: number;
    inactive_kits: number;
    total_items: number;
    unique_types: number;
  };
}

export const KitsStatsCards = ({ stats }: KitsStatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Kits Actifs"
        value={stats.active_kits}
        icon={Package}
        variant="success"
      />
      <StatsCard
        title="Kits Inactifs"
        value={stats.inactive_kits}
        icon={Package}
        variant="destructive"
      />
      <StatsCard
        title="Total Articles"
        value={stats.total_items}
        icon={Package}
        variant="info"
      />
      {/* Assuming unique_types is the number of different kit types 
      <StatsCard
        title="Types de Kits"
        value={stats.unique_types}
        icon={Package}
      />*/}
    </div>
  );
};