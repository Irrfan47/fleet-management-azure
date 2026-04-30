import api from "./api";

function createCrudService<T>(endpoint: string) {
  return {
    list: async () => {
      const { data } = await api.get<T[]>(endpoint);
      return data;
    },
    get: async (id: string | number) => {
      const { data } = await api.get<T>(`${endpoint}/${id}`);
      return data;
    },
    create: async (payload: Partial<T>) => {
      const { data } = await api.post<T>(endpoint, payload);
      return data;
    },
    update: async (id: string | number, payload: Partial<T>) => {
      const { data } = await api.put<T>(`${endpoint}/${id}`, payload);
      return data;
    },
    remove: async (id: string | number) => {
      await api.delete(`${endpoint}/${id}`);
      return true;
    },
  };
}

export const vehiclesService = createCrudService<any>("vehicles");
export const driversService = createCrudService<any>("drivers");
export const bookingsService = createCrudService<any>("bookings");
export const maintenanceService = createCrudService<any>("maintenances");
export const insuranceService = createCrudService<any>("insurance-policies");
export const accidentsService = createCrudService<any>("accidents");
export const finesService = createCrudService<any>("fines");
export const disposalsService = createCrudService<any>("disposals");
export const activitiesService = createCrudService<any>("activities");

export const uploadService = {
  upload: async (file: File, folder: string, subfolder?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    if (subfolder) formData.append("subfolder", subfolder);
    
    const { data } = await api.post<{ url: string; path: string }>("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
