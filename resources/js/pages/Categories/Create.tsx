import { PageProps } from '@/types/types';
import Form from './Form';

export default function Create({ auth }: PageProps) {
    return <Form auth={auth} />;
}
