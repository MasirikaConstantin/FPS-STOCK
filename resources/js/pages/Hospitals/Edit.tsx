import Form from './Form';
import { PageProps } from '@/types/types';

export default function Edit({ hopital, divisions, types }: PageProps<{ hopital: any; divisions: any[]; types: string[] }>) {
    return <Form hopital={hopital} divisions={divisions} types={types} />;
}