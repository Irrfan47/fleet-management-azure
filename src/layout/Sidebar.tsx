import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Car, Users, CalendarCheck, Wrench, ShieldCheck, AlertTriangle, Trash2, User, ChevronLeft, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector, toggleSidebar } from "@/redux/store";
import { useLanguage } from "@/contexts/LanguageContext";
import { APP_NAME } from "@/utils/constants";

const navItems = [
  { to: "/", key: "dashboard", icon: LayoutDashboard, end: true },
  { to: "/vehicles", key: "vehicles", icon: Car },
  { to: "/drivers", key: "drivers", icon: Users },
  { to: "/bookings", key: "bookings", icon: CalendarCheck },
  { to: "/maintenance", key: "maintenance", icon: Wrench },
  { to: "/insurance", key: "insurance", icon: ShieldCheck },
  { to: "/accidents", key: "accidents", icon: AlertTriangle },
  { to: "/disposal", key: "disposals", icon: Trash2 },
  { to: "/reports", key: "reports", icon: FileText },
  { to: "/profile", key: "profile", icon: User },
];

export function Sidebar() {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-sidebar-border", collapsed ? "justify-center px-2" : "justify-between px-4")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md overflow-hidden bg-white p-1 shadow-sm">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white leading-tight">{APP_NAME}</span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-10 w-10 items-center justify-center rounded-md overflow-hidden bg-white p-1 shadow-sm">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? t(item.key) : undefined}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
              {!collapsed && <span className="truncate">{t(item.key)}</span>}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={() => dispatch(toggleSidebar())}
        className="m-2 flex items-center justify-center gap-2 rounded-md border border-sidebar-border p-2 text-xs font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
