'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";

type UserNavProps = {
  isSidebar?: boolean;
  side?: ComponentProps<typeof DropdownMenuContent>['side'];
  align?: ComponentProps<typeof DropdownMenuContent>['align'];
};

export function UserNav({ isSidebar = false, side = "bottom", align = "end" }: UserNavProps) {
    const [userName, setUserName] = useState('Usuario');
    const [avatarFallback, setAvatarFallback] = useState('U');

    const updateName = () => {
        const name = localStorage.getItem('userName');
        if (name) {
            setUserName(name);
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            setAvatarFallback(initials);
        }
    };

    useEffect(() => {
        updateName();

        const handleStorageChange = () => {
            updateName();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

  if (isSidebar) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2 text-left h-auto py-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" alt={userName} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden flex flex-col">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-muted-foreground">Tu espacio de crecimiento</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align={align} side={side} forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild><Link href="/dashboard/settings">Ajustes</Link></DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link href="/">Cerrar Sesión</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" alt={userName} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={align} side={side} forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuItem asChild><Link href="/dashboard/settings">Ajustes</Link></DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href="/">Cerrar Sesión</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
