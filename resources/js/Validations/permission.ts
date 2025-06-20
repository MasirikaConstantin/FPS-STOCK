import { z } from "zod";

export const permissionSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  module: z.string().min(2, "Le module doit contenir au moins 2 caractères"),
  action: z.string().min(2, "L'action doit contenir au moins 2 caractères"),
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;