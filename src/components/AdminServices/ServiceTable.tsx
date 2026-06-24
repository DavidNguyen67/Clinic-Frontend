"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatVND, getImageUrl } from "@/lib/utils";
import type { ServiceItem } from "@/interface/response";
import { useState } from "react";

interface ServiceTableProps {
  services: ServiceItem[];
  openEdit: (service: ServiceItem) => void;
  onDelete: (service: ServiceItem) => void;
}

export function ServiceTable({ services, openEdit, onDelete }: ServiceTableProps) {
  const t = useTranslations("admin.services");
  const [deleteService, setDeleteService] = useState<ServiceItem | null>(null);
  return (
    <div className="max-h-[800px] overflow-y-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="pl-4">{t("columns.image")}</TableHead>
            <TableHead>{t("columns.name")}</TableHead>
            <TableHead>{t("columns.duration")}</TableHead>
            <TableHead>{t("columns.price")}</TableHead>
            <TableHead>{t("columns.promotionalPrice")}</TableHead>
            <TableHead>{t("columns.featured")}</TableHead>
            <TableHead>{t("columns.status")}</TableHead>
            <TableHead className="w-28 pr-4 text-right">{t("columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="pl-4">
                <div className="relative size-12 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={getImageUrl(service.image)}
                    alt={service.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-gray-900">{service.name}</div>
                <div className="text-xs text-muted-foreground">{service.slug}</div>
              </TableCell>
              <TableCell>{t("durationValue", { count: service.duration })}</TableCell>
              <TableCell>{formatVND(service.price)}</TableCell>
              <TableCell>
                {service.promotionalPrice > 0 ? formatVND(service.promotionalPrice) : t("none")}
              </TableCell>
              <TableCell>
                <Switch checked={service.isFeatured} aria-label={t("toggleFeatured")} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch checked={service.isActive} aria-label={t("toggleActive")} />
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      service.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {service.isActive ? t("active") : t("inactive")}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="pr-4 text-right">
                <div className="flex items-center justify-end gap-0.5">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(service)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setDeleteService(service)}>
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {services.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-28 text-center text-muted-foreground">
                {t("noResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AlertDialog
        open={!!deleteService}
        onOpenChange={(open) => {
          if (!open) setDeleteService(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa dịch vụ</AlertDialogTitle>

            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa <span className="font-medium">{deleteService?.name}</span>?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (deleteService) {
                  onDelete(deleteService);
                }
                setDeleteService(null);
              }}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
