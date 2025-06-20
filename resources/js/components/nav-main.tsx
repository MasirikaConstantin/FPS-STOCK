import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {},
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {},
        },
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Navigation</SidebarGroupLabel>

            <SidebarMenu>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2.5">
                    {items.map((item) => {
                        const isActive = page.url.startsWith(item.href);

                        return (
                            <motion.div key={item.title} variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isActive} className="relative px-3 py-3 transition-all duration-200">
                                        <Link href={item.href} prefetch className="w-full py-4">
                                            <div
                                                className={`flex w-full items-center gap-3 ${
                                                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                {item.icon && (
                                                    <motion.div
                                                        className={isActive ? 'text-primary' : 'text-muted-foreground'}
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <item.icon className="h-5 w-5" />
                                                    </motion.div>
                                                )}

                                                <span className="text-sm font-medium">{item.title}</span>

                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeIndicator"
                                                        className="absolute left-0 h-6 w-1 rounded-r-md bg-primary"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                    />
                                                )}
                                            </div>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </SidebarMenu>
        </SidebarGroup>
    );
}
