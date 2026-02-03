"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookText, ListChecks, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";

const navItems = [
    { href: "/dashboard", label: "Inicio", icon: Home },
    { href: "/dashboard/journal", label: "Diario", icon: BookText },
    { href: "/dashboard/habits", label: "Hábitos", icon: ListChecks },
    { href: "/dashboard/progress", label: "Progreso", icon: TrendingUp },
  ];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="grid h-full grid-cols-5 items-center">
      {navItems.map((item) => (
        <Link 
            href={item.href} 
            key={item.href}
            className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary h-full",
                pathname === item.href && "text-primary"
            )}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium text-center">{item.label}</span>
        </Link>
      ))}
      <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground h-full">
        <UserNav side="top" align="end" />
        <span className="text-[10px] font-medium text-center">Perfil</span>
      </div>
    </div>
  );
}
