
export declare interface Permission {
    id: number;
    name: string;
    description: string;
    module: string;
    action: string;
    created_at: string;
    updated_at: string;
    ref: string;
}

export declare interface UserPermission {
    id: number;
    user_id: number;
    permission_id: number;
    granted_by: number | null;
    granted_at: string;
    created_at: string;
    updated_at: string;
    ref: string;
    permission: Permission;
}