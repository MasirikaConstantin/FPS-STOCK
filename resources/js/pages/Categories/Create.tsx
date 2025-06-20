
import Form from './Form';
import { PageProps } from '@/types/types';

export default function Create({ auth }: PageProps) {
    return <Form auth={auth} />;
}