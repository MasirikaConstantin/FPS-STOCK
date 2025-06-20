import { Loading } from '@/components/loandig';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface Medicine {
    id: number;
    name: string;
    description: string;
    quantity: number;
}

const MedicinesIndex: React.FC = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Gestion Médicaments',
            href: '/medicaments',
        },
    ];
    useEffect(() => {
        // Simulate fetching data from an API
        const fetchMedicines = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/medicines'); // Replace with your API endpoint
                const data = await response.json();
                setMedicines(data);
            } catch (error) {
                console.error('Error fetching medicines:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await fetch(`/api/medicines/${id}`, { method: 'DELETE' }); // Replace with your API endpoint
            setMedicines(medicines.filter((medicine) => medicine.id !== id));
        } catch (error) {
            console.error('Error deleting medicine:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion Médicaments" />
            {loading && (
                <>
                    <Loading />
                </>
            )}
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>Medicines Management</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((medicine) => (
                            <tr key={medicine.id}>
                                <td>{medicine.name}</td>
                                <td>{medicine.description}</td>
                                <td>{medicine.quantity}</td>
                                <td>
                                    <button onClick={() => handleDelete(medicine.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
};

export default MedicinesIndex;
