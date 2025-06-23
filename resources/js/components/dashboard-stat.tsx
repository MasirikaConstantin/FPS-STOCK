import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Package } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    variant?: 'default' | 'success' | 'destructive' | 'warning' | 'info';
}

const StatsCard = ({ title, value, icon: Icon, variant = 'default' }: StatsCardProps) => {
    return (
        <Card className="w-full" color={variant}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Icon className="h-8 w-8 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString('fr-FR')}</div>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
