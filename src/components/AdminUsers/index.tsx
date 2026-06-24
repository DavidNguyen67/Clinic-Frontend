"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { ROLE_NAME, USER_STATUS } from "@/common";

import { useUsers } from "./hooks";

import { useModal } from "@/hooks/common";

import UserForm from "./UserForm";

import ModalProvider from "../ModalProvider";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { UserAdminResponse, UserItem } from "@/interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const roleBadge: Record<string, string> = {
  [ROLE_NAME.ADMIN]: "bg-purple-50 text-purple-700",
  [ROLE_NAME.DOCTOR]: "bg-blue-50 text-blue-700",
  [ROLE_NAME.PATIENT]: "bg-gray-100 text-gray-700",
  [ROLE_NAME.STAFF]: "bg-amber-50 text-amber-700",
};
const statusBadge: Record<string, string> = {
  [USER_STATUS.ACTIVE]: "bg-green-50 text-green-700",
  [USER_STATUS.INACTIVE]: "bg-gray-100 text-gray-500",
  [USER_STATUS.BANNED]: "bg-red-50 text-red-700",
};
export default function AdminUsers() {
  const t = useTranslations("admin");

  const modal = useModal<UserItem>();
  const [page, setPage] = useState(1);

  const { getListUsers, deleteUser } = useUsers(20, page - 1);
  const handleEdit = (user: UserItem) => {
    modal.handleShow(user);
  };
  const handleDelete = async (data: UserItem) => {
    try {
      await deleteUser.trigger({
        id: data.id,
      });

      await getListUsers.mutate();
    } catch (error) {
      console.error("Delete user failed:", error);
    }
  };

  const data = getListUsers.data?.body as UserAdminResponse;
  useEffect(() => {
    getListUsers.mutate();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("users.title")}</h1>

          <p className="text-muted-foreground">{t("users.subtitle")}</p>
        </div>
        <Button onClick={() => modal.handleShow()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />

          {t("users.addUser")}
        </Button>
      </div>

      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="pl-4">{t("users.name")}</TableHead>
              <TableHead>{t("users.email")}</TableHead>
              <TableHead>{t("users.phone")}</TableHead>
              <TableHead>{t("users.gender")}</TableHead>
              <TableHead>{t("users.role")}</TableHead>
              <TableHead>{t("users.status")}</TableHead>
              <TableHead>{t("users.createdAt")}</TableHead>
              <TableHead className="text-right w-28 pr-4">{t("users.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="pl-4 font-medium">{user.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-muted-foreground">{user.phone}</TableCell>
                <TableCell className="text-muted-foreground">{user.gender}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      roleBadge[user.role] || "bg-gray-100 text-gray-600"
                    )}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      statusBadge[user.status] || "bg-gray-100 text-gray-600"
                    )}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{user.createdAt}</TableCell>
                <TableCell className="text-right pr-4">
                  <div className="flex items-center justify-end gap-0.5">
                    <Button
                      className="cursor-pointer"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        handleEdit(user);
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="cursor-pointer"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {data?.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {t("users.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data?.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                className={page >= data.totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <ModalProvider show={modal.show} onClose={modal.handleHide}>
        <UserForm data={modal.data} onSuccess={modal.handleHide} />
      </ModalProvider>
    </div>
  );
}
