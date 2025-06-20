import Form from './Form';
import { App, PageProps } from '@/types/types';

export default function Edit({ auth, category }: PageProps<{ category: App.Category }>) {
    return <Form auth={auth} category={category} />;
}