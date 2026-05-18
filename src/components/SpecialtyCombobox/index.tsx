import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useVirtualizer } from "@tanstack/react-virtual";
import { usePublicSpecialtyList } from "@/hooks/public/usePublicSpecialty";
import { SpecialtyResponse } from "@/interface/response";

// ─────────────────────────────────────────────────────────────────────────────
// Hook: useInfiniteSpecialtyList
// ─────────────────────────────────────────────────────────────────────────────
function useInfiniteSpecialtyList(keyword?: string) {
  const PAGE_SIZE = 20;

  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<SpecialtyResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Reset list khi keyword thay đổi
  const prevKeyword = useRef(keyword);
  useEffect(() => {
    if (prevKeyword.current !== keyword) {
      prevKeyword.current = keyword;
      setPage(0);
      setAllItems([]);
      setHasMore(true);
    }
  }, [keyword]);

  const { data, isLoading, isValidating } = usePublicSpecialtyList({
    page,
    size: PAGE_SIZE,
    keyword,
  });

  useEffect(() => {
    const incoming: SpecialtyResponse[] = data?.body?.data ?? [];
    if (incoming.length === 0) {
      setHasMore(false);
      return;
    }

    setAllItems((prev) => {
      // Nếu đang ở page 1 (sau khi search reset) thì replace, không append
      if (page === 1 && prev.length === 0) return incoming;
      const existingIds = new Set(prev.map((s) => s.id));
      const fresh = incoming.filter((s) => !existingIds.has(s.id));
      return fresh.length > 0 ? [...prev, ...fresh] : prev;
    });

    if (incoming.length < PAGE_SIZE) {
      setHasMore(false);
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (!isValidating && hasMore) {
      setPage((p) => p + 1);
    }
  }, [isValidating, hasMore]);

  return { allItems, isLoading, isValidating, hasMore, loadMore };
}

// ─────────────────────────────────────────────────────────────────────────────
// SpecialtyCombobox — dùng pattern VirtualizedCombobox + infinite scroll
// ─────────────────────────────────────────────────────────────────────────────
interface SpecialtyComboboxProps {
  disabled?: boolean;
  value: string; // id của specialty đang được chọn
  onValueChange: (val: string) => void;
  placeholder?: string;
  width?: string;
  height?: string;
  classNames?: {
    popoverTrigger?: string;
  };
}

export function SpecialtyCombobox({
  disabled,
  value,
  onValueChange,
  placeholder = "Select a specialty",
  width = "250px",
  height = "300px",
  classNames,
}: SpecialtyComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false);

  const getWidth = () => {
    const parsedWith = width?.slice(0, -2);
    if (!parsedWith || isNaN(Number(parsedWith))) return 250;
    return Number(parsedWith) < 100 ? 250 : Number(parsedWith);
  };

  const parentRef = useRef<HTMLDivElement>(null);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { allItems, isLoading, isValidating, hasMore, loadMore } = useInfiniteSpecialtyList(
    debouncedSearch || undefined
  );

  // +1 sentinel row khi còn data
  const totalCount = allItems.length + (hasMore ? 1 : 0);

  const virtualizer = useVirtualizer({
    count: totalCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Infinite scroll: khi sentinel row xuất hiện thì loadMore
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    if (lastItem.index >= allItems.length && hasMore && !isValidating) {
      loadMore();
    }
  }, [virtualItems, allItems.length, hasMore, isValidating, loadMore]);

  // Scroll đến item đang được chọn khi mở popover
  useEffect(() => {
    if (!open || !value) return;
    const idx = allItems.findIndex((s) => s.id === value);
    if (idx !== -1) {
      setFocusedIndex(idx);
      virtualizer.scrollToIndex(idx, { align: "center" });
    }
  }, [open, value, allItems, virtualizer]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const next = prev === -1 ? 0 : Math.min(prev + 1, allItems.length - 1);
          virtualizer.scrollToIndex(next, { align: "center" });
          return next;
        });
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const next = prev === -1 ? allItems.length - 1 : Math.max(prev - 1, 0);
          virtualizer.scrollToIndex(next, { align: "center" });
          return next;
        });
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (allItems[focusedIndex]) {
          onValueChange(allItems[focusedIndex].id);
          setOpen(false);
        }
        break;
      }
      default:
        break;
    }
  };

  const selectedLabel = allItems.find((s) => s.id === value)?.name ?? placeholder;

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (!disabled) setOpen(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("justify-between font-normal", classNames?.popoverTrigger)}
          style={{ width: getWidth() }}
        >
          <span className="truncate">{value ? selectedLabel : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0" style={{ width: getWidth() }}>
        <Command shouldFilter={false} onKeyDown={handleKeyDown}>
          <CommandInput
            placeholder="Search specialty..."
            value={search}
            onValueChange={(v) => {
              setSearch(v);
              setIsKeyboardNavActive(false);
            }}
          />

          <CommandList
            ref={parentRef}
            style={{ height, width: "100%", overflow: "auto" }}
            onMouseDown={() => setIsKeyboardNavActive(false)}
            onMouseMove={() => setIsKeyboardNavActive(false)}
          >
            {/* Empty state */}
            {!isLoading && allItems.length === 0 && (
              <CommandEmpty>No specialty found.</CommandEmpty>
            )}

            {/* Initial loading */}
            {isLoading && allItems.length === 0 && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            <CommandGroup>
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualItems.map((virtualItem) => {
                  const isLoaderRow = virtualItem.index >= allItems.length;

                  if (isLoaderRow) {
                    return (
                      <div
                        key="loader"
                        className="absolute left-0 top-0 flex w-full items-center justify-center"
                        style={{
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        {isValidating && (
                          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    );
                  }

                  const item = allItems[virtualItem.index];
                  const isSelected = value === item.id;
                  const isFocused = focusedIndex === virtualItem.index;

                  return (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      disabled={isKeyboardNavActive}
                      className={cn(
                        "absolute left-0 top-0 w-full bg-transparent",
                        isFocused && "bg-accent text-accent-foreground",
                        isKeyboardNavActive &&
                          !isFocused &&
                          "aria-selected:bg-transparent aria-selected:text-primary"
                      )}
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      onMouseEnter={() =>
                        !isKeyboardNavActive && setFocusedIndex(virtualItem.index)
                      }
                      onMouseLeave={() => !isKeyboardNavActive && setFocusedIndex(-1)}
                      onSelect={() => {
                        onValueChange(item.id === value ? "" : item.id);
                        setOpen(false);
                      }}
                    >
                      <div className="flex min-w-4 flex-1 flex-col">
                        <span className="truncate text-sm font-medium leading-tight">
                          {item.name}
                        </span>
                        <span
                          className={cn(
                            "truncate text-xs text-muted-foreground transition-colors duration-100",
                            isFocused && "text-accent-foreground/70"
                          )}
                        >
                          {item.slug}
                        </span>
                      </div>

                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0 text-primary transition-opacity duration-100",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SpecialtyCombobox;
