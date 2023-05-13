import { FileItem, StateLoading } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface LocationState {
  Parents?: FileItem[];
  fetchLoading?: boolean;
  fetchError?: string;
  locations?: FileItem[];

  createState: StateLoading<unknown>;
  updateState: StateLoading<FileItem | undefined>;
}

interface LocationAction {
  fetchLocation: (file?: FileItem) => Promise<void>;
  createLocations: (locations: string[], isPath: boolean) => Promise<void>;
  updateLocation: (item: FileItem) => Promise<void>;
}

export const useLocation = create<LocationState & LocationAction>()(
  devtools(
    persist(
      (set, get) => ({
        fetchLocation: async (file) => {
          set({ fetchLoading: true });
          try {
            const { data } = await axiosInstance("/api/locations", {
              params: {
                ParentId: file?.id || "null",
                scope: "withParent",
              },
            });
            let parents = [];
            if (file) {
              const response = await axiosInstance(
                "/functions/parent/" + file?.id
              );
              parents = response.data;
            }
            set({
              locations: data,
              Parents: [...parents, file],
            });
          } catch (err) {
            const error = err as Error;
            console.log(err);
            set({ fetchError: error.message });
          }
          set({ fetchLoading: true });
        },
        createLocations: async (locations, isPath) => {
          set({ createState: { isLoading: true, error: undefined } });
          try {
            await axiosInstance({
              method: "POST",
              url: "/functions/create-locations",
              data: { locations, isPath },
            });
            const Parents = get().Parents || [];
            await get().fetchLocation(Parents[Parents.length - 1]);
            set({ createState: { isLoading: false } });
          } catch (err) {
            const error = err as Error;
            set({ createState: { isLoading: false, error: error.message } });
          }
        },
        createState: { isLoading: true, data: undefined },
        updateState: { isLoading: true },
        updateLocation: async (
          { id, ...location }: FileItem,
          doDelete?: boolean
        ) => {
          set({ updateState: { isLoading: true } });
          const locations = get().locations || [];
          const cLocations = [...locations];
          set({ locations: cLocations.filter((e) => e.id === id) });
          try {
            const { data } = await axiosInstance({
              url: "/api/locations/" + id,
              method: doDelete ? "DELETE" : "PUT",
              data: location,
            });
            set({ updateState: { isLoading: false, data } });
            const Parents = get().Parents || [];
            await get().fetchLocation(Parents[Parents.length - 1]);
          } catch (err) {
            set({
              updateState: { isLoading: false, error: (err as Error).message },
              locations: cLocations,
            });
          }
        },
      }),
      {
        name: "location-storage",
      }
    )
  )
);
