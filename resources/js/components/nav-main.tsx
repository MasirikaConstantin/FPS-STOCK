import { motion } from 'framer-motion';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Variants } from 'framer-motion';
export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    
    // Définition des variants avec le bon typage
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { 
                type: 'spring', 
                stiffness: 100,
                damping: 10 // Ajout recommandé pour les animations spring
            }
        }
    };


    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                Navigation
            </SidebarGroupLabel>
            
            <SidebarMenu>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2.5"
                >
                    {items.map((item) => {
                        const isActive = page.url.startsWith(item.href);
                        
                        return (
                            <motion.div
                                key={item.title}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        className="relative px-3 py-3 transition-all duration-200"
                                    >
                                        <Link href={item.href} prefetch className="w-full py-4">
                                            <motion.div
                                                className={`flex items-center gap-3 w-full ${
                                                    isActive 
                                                        ? 'text-primary' 
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                                whileHover={{ 
                                                    color: isActive 
                                                        ? 'hsl(221.2 83.2% 53.3%)' // Bleu plus vif au hover si actif
                                                        : 'hsl(240 10% 3.9%)'       // Noir au hover si inactif
                                                }}
                                            >
                                                {item.icon && (
                                                    <motion.div
                                                        className={isActive ? 'text-primary' : 'text-muted-foreground'}
                                                        whileHover={{ 
                                                            scale: 1.1,
                                                            color: isActive 
                                                                ? 'hsl(221.2 83.2% 53.3%)' 
                                                                : 'hsl(240 5.9% 10%)'
                                                        }}
                                                    >
                                                        <item.icon className="h-5 w-5" />
                                                    </motion.div>
                                                )}
                                                
                                                <motion.span
                                                    className="text-sm font-medium"
                                                    animate={{
                                                        color: isActive
                                                            ? 'hsl(221.2 83.2% 53.3%)' // Bleu primaire
                                                            : 'hsl(240 5% 64.9%)'       // Gris foncé
                                                    }}
                                                >
                                                    {item.title}
                                                </motion.span>
                                                
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeIndicator"
                                                        className="absolute left-0 h-6 w-1 bg-primary rounded-r-md"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                    />
                                                )}
                                            </motion.div>
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