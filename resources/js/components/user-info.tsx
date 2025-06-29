import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false, showHopital=false, showRole =false }: { user: User; showEmail?: boolean; showHopital?:boolean; showRole?:boolean }) {
    const getInitials = useInitials();

    return (
        <>
            {user.avatar ? (
                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
            ) : (
                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
            )}
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
                {showHopital && <span className="truncate text-xs text-muted-foreground">{user.profile?.hopital?.nom}</span>}
                {showRole && <span className="truncate text-xs text-muted-foreground">{user.role}</span>}
            </div>
        </>
    );
}
