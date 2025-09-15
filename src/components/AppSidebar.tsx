"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarHeader, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent } from "@/components/ui/sidebar";
import { LayoutDashboard, Info, Users, Calculator, Network } from "lucide-react";
import Image from "next/image";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center p-1.5 rounded-lg">
                <Image src="/logo.png" alt="SolarWindSim Logo" width={28} height={28} />
            </div>
            <span className="font-semibold text-lg">SolarWindSim</span>
            <div className="grow" />
            <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton isActive={pathname === '/'} tooltip={{children: 'Dashboard'}}>
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/diagram">
              <SidebarMenuButton isActive={pathname === '/diagram'} tooltip={{children: 'System Diagram'}}>
                <Network />
                System Diagram
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/calculator">
              <SidebarMenuButton isActive={pathname === '/calculator'} tooltip={{children: 'Calculator'}}>
                <Calculator />
                Calculator
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/about-project">
              <SidebarMenuButton isActive={pathname === '/about-project'} tooltip={{children: 'About Project'}}>
                <Info />
                About Project
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/about-us">
                <SidebarMenuButton isActive={pathname === '/about-us'} tooltip={{children: 'About Us'}}>
                    <Users />
                    About Us
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
