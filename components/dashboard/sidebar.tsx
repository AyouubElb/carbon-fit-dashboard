"use client";

import {
  ChevronDown,
  ChevronRight,
  Home,
  LogOut,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarProvider";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

const navigation = [
  { name: "Accueil", href: "/dashboard", icon: Home },
  {
    name: "Produits",
    href: "/dashboard/products",
    icon: Package,
    submenu: [
      {
        name: "Liste des produits",
        href: "/dashboard/products",
        icon: Package,
      },
      {
        name: "Ajouter un produit",
        href: "/dashboard/products/add",
        icon: Plus,
      },
    ],
  },
  { name: "Commandes", href: "/dashboard/orders", icon: ShoppingCart },
];

const Sidebar = () => {
  const { isOpen, close } = useSidebar();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Produits"]);
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      // clear HttpOnly cookies on the server
      const res = await fetch("/api/auth/clear-session", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const serverMsg = body?.message ?? "Failed to clear server session";
        throw new Error(serverMsg);
      }

      toast.success("Logged out successfully.");
      router.push("/auth/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          "lg:static lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex w-72 flex-col lg:sticky lg:top-0 h-screen">
          <div className="flex h-20 items-center justify-center px-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-wider text-gray-900 uppercase">
                Carbon Fit
              </h1>
              <p className="text-xs font-medium text-gray-500 tracking-wide uppercase mt-1">
                Admin Dashboard
              </p>
            </div>
          </div>

          <nav className="flex-1 px-6 py-8 space-y-3">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.submenu &&
                  item.submenu.some((sub) => pathname === sub.href));
              const isExpanded = expandedMenus.includes(item.name);

              return (
                <div key={item.name}>
                  {item.submenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={cn(
                        "flex items-center justify-between w-full gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 group",
                        isActive
                          ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isActive
                              ? "bg-indigo-100"
                              : "bg-gray-100 group-hover:bg-gray-200"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5",
                              isActive ? "text-indigo-600" : "text-gray-600"
                            )}
                          />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div
                        className={cn(
                          "p-1 rounded-md transition-colors",
                          isActive
                            ? "bg-indigo-100"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        )}
                      >
                        {isExpanded ? (
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isActive ? "text-indigo-600" : "text-gray-500"
                            )}
                          />
                        ) : (
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isActive ? "text-indigo-600" : "text-gray-500"
                            )}
                          />
                        )}
                      </div>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 group",
                        isActive
                          ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                      )}
                      onClick={() => close()}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          isActive
                            ? "bg-indigo-100"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5",
                            isActive ? "text-indigo-600" : "text-gray-600"
                          )}
                        />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}

                  {item.submenu && isExpanded && (
                    <div className="ml-8 mt-3 space-y-2">
                      {item.submenu.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                              isSubActive
                                ? "bg-indigo-100 text-indigo-700 border-l-3 border-indigo-500"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-3 border-transparent hover:border-gray-200"
                            )}
                            onClick={() => close()}
                          >
                            <subItem.icon
                              className={cn(
                                "h-4 w-4",
                                isSubActive
                                  ? "text-indigo-600"
                                  : "text-gray-500"
                              )}
                            />
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              disabled={isLoading}
              className="w-full justify-start gap-4 h-12 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
                <LogOut className="h-5 w-5 group-hover:text-red-600" />
              </div>
              <span>{isLoading ? "Se déconnecter..." : "Se déconnecter"}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
