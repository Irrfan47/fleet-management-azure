import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Car, Users, CalendarCheck, Wrench, ShieldCheck, AlertTriangle, Trash2, User, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector, toggleSidebar } from "@/redux/store";
import { APP_NAME } from "@/utils/constants";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/vehicles", label: "Vehicles", icon: Car },
  { to: "/drivers", label: "Drivers", icon: Users },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/insurance", label: "Insurance & Tax", icon: ShieldCheck },
  { to: "/accidents", label: "Accidents & Fines", icon: AlertTriangle },
  { to: "/disposal", label: "Disposal", icon: Trash2 },
  { to: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const dispatch = useAppDispatch();
  const location = useLocation();

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
            <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-primary text-primary-foreground">
              <Car className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-primary text-primary-foreground">
            <Car className="h-4 w-4" />
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
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
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
