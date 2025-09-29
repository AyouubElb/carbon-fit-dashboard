"use client";
import React from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/context/SidebarProvider";

const Header = () => {
  const { toggle } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-6 shadow-sm">
      <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggle}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Ouvrir le menu</span>
      </Button>

      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-900">
          Tableau de bord - Carbon Fit Store
        </h1>
      </div>
    </header>
  );
};

export default Header;
