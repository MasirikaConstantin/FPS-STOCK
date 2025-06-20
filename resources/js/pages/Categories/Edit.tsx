import { App, PageProps } from '@/types/types';
import Form from './Form';

export default function Edit({ auth, category }: PageProps<{ category: App.Category }>) {
    return <Form auth={auth} category={category} />;
}
