import { Bell, Moon, Sun, Search, LogOut, Menu, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppDispatch, useAppSelector, markAllRead, markNotificationRead, toggleSidebar } from "@/redux/store";
import { fmtRelative } from "@/utils/format";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const notifications = useAppSelector((s) => s.ui.notifications);
  const dispatch = useAppDispatch();
  const unread = notifications.filter((n) => !n.read).length;

  const handleLogout = () => { logout(); navigate("/login"); };
  const initials = user?.name?.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => dispatch(toggleSidebar())}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("search") + "..."} className="w-72 pl-9" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("en")} className={cn(language === "en" && "bg-primary-muted")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("ms")} className={cn(language === "ms" && "bg-primary-muted")}>
              Bahasa Melayu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center bg-destructive p-0 text-[10px] text-destructive-foreground">{unread}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b p-3">
              <p className="text-sm font-semibold">Notifications</p>
              <Button variant="ghost" size="sm" onClick={() => dispatch(markAllRead())} className="h-auto p-1 text-xs">Mark all read</Button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">No notifications</p>
              ) : notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => dispatch(markNotificationRead(n.id))}
                  className={cn("flex w-full flex-col items-start gap-0.5 border-b px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50", !n.read && "bg-primary-muted/30")}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">{fmtRelative(n.timestamp)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{n.message}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-tight">{user?.name}</p>
                <p className="text-xs capitalize text-muted-foreground">{user?.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
