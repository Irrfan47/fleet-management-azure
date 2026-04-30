import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CrudService<T extends { id: string }> {
  list: () => Promise<T[]>;
  get: (id: string) => Promise<T>;
  create: (payload: Omit<T, "id" | "createdAt" | "updatedAt">) => Promise<T>;
  update: (id: string, payload: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<boolean>;
}

export function useCrudResource<T extends { id: string }>(service: CrudService<T>, label = "Item") {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { setItems(await service.list()); } finally { setLoading(false); }
  }, [service]);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = useCallback(async (payload: Omit<T, "id" | "createdAt" | "updatedAt">) => {
    const created = await service.create(payload);
    setItems((p) => [created, ...p]);
    toast.success(`${label} created`);
    return created;
  }, [service, label]);

  const update = useCallback(async (id: string, payload: Partial<T>) => {
    const updated = await service.update(id, payload);
    setItems((p) => p.map((x) => (x.id === id ? updated : x)));
    toast.success(`${label} updated`);
    return updated;
  }, [service, label]);

  const remove = useCallback(async (id: string) => {
    await service.remove(id);
    setItems((p) => p.filter((x) => x.id !== id));
    toast.success(`${label} deleted`);
  }, [service, label]);

  const getOne = useCallback(async (id: string) => {
    return await service.get(id);
  }, [service]);

  return { items, loading, refresh, create, update, remove, getOne };
}
