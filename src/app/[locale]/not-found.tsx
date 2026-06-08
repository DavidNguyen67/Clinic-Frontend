import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileQuestion, Home, Search, FileText, LayoutDashboard, Users } from "lucide-react";

const suggestedPages = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    description: "Tổng quan hệ thống",
  },
  {
    icon: FileText,
    label: "Bài viết",
    href: "/posts",
    description: "Xem tất cả bài viết",
  },
  {
    icon: Users,
    label: "Người dùng",
    href: "/users",
    description: "Quản lý tài khoản",
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Badge */}
        <div className="flex items-center justify-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
            <Search className="h-3.5 w-3.5" />
            404 · Không tìm thấy
          </Badge>
        </div>

        {/* Main card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4 text-center">
            {/* Large 404 number */}
            <div className="mx-auto mb-3 select-none">
              <span className="text-[80px] font-black leading-none tracking-tighter text-muted-foreground/20">
                404
              </span>
            </div>

            {/* Icon */}
            <div className="mx-auto -mt-4 mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary ring-8 ring-secondary/40">
              <FileQuestion className="h-7 w-7 text-secondary-foreground" />
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight">Trang không tồn tại</CardTitle>
            <CardDescription className="text-base">
              Trang bạn đang tìm kiếm đã bị xoá, đổi địa chỉ hoặc chưa bao giờ tồn tại.
            </CardDescription>
          </CardHeader>

          <Separator />

          {/* Suggested pages */}
          <CardContent className="pt-5">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Có thể bạn đang tìm kiếm?
            </p>
            <div className="space-y-2">
              {suggestedPages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link key={page.href} href={page.href}>
                    <div className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 hover:border-border hover:bg-accent transition-all duration-150 cursor-pointer group">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary group-hover:bg-background transition-colors">
                        <Icon className="h-4 w-4 text-secondary-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-none mb-0.5">{page.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{page.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className="pt-5 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full sm:flex-1 h-11 rounded-md px-8 text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              <Home className="h-4 w-4" />
              Về trang chủ
            </Link>
          </CardFooter>
        </Card>

        {/* Help text */}
        <p className="text-center text-xs text-muted-foreground">
          Nếu bạn cho rằng đây là lỗi,{" "}
          <a
            href="mailto:support@example.com"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            báo cáo sự cố
          </a>
        </p>
      </div>
    </div>
  );
}
