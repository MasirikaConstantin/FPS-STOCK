import { Hopital, PageProps, Role } from '@/types/types';
import Form from './Form';
import { User } from '@/types';

export default function Edit({ user, hopitals, roles  }: PageProps<{ user: User; hopitals: Hopital[]; roles: Role[] }>) {
    return <Form  user={user} hopitals={hopitals} roles={roles} />;
}
