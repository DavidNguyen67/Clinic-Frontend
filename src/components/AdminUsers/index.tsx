"use client";

import { useState, useMemo } from "react";
import { useFormik } from "formik";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { userFormSchema, UserFormValues } from "./config";
import UserForm from "./UserForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { ROLE_NAME, USER_STATUS } from "@/common";
import { cn } from "@/lib/utils";
import { useUsers } from "./hooks";
import { useModal } from "@/hooks/common";
import ModalProvider from "../ModalProvider";
interface UserItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

const MOCK_USERS: UserItem[] = [
  {
    id: "1",
    fullName: "Nguyen Van A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    role: ROLE_NAME.ADMIN,
    status: USER_STATUS.ACTIVE,
    createdAt: "01/01/2026",
  },
  {
    id: "2",
    fullName: "Tran Thi B",
    email: "tranthib@example.com",
    phone: "0902345678",
    role: ROLE_NAME.DOCTOR,
    status: USER_STATUS.ACTIVE,
    createdAt: "15/02/2026",
  },
  {
    id: "3",
    fullName: "Le Van C",
    email: "levanc@example.com",
    phone: "0903456789",
    role: ROLE_NAME.PATIENT,
    status: USER_STATUS.INACTIVE,
    createdAt: "03/03/2026",
  },
  {
    id: "4",
    fullName: "Pham Thi D",
    email: "phamthid@example.com",
    phone: "0904567890",
    role: ROLE_NAME.STAFF,
    status: USER_STATUS.ACTIVE,
    createdAt: "20/04/2026",
  },
  {
    id: "5",
    fullName: "Hoang Van E",
    email: "hoangvane@example.com",
    phone: "0905678901",
    role: ROLE_NAME.PATIENT,
    status: USER_STATUS.BANNED,
    createdAt: "10/05/2026",
  },
  {
    id: "6",
    fullName: "Do Thi F",
    email: "dothif@example.com",
    phone: "0906789012",
    role: ROLE_NAME.DOCTOR,
    status: USER_STATUS.ACTIVE,
    createdAt: "25/05/2026",
  },
  {
    id: "7",
    fullName: "Vu Van G",
    email: "vuvang@example.com",
    phone: "0907890123",
    role: ROLE_NAME.PATIENT,
    status: USER_STATUS.ACTIVE,
    createdAt: "02/06/2026",
  },
  {
    id: "8",
    fullName: "Bui Thi H",
    email: "buithih@example.com",
    phone: "0908901234",
    role: ROLE_NAME.STAFF,
    status: USER_STATUS.ACTIVE,
    createdAt: "05/06/2026",
  },
];

const PAGE_SIZE = 5;

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
  const useCreateModal = useModal();
  const handleShow = () => {
    useCreateModal.handleShow();
  };

  const t = useTranslations("admin");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const formik = useFormik<UserFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      role: ROLE_NAME.PATIENT,
      status: USER_STATUS.ACTIVE,
    },
    validationSchema: userFormSchema,
    onSubmit: async (values, helpers) => {
      console.log("[Users] submit:", editingUser ? "edit" : "add", values);
      setDialogOpen(false);
      helpers.setSubmitting(false);
    },
  });

  const filtered = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const matchSearch =
        !search ||
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditingUser(null);
    formik.resetForm({
      values: {
        fullName: "",
        email: "",
        phone: "",
        role: ROLE_NAME.PATIENT,
        status: USER_STATUS.ACTIVE,
      },
    });
    setDialogOpen(true);
  };

  const openEdit = (user: UserItem) => {
    setEditingUser(user);
    formik.resetForm({
      values: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role as ROLE_NAME,
        status: user.status as USER_STATUS,
      },
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const handleDelete = (id: string) => {
    console.log("[Users] delete:", id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-gray-900">{t("users.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("users.subtitle")}</p>
        </div>
        <Button onClick={handleShow} size="sm">
          <Plus className="w-4 h-4" />
          {t("users.addUser")}
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("users.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-8"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder={t("users.filterRole")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("users.allRoles")}</SelectItem>
            <SelectItem value={ROLE_NAME.ADMIN}>Admin</SelectItem>
            <SelectItem value={ROLE_NAME.DOCTOR}>Doctor</SelectItem>
            <SelectItem value={ROLE_NAME.PATIENT}>Patient</SelectItem>
            <SelectItem value={ROLE_NAME.STAFF}>Staff</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder={t("users.filterStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("users.allStatuses")}</SelectItem>
            <SelectItem value={USER_STATUS.ACTIVE}>Active</SelectItem>
            <SelectItem value={USER_STATUS.INACTIVE}>Inactive</SelectItem>
            <SelectItem value={USER_STATUS.BANNED}>Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="pl-4">{t("users.name")}</TableHead>
              <TableHead>{t("users.email")}</TableHead>
              <TableHead>{t("users.phone")}</TableHead>
              <TableHead>{t("users.role")}</TableHead>
              <TableHead>{t("users.status")}</TableHead>
              <TableHead>{t("users.createdAt")}</TableHead>
              <TableHead className="text-right w-28 pr-4">{t("users.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="pl-4 font-medium">{user.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-muted-foreground">{user.phone}</TableCell>
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
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(user)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleteConfirm(user.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {pageData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {t("users.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? t("users.editUser") : t("users.addUser")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <FieldGroup>
              <Field>
                <FieldLabel>{t("users.name")}</FieldLabel>
                <Input
                  {...formik.getFieldProps("fullName")}
                  placeholder="Full name"
                  className="h-8"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <FieldDescription className="text-red-500">
                    {formik.errors.fullName}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel>{t("users.email")}</FieldLabel>
                <Input
                  type="email"
                  {...formik.getFieldProps("email")}
                  placeholder="email@example.com"
                  className="h-8"
                />
                {formik.touched.email && formik.errors.email && (
                  <FieldDescription className="text-red-500">
                    {formik.errors.email}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel>{t("users.phone")}</FieldLabel>
                <Input
                  {...formik.getFieldProps("phone")}
                  placeholder="0901234567"
                  className="h-8"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <FieldDescription className="text-red-500">
                    {formik.errors.phone}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel>{t("users.role")}</FieldLabel>
                <Select
                  value={formik.values.role}
                  onValueChange={(v: ROLE_NAME) => formik.setFieldValue("role", v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ROLE_NAME.ADMIN}>Admin</SelectItem>
                    <SelectItem value={ROLE_NAME.DOCTOR}>Doctor</SelectItem>
                    <SelectItem value={ROLE_NAME.PATIENT}>Patient</SelectItem>
                    <SelectItem value={ROLE_NAME.STAFF}>Staff</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.role && formik.errors.role && (
                  <FieldDescription className="text-red-500">{formik.errors.role}</FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel>{t("users.status")}</FieldLabel>
                <Select
                  value={formik.values.status}
                  onValueChange={(v: USER_STATUS) => formik.setFieldValue("status", v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={USER_STATUS.ACTIVE}>Active</SelectItem>
                    <SelectItem value={USER_STATUS.INACTIVE}>Inactive</SelectItem>
                    <SelectItem value={USER_STATUS.BANNED}>Banned</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FieldDescription className="text-red-500">
                    {formik.errors.status}
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={formik.isSubmitting}
            >
              {t("users.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={formik.isSubmitting}>
              {editingUser ? t("users.save") : t("users.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("users.deleteConfirmTitle")}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t("users.deleteConfirmDesc")}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              {t("users.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              {t("users.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ModalProvider show={useCreateModal.show} onClose={useCreateModal.handleHide}>
        <UserForm />
      </ModalProvider>
    </div>
  );
}
