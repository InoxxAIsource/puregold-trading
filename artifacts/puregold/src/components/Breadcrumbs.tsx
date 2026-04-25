import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground whitespace-nowrap overflow-x-auto pb-2 mb-4" data-testid="breadcrumbs">
      <Link href="/" className="hover:text-primary transition-colors flex items-center shrink-0">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center shrink-0">
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors truncate max-w-[200px]">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground truncate max-w-[200px]">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
