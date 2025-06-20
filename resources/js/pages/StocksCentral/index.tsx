import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react';

const StocksCentral: React.FC = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Stocks Central',
            href: '/central-stocks',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stocks Central" />
        </AppLayout>
    );
};

export default StocksCentral;
