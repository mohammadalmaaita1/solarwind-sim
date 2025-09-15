import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarRail, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import HybridEmulator from "@/components/HybridEmulator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolarWindSim",
  description: "A simulator for hybrid solar and wind power generation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground flex flex-col min-h-screen`}>
        <HybridEmulator>
          <SidebarProvider>
            <Sidebar collapsible="icon">
              <AppSidebar />
              <SidebarRail />
            </Sidebar>
            <SidebarInset className="flex-grow">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </HybridEmulator>
        <footer className="p-4 text-center text-muted-foreground text-sm border-t">
          © {new Date().getFullYear()} SolarWindSim. All rights reserved.
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
