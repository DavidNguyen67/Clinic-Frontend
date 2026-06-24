"use client";

import { useMemo, useState } from "react";

import { FILTER_ALL_VALUE } from "@/hooks/global";
import type { TYPE_OF_FILTER_ALL_VALUE } from "@/hooks/global";
import type { ServiceResponse } from "@/interface/response";
import { mockServices } from "@/hooks/mock/serviceMockData";

export type ServiceStatusFilter = "active" | "inactive" | "featured" | TYPE_OF_FILTER_ALL_VALUE;

interface ServiceFilter {
  search: string;
  status: ServiceStatusFilter;
  page: number;
  size: number;
}

const matchesStatus = (service: ServiceResponse, status: ServiceStatusFilter) => {
  if (status === FILTER_ALL_VALUE) return true;
  if (status === "active") return service.isActive;
  if (status === "inactive") return !service.isActive;
  return service.isFeatured;
};

export function useAdminServices(filter: ServiceFilter) {
  const [items, setItems] = useState<ServiceResponse[]>(mockServices);

  const filtered = useMemo(() => {
    const normalizedSearch = filter.search.trim().toLowerCase();

    return items.filter((service) => {
      const matchesSearch =
        !normalizedSearch || service.name.toLowerCase().includes(normalizedSearch);

      return matchesSearch && matchesStatus(service, filter.status);
    });
  }, [filter.search, filter.status, items]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / filter.size));
  const page = Math.min(filter.page, totalPages);
  const data = filtered.slice((page - 1) * filter.size, page * filter.size);

  const createService = (values: Omit<ServiceResponse, "id">) => {
    setItems((current) => [
      {
        ...values,
        id: `service-${Date.now()}`,
      },
      ...current,
    ]);
  };

  const updateService = (serviceId: string, values: Omit<ServiceResponse, "id">) => {
    setItems((current) =>
      current.map((service) => (service.id === serviceId ? { ...service, ...values } : service))
    );
  };

  const deleteService = (serviceId: string) => {
    setItems((current) => current.filter((service) => service.id !== serviceId));
  };

  const toggleActive = (serviceId: string) => {
    setItems((current) =>
      current.map((service) =>
        service.id === serviceId ? { ...service, isActive: !service.isActive } : service
      )
    );
  };

  const toggleFeatured = (serviceId: string) => {
    setItems((current) =>
      current.map((service) =>
        service.id === serviceId ? { ...service, isFeatured: !service.isFeatured } : service
      )
    );
  };

  return {
    data,
    total: filtered.length,
    totalPages,
    createService,
    updateService,
    deleteService,
    toggleActive,
    toggleFeatured,
  };
}
