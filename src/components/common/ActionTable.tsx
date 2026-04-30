import { ReactNode, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { PAGINATION } from "@/utils/constants";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, colIndex?: number, rowIndex?: number) => ReactNode;
  className?: string;
  sortable?: boolean;
  accessor?: (row: T) => string | number;
}

interface ActionTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  pageSize?: number;
  renderEmpty?: ReactNode; // New prop for custom empty state
}

export function ActionTable<T extends { id: string }>({
  columns,
  data,
  loading,
  searchable = true,
  searchPlaceholder = "Search...",
  onRowClick,
  emptyMessage = "No records found.",
  pageSize = PAGINATION.DEFAULT_PER_PAGE,
  renderEmpty,
}: ActionTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      columns.some((c) => {
        const v = c.accessor ? c.accessor(row) : (row as Record<string, unknown>)[c.key];
        return v != null && String(v).toLowerCase().includes(q);
      }),
    );
  }, [data, query, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="space-y-3">
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder={searchPlaceholder} className="pl-9" />
        </div>
      )}

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              {columns.map((c) => (
                <TableHead key={c.key} className={cn("font-semibold text-foreground", c.className)}>{c.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64 text-center">
                  {renderEmpty || <span className="text-muted-foreground">{emptyMessage}</span>}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, paginatedIndex) => {
                const absoluteIndex = (safePage - 1) * pageSize + paginatedIndex;
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(onRowClick && "cursor-pointer hover:bg-muted/40")}
                  >
                    {columns.map((c, colIdx) => (
                      <TableCell key={c.key} className={c.className}>
                        {c.render ? c.render(row, colIdx, absoluteIndex) : String((row as Record<string, unknown>)[c.key] ?? "—")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>Page {safePage} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
