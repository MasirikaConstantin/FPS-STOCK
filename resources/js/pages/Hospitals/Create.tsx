import Form from './Form';

export default function Create({ divisions, types }: PageProps<{ divisions: any[]; types: string[] }>) {
    return <Form divisions={divisions} types={types} />;
}