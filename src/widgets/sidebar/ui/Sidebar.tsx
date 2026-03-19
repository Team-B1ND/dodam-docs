"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Route from "./Route";
import { useSidebarStore } from "@/shared/stores/useSidebarStore";
import type { NavSection, NavItem } from "@/lib/nav";

const NAV_STYLES = "flex flex-col border-l border-border-normal pl-2 pr-4 ml-4 md:ml-0";

function groupBySubsection(items: NavItem[]): { subsection?: string; items: NavItem[] }[] {
  const groups: { subsection?: string; items: NavItem[] }[] = [];

  for (const item of items) {
    const last = groups[groups.length - 1];
    if (!last || item.subsection !== last.subsection) {
      groups.push({ subsection: item.subsection, items: [item] });
    } else {
      last.items.push(item);
    }
  }
  return groups;
}

interface SidebarProps {
  nav: NavSection[];
}

const Sidebar = ({ nav }: SidebarProps) => {
  const pathname = usePathname();
  const { isOpen, close } = useSidebarStore();

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-40 w-56 h-dvh pt-16
          overflow-y-auto bg-background-default
          transition-transform duration-300 ease-in-out
          md:left-auto md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
        <div className="flex items-center justify-between px-4 py-2 md:hidden">
          <span className="text-text-primary font-semibold">메뉴</span>
          <button
            type="button"
            onClick={close}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-fill-secondary cursor-pointer"
            aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="pb-8 px-4 md:px-0">
          {nav.filter(Boolean).map((section, i) => {
            const groups = groupBySubsection(section.items ?? []);
            return (
              <div key={section.id} className={i > 0 ? "mt-8" : ""}>
                <p className="text-text-primary font-bold text-sm mb-1 px-2">
                  {section.title}
                </p>
                {groups.map((group, gi) => (
                  <div key={gi} className={gi > 0 ? "mt-3" : ""}>
                    {group.subsection && (
                      <p className="text-text-placeholder text-xs mb-1 mt-3 px-2 uppercase tracking-wider">
                        {group.subsection}
                      </p>
                    )}
                    <nav className={NAV_STYLES}>
                      {group.items.map((item) => (
                        <Route key={item.href} href={item.href} title={item.title} />
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
