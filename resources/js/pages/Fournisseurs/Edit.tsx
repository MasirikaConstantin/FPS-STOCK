import { PageProps } from '@/types/types';
import Form from './Form';

export default function Edit({ fournisseur }: PageProps<{ fournisseur: any }>) {
    return <Form fournisseur={fournisseur} />;
}