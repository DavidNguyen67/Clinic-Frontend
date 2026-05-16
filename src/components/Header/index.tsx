"use client";
import { Bell, ChevronDown, LogOut, Stethoscope, User } from "lucide-react";
import { NAV_LINKS } from "./config";
import { useSession } from "@/hooks/useSession";
import { usePathname, useRouter } from "next/navigation";
import { NavLinkItem } from "../NavLinkItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl, getInitials } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@/i18n/navigation";

const Header = () => {
  const { user } = useSession();
  const { logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = NAV_LINKS[user?.role!] ?? [
    { label: "Home", path: "/", icon: "Home" },
    { label: "Doctors", path: "/doctors", icon: "Stethoscope" },
    { label: "Services", path: "/services/general", icon: "LayoutGrid" },
    { label: "FAQ", path: "/faq", icon: "CircleHelp" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  const handleLogout = () => {
    logout?.();
    router.push("/");
  };

  const isInAuthPages = (path: string) => {
    return ["/login", "/register", "/forgot-password"].some((authPath) =>
      path.startsWith(authPath)
    );
  };

  if (isInAuthPages(pathname)) return null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-blue-700">MedCare</span>
          </Link>

          {/* ── Nav ── */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLinkItem key={link.path} link={link} isActive={isActive(link.path)} />
            ))}
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full"
                  asChild={false}
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-red-500 hover:bg-red-500">
                    3
                  </Badge>
                </Button>

                {/* Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-2 rounded-full h-9"
                    >
                      <Avatar className="w-7 h-7">
                        <AvatarImage
                          alt={user.fullName}
                          src={user.pathAvatar ? getImageUrl(user.pathAvatar) : undefined}
                        />
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="pb-1">
                      <p className="font-semibold text-sm truncate">{user?.fullName}</p>
                      <p className="text-xs text-muted-foreground font-normal truncate">
                        {user?.email}
                      </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link
                        href="/patient/profile"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-sm"
                >
                  <Link href="/auth/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
