"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FILTER_ALL_VALUE } from "@/hooks/global";
import { type ServiceStatusFilter } from "@/hooks/admin/useAdminServices";
import type { ServiceAdminResponse, ServiceItem, ServiceResponse } from "@/interface/response";
import { Button } from "@/components/ui/button";
import { ServiceTable } from "./ServiceTable";
import { useServices } from "./hooks";
import ModalProvider from "../ModalProvider";
import ServiceForm from "./ServiceForm";
import { useModal } from "@/hooks/common";
const PAGE_SIZE = 20;

export default function AdminServices() {
  const t = useTranslations("admin.services");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatusFilter>(FILTER_ALL_VALUE);
  const [page, setPage] = useState(1);
  const modal = useModal<ServiceItem>();

  const { getListServices, deleteService } = useServices(PAGE_SIZE, page - 1, search, statusFilter);
  const data = getListServices.data?.body as ServiceAdminResponse;
  useEffect(() => {
    console.log("check search", search);
    getListServices.mutate();
  }, [search, statusFilter, page]);
  const openCreate = () => {
    modal.handleShow();
  };

  const openEdit = (service: ServiceItem) => {
    modal.handleShow(service);
  };
  const onSuccess = () => {
    modal.handleHide();
    getListServices.mutate();
  };
  const handleDelete = async (data: ServiceItem) => {
    try {
      await deleteService.trigger({
        id: data.id,
      });

      await getListServices.mutate();
    } catch (error) {
      console.error("Delete service failed:", error);
    }
  };
  return (
    <div className="flex h-full flex-1 flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dịch vụ phòng khám</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            placeholder={t("searchPlaceholder")}
            className="h-8 pl-9"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value: ServiceStatusFilter) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-[170px]">
            <SelectValue placeholder={t("filterPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FILTER_ALL_VALUE}>{t("allServices")}</SelectItem>
            <SelectItem value="active">{t("active")}</SelectItem>
            <SelectItem value="inactive">{t("inactive")}</SelectItem>
            <SelectItem value="featured">{t("featured")}</SelectItem>
          </SelectContent>
        </Select>

        <Button className="h-8 w-full sm:ml-auto sm:w-auto" onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Tạo dịch vụ
        </Button>
      </div>

      <ServiceTable services={data?.data || []} openEdit={openEdit} onDelete={handleDelete} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {data?.totalPages > 1 && (
          <Pagination className="sm:w-auto sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  text={t("previous")}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              {Array.from({ length: data?.totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pageNumber === page}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  text={t("next")}
                  onClick={() => setPage((current) => Math.min(data?.totalPages || 1, current + 1))}
                  className={
                    page >= (data?.totalPages || 1) ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <ModalProvider show={modal.show} onClose={modal.handleHide}>
        <ServiceForm data={modal.data} onSuccess={onSuccess} />
      </ModalProvider>
    </div>
  );
}
