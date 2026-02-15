import { create } from "zustand";
import { api } from "@/api";
import type { Designer, CreateDesignerDto, UpdateDesignerDto } from "@/api";

interface DesignerState {
  designers: Designer[];
  isLoading: boolean;
  error: string | null;

  fetchDesigners: () => Promise<void>;
  addDesigner: (data: CreateDesignerDto) => Promise<Designer>;
  updateDesigner: (id: string, data: UpdateDesignerDto) => Promise<void>;
  removeDesigner: (id: string) => Promise<void>;
}

export const useDesignerStore = create<DesignerState>((set) => ({
  designers: [],
  isLoading: false,
  error: null,

  fetchDesigners: async () => {
    set({ isLoading: true, error: null });
    try {
      const designers = await api.getDesigners();
      set({ designers, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  addDesigner: async (data) => {
    set({ error: null });
    try {
      const newDesigner = await api.createDesigner(data);
      const designers = await api.getDesigners();
      set({ designers });
      return newDesigner;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  updateDesigner: async (id, data) => {
    set({ error: null });
    try {
      await api.updateDesigner(id, data);
      const designers = await api.getDesigners();
      set({ designers });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  removeDesigner: async (id) => {
    set({ error: null });
    try {
      await api.deleteDesigner(id);
      const designers = await api.getDesigners();
      set({ designers });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },
}));
