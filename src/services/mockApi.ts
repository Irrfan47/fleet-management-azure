/**
 * Mock service factory — simulates a REST API with latency.
 * Replace with real api calls from `./api` when Laravel backend is ready.
 */
import {
  mockVehicles, mockDrivers, mockBookings, mockMaintenance,
  mockInsurance, mockAccidents, mockFines, mockDisposals, mockActivities,
} from "./mockData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 10);

function createCrud<T extends { id: string }>(seed: T[]) {
  let data = [...seed];
  return {
    list: async () => { await delay(); return [...data]; },
    get: async (id: string) => { await delay(); return data.find((x) => x.id === id) || null; },
    create: async (payload: Omit<T, "id" | "createdAt" | "updatedAt">) => {
      await delay();
      const now = new Date().toISOString();
      const item = { ...(payload as object), id: uid(), createdAt: now, updatedAt: now } as unknown as T;
      data = [item, ...data];
      return item;
    },
    update: async (id: string, payload: Partial<T>) => {
      await delay();
      data = data.map((x) => (x.id === id ? { ...x, ...payload, updatedAt: new Date().toISOString() } as T : x));
      return data.find((x) => x.id === id)!;
    },
    remove: async (id: string) => { await delay(); data = data.filter((x) => x.id !== id); return true; },
  };
}

export const vehiclesService = createCrud(mockVehicles);
export const driversService = createCrud(mockDrivers);
export const bookingsService = createCrud(mockBookings);
export const maintenanceService = createCrud(mockMaintenance);
export const insuranceService = createCrud(mockInsurance);
export const accidentsService = createCrud(mockAccidents);
export const finesService = createCrud(mockFines);
export const disposalsService = createCrud(mockDisposals);

export const activitiesService = {
  list: async () => { await delay(200); return [...mockActivities]; },
};
