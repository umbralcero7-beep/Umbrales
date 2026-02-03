import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { MainNav } from "@/components/dashboard/main-nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    className={cn(className)}
  >
    <path
      d="M52,60.1V32.5C52,18.4,41.6,8,27.5,8S3,18.4,3,32.5v27.6H52z"
      fill="#feeaa6"
    />
    <circle cx="27.5" cy="24" r="8" fill="#f9b112" />
    <path
      d="M3,60.1l11-20.3l8.6,13.8l12.4-23.3L52,60.1H3z"
      fill="#706293"
    />
    <path
      d="M3,60.1l17.3-21.8L28,50.7l10.7-19.4l-3.3,4.4l12.6,14.4H3z"
      fill="#483d73"
    />
    <path
      d="M55,32.5C55,16.8,42.7,4.5,27.5,4.5S0,16.8,0,32.5v27.6C0,61.2,0.9,62,2,62h51c1.1,0,2-0.8,2-1.9V32.5z M52,58.1H3V32.5 C3,18.4,13.9,8,27.5,8S52,18.4,52,32.5V58.1z"
      fill="#f9b112"
    />
  </svg>
);


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <Sidebar collapsible="icon" side="left" className="hidden md:flex">
          <SidebarHeader className="border-b">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg font-headline tracking-tighter">
              <Logo className="h-6 w-6" />
              <span className="group-data-[collapsible=icon]:hidden">Umbral</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <MainNav />
          </SidebarContent>
          <SidebarFooter className="p-2">
            <UserNav isSidebar={true} />
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 pb-24 md:pb-0">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-20 border-t bg-background/95 backdrop-blur-sm">
            <MobileNav />
        </nav>
    </SidebarProvider>
  );
}
