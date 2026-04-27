import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CrudService<T extends { id: string }> {
  list: () => Promise<T[]>;
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

  const create = async (payload: Omit<T, "id" | "createdAt" | "updatedAt">) => {
    const created = await service.create(payload);
    setItems((p) => [created, ...p]);
    toast.success(`${label} created`);
    return created;
  };

  const update = async (id: string, payload: Partial<T>) => {
    const updated = await service.update(id, payload);
    setItems((p) => p.map((x) => (x.id === id ? updated : x)));
    toast.success(`${label} updated`);
    return updated;
  };

  const remove = async (id: string) => {
    await service.remove(id);
    setItems((p) => p.filter((x) => x.id !== id));
    toast.success(`${label} deleted`);
  };

  return { items, loading, refresh, create, update, remove };
}
