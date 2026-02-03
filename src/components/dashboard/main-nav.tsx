"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, BookText, ListChecks, TrendingUp, Rocket, Settings, Wind } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/journal", label: "Diario", icon: BookText },
  { href: "/dashboard/calm", label: "Calma", icon: Wind },
  { href: "/dashboard/habits", label: "Hábitos", icon: ListChecks },
  { href: "/dashboard/progress", label: "Progreso", icon: TrendingUp },
];

const bottomNavItems = [
    { href: "/dashboard/settings", label: "Ajustes", icon: Settings },
]

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
        <SidebarMenu className="flex-1">
        {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
            >
                <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
        ))}
        </SidebarMenu>
        <SidebarMenu>
            {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className={item.href === '/dashboard/pro' ? 'text-primary hover:bg-primary/10 data-[active=true]:bg-primary/10 data-[active=true]:text-primary' : ''}
            >
                <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
        ))}
        </SidebarMenu>
    </div>
  );
}
