import { App, Hospital, PageProps } from '@/types/types';
import Form from './Form';
import { User } from '@/types';

export default function Edit({ user, hopitals, roles  }: PageProps<{ user: User; hospitals: Hospital; roles: any }>) {
    return <Form  user={user} hopitals={hopitals} roles={roles} />;
}
