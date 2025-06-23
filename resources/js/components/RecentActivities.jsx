import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Package, Truck, CheckCircle, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface RecentActivity {
  id: number;
  type: 'transfert' | 'stock' | 'alerte' | 'reception';
  title: string;
  description?: string;
  hospital?: string;
  product?: string;
  createdAt: string;
  status?: 'en_attente' | 'approuve' | 'en_transit' | 'livre' | 'annule';
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'transfert':
        return <Truck className="h-4 w-4" />;
      case 'stock':
        return <Package className="h-4 w-4" />;
      case 'alerte':
        return <AlertTriangle className="h-4 w-4" />;
      case 'reception':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approuve':
        return 'text-green-500';
      case 'en_transit':
        return 'text-blue-500';
      case 'livre':
        return 'text-purple-500';
      case 'annule':
        return 'text-red-500';
      case 'en_attente':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHeader>
        <CardTitle>Activités Récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                {getActivityIcon(activity.type)}
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.title}
                  {activity.hospital && (
                    <span className="font-bold"> {activity.hospital}</span>
                  )}
                </p>
                {activity.product && (
                  <p className="text-sm text-muted-foreground">
                    {activity.product}
                  </p>
                )}
                {activity.status && (
                  <span className={`text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status.replace('_', ' ')}
                  </span>
                )}
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                  locale: fr
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;