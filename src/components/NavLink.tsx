
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

export const NavLink = ({ to, icon, label, isActive }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
        isActive
          ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
      )}
    >
      <span className="text-slate-500 dark:text-slate-400">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};
