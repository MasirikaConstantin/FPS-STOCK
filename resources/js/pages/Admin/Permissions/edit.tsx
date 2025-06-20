import { PermissionForm } from "@/components/forms/PermissionForm";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Permission } from "@/types/permissions";
import { Head, useForm } from "@inertiajs/react";

interface EditPermissionProps {
  permission: Permission;
}

export default function EditPermission({ permission }: EditPermissionProps) {
  const { put, processing } = useForm();

  const handleSubmit = (values: any) => {
    put(route("admin.permissions.update", permission.id), {
      data: values,
      preserveScroll: true,
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Accueil", href: route("dashboard") },
    { title: "Permissions", href: route("admin.permissions.index") },
    { title: "Modifier permission", href: route("admin.permissions.edit", permission.id) },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Modifier permission" />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Modifier la permission</h1>
        <PermissionForm
          defaultValues={permission}
          onSubmit={handleSubmit}
          isSubmitting={processing}
        />
      </div>
    </AppLayout>
  );
}