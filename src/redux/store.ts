import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

interface UIState {
  sidebarCollapsed: boolean;
  notifications: { id: string; title: string; message: string; type: "info" | "warning" | "success" | "error"; read: boolean; timestamp: string }[];
}

const initialUI: UIState = {
  sidebarCollapsed: false,
  notifications: [
    { id: "n1", title: "Insurance Expiring", message: "WXY 5678 insurance expires in 5 days", type: "error", read: false, timestamp: new Date().toISOString() },
    { id: "n2", title: "Road Tax Reminder", message: "WCD 3456 road tax expires in 28 days", type: "warning", read: false, timestamp: new Date().toISOString() },
    { id: "n3", title: "Maintenance Due", message: "WPK 1234 service scheduled in 14 days", type: "info", read: true, timestamp: new Date().toISOString() },
  ],
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUI,
  reducers: {
    toggleSidebar(state) { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setSidebar(state, action: PayloadAction<boolean>) { state.sidebarCollapsed = action.payload; },
    markNotificationRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find((x) => x.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) { state.notifications.forEach((n) => (n.read = true)); },
    addNotification(state, action: PayloadAction<UIState["notifications"][number]>) {
      state.notifications.unshift(action.payload);
    },
  },
});

export const { toggleSidebar, setSidebar, markNotificationRead, markAllRead, addNotification } = uiSlice.actions;

export const store = configureStore({
  reducer: { ui: uiSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
