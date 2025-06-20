import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Link } from 'lucide-react'

export default function Page404() {
  return (
    <AppLayout>
      <Head title="Page not found" />
      <div className="flex flex-col items-center px-4 py-8">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-center">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-blue-500 px-6 py-3 text-white"
        >
          Go back home
        </Link>
      </div>
    </AppLayout>
  )
}
